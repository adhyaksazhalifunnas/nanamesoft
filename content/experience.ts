/**
 * experience.ts — roles and their outcomes (PRD §8.3).
 *
 * Entries are sorted reverse-chronologically at render time, not here.
 *
 * AC-07.2: highlights are outcome-framed, never duty-framed. `pnpm validate`
 * warns on any highlight opening with "Responsible for", "Worked on", or
 * "Helped with". The `type` discriminator supports academic, open-source and
 * freelance work, so a record with no formal employment is still a real record.
 */
import type { Experience } from "@/lib/schemas";

export const experience: Experience[] = [
  {
    id: "frescis-senior-project",
    organization: "Universitas Gadjah Mada — Senior Project",
    title: "Team Lead",
    type: "academic",
    location: "Yogyakarta, Indonesia",
    workMode: "hybrid",
    startDate: "2023-02",
    endDate: "2023-06",
    summary:
      "TODO: 40-300 characters. What the team was formed to do, how big it was, and what you owned within it.",
    highlights: [
      "TODO: An outcome, not a duty. What changed because you did this? Include a number where one honestly exists.",
      "TODO: A second outcome. Lead with the result, then say how you got there.",
    ],
    stack: ["Next.js", "Python", "Azure Functions", "TensorFlow"],
    projects: ["frescis"],
    confidential: false,
  },
];

export default experience;
