/**
 * /projects — the full index.
 *
 * US-17 (filtering) is P2 and explicitly gated on having more than eight
 * projects: below that it is friction, not help. So there is no filter UI here
 * yet, and adding one later changes this file only.
 */
import type { Metadata } from "next";

import { Container } from "@/components/primitives/Container";
import { ProjectShowcase } from "@/components/sections/ProjectShowcase";
import { getProjects } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const count = getProjects().length;
  return buildMetadata({
    title: "Projects",
    description: `${count} technical case ${count === 1 ? "study" : "studies"}, each covering the problem, the constraints, the decisions taken and rejected, and the measured outcome.`,
    pathname: "/projects",
  });
}

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <Container as="div" className="py-[var(--space-8)] lg:py-[var(--space-9)]">
      <header className="max-w-[var(--measure)]">
        <p className="text-accent text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
          Selected work
        </p>
        <h1 className="mt-[var(--space-3)] text-2xl">Projects</h1>
        <p className="text-md text-ink-muted mt-[var(--space-5)]">
          Four to six projects, deliberately — not everything I have ever pushed. Each is
          written the way I would explain it to a peer at a whiteboard.
        </p>
      </header>

      <div className="mt-[var(--space-8)] lg:mt-[var(--space-9)]">
        <ProjectShowcase projects={projects} />
      </div>
    </Container>
  );
}
