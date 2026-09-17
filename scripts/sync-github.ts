/**
 * sync-github.ts — build-time enrichment (PRD §7.1).
 *
 * Contract (§7.1.5):
 *   Inputs:  content/projects/*.mdx -> frontmatter.repo ("owner/name")
 *            env GH_SYNC_TOKEN (optional; raises the rate limit from 60/hr to 5,000/hr)
 *   Output:  data/github-cache.json (COMMITTED to the repository)
 *   Exit 0:  always on network/API failure — the previous cache is preserved
 *   Exit 1:  only if the GitHub response fails Zod parsing AND no prior cache exists
 *
 * Guarantees:
 *   - Never writes a partial or malformed cache (write to temp, validate, rename)
 *   - Never removes an existing repo entry because of a transient fetch failure
 *   - Always sets cache.syncedAt to an ISO-8601 UTC timestamp
 *
 * This is the only file in the repository allowed to hold a GitHub token. The
 * token is a fine-grained PAT with read-only public metadata scope and lives in
 * GitHub Actions secrets — never in `src/`, never at runtime (§5.7).
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { Octokit } from "octokit";

import { parseFrontmatter } from "../src/lib/frontmatter.ts";
import {
  GitHubCacheSchema,
  RepoDataSchema,
  type GitHubCache,
  type RepoData,
} from "../src/lib/schemas.ts";

const CACHE_PATH = path.join(process.cwd(), "data", "github-cache.json");
const TMP_PATH = `${CACHE_PATH}.tmp`;
const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

const token = process.env.GH_SYNC_TOKEN ?? process.env.GITHUB_TOKEN;

/** Hard ceiling per request. A hung sync must never become a hung build. */
const REQUEST_TIMEOUT_MS = 20_000;

/** GitHub Actions picks these up as annotations; locally they are just text. */
const notice = (m: string) => console.log(`::notice::${m}`);
const warn = (m: string) => console.log(`::warning::${m}`);

/* ── Inputs ──────────────────────────────────────────────────────────────── */

function collectRepoRefs(): string[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  const refs = new Set<string>();

  for (const file of fs.readdirSync(PROJECTS_DIR)) {
    if (!file.endsWith(".mdx") || file.startsWith("_")) continue;
    const { data } = parseFrontmatter(
      fs.readFileSync(path.join(PROJECTS_DIR, file), "utf8"),
    );
    const repo = data.repo;
    if (typeof repo === "string" && /^[\w.-]+\/[\w.-]+$/.test(repo)) refs.add(repo);
  }

  return [...refs].sort();
}

function readExistingCache(): GitHubCache {
  if (!fs.existsSync(CACHE_PATH)) {
    return { version: 1, syncedAt: new Date(0).toISOString(), repos: {} };
  }
  try {
    const parsed = GitHubCacheSchema.safeParse(
      JSON.parse(fs.readFileSync(CACHE_PATH, "utf8")),
    );
    if (parsed.success) return parsed.data;
    warn("Existing cache failed validation; starting from an empty one.");
  } catch {
    warn("Existing cache is not readable JSON; starting from an empty one.");
  }
  return { version: 1, syncedAt: new Date(0).toISOString(), repos: {} };
}

/* ── GraphQL: one batched query for every repository (§7.1.3) ────────────── */

type GraphQLRepo = {
  nameWithOwner: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  isPrivate: boolean;
  isArchived: boolean;
  createdAt: string;
  pushedAt: string;
  stargazerCount: number;
  forkCount: number;
  licenseInfo: { spdxId: string | null; name: string } | null;
  primaryLanguage: { name: string; color: string | null } | null;
  languages: {
    totalSize: number;
    edges: Array<{ size: number; node: { name: string; color: string | null } }>;
  };
  repositoryTopics: { nodes: Array<{ topic: { name: string } }> };
  defaultBranchRef: {
    target: {
      history: { totalCount: number };
      oid?: string;
      committedDate?: string;
      messageHeadline?: string;
    } | null;
  } | null;
  latestRelease: { tagName: string; publishedAt: string; url: string } | null;
};

/** Builds one query with an aliased field per repository — 1 request, N repos. */
function buildQuery(refs: string[]): string {
  const fragments = refs
    .map((ref, i) => {
      const [owner, name] = ref.split("/");
      return `  r${i}: repository(owner: ${JSON.stringify(owner)}, name: ${JSON.stringify(name)}) { ...RepoFields }`;
    })
    .join("\n");

  return `
query RepoBatch {
${fragments}
}

fragment RepoFields on Repository {
  nameWithOwner
  description
  url
  homepageUrl
  isPrivate
  isArchived
  createdAt
  pushedAt
  stargazerCount
  forkCount
  licenseInfo { spdxId name }
  primaryLanguage { name color }
  languages(first: 12, orderBy: { field: SIZE, direction: DESC }) {
    totalSize
    edges { size node { name color } }
  }
  repositoryTopics(first: 12) { nodes { topic { name } } }
  defaultBranchRef {
    target {
      ... on Commit {
        oid
        committedDate
        messageHeadline
        history { totalCount }
      }
    }
  }
  latestRelease { tagName publishedAt url }
}`;
}

/** A language with no colour in the API still needs one; fall back to the rule. */
const FALLBACK_COLOR = "#8b8b8b";

function toRepoData(node: GraphQLRepo): RepoData {
  const totalSize = node.languages.totalSize || 1;
  const commit = node.defaultBranchRef?.target ?? null;

  return {
    nameWithOwner: node.nameWithOwner,
    description: node.description,
    url: node.url,
    homepageUrl: node.homepageUrl,
    isPrivate: node.isPrivate,
    isArchived: node.isArchived,
    createdAt: new Date(node.createdAt).toISOString(),
    pushedAt: new Date(node.pushedAt).toISOString(),
    stars: node.stargazerCount,
    forks: node.forkCount,
    license: node.licenseInfo?.spdxId
      ? { spdxId: node.licenseInfo.spdxId, name: node.licenseInfo.name }
      : null,
    primaryLanguage: node.primaryLanguage
      ? {
          name: node.primaryLanguage.name,
          color: node.primaryLanguage.color ?? FALLBACK_COLOR,
        }
      : null,
    languages: node.languages.edges.map((e) => ({
      name: e.node.name,
      color: e.node.color ?? FALLBACK_COLOR,
      bytes: e.size,
      percent: Math.round((e.size / totalSize) * 1000) / 10,
    })),
    topics: node.repositoryTopics.nodes.map((n) => n.topic.name),
    commitCount: commit?.history.totalCount ?? 0,
    lastCommit:
      commit?.oid && commit.committedDate
        ? {
            date: new Date(commit.committedDate).toISOString(),
            messageHeadline: commit.messageHeadline ?? "",
            oid: commit.oid,
          }
        : null,
    commitActivity: null, // filled by the REST pass below
    contributorCount: null, // filled by the REST pass below
    latestRelease: node.latestRelease
      ? {
          tagName: node.latestRelease.tagName,
          publishedAt: new Date(node.latestRelease.publishedAt).toISOString(),
          url: node.latestRelease.url,
        }
      : null,
    readmeExcerpt: null, // filled by the REST pass below
    stale: false,
  };
}

/* ── REST: per-repository extras (§7.1.4) ────────────────────────────────── */

/** Strips badges, HTML and headings so the excerpt is readable prose. */
function readmeExcerpt(markdown: string): string {
  const text = markdown
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images and badges
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> their text
    .replace(/<[^>]+>/g, "")
    .replace(/^#+\s.*$/gm, "")
    .replace(/^[-*_]{3,}$/gm, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.slice(0, 2000);
}

async function enrichWithRest(octokit: Octokit, repo: RepoData): Promise<void> {
  const [owner, name] = repo.nameWithOwner.split("/") as [string, string];

  // README excerpt.
  try {
    const res = await octokit.request("GET /repos/{owner}/{repo}/readme", {
      owner,
      repo: name,
      headers: { accept: "application/vnd.github.raw" },
    });
    if (typeof res.data === "string") repo.readmeExcerpt = readmeExcerpt(res.data);
  } catch {
    // No README is normal and not worth a warning.
  }

  // Contributors — used only to label solo vs. team honestly.
  try {
    const res = await octokit.request("GET /repos/{owner}/{repo}/contributors", {
      owner,
      repo: name,
      per_page: 10,
    });
    if (Array.isArray(res.data) && res.data.length > 0) {
      repo.contributorCount = res.data.length;
    }
  } catch {
    // Empty repositories 204 here.
  }

  // 52-week commit sparkline. GitHub answers 202 while it computes the stats,
  // so retry once and then give up rather than blocking the build (§7.1.6).
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await octokit.request(
        "GET /repos/{owner}/{repo}/stats/commit_activity",
        {
          owner,
          repo: name,
        },
      );
      if (res.status === 202) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      if (Array.isArray(res.data) && res.data.length === 52) {
        repo.commitActivity = res.data.map((w: { total: number }) => w.total);
      }
      break;
    } catch {
      break;
    }
  }
}

/* ── Atomic write ────────────────────────────────────────────────────────── */

function writeCache(cache: GitHubCache): void {
  const validated = GitHubCacheSchema.safeParse(cache);
  if (!validated.success) {
    // Refuse to write something the render path will reject.
    console.error("Refusing to write an invalid cache:");
    for (const i of validated.error.issues) {
      console.error(`  - ${i.path.join(".")}: ${i.message}`);
    }
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
  fs.writeFileSync(TMP_PATH, `${JSON.stringify(validated.data, null, 2)}\n`, "utf8");
  fs.renameSync(TMP_PATH, CACHE_PATH);
}

/* ── Main ────────────────────────────────────────────────────────────────── */

async function main(): Promise<void> {
  const refs = collectRepoRefs();
  const previous = readExistingCache();

  if (refs.length === 0) {
    notice("No `repo:` fields found in content/projects/. Nothing to sync.");
    return;
  }

  // GitHub's GraphQL API requires authentication — there is no anonymous tier,
  // unlike REST. Without a token the batched query can only ever 401, and
  // Octokit's throttling plugin will sit in backoff for minutes before giving
  // up. Failing here immediately is both honest and CI-safe.
  if (!token) {
    warn(
      "No GH_SYNC_TOKEN set. GitHub's GraphQL API requires authentication, so " +
        "there is nothing to sync. Create a fine-grained PAT with read-only " +
        "public repository metadata access and set GH_SYNC_TOKEN. Keeping the " +
        "existing cache; the build will still succeed.",
    );
    return;
  }

  const octokit = new Octokit({
    auth: token,
    // Fail fast rather than backing off. The whole point of the committed cache
    // is that a bad response costs us freshness, never a build.
    retry: { enabled: false },
    throttle: { enabled: false },
    request: { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) },
  });

  // Start from the previous cache so a transient failure never deletes an entry.
  const repos: Record<string, RepoData> = { ...previous.repos };

  let response: Record<string, GraphQLRepo | null>;
  try {
    response = await octokit.graphql<Record<string, GraphQLRepo | null>>(
      buildQuery(refs),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    // A 404 inside a batched GraphQL query still returns data for the others,
    // so octokit surfaces it as an error carrying a partial `data` payload.
    const partial = (error as { data?: Record<string, GraphQLRepo | null> }).data;
    if (partial) {
      warn(`Some repositories could not be read: ${message}`);
      response = partial;
    } else {
      warn(`GitHub sync failed (${message}). Keeping the existing cache.`);
      // Exit 0: a bad day at GitHub is never a bad day for the portfolio.
      return;
    }
  }

  const seen = new Set<string>();

  for (const [alias, node] of Object.entries(response)) {
    if (!node) continue;
    const index = Number(alias.slice(1));
    const ref = refs[index];
    if (!ref) continue;

    const parsed = RepoDataSchema.safeParse(toRepoData(node));
    if (!parsed.success) {
      // An upstream shape change must fail loudly rather than write garbage
      // (AC-16.5) — but only fatally if we have no cache to fall back on.
      console.error(`GitHub response for ${ref} failed validation:`);
      for (const i of parsed.error.issues) {
        console.error(`  - ${i.path.join(".")}: ${i.message}`);
      }
      if (Object.keys(previous.repos).length === 0) process.exit(1);
      warn(`Keeping the cached entry for ${ref}.`);
      continue;
    }

    await enrichWithRest(octokit, parsed.data);
    repos[ref] = parsed.data;
    seen.add(ref);
  }

  // Anything requested but not returned (renamed, deleted, made private) keeps
  // its last known entry and is flagged stale so the UI can be honest (§7.1.6).
  for (const ref of refs) {
    if (seen.has(ref)) continue;
    const existing = repos[ref];
    if (existing) {
      existing.stale = true;
      warn(`${ref} could not be read; keeping the cached entry and marking it stale.`);
    } else {
      warn(
        `${ref} could not be read and has no cached entry. Its evidence block will be omitted.`,
      );
    }
  }

  writeCache({ version: 1, syncedAt: new Date().toISOString(), repos });
  notice(`Synced ${seen.size}/${refs.length} repositories into data/github-cache.json`);
}

main().catch((error: unknown) => {
  // The contract is exit 0 on failure. The cache on disk is untouched.
  warn(
    `Unexpected sync error: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(0);
});
