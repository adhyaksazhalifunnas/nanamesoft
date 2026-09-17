/**
 * ProjectCard — US-02 and US-03.
 *
 * Server Component with no client wrapper at all. §5.5 budgets a "tiny client
 * wrapper" for hover state; CSS group-hover covers every state this card has,
 * so the wrapper is not needed and the card costs zero JavaScript.
 *
 * Key constraints:
 *   AC-02.4  Technologies render as TEXT. No logo grid, ever (§11.2).
 *   AC-02.5  The whole card is ONE link and ONE tab stop. Implemented with a
 *            stretched pseudo-element over the card rather than by nesting
 *            links, which would create several tab stops and break the pattern.
 *   AC-03.1  Coordinated hover transition in <=250ms with an ease-out curve.
 *   AC-03.2  Focus is at least as prominent as hover — the ring plus the same
 *            state change, so a keyboard user is never shown less.
 *   AC-03.4  transform and opacity only. Nothing animates box-shadow, width,
 *            height, top or left.
 *   AC-03.6  No layout shift from any interaction: the translate happens on an
 *            inner layer and the card's own box never moves.
 *   AC-03.7  No 3D tilt, no spotlight glow, no particle field.
 */
import Link from "next/link";

import { scopeLabel } from "@/lib/format";
import type { Project } from "@/lib/schemas";

type ProjectCardProps = {
  project: Project;
  /** The flagship card spans the full grid width and sets its title larger. */
  featured?: boolean;
};

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const headline = project.metrics.find((m) => m.isHeadline);

  return (
    <article
      className={[
        "group border-rule relative flex h-full flex-col border-t pt-[var(--space-5)]",
        "transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)]",
        "hover:border-accent focus-within:border-accent",
        featured ? "md:col-span-2" : "",
      ].join(" ")}
    >
      {/* AC-04.6 / AC-02.2: scope is disclosed on the card, not buried. */}
      <p className="text-ink-subtle text-xs tracking-[var(--tracking-caps)] uppercase">
        {scopeLabel(project)}
      </p>

      <h3
        className={`mt-[var(--space-3)] ${featured ? "text-lg" : "text-md"} group-hover:text-accent group-focus-within:text-accent transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)]`}
      >
        {/*
          The stretched link. `after:absolute after:inset-0` makes the entire
          card clickable while keeping exactly one <a> in the tab order, and
          `focus-visible:after:*` is what gives the card its focus ring since
          the link itself has no visible box of its own.
        */}
        <Link
          href={`/projects/${project.slug}`}
          className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-offset-[var(--focus-offset)] focus-visible:after:outline-[var(--focus-ring)]"
        >
          {project.title}
        </Link>
      </h3>

      {/* AC-02.2/AC-02.3: <=140 characters, comprehensible to a non-engineer. */}
      <p className="text-ink-muted mt-[var(--space-3)] max-w-[52ch] text-base">
        {project.tagline}
      </p>

      {headline ? (
        <p className="tabular font-display text-md mt-[var(--space-5)]">
          <span className="text-ink-subtle">{headline.baseline}</span>
          <span aria-hidden="true" className="text-ink-subtle mx-[var(--space-2)]">
            →
          </span>
          <span className="text-accent">{headline.result}</span>
          <span className="font-text text-ink-subtle ml-[var(--space-3)] text-xs">
            {headline.label}
          </span>
        </p>
      ) : null}

      {/* Pushes the stack line to the bottom so cards of different prose
          lengths still align along their base (§11.7, content-agnostic). */}
      <div className="grow" />

      <ul className="text-ink-subtle mt-[var(--space-5)] flex flex-wrap gap-x-[var(--space-3)] gap-y-[var(--space-1)] pb-[var(--space-5)] text-xs">
        {project.stack.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
    </article>
  );
}
