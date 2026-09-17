/**
 * education.ts — CS background (PRD §8.5, AC-08.2).
 *
 * The `takeaway` on every course is required and is the whole point of this
 * section: a bare list of course codes tells a reader nothing. Say what the
 * course actually produced or taught.
 */
import type { Education } from "@/lib/schemas";

export const education: Education[] = [
  {
    id: "ugm-information-technology",
    institution: "Universitas Gadjah Mada",
    institutionUrl: "https://ugm.ac.id",
    degree: "TODO: e.g. Bachelor of Engineering",
    field: "Information Technology",
    location: "Yogyakarta, Indonesia",
    startDate: "2020-08",
    endDate: "2024-08",
    expected: false,
    focusAreas: ["TODO: e.g. Software Engineering", "TODO: e.g. Machine Learning"],

    // AC-08.2 requires 4–8 courses, each with a real takeaway.
    courses: [
      {
        name: "TODO: Course name",
        term: "TODO: e.g. Fall 2022",
        takeaway:
          "TODO: What this course produced or taught you. One sentence, concrete. Not the syllabus description.",
        projects: [],
      },
      {
        name: "TODO: Course name",
        takeaway:
          "TODO: What this course produced or taught you. One sentence, concrete. Not the syllabus description.",
        projects: [],
      },
      {
        name: "TODO: Course name",
        takeaway:
          "TODO: What this course produced or taught you. One sentence, concrete. Not the syllabus description.",
        projects: [],
      },
      {
        name: "TODO: Course name",
        takeaway:
          "TODO: What this course produced or taught you. One sentence, concrete. Not the syllabus description.",
        projects: [],
      },
    ],

    honors: [],
    activities: [],
  },
];

export default education;
