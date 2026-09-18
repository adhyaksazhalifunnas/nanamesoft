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
    id: "graphie-frontend-intern",
    organization: "PT Graphie Global Interaktif",
    title: "Frontend Developer Intern",
    type: "internship",
    location: "TODO: city, or Remote",
    workMode: "remote", // TODO: confirm — on-site | hybrid | remote
    startDate: "2023-01",
    endDate: "2023-04",
    summary:
      "Four-month frontend internship on the company's Web3 work: NFT minting and marketplace websites built on Solidity smart contracts, plus research into decentralised applications.",
    highlights: [
      "Built the frontend of the company's NFT minting website on top of its Solidity smart contracts.",
      "Built the frontend of an NFT marketplace website wired to on-chain contracts.",
      "Produced Web3 research on Solidity smart contracts and decentralised-application architecture.",
    ],
    stack: ["Solidity", "Next.js", "Hardhat", "OpenZeppelin", "ethers.js"],
    // TODO: if the NFT-Marketplace repositories came out of this internship,
    // add "nft-marketplace" here so the entry links to its case study.
    projects: [],
    confidential: false,
  },
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
      "Led a three-person team building FresCis, a web app that judges fish freshness from a photo of the eye, for the Information Technology senior project course.",
    highlights: [
      "Took the product from a Figma design to a Next.js frontend and a Python backend on Azure Functions.",
      "Served the freshness model behind a Predict endpoint using Roboflow and OpenCV, with images in Cloudinary and detection history in MongoDB.",
    ],
    stack: [
      "Next.js",
      "React",
      "Ant Design",
      "Python",
      "Azure Functions",
      "Roboflow",
      "OpenCV",
      "MongoDB",
    ],
    projects: ["frescis"],
    confidential: false,
  },
];

export default experience;
