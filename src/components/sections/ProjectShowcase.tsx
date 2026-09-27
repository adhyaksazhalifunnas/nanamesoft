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
import type { Dictionary } from "@/i18n";
import { localePath, type Locale } from "@/i18n/config";
import type { LocalizedProject } from "@/lib/localize";

import { ProjectCard } from "./ProjectCard";

type ProjectShowcaseProps = {
  projects: LocalizedProject[];
  /** Renders the first card at double width. Off on the /projects index. */
  featureFirst?: boolean;
  /** Passed through to each card — see ProjectCard for why this is per-page. */
  headingLevel?: 2 | 3;
  locale: Locale;
  dictionary: Dictionary;
};

export function ProjectShowcase({
  projects,
  featureFirst = false,
  headingLevel = 3,
  locale,
  dictionary,
}: ProjectShowcaseProps) {
  if (projects.length === 0) {
    return (
      <p className="text-md text-ink-muted max-w-[var(--measure)]">
        {dictionary.projects.empty}
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
            <ProjectCard
              project={project}
              featured={featureFirst && i === 0}
              headingLevel={headingLevel}
              locale={locale}
              dictionary={dictionary}
            />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

export function AllProjectsLink({
  count,
  locale,
  dictionary,
}: {
  count: number;
  locale: Locale;
  dictionary: Dictionary;
}) {
  if (count === 0) return null;
  return (
    <p className="mt-[var(--space-7)]">
      <Link
        href={localePath(locale, "/projects")}
        className="text-accent text-sm underline underline-offset-4 transition-opacity duration-[var(--dur-fast)] hover:opacity-75"
      >
        {dictionary.home.allProjects(count)}
      </Link>
    </p>
  );
}
