/**
 * education.ts — CS background (PRD §8.5, AC-08.2).
 *
 * The `takeaway` on every course is required and is the whole point of this
 * section: a bare list of course codes tells a reader nothing. Each one says
 * what the course actually produced.
 *
 * GPA is deliberately omitted (§8.5: include it only if it is a strength —
 * the owner's call, and the call was no).
 */
import type { Education } from "@/lib/schemas";

export const education: Education[] = [
  {
    id: "ugm-information-technology",
    institution: "Universitas Gadjah Mada",
    institutionUrl: "https://ugm.ac.id",
    degree: "Bachelor of Engineering (S.T.)",
    field: "Information Technology",
    location: "Yogyakarta, Indonesia",
    startDate: "2020-08",
    endDate: "2026-02",
    expected: false,
    focusAreas: ["Computer vision", "Full-stack web", "IoT", "Security"],

    courses: [
      {
        name: "Senior Project",
        takeaway:
          "Led a team of three to ship FresCis, a web app that judges fish freshness from a photo of the eye — Figma design, Next.js frontend, Python on Azure Functions.",
        projects: ["frescis"],
      },
      {
        name: "Capstone Project",
        term: "2022–2023",
        takeaway:
          "Led the team building an IoT LPG vending-machine prototype: RFID reads an e-KTP, a database decides subsidy eligibility, the machine dispenses, and a sensor watches for gas leaks.",
        projects: ["lpg-vending-iot"],
      },
      {
        name: "Game Application Development",
        takeaway:
          "Built Reverie D Redeemer in Unity as a two-person team, including hand-written ShaderLab and HLSL shaders.",
        projects: ["reverie-d-redeemer"],
      },
      {
        name: "Big Data and Analytics",
        term: "2023",
        takeaway:
          "Tallied simulated 2024 Indonesian election results per presidential candidate and party with Hadoop MapReduce jobs running distributed on Cloudera.",
        projects: [],
      },
      {
        name: "Ethical Hacking",
        term: "2023",
        takeaway:
          "Attacked a VirtualBox lab end to end — Nmap scanning, Metasploit against DVWA, Bettercap MITM, Aircrack wireless testing — then wrote CVE mitigations under EC-Council ethics and the PDP law.",
        projects: [],
      },
    ],

    thesis: {
      title:
        "Anomaly Analysis of Batik Tulis Tekno Patterns Using Convolutional Neural Networks",
      abstract:
        "An individual thesis on detecting anomalies in hand-drawn batik tulis tekno produced by Batik Butimo. I trained YOLO and R-CNN object-detection models on the pattern images and analysed each model's detection results against the other. Original title: Analisis Anomali Pola Batik Tulis Tekno Menggunakan Metode Convolutional Neural Network.",
    },

    honors: [],
    activities: [
      "Public relations, KMTETI — the student association of UGM's Department of Electrical and Information Engineering",
    ],
  },
];

export default education;
