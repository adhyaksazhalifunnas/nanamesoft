/**
 * schemas.ts — the single source of truth for every content shape (PRD §8).
 *
 * Types are INFERRED from these schemas (`z.infer<...>`) rather than declared
 * alongside them, so a validator and its type can never drift apart.
 *
 * Everything here runs at build time. A schema failure is a failed build, which
 * is the point: "I forgot the Outcome section" should be a red build, not a
 * silent quality regression that ships.
 */
import { z } from "zod";

/* ── Shared primitives ───────────────────────────────────────────────────── */

export const SlugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case");

export const MetricSchema = z.object({
  label: z.string().min(3).max(60), // "Sync job p95 latency"
  baseline: z.string().min(1).max(40), // "8.2 s"
  result: z.string().min(1).max(40), // "1.4 s"
  delta: z.string().max(40).optional(), // "-83%"
  /** REQUIRED. A metric without a method is a claim without evidence (AC-04.4). */
  method: z.string().min(10).max(200),
  instrument: z.string().max(80).optional(), // "k6, 200 VU, 5 min, staging"
  isHeadline: z.boolean().default(false),
});

export const DecisionSchema = z.object({
  decision: z.string().min(10).max(120), // "How to invalidate the read cache"
  chosen: z.string().min(5).max(200),
  alternatives: z
    .array(z.string().min(3).max(200))
    .min(1, "Name at least one rejected alternative — the trade-off is the signal"),
  rationale: z.string().min(20).max(600),
  tradeoff: z.string().min(10).max(400), // what you knowingly gave up
});

export const LinkSchema = z.object({
  label: z.string().min(2).max(60),
  href: z.url(),
  kind: z.enum(["repo", "source", "demo", "docs", "writeup", "release", "other"]),
});

/* ── 8.2 Project ─────────────────────────────────────────────────────────── */

export const ProjectFrontmatterSchema = z
  .object({
    // ── Identity ──────────────────────────────────────────────
    slug: SlugSchema,
    title: z.string().min(2).max(80),
    tagline: z.string().min(20).max(140), // AC-02.2: the plain-language one-liner
    summary: z.string().min(120).max(400), // AC-04.9: the <=60-word standalone block

    // ── Curation ──────────────────────────────────────────────
    featured: z.boolean().default(false),
    tier: z.enum(["flagship", "supporting", "archive"]).default("supporting"),
    order: z.number().int().min(0).default(100),
    status: z.enum(["draft", "published"]).default("draft"),

    // ── Honest scoping (AC-04.6) ──────────────────────────────
    role: z.enum(["solo", "lead", "contributor", "team-member"]),
    teamSize: z.number().int().min(1).max(500).default(1),
    context: z.enum(["personal", "academic", "freelance", "employment", "open-source"]),
    hasUsers: z.boolean().default(false),
    userScale: z.string().max(60).optional(), // omit if unknown

    // ── Timeline ──────────────────────────────────────────────
    startDate: z.iso.date(), // ISO YYYY-MM-DD
    endDate: z.iso.date().nullable().default(null), // null = ongoing

    // ── Technical ─────────────────────────────────────────────
    repo: z
      .string()
      .regex(/^[\w.-]+\/[\w.-]+$/, 'repo must be "owner/name"')
      .optional(),
    stack: z.array(z.string().min(1).max(40)).min(1).max(12),
    domains: z
      .array(
        z.enum([
          "frontend",
          "backend",
          "data",
          "infra",
          "mobile",
          "ml",
          "devtools",
          "security",
          "games",
        ]),
      )
      .min(1),

    // ── Narrative structure (AC-04.1) ─────────────────────────
    problem: z.string().min(80).max(1000),
    constraints: z.array(z.string().min(10).max(300)).min(1),
    decisions: z
      .array(DecisionSchema)
      .min(2, "A case study needs at least two real decisions"),
    metrics: z.array(MetricSchema).default([]),
    limitations: z
      .array(z.string().min(15).max(400))
      .min(1, "Limitations are required — their absence is a credibility problem"),

    // ── Media & links ─────────────────────────────────────────
    cover: z
      .object({
        src: z.string().startsWith("/"),
        alt: z.string().min(10).max(200),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      })
      .optional(),
    architecture: z
      .object({
        src: z.string().startsWith("/"),
        /** Must convey the relationships, not just "diagram" (AC-04.3). */
        alt: z.string().min(20).max(500),
        caption: z.string().max(300).optional(),
      })
      .optional(),
    links: z.array(LinkSchema).default([]),

    // ── SEO ───────────────────────────────────────────────────
    seoTitle: z.string().max(60).optional(),
    seoDescription: z.string().min(70).max(160).optional(),
  })
  .refine((d) => d.endDate === null || d.endDate >= d.startDate, {
    message: "endDate must be on or after startDate",
    path: ["endDate"],
  })
  .refine((d) => d.role !== "solo" || d.teamSize === 1, {
    message: 'role "solo" requires teamSize 1',
    path: ["teamSize"],
  })
  .refine((d) => !d.hasUsers || !!d.userScale, {
    message: "If hasUsers is true, provide userScale",
    path: ["userScale"],
  })
  .refine(
    (d) => d.status !== "published" || d.metrics.length > 0 || d.limitations.length >= 2,
    {
      message:
        "A published project needs either measured metrics or a substantive limitations section",
      path: ["metrics"],
    },
  );

export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>;
export type Project = ProjectFrontmatter & {
  body: string;
  readingTimeMinutes: number;
  wordCount: number;
};

/* ── 8.3 Experience ──────────────────────────────────────────────────────── */

export const ExperienceSchema = z
  .object({
    id: SlugSchema,
    organization: z.string().min(2).max(100),
    orgUrl: z.url().optional(),
    title: z.string().min(2).max(100),
    type: z.enum([
      "full-time",
      "part-time",
      "internship",
      "contract",
      "freelance",
      "open-source",
      "volunteer",
      "academic",
    ]),
    location: z.string().max(80),
    workMode: z.enum(["on-site", "hybrid", "remote"]),
    startDate: z.string().regex(/^\d{4}-\d{2}$/, "Use YYYY-MM"), // YYYY-MM
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}$/, "Use YYYY-MM")
      .nullable(), // null = present
    summary: z.string().min(40).max(300),
    /** Outcome-framed, never duty-framed (AC-07.2). */
    highlights: z.array(z.string().min(25).max(300)).min(2).max(5),
    stack: z.array(z.string().max(40)).max(15).default([]),
    projects: z.array(SlugSchema).default([]), // FK -> Project.slug
    /** If true the organization is shown generically ("a fintech startup"). */
    confidential: z.boolean().default(false),
  })
  .refine((d) => d.endDate === null || d.endDate >= d.startDate, {
    message: "endDate must be on or after startDate",
    path: ["endDate"],
  });

export type Experience = z.infer<typeof ExperienceSchema>;

/* ── 8.4 Skills ──────────────────────────────────────────────────────────── */

export const SKILL_LEVELS = ["learning", "working", "proficient", "deep"] as const;

/** Published on the page so the scale is not left to interpretation (§8.4). */
export const SKILL_LEVEL_DEFINITIONS: Record<(typeof SKILL_LEVELS)[number], string> = {
  learning: "Currently building with it; still reaching for documentation constantly.",
  working: "Can build features independently; would need help with unusual problems.",
  proficient:
    "Can design and own a component in it; understand the common failure modes.",
  deep: "Can debug it under pressure, reason about its internals, and teach it.",
};

export const SKILL_CATEGORIES = [
  "language",
  "framework",
  "data",
  "infrastructure",
  "tooling",
  "practice",
] as const;

export const SKILL_CATEGORY_LABELS: Record<(typeof SKILL_CATEGORIES)[number], string> = {
  language: "Languages",
  framework: "Frameworks",
  data: "Data",
  infrastructure: "Infrastructure",
  tooling: "Tooling",
  practice: "Practices",
};

export const SkillSchema = z
  .object({
    id: SlugSchema,
    name: z.string().min(1).max(40),
    category: z.enum(SKILL_CATEGORIES),
    /** AC-06.3: never a percentage, star rating, or progress bar. */
    level: z.enum(SKILL_LEVELS),
    firstUsed: z.number().int().min(2000).max(2100), // year
    lastUsed: z.number().int().min(2000).max(2100).nullable().default(null), // null = current
    projects: z.array(SlugSchema).default([]), // FK -> Project.slug
    note: z.string().max(160).optional(),
    showcase: z.boolean().default(false), // surface on the landing page
  })
  .refine((d) => d.lastUsed === null || d.lastUsed >= d.firstUsed, {
    message: "lastUsed must be >= firstUsed",
    path: ["lastUsed"],
  })
  .refine((d) => !["proficient", "deep"].includes(d.level) || d.projects.length > 0, {
    message:
      "Proficient/deep skills must reference at least one project as evidence (AC-06.4)",
    path: ["projects"],
  });

export type Skill = z.infer<typeof SkillSchema>;
export type SkillCategory = (typeof SKILL_CATEGORIES)[number];
export type SkillLevel = (typeof SKILL_LEVELS)[number];
export type SkillGroup = { category: SkillCategory; label: string; skills: Skill[] };

/* ── 8.5 Education ───────────────────────────────────────────────────────── */

export const CourseSchema = z.object({
  code: z.string().max(20).optional(), // "CS 3410"
  name: z.string().min(3).max(120),
  term: z.string().max(30).optional(), // "Fall 2025"
  grade: z.string().max(10).optional(), // include only if it helps
  /** AC-08.2: REQUIRED — what the course actually produced or taught. */
  takeaway: z.string().min(20).max(240),
  projects: z.array(SlugSchema).default([]), // FK -> Project.slug
  repoUrl: z.url().optional(),
});

export const EducationSchema = z.object({
  id: SlugSchema,
  institution: z.string().min(2).max(120),
  institutionUrl: z.url().optional(),
  degree: z.string().min(2).max(120), // "B.Sc. Computer Science"
  field: z.string().max(120).optional(),
  location: z.string().max(80),
  startDate: z.string().regex(/^\d{4}-\d{2}$/, "Use YYYY-MM"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Use YYYY-MM")
    .nullable(),
  expected: z.boolean().default(false), // true -> render "Expected <date>"
  gpa: z
    .object({ value: z.number().min(0).max(5), scale: z.number().min(4).max(5) })
    .optional(), // include only if it is a strength
  focusAreas: z.array(z.string().max(60)).max(6).default([]),
  courses: z.array(CourseSchema).min(4).max(8), // AC-08.2
  thesis: z
    .object({
      title: z.string().max(200),
      abstract: z.string().min(80).max(800),
      advisor: z.string().max(80).optional(),
      url: z.url().optional(),
    })
    .optional(),
  honors: z.array(z.string().max(160)).default([]),
  activities: z.array(z.string().max(160)).default([]),
});

export type Course = z.infer<typeof CourseSchema>;
export type Education = z.infer<typeof EducationSchema>;

/* ── 8.6 Site configuration ──────────────────────────────────────────────── */

export const SiteConfigSchema = z.object({
  name: z.string().min(2).max(80),
  /** AC-01.2: must be specific. "Full-Stack Developer & Problem Solver" fails. */
  headline: z.string().min(20).max(120),
  valueProp: z.string().min(40).max(200),
  availability: z.object({
    status: z.enum(["open", "selectively-open", "not-looking"]),
    detail: z.string().max(120),
    location: z.string().max(80),
  }),
  email: z.email(),
  resumePath: z.string().startsWith("/").endsWith(".pdf"),
  resumeUpdated: z.iso.date(),
  socials: z
    .array(
      z.object({
        platform: z.enum([
          "github",
          "linkedin",
          "x",
          "mastodon",
          "bluesky",
          "email",
          "other",
        ]),
        url: z.url(),
        label: z.string().max(60),
      }),
    )
    .min(1),
  githubUsername: z.string().min(1).max(39),
  /** About prose. 150-350 words total, first-person, no banned phrases (AC-08.1). */
  about: z.array(z.string().min(40)).min(1),
  seo: z.object({
    siteUrl: z.url(),
    defaultTitle: z.string().max(60),
    defaultDescription: z.string().min(70).max(160),
    twitterHandle: z.string().max(16).optional(),
    locale: z.string().default("en_US"),
  }),
  analytics: z.object({
    provider: z.enum(["plausible", "umami", "none"]),
    domain: z.string().max(120).optional(),
    scriptUrl: z.url().optional(),
  }),
});

export type SiteConfig = z.infer<typeof SiteConfigSchema>;

/* ── 8.7 GitHub cache (generated — do not hand-edit) ─────────────────────── */

export const RepoDataSchema = z.object({
  nameWithOwner: z.string(),
  description: z.string().nullable(),
  url: z.url(),
  homepageUrl: z.url().nullable(),
  isPrivate: z.boolean(),
  isArchived: z.boolean(),
  createdAt: z.iso.datetime(),
  pushedAt: z.iso.datetime(),
  stars: z.number().int().min(0),
  forks: z.number().int().min(0),
  license: z.object({ spdxId: z.string(), name: z.string() }).nullable(),
  primaryLanguage: z.object({ name: z.string(), color: z.string() }).nullable(),
  languages: z.array(
    z.object({
      name: z.string(),
      color: z.string(),
      bytes: z.number().int(),
      percent: z.number().min(0).max(100),
    }),
  ),
  topics: z.array(z.string()),
  commitCount: z.number().int().min(0),
  lastCommit: z
    .object({
      date: z.iso.datetime(),
      messageHeadline: z.string(),
      oid: z.string(),
    })
    .nullable(),
  /** Weekly, oldest -> newest. */
  commitActivity: z.array(z.number().int().min(0)).length(52).nullable(),
  contributorCount: z.number().int().min(1).nullable(),
  latestRelease: z
    .object({
      tagName: z.string(),
      publishedAt: z.iso.datetime(),
      url: z.url(),
    })
    .nullable(),
  readmeExcerpt: z.string().max(2000).nullable(),
  stale: z.boolean().default(false),
});

export const GitHubCacheSchema = z.object({
  version: z.literal(1),
  syncedAt: z.iso.datetime(),
  repos: z.record(z.string(), RepoDataSchema), // key = "owner/name"
});

export type RepoData = z.infer<typeof RepoDataSchema>;
export type GitHubCache = z.infer<typeof GitHubCacheSchema>;
