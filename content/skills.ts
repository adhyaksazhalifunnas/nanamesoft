/**
 * skills.ts — skills with acquisition timeline (PRD §8.4).
 *
 * AC-06.3: proficiency is a four-level vocabulary with published definitions,
 * never a percentage or a progress bar. The definitions render on the page
 * (see SKILL_LEVEL_DEFINITIONS in src/lib/schemas.ts) so the scale is not left
 * to the reader's imagination.
 *
 * AC-06.4: any skill at `proficient` or `deep` must cite at least one project
 * as evidence. The build fails otherwise — that rule is what stops this file
 * from drifting into a wish list.
 *
 * The entries below are seeded from the languages GitHub reports across the
 * showcased repositories. Levels and `firstUsed` years are marked TODO because
 * only you can set them honestly.
 */
import type { Skill } from "@/lib/schemas";

export const skills: Skill[] = [
  // ── Languages ────────────────────────────────────────────────────────────
  {
    id: "typescript",
    name: "TypeScript",
    category: "language",
    level: "working", // TODO: confirm — learning | working | proficient | deep
    firstUsed: 2023, // TODO: confirm the year you first used it
    lastUsed: null,
    projects: [],
    showcase: true,
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "language",
    level: "working", // TODO: confirm
    firstUsed: 2021, // TODO: confirm
    lastUsed: null,
    projects: ["frescis", "nft-marketplace", "benet"],
    showcase: true,
  },
  {
    id: "python",
    name: "Python",
    category: "language",
    level: "working", // TODO: confirm
    firstUsed: 2022, // TODO: confirm
    lastUsed: null,
    projects: ["frescis"],
    showcase: true,
  },
  {
    id: "csharp",
    name: "C#",
    category: "language",
    level: "working", // TODO: confirm
    firstUsed: 2021, // TODO: confirm
    lastUsed: 2023,
    projects: ["reverie-d-redeemer", "benet"],
    showcase: true,
  },
  {
    id: "solidity",
    name: "Solidity",
    category: "language",
    level: "working", // TODO: confirm
    firstUsed: 2023, // TODO: confirm
    lastUsed: 2023,
    projects: ["nft-marketplace"],
    showcase: false,
  },
  {
    id: "hlsl",
    name: "HLSL / ShaderLab",
    category: "language",
    level: "learning", // TODO: confirm
    firstUsed: 2023, // TODO: confirm
    lastUsed: 2023,
    projects: ["reverie-d-redeemer"],
    note: "TODO: e.g. Comfortable with fragment shaders; not with compute pipelines.",
    showcase: false,
  },

  // ── Frameworks ───────────────────────────────────────────────────────────
  {
    id: "nextjs",
    name: "Next.js",
    category: "framework",
    level: "working", // TODO: confirm
    firstUsed: 2023, // TODO: confirm
    lastUsed: null,
    projects: ["frescis"],
    showcase: true,
  },
  {
    id: "react",
    name: "React",
    category: "framework",
    level: "working", // TODO: confirm
    firstUsed: 2023, // TODO: confirm
    lastUsed: null,
    projects: ["frescis", "nft-marketplace"],
    showcase: true,
  },
  {
    id: "unity",
    name: "Unity",
    category: "framework",
    level: "working", // TODO: confirm
    firstUsed: 2023, // TODO: confirm
    lastUsed: 2023,
    projects: ["reverie-d-redeemer"],
    showcase: true,
  },
  {
    id: "aspnet",
    name: "ASP.NET",
    category: "framework",
    level: "learning", // TODO: confirm
    firstUsed: 2021, // TODO: confirm
    lastUsed: 2022,
    projects: ["benet"],
    showcase: false,
  },

  // ── Data ─────────────────────────────────────────────────────────────────
  {
    id: "tensorflow",
    name: "TensorFlow",
    category: "data",
    level: "learning", // TODO: confirm
    firstUsed: 2023, // TODO: confirm
    lastUsed: 2023,
    projects: ["frescis"],
    showcase: false,
  },

  // ── Infrastructure ───────────────────────────────────────────────────────
  {
    id: "azure-functions",
    name: "Azure Functions",
    category: "infrastructure",
    level: "learning", // TODO: confirm
    firstUsed: 2023, // TODO: confirm
    lastUsed: 2023,
    projects: ["frescis"],
    showcase: false,
  },

  // ── Tooling ──────────────────────────────────────────────────────────────
  {
    id: "git",
    name: "Git",
    category: "tooling",
    level: "working", // TODO: confirm
    firstUsed: 2021, // TODO: confirm
    lastUsed: null,
    projects: [],
    showcase: false,
  },

  // TODO: add the rest of your stack. One entry per skill; the timeline and the
  // grouped list both scale automatically.
];

export default skills;
