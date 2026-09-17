/**
 * ProjectShowcase — the project grid (US-02).
 *
 * AC-02.6: one grid that reflows 3 / 2 / 1 with no card-count-dependent
 * tuning. AC-02.7: adding a fifth project changes no component file — which is
 * only true if nothing here counts the items, so nothing here does.
 *
 * The empty state matters more than it looks: a fresh clone with every project
 * still in `draft` renders this, and a silent blank section would read as a
 * bug rather than as "nothing published yet".
 */
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import type { Project } from "@/lib/schemas";

import { ProjectCard } from "./ProjectCard";

type ProjectShowcaseProps = {
  projects: Project[];
  /** Renders the first card at double width. Off on the /projects index. */
  featureFirst?: boolean;
};

export function ProjectShowcase({
  projects,
  featureFirst = false,
}: ProjectShowcaseProps) {
  if (projects.length === 0) {
    return (
      <p className="text-md text-ink-muted max-w-[var(--measure)]">
        No case studies are published yet. Each one lives in{" "}
        <code>content/projects/</code> and appears here the moment its <code>status</code>{" "}
        is set to <code>published</code>.
      </p>
    );
  }

  return (
    <ul className="grid gap-x-[var(--space-6)] gap-y-[var(--space-7)] md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, i) => (
        <li
          key={project.slug}
          className={featureFirst && i === 0 ? "md:col-span-2 lg:col-span-3" : ""}
        >
          <Reveal index={i}>
            <ProjectCard project={project} featured={featureFirst && i === 0} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

export function AllProjectsLink({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <p className="mt-[var(--space-7)]">
      <Link
        href="/projects"
        className="text-accent text-sm underline underline-offset-4 transition-opacity duration-[var(--dur-fast)] hover:opacity-75"
      >
        All {count} case {count === 1 ? "study" : "studies"}
      </Link>
    </p>
  );
}
