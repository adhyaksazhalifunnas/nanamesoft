/**
 * The English dictionary — the source of truth for every UI string.
 *
 * `Dictionary` is inferred from this object, and the other locales are typed
 * `satisfies Dictionary`, so adding a key here without adding it to `id.ts`
 * and `ja.ts` is a TYPE ERROR rather than a string that silently renders in
 * the wrong language. Same idea as the Zod content schemas: make the omission
 * impossible rather than remembering to check for it.
 */
export const en = {
  common: {
    /** Shown where an end date is absent, on dates and role ranges. */
    present: "Present",
  },

  nav: {
    primary: "Primary",
    projects: "Projects",
    experience: "Experience",
    about: "About",
    contact: "Contact",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    skipToContent: "Skip to content",
  },

  language: {
    /** The switcher's accessible name. */
    label: "Language",
    /** Announced on the option for the language already active. */
    current: "Current language",
  },

  theme: {
    system: "Match system theme",
    light: "Light theme",
    dark: "Dark theme",
  },

  home: {
    heroCta: "Read the case studies",
    workEyebrow: "Selected work",
    workTitle: "Case studies, not screenshots",
    workLede:
      "Each one covers the problem, the constraints, the decision I made and what I rejected, and what the numbers looked like afterwards.",
    skillsEyebrow: "Capability",
    skillsTitle: "What I work with, and for how long",
    skillsLede:
      "Proficiency is a four-level scale with published definitions rather than a percentage, because nobody can defend a percentage.",
    allProjects: (count: number) =>
      `All ${count} case ${count === 1 ? "study" : "studies"}`,
    basedIn: (location: string) => `Based in ${location}`,
  },

  projects: {
    eyebrow: "Selected work",
    title: "Projects",
    lede: "Four to six projects, deliberately — not everything I have ever pushed. Each is written the way I would explain it to a peer at a whiteboard.",
    empty:
      "No case studies are published yet. Each one lives in content/projects/ and appears here the moment its status is set to published.",
    metaDescription: (count: number) =>
      `${count} technical case ${count === 1 ? "study" : "studies"}, each covering the problem, the constraints, the decisions taken and rejected, and the measured outcome.`,
  },

  caseStudy: {
    draftNotice:
      "Draft — this case study is not finished and is hidden from every listing and from search engines.",
    readingTime: (minutes: number) => `${minutes} min read`,
    stack: "Stack:",
    constraints: "Constraints",
    constraintsLede:
      "What I could not change. Without these, none of the decisions below look hard.",
    decisions: "Decisions",
    decisionsLede: "What I chose, what I turned down, and what each choice cost.",
    decisionColumn: "Decision",
    chosenColumn: "Chosen",
    rejectedColumn: "Rejected",
    tradeoffColumn: "Trade-off taken",
    decisionTableCaption:
      "Design decisions, the option chosen, the alternatives rejected, and the trade-off accepted for each",
    why: (decision: string) => `Why — ${decision}`,
    outcome: "Outcome",
    outcomeLede:
      "Every number below states how it was measured. A metric without a method is a claim without evidence.",
    metricColumn: "Metric",
    beforeColumn: "Before",
    afterColumn: "After",
    methodColumn: "How it was measured",
    metricsTableCaption:
      "Measured outcomes, with the baseline, the result, and how each was measured",
    limitations: "Limitations, and what I would do differently",
    sourceLinks: "Go straight to the code",
    onThisPage: "On this page",
    previous: "Previous",
    next: "Next",
    moreCaseStudies: "More case studies",
    getInTouch: "Get in touch",
    /** Shown on a non-English page, because the body below it stays English. */
    bodyInEnglish:
      "The full case study below is in English — it is written for engineers reading in depth, and a translation nobody can verify would be worse than the original.",
  },

  evidence: {
    heading: "Repository evidence",
    stale:
      "This repository could not be read at the last sync. The figures below are the last known values.",
    commits: "Commits",
    repositoryAge: "Repository age",
    firstCommit: "First commit",
    lastPush: "Last push",
    contributors: "Contributors",
    stars: "Stars",
    forks: "Forks",
    license: "License",
    latestRelease: "Latest release",
    openInNewTab: "(opens in a new tab)",
    onGitHub: (repo: string) => `${repo} on GitHub`,
    liveSite: "Live site",
    dataAsOf: "Repository data as of",
    fetchedAtBuild: "Fetched at build time, not on page load.",
  },

  skills: {
    since: (from: number, to: number | null) =>
      to ? `since ${from}–${to}` : `since ${from}`,
    evidence: "Evidence:",
    levelsHeading: "What the levels mean",
    levels: {
      learning: "Learning",
      working: "Working",
      proficient: "Proficient",
      deep: "Deep",
    },
    levelDefinitions: {
      learning:
        "Currently building with it; still reaching for documentation constantly.",
      working: "Can build features independently; would need help with unusual problems.",
      proficient:
        "Can design and own a component in it; understand the common failure modes.",
      deep: "Can debug it under pressure, reason about its internals, and teach it.",
    },
    categories: {
      language: "Languages",
      framework: "Frameworks",
      data: "Data",
      infrastructure: "Infrastructure",
      tooling: "Tooling",
      practice: "Practices",
    },
  },

  about: {
    eyebrow: "Background",
    title: "About",
    metaDescription: (name: string) =>
      `Background, computer science education and coursework for ${name}, and how I approach engineering problems.`,
    educationEyebrow: "Computer science background",
    programme: "Programme",
    dates: "Dates",
    location: "Location",
    gpa: "GPA",
    focus: "Focus",
    expected: (date: string) => `expected ${date}`,
    coursework: "Coursework, and what it produced",
    thesis: "Thesis",
    honours: "Honours",
    activities: "Activities",
    repository: "Repository",
  },

  experience: {
    eyebrow: "Trajectory",
    title: "Experience",
    lede: "Dates are honest, including the gaps. Each entry says what changed because of the work rather than what the work was.",
    empty: "No entries yet. Add them to content/experience.ts.",
    metaDescription: (name: string) =>
      `Roles, projects and outcomes for ${name} — what I owned, what changed because of it, and the stack each one ran on.`,
    undisclosed: "Undisclosed organisation",
    readCaseStudy: (slug: string) => `Read the ${slug} case study`,
    types: {
      "full-time": "Full-time",
      "part-time": "Part-time",
      internship: "Internship",
      contract: "Contract",
      freelance: "Freelance",
      "open-source": "Open source",
      volunteer: "Volunteer",
      academic: "Academic",
    },
    modes: {
      "on-site": "On-site",
      hybrid: "Hybrid",
      remote: "Remote",
    },
  },

  scope: {
    roles: {
      solo: "Solo",
      lead: "Team lead",
      contributor: "Contributor",
      "team-member": "Team member",
    },
    contexts: {
      personal: "Personal",
      academic: "Academic",
      freelance: "Freelance",
      employment: "Employment",
      "open-source": "Open source",
    },
    people: (count: number) => `${count} people`,
  },

  contact: {
    eyebrow: "Say hello",
    title: (shortName: string) => `Write to ${shortName}`,
    metaDescription: (name: string, detail: string) =>
      `Get in touch with ${name} by email or through the contact form. ${detail}`,
    sendMessage: "Send a message",
    orDirectly: "Or reach me directly",
    notObfuscated:
      "The address is written out rather than obfuscated. Obfuscation costs recruiters more than it helps against scrapers.",
    resume: "Résumé",
    resumeMeta: (date: string) => `PDF · updated ${date}`,
    privacyNote:
      "This form stores nothing. It sends your message to my inbox and keeps no copy, no cookie and no analytics profile of you.",
    form: {
      name: "Name",
      email: "Email",
      organisation: "Organisation",
      optional: "(optional)",
      source: "How did you find me?",
      sourcePreferNot: "Prefer not to say",
      message: "Message",
      characters: "{count} of 2,000 characters",
      submit: "Send message",
      submitting: "Sending…",
      fixFields: "Please fix the fields marked below.",
      emailInstead: "Send this by email instead",
      offline:
        "That request could not be sent — you may be offline. Your message is still here, and you can email it to {email} instead.",
      successFallback: "If you do not hear back, email me directly at {email}.",
      honeypotLabel: "Company website",
      sources: {
        linkedin: "LinkedIn",
        github: "GitHub",
        referral: "Someone referred me",
        search: "Search engine",
        other: "Something else",
      },
    },
  },

  footer: {
    pages: "Pages",
    elsewhere: "Elsewhere",
    resumeMeta: (date: string) => `(PDF, updated ${date})`,
    colophon:
      "Built with Next.js. Repository data from the GitHub API, cached at build time.",
  },

  notFound: {
    code: "404",
    title: "That page does not exist",
    body: "The link may be out of date, or the case study it pointed at may still be a draft.",
    seeProjects: "See the case studies",
    backHome: "Back home",
  },

  error: {
    code: "Error",
    title: "Something broke on this page",
    body: "This is my bug, not yours. Reloading usually fixes it.",
    tryAgain: "Try again",
  },
};

/**
 * Deliberately NOT `as const`. With literal types, `satisfies Dictionary` on a
 * translated file would demand the English strings back, which is the opposite
 * of the point. Widened to `string` and the function signatures, the check
 * becomes exactly what it should be: same keys, same shapes, any wording.
 */
export type Dictionary = typeof en;

export default en;
