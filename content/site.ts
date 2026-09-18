/**
 * site.ts — identity, links, and SEO defaults (PRD §8.6).
 *
 * Validated by SiteConfigSchema at build time. Anything still marked `TODO:`
 * is reported by `pnpm validate` and must be resolved before launch.
 */
import type { SiteConfig } from "@/lib/schemas";

export const site = {
  brand: "NanameSoft",
  name: "Adhyaksa Zhalifunnas",
  shortName: "Adhyaksa",

  /**
   * AC-01.2: specific enough that a recruiter can place you in one read —
   * the role, the languages, and the kind of system.
   */
  headline:
    "Full-stack & AI engineer — Python, JavaScript and computer vision, from trained model to shipped web app",

  valueProp:
    "I train object-detection models and build the web apps around them: a thesis comparing YOLO and R-CNN on batik, and a fish-freshness detector served from Azure Functions.",

  availability: {
    status: "open",
    detail: "Open to full-stack, AI and ML engineering roles — available now",
    location: "Semarang, Yogyakarta or Jakarta · open to relocation",
  },

  email: "adhyaksazhalifunnas@gmail.com",

  // TODO: add once the PDF exists — { path: "/resume.pdf", updated: "YYYY-MM-DD" }.
  // While null, every résumé link on the site is hidden rather than pointing at a 404.
  resume: null,

  socials: [
    {
      platform: "github",
      url: "https://github.com/adhyaksazhalifunnas",
      label: "GitHub",
    },
    {
      platform: "linkedin",
      url: "https://www.linkedin.com/in/adhyaksa-zhalifunnas-4139a1157/",
      label: "LinkedIn",
    },
    {
      platform: "instagram",
      url: "https://www.instagram.com/adhyak_zha",
      label: "Instagram",
    },
  ],

  githubUsername: "adhyaksazhalifunnas",

  /**
   * AC-08.1: 150–350 words, first person, specific, and free of every phrase
   * in the banned list (PRD §12.6). One array entry per paragraph.
   */
  about: [
    "I'm Adhyaksa, a full-stack and AI engineer. I finished a Bachelor of Engineering in Information Technology at Universitas Gadjah Mada in February 2026, and most of what I build sits where a trained model meets the software people actually use.",
    "My thesis compared YOLO and R-CNN for detecting anomalies in hand-drawn batik tulis tekno from Batik Butimo, and analysed where each model's detections held up and where they did not.",
    "Before that I led two team projects from first sketch to working system. FresCis, my senior project, tells you whether a fish is fresh from a photo of its eye; I led a team of three across the Figma design, a Next.js frontend and a Python backend on Azure Functions. For my capstone I led the team behind an IoT vending-machine prototype that reads an electronic ID card over RFID, checks LPG-subsidy eligibility against a database, dispenses a cylinder, and watches for gas leaks.",
    "Outside the classroom, I spent four months as a frontend intern at PT Graphie Global Interaktif building NFT minting and marketplace frontends on Solidity smart contracts. A course in ethical hacking had me attacking lab systems with Nmap, Metasploit and Bettercap before writing the mitigations.",
    "I'm looking for full-stack, AI or machine-learning engineering roles, based between Semarang, Yogyakarta and Jakarta and open to relocating.",
  ],

  seo: {
    // TODO: switch to the custom domain once it is registered, then redeploy.
    siteUrl: "https://nanamesoft.vercel.app",
    defaultTitle: "Adhyaksa Zhalifunnas — Full-stack & AI Engineer",
    defaultDescription:
      "Adhyaksa Zhalifunnas builds computer-vision models and the web apps that ship them. Case studies on YOLO, R-CNN, Next.js and Azure.",
    locale: "en_US",
  },

  analytics: {
    provider: "none",
  },
} as const satisfies SiteConfig;

export default site;
