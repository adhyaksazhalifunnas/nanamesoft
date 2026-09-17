/**
 * site.ts — identity, links, and SEO defaults (PRD §8.6).
 *
 * Validated by SiteConfigSchema at build time. Anything still marked `TODO:`
 * is reported by `pnpm validate` and must be resolved before launch.
 */
import type { SiteConfig } from "@/lib/schemas";

export const site = {
  name: "Adhyaksa Zhalifunnas",

  /**
   * AC-01.2: the headline must be specific enough that a recruiter can place
   * you. "Full-Stack Developer & Problem Solver" fails this criterion.
   */
  headline:
    "TODO: Full-stack developer — name your two strongest languages and the kind of system you build",

  valueProp:
    "TODO: One sentence with at least one concrete technical noun in it. What do you build, and for whom?",

  availability: {
    status: "open",
    detail: "TODO: e.g. Open to backend and full-stack roles from Q4 2026",
    location: "TODO: City, Country",
  },

  email: "adhyaksazhalifunnas@gmail.com",

  resumePath: "/resume.pdf",
  resumeUpdated: "2026-09-17",

  socials: [
    {
      platform: "github",
      url: "https://github.com/adhyaksazhalifunnas",
      label: "GitHub",
    },
    {
      platform: "linkedin",
      url: "https://linkedin.com/in/TODO-your-linkedin-handle",
      label: "LinkedIn",
    },
  ],

  githubUsername: "adhyaksazhalifunnas",

  /**
   * AC-08.1: 150–350 words total, first person, specific, and free of every
   * phrase in the banned list (PRD §12.6). One array entry per paragraph.
   */
  about: [
    "TODO: Paragraph one. Who you are and what you actually build. Lead with something concrete — a system you shipped, a problem domain you know. Not 'passionate about technology'.",
    "TODO: Paragraph two. How you work and what you are looking for next. Name real constraints you have worked under and real trade-offs you have made.",
  ],

  seo: {
    siteUrl: "https://nanamesoft.vercel.app",
    defaultTitle: "Adhyaksa Zhalifunnas — Developer",
    defaultDescription:
      "TODO: 70-160 characters. This is the sentence that appears under your name in Google results, so make it carry information.",
    locale: "en_US",
  },

  analytics: {
    provider: "none",
  },
} as const satisfies SiteConfig;

export default site;
