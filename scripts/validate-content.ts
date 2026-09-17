/**
 * validate-content.ts — the build gate (PRD §8.8).
 *
 * Runs before `next build`. Does three things Zod alone cannot:
 *
 *   1. Parses every content file through its schema and reports ALL failures
 *      at once, rather than throwing on the first one.
 *   2. Checks referential integrity ACROSS files — a skill citing a project
 *      slug that does not exist is a dead link waiting to happen, and Zod has
 *      no visibility past a single object.
 *   3. Applies the editorial rules from §12.6 as warnings: duty-framed
 *      highlights and banned clichés do not stop a build, but they are
 *      reported every time until they are fixed.
 *
 * Exit 1 on any error. Exit 0 with a summary on warnings only.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import education from "../content/education.ts";
import experience from "../content/experience.ts";
import site from "../content/site.ts";
import skills from "../content/skills.ts";
import { parseFrontmatter } from "../src/lib/frontmatter.ts";
import {
  EducationSchema,
  ExperienceSchema,
  ProjectFrontmatterSchema,
  SiteConfigSchema,
  SkillSchema,
} from "../src/lib/schemas.ts";

/* ── Reporting ───────────────────────────────────────────────────────────── */

const errors: string[] = [];
const warnings: string[] = [];

const err = (where: string, message: string) => errors.push(`${where}: ${message}`);
const warn = (where: string, message: string) => warnings.push(`${where}: ${message}`);

/** Renders a ZodError's issues as one line per issue, with the field path. */
function reportZod(where: string, issues: { path: PropertyKey[]; message: string }[]) {
  for (const issue of issues) {
    const field = issue.path.map(String).join(".") || "(root)";
    err(where, `${field} — ${issue.message}`);
  }
}

/* ── §12.6 editorial rules ───────────────────────────────────────────────── */

const BANNED_PHRASES = [
  // Résumé clichés
  "passionate about",
  "results-driven",
  "detail-oriented",
  "team player",
  "think outside the box",
  "wear many hats",
  "hit the ground running",
  "fast-paced environment",
  "synergy",
  "go-getter",
  "self-starter",
  // Developer clichés
  "turning coffee into code",
  "i love to code",
  "clean code enthusiast",
  "pixel-perfect",
  "full-stack ninja",
  "full-stack rockstar",
  "full-stack guru",
  "full-stack wizard",
  "always learning",
  "code that speaks for itself",
  // Empty intensifiers
  "cutting-edge",
  "state-of-the-art",
  "seamless",
  "leveraging",
  "utilize",
  "revolutionize",
  "game-changing",
  "best-in-class",
  "next-generation",
  // Vague quantifiers
  "significantly improved",
  "greatly enhanced",
  "dramatically reduced",
  "a lot of users",
  "high performance",
  // Fabrication tells
  "enterprise-grade",
  "production-ready",
  "architected",
];

/** AC-07.2 — the most common résumé failure is describing duties, not outcomes. */
const DUTY_FRAMINGS = ["responsible for", "worked on", "helped with", "assisted with"];

function checkBannedPhrases(where: string, text: string) {
  const lower = text.toLowerCase();
  for (const phrase of BANNED_PHRASES) {
    if (lower.includes(phrase)) {
      warn(where, `banned phrase from §12.6: "${phrase}"`);
    }
  }
}

/** Unresolved authoring placeholders. Blocking once a project is published. */
function checkTodos(where: string, text: string, blocking: boolean) {
  if (/\bTODO\b/.test(text)) {
    const message = "contains an unresolved TODO placeholder";
    if (blocking) err(where, message);
    else warn(where, message);
  }
}

/* ── Site configuration ──────────────────────────────────────────────────── */

const siteResult = SiteConfigSchema.safeParse(site);
if (!siteResult.success) {
  reportZod("content/site.ts", siteResult.error.issues);
} else {
  const s = siteResult.data;
  checkTodos("content/site.ts", JSON.stringify(s), false);
  checkBannedPhrases("content/site.ts about", s.about.join(" "));
  checkBannedPhrases("content/site.ts headline", s.headline);
  checkBannedPhrases("content/site.ts valueProp", s.valueProp);

  // AC-08.1: the About section is 150–350 words.
  const aboutWords = s.about.join(" ").trim().split(/\s+/).length;
  if (aboutWords < 150 || aboutWords > 350) {
    warn("content/site.ts about", `is ${aboutWords} words; AC-08.1 wants 150–350`);
  }
}

/* ── Projects ────────────────────────────────────────────────────────────── */

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");
const projectSlugs = new Set<string>();
const publishedCount = { n: 0 };

if (fs.existsSync(PROJECTS_DIR)) {
  const files = fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"));

  for (const file of files) {
    const where = `content/projects/${file}`;
    const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), "utf8");
    const { data, content } = parseFrontmatter(raw);

    const parsed = ProjectFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      reportZod(where, parsed.error.issues);
      continue;
    }

    const p = parsed.data;
    const isPublished = p.status === "published";
    if (isPublished) publishedCount.n += 1;

    // Slug uniqueness, and slug must match the filename so the route is findable.
    if (projectSlugs.has(p.slug)) err(where, `duplicate slug "${p.slug}"`);
    projectSlugs.add(p.slug);

    const expectedFile = `${p.slug}.mdx`;
    if (file !== expectedFile) {
      err(where, `slug "${p.slug}" should live in ${expectedFile}`);
    }

    // A published case study must not still contain scaffolding.
    checkTodos(where, JSON.stringify(p), isPublished);
    checkTodos(`${where} (body)`, content, isPublished);
    checkBannedPhrases(`${where} summary`, p.summary);
    checkBannedPhrases(`${where} tagline`, p.tagline);
    checkBannedPhrases(`${where} problem`, p.problem);

    // AC-04.1 — the five beats. Zod covers Constraint/Decision/Outcome via the
    // frontmatter arrays; Context and Implementation live in the MDX body.
    if (isPublished) {
      if (!/^##\s+Context\s*$/im.test(content)) {
        err(where, "published case study is missing a `## Context` section in the body");
      }
      if (!/^##\s+Implementation\s*$/im.test(content)) {
        err(
          where,
          "published case study is missing an `## Implementation` section in the body",
        );
      }

      // AC-04.2 — the Decision Table needs at least two rows, and each row needs
      // a named rejected alternative. Zod enforces the counts; this catches the
      // case where the "alternative" is a placeholder.
      p.decisions.forEach((d, i) => {
        if (d.alternatives.some((a) => /^(n\/?a|none|tbd)$/i.test(a.trim()))) {
          err(where, `decisions[${i}].alternatives contains a placeholder value`);
        }
      });

      // §12.5 — case studies run 800–1,600 words.
      const words = content.trim().split(/\s+/).length;
      if (words < 300) {
        warn(where, `body is only ${words} words; §12.5 targets 800–1,600`);
      }
    }

    // Exactly one headline metric, or none. Two competing headline numbers in
    // the summary block is a layout bug waiting to happen.
    const headlines = p.metrics.filter((m) => m.isHeadline);
    if (headlines.length > 1) {
      err(where, `${headlines.length} metrics are marked isHeadline; at most one may be`);
    }
  }
}

/* ── Referential integrity across files (§8.1) ───────────────────────────── */

function checkProjectRefs(where: string, slugs: string[]) {
  for (const slug of slugs) {
    if (!projectSlugs.has(slug)) {
      err(where, `references project "${slug}", which has no file in content/projects/`);
    }
  }
}

/* ── Experience ──────────────────────────────────────────────────────────── */

const openEndedByType = new Map<string, number>();

experience.forEach((entry, i) => {
  const where = `content/experience.ts[${i}] (${entry.id})`;
  const parsed = ExperienceSchema.safeParse(entry);
  if (!parsed.success) {
    reportZod(where, parsed.error.issues);
    return;
  }

  const e = parsed.data;
  checkProjectRefs(where, e.projects);
  checkTodos(where, JSON.stringify(e), false);
  checkBannedPhrases(where, [e.summary, ...e.highlights].join(" "));

  for (const [j, highlight] of e.highlights.entries()) {
    const lower = highlight.toLowerCase().trimStart();
    const duty = DUTY_FRAMINGS.find((d) => lower.startsWith(d));
    if (duty) {
      warn(
        `${where}.highlights[${j}]`,
        `opens with duty framing "${duty}" — AC-07.2 wants the outcome first`,
      );
    }
  }

  if (e.endDate === null) {
    openEndedByType.set(e.type, (openEndedByType.get(e.type) ?? 0) + 1);
  }
});

const openFullTime = openEndedByType.get("full-time") ?? 0;
if (openFullTime > 1) {
  err(
    "content/experience.ts",
    `${openFullTime} full-time entries have endDate: null — at most one role can be current`,
  );
}

/* ── Skills ──────────────────────────────────────────────────────────────── */

const skillIds = new Set<string>();

skills.forEach((skill, i) => {
  const where = `content/skills.ts[${i}] (${skill.id})`;
  const parsed = SkillSchema.safeParse(skill);
  if (!parsed.success) {
    reportZod(where, parsed.error.issues);
    return;
  }

  const s = parsed.data;
  if (skillIds.has(s.id)) err(where, `duplicate skill id "${s.id}"`);
  skillIds.add(s.id);

  checkProjectRefs(where, s.projects);
  checkTodos(where, JSON.stringify(s), false);
});

/* ── Education ───────────────────────────────────────────────────────────── */

education.forEach((entry, i) => {
  const where = `content/education.ts[${i}] (${entry.id})`;
  const parsed = EducationSchema.safeParse(entry);
  if (!parsed.success) {
    reportZod(where, parsed.error.issues);
    return;
  }

  const e = parsed.data;
  checkTodos(where, JSON.stringify(e), false);
  for (const course of e.courses) checkProjectRefs(where, course.projects);
});

/* ── Cache freshness (AC-16.4) ───────────────────────────────────────────── */

const CACHE_PATH = path.join(process.cwd(), "data", "github-cache.json");
if (fs.existsSync(CACHE_PATH)) {
  try {
    const cache = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8")) as {
      syncedAt?: string;
    };
    if (cache.syncedAt) {
      const days = Math.floor((Date.now() - Date.parse(cache.syncedAt)) / 86_400_000);
      if (days > 14) {
        warn(
          "data/github-cache.json",
          `last synced ${days} days ago — run \`pnpm sync:github\``,
        );
      }
    }
  } catch {
    err("data/github-cache.json", "is not valid JSON");
  }
}

/* ── Launch gate G1 ──────────────────────────────────────────────────────── */

if (publishedCount.n < 4) {
  warn(
    "launch gate G1",
    `${publishedCount.n} published case ${publishedCount.n === 1 ? "study" : "studies"}; the launch gate wants at least 4`,
  );
}

/* ── Output ──────────────────────────────────────────────────────────────── */

const GREY = "[90m";
const RED = "[31m";
const YELLOW = "[33m";
const GREEN = "[32m";
const RESET = "[0m";

if (warnings.length > 0) {
  console.warn(`\n${YELLOW}Content warnings (${warnings.length})${RESET}`);
  for (const w of warnings) console.warn(`  ${YELLOW}!${RESET} ${w}`);
}

if (errors.length > 0) {
  console.error(`\n${RED}Content errors (${errors.length})${RESET}`);
  for (const e of errors) console.error(`  ${RED}x${RESET} ${e}`);
  console.error(
    `\n${GREY}Fix the errors above. The build is blocked deliberately: shipping a half-written case study is worse than shipping nothing.${RESET}\n`,
  );
  process.exit(1);
}

console.log(
  `\n${GREEN}Content valid${RESET} ${GREY}— ${projectSlugs.size} project file(s), ${publishedCount.n} published, ${skills.length} skills, ${experience.length} experience ${experience.length === 1 ? "entry" : "entries"}${RESET}\n`,
);
