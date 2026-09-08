/**
 * ============================================================================
 *  EDIT THIS FILE FIRST — it is the only file you need to touch to make the
 *  site yours. Every string below marked TODO is a placeholder.
 *  Search the project for "TODO:" to confirm nothing is left over.
 * ============================================================================
 */

export type Project = {
  title: string;
  description: string;
  /** Short tech tags shown as pills on the card. */
  tags: string[];
  /** Live demo URL, or null to hide the "Live" link. */
  liveUrl: string | null;
  /** Source code URL, or null to hide the "Code" link. */
  repoUrl: string | null;
  /** Optional image in /public, e.g. "/projects/my-app.png". null = gradient placeholder. */
  image: string | null;
};

export type SocialLink = {
  label: string;
  href: string;
};

export const site = {
  // --- Identity -------------------------------------------------------------
  /** TODO: your full name. Shown in the nav, hero and <title>. */
  name: "YOUR NAME",
  /** TODO: one-line role, e.g. "Full-stack developer". */
  role: "YOUR ROLE — e.g. Full-stack Developer",
  /** TODO: 1–3 sentence intro shown under the hero heading. */
  tagline:
    "TODO: One or two sentences about what you build and who you build it for. Keep it concrete — this is the first thing a recruiter reads.",
  /** TODO: canonical URL once deployed. Used for SEO metadata and Open Graph. */
  url: "https://example.com",
  /** TODO: contact email. */
  email: "you@example.com",
  /** TODO: city / timezone, or set to null to hide. */
  location: "YOUR CITY, COUNTRY",

  // --- About ----------------------------------------------------------------
  /** TODO: longer bio. Each string becomes its own paragraph. */
  about: [
    "TODO: Paragraph one — what you do, how long you have been doing it, and the kind of problems you enjoy.",
    "TODO: Paragraph two — your current focus, the stack you reach for, and what you are looking for next.",
  ],

  /** TODO: replace with the tools you actually use. Grouped for the skills grid. */
  skills: [
    { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "SQL"] },
    { group: "Frontend", items: ["React", "Next.js", "Tailwind CSS"] },
    { group: "Backend", items: ["Node.js", "PostgreSQL", "REST APIs"] },
    { group: "Tooling", items: ["Git", "Docker", "Vercel"] },
  ],

  // --- Links ----------------------------------------------------------------
  /** TODO: point these at your real profiles. Delete any you do not use. */
  socials: [
    { label: "GitHub", href: "https://github.com/YOUR_USERNAME" },
    { label: "LinkedIn", href: "https://linkedin.com/in/YOUR_USERNAME" },
    { label: "X", href: "https://x.com/YOUR_USERNAME" },
  ] satisfies SocialLink[],

  /** TODO: put a PDF at public/resume.pdf, or set to null to hide the button. */
  resumeUrl: "/resume.pdf" as string | null,
} as const;

/**
 * TODO: replace these three with your real work. Two to six projects reads best.
 * The first project is rendered as a wide "featured" card.
 */
export const projects: Project[] = [
  {
    title: "TODO: Project One",
    description:
      "TODO: What it does, who it is for, and the one thing you are proud of technically. Two sentences is plenty.",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/YOUR_USERNAME/project-one",
    image: null,
  },
  {
    title: "TODO: Project Two",
    description:
      "TODO: Describe the problem it solves. Lead with the outcome, not the tech stack.",
    tags: ["React", "Node.js"],
    liveUrl: null,
    repoUrl: "https://github.com/YOUR_USERNAME/project-two",
    image: null,
  },
  {
    title: "TODO: Project Three",
    description:
      "TODO: A smaller side project or open-source contribution works well here.",
    tags: ["Python", "CLI"],
    liveUrl: null,
    repoUrl: "https://github.com/YOUR_USERNAME/project-three",
    image: null,
  },
];

/** TODO: delete this array (and the <Experience /> section) if you would rather not list roles. */
export const experience = [
  {
    company: "TODO: Company Name",
    role: "TODO: Your Title",
    period: "2023 — Present",
    summary:
      "TODO: One or two lines on what you owned and what changed because of it. Numbers help.",
  },
  {
    company: "TODO: Previous Company",
    role: "TODO: Your Title",
    period: "2021 — 2023",
    summary: "TODO: Same again — scope, impact, and the stack you worked in.",
  },
];
