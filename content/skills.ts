/**
 * skills.ts — skills with acquisition timeline (PRD §8.4).
 *
 * AC-06.3: proficiency is a four-level vocabulary with published definitions,
 * never a percentage or a progress bar.
 *
 * AC-06.4: any skill at `proficient` or `deep` must cite at least one project
 * as evidence, and the build fails otherwise.
 *
 * Every entry here is grounded in something checkable — a dependency in one of
 * the showcased repositories, a language GitHub reports, the thesis, or a
 * course. Levels are deliberately conservative: one project with a tool is
 * "working", not "proficient". Years marked `estimate` were inferred from
 * repository dates and course timing and should be confirmed.
 */
import type { Skill } from "@/lib/schemas";

export const skills: Skill[] = [
  // ── Languages ────────────────────────────────────────────────────────────
  {
    id: "python",
    name: "Python",
    category: "language",
    level: "proficient",
    firstUsed: 2021, // estimate
    lastUsed: null,
    projects: ["frescis"],
    note: "Model training and inference for the thesis, the FresCis backend, and data work with pandas and NumPy.",
    showcase: true,
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "language",
    level: "working",
    firstUsed: 2021, // BENET, 2021
    lastUsed: null,
    projects: ["frescis", "nft-marketplace", "benet"],
    showcase: true,
  },
  {
    id: "csharp",
    name: "C#",
    category: "language",
    level: "working",
    firstUsed: 2021, // BENET and UECS, 2021
    lastUsed: 2023,
    projects: ["reverie-d-redeemer", "benet"],
    showcase: false,
  },
  {
    id: "solidity",
    name: "Solidity",
    category: "language",
    level: "working",
    firstUsed: 2023,
    lastUsed: 2023,
    projects: ["nft-marketplace"],
    showcase: false,
  },
  {
    id: "hlsl",
    name: "HLSL / ShaderLab",
    category: "language",
    level: "learning",
    firstUsed: 2023,
    lastUsed: 2023,
    projects: ["reverie-d-redeemer"],
    showcase: false,
  },
  {
    id: "go",
    name: "Go",
    category: "language",
    level: "learning",
    firstUsed: 2022,
    lastUsed: 2022,
    projects: [],
    showcase: false,
  },

  // ── Frameworks ───────────────────────────────────────────────────────────
  {
    id: "nextjs",
    name: "Next.js",
    category: "framework",
    level: "working",
    firstUsed: 2023,
    lastUsed: null,
    projects: ["frescis", "nft-marketplace"],
    showcase: true,
  },
  {
    id: "react",
    name: "React",
    category: "framework",
    level: "working",
    firstUsed: 2023,
    lastUsed: null,
    projects: ["frescis", "nft-marketplace"],
    showcase: true,
  },
  {
    id: "unity",
    name: "Unity",
    category: "framework",
    level: "working",
    firstUsed: 2023,
    lastUsed: 2023,
    projects: ["reverie-d-redeemer"],
    showcase: false,
  },
  {
    id: "hardhat",
    name: "Hardhat & OpenZeppelin",
    category: "framework",
    level: "working",
    firstUsed: 2023,
    lastUsed: 2023,
    projects: ["nft-marketplace"],
    note: "Contract development and testing with ethers.js and Chai.",
    showcase: false,
  },
  {
    id: "aspnet",
    name: "ASP.NET",
    category: "framework",
    level: "learning",
    firstUsed: 2021,
    lastUsed: 2022,
    projects: ["benet"],
    showcase: false,
  },

  // ── Data & machine learning ──────────────────────────────────────────────
  {
    id: "object-detection",
    name: "Object detection (YOLO, R-CNN)",
    category: "data",
    level: "working",
    firstUsed: 2025, // estimate — thesis year
    lastUsed: null,
    projects: [],
    note: "Trained and compared both architectures for the batik anomaly thesis.",
    showcase: true,
  },
  {
    id: "opencv",
    name: "OpenCV",
    category: "data",
    level: "working",
    firstUsed: 2023,
    lastUsed: null,
    projects: ["frescis"],
    showcase: true,
  },
  {
    id: "roboflow",
    name: "Roboflow",
    category: "data",
    level: "working",
    firstUsed: 2023,
    lastUsed: null,
    projects: ["frescis"],
    showcase: false,
  },
  {
    id: "pandas-numpy",
    name: "pandas & NumPy",
    category: "data",
    level: "working",
    firstUsed: 2022, // estimate — prediction-modelling repository
    lastUsed: null,
    projects: ["frescis"],
    showcase: false,
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "data",
    level: "learning",
    firstUsed: 2023,
    lastUsed: 2023,
    projects: ["frescis"],
    showcase: false,
  },
  {
    id: "hadoop",
    name: "Hadoop MapReduce",
    category: "data",
    level: "learning",
    firstUsed: 2024, // estimate — Big Data and Analytics course
    lastUsed: 2024,
    projects: [],
    showcase: false,
  },

  // ── Infrastructure ───────────────────────────────────────────────────────
  {
    id: "azure-functions",
    name: "Azure Functions",
    category: "infrastructure",
    level: "working",
    firstUsed: 2023,
    lastUsed: 2023,
    projects: ["frescis"],
    showcase: false,
  },
  {
    id: "firebase",
    name: "Firebase",
    category: "infrastructure",
    level: "learning",
    firstUsed: 2023,
    lastUsed: 2023,
    projects: ["frescis"],
    showcase: false,
  },

  // ── Tooling ──────────────────────────────────────────────────────────────
  {
    id: "git",
    name: "Git & GitHub",
    category: "tooling",
    level: "working",
    firstUsed: 2021,
    lastUsed: null,
    projects: [],
    showcase: false,
  },
  {
    id: "security-tooling",
    name: "Kali Linux, Nmap, Metasploit",
    category: "tooling",
    level: "learning",
    firstUsed: 2024, // estimate — Ethical Hacking course
    lastUsed: 2024,
    projects: [],
    showcase: false,
  },
  {
    id: "figma",
    name: "Figma",
    category: "tooling",
    level: "learning",
    firstUsed: 2023,
    lastUsed: null,
    projects: ["frescis"],
    showcase: false,
  },

  // ── Practices ────────────────────────────────────────────────────────────
  {
    id: "team-leadership",
    name: "Leading small project teams",
    category: "practice",
    level: "working",
    firstUsed: 2023,
    lastUsed: null,
    projects: ["frescis"],
    note: "Team lead on the senior project and the capstone.",
    showcase: false,
  },
  {
    id: "iot-prototyping",
    name: "IoT prototyping (RFID, gas sensing)",
    category: "practice",
    level: "learning",
    firstUsed: 2025, // estimate — capstone year
    lastUsed: null,
    projects: [],
    showcase: false,
  },
];

export default skills;
