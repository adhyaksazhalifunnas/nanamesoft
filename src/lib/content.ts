/**
 * content.ts — typed content loaders (PRD §7.4).
 *
 * Content is read from disk at build time, never fetched. Every loader parses
 * through the Zod schema on the way out, so a route can assume its data is
 * valid or the build has already failed.
 *
 * These run in Server Components only. `fs` here is a deliberate guarantee that
 * nothing in this module can ever be bundled for the client.
 */
import "server-only";

import fs from "node:fs";
import path from "node:path";

import readingTime from "reading-time";

import education from "@content/education";
import experienceData from "@content/experience";
import siteData from "@content/site";
import skillsData from "@content/skills";

import { parseFrontmatter } from "./frontmatter";
import {
  EducationSchema,
  ExperienceSchema,
  ProjectFrontmatterSchema,
  SKILL_CATEGORIES,
  SKILL_CATEGORY_LABELS,
  SiteConfigSchema,
  SkillSchema,
  type Education,
  type Experience,
  type Project,
  type SiteConfig,
  type Skill,
  type SkillGroup,
} from "./schemas";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

/* ── Projects ────────────────────────────────────────────────────────────── */

/**
 * Parsed once per process and memoized. Next.js builds each route in the same
 * worker, so re-reading and re-parsing every MDX file per route would make the
 * build time scale with routes x projects instead of just projects.
 */
let projectCache: Project[] | null = null;

function readProjectsFromDisk(): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  const files = fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"));

  const projects = files.map((file) => {
    const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), "utf8");
    const { data, content } = parseFrontmatter(raw);

    const parsed = ProjectFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      // Fail loudly and name the file — AC-12.4.
      const issues = parsed.error.issues
        .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("\n");
      throw new Error(`Invalid frontmatter in content/projects/${file}:\n${issues}`);
    }

    const stats = readingTime(content);

    return {
      ...parsed.data,
      body: content,
      readingTimeMinutes: Math.max(1, Math.round(stats.minutes)),
      wordCount: stats.words,
    } satisfies Project;
  });

  // Sort by `order` ascending, then by start date descending.
  return projects.sort(
    (a, b) => a.order - b.order || b.startDate.localeCompare(a.startDate),
  );
}

function allProjects(): Project[] {
  projectCache ??= readProjectsFromDisk();
  return projectCache;
}

/**
 * Draft projects are excluded from every public listing. They still build, so
 * you can preview one by visiting its URL directly.
 */
export function getProjects(opts?: { featured?: boolean }): Project[] {
  let list = allProjects().filter((p) => p.status === "published");
  if (opts?.featured) list = list.filter((p) => p.featured);
  return list;
}

export function getProject(slug: string): Project | null {
  return allProjects().find((p) => p.slug === slug) ?? null;
}

/** Feeds generateStaticParams. Includes drafts so their routes exist. */
export function getAllProjectSlugs(): string[] {
  return allProjects().map((p) => p.slug);
}

/**
 * Previous/next within the published set, for the case-study footer.
 * Returns nulls at the ends rather than wrapping — wrapping makes a reader
 * think they have missed something.
 */
export function getProjectNeighbours(slug: string): {
  previous: Project | null;
  next: Project | null;
} {
  const list = getProjects();
  const i = list.findIndex((p) => p.slug === slug);
  if (i === -1) return { previous: null, next: null };
  return { previous: list[i - 1] ?? null, next: list[i + 1] ?? null };
}

/* ── Experience ──────────────────────────────────────────────────────────── */

/** Reverse-chronological. Sorting happens here so authoring order is free. */
export function getExperience(): Experience[] {
  return experienceData
    .map((e, i) => {
      const parsed = ExperienceSchema.safeParse(e);
      if (!parsed.success) {
        throw new Error(
          `Invalid experience entry #${i} (${e.id}): ${parsed.error.issues
            .map((x) => `${x.path.join(".")}: ${x.message}`)
            .join("; ")}`,
        );
      }
      return parsed.data;
    })
    .sort((a, b) => {
      // Ongoing roles first, then most recent start date.
      if (a.endDate === null && b.endDate !== null) return -1;
      if (b.endDate === null && a.endDate !== null) return 1;
      return b.startDate.localeCompare(a.startDate);
    });
}

/* ── Skills ──────────────────────────────────────────────────────────────── */

/** Grouped by category, in the fixed category order from the schema. */
export function getSkills(): SkillGroup[] {
  const parsed: Skill[] = skillsData.map((s, i) => {
    const result = SkillSchema.safeParse(s);
    if (!result.success) {
      throw new Error(
        `Invalid skill entry #${i} (${s.id}): ${result.error.issues
          .map((x) => `${x.path.join(".")}: ${x.message}`)
          .join("; ")}`,
      );
    }
    return result.data;
  });

  return SKILL_CATEGORIES.map((category) => ({
    category,
    label: SKILL_CATEGORY_LABELS[category],
    // Oldest first: the timeline reads left-to-right as a history.
    skills: parsed
      .filter((s) => s.category === category)
      .sort((a, b) => a.firstUsed - b.firstUsed || a.name.localeCompare(b.name)),
  })).filter((g) => g.skills.length > 0);
}

export function getShowcaseSkills(): Skill[] {
  return getSkills()
    .flatMap((g) => g.skills)
    .filter((s) => s.showcase);
}

/** The full span covered by the timeline axis. */
export function getSkillYearRange(): { from: number; to: number } {
  const years = getSkills().flatMap((g) => g.skills.map((s) => s.firstUsed));
  const currentYear = new Date().getFullYear();
  if (years.length === 0) return { from: currentYear, to: currentYear };
  return { from: Math.min(...years), to: currentYear };
}

/* ── Education ───────────────────────────────────────────────────────────── */

export function getEducation(): Education[] {
  return education.map((e, i) => {
    const parsed = EducationSchema.safeParse(e);
    if (!parsed.success) {
      throw new Error(
        `Invalid education entry #${i} (${e.id}): ${parsed.error.issues
          .map((x) => `${x.path.join(".")}: ${x.message}`)
          .join("; ")}`,
      );
    }
    return parsed.data;
  });
}

/* ── Site configuration ──────────────────────────────────────────────────── */

let siteCache: SiteConfig | null = null;

export function getSiteConfig(): SiteConfig {
  if (siteCache) return siteCache;
  const parsed = SiteConfigSchema.safeParse(siteData);
  if (!parsed.success) {
    throw new Error(
      `Invalid content/site.ts:\n${parsed.error.issues
        .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
        .join("\n")}`,
    );
  }
  siteCache = parsed.data;
  return siteCache;
}
