/**
 * CaseStudyHeader — the header and summary block from §12.2.
 *
 * The summary block is "Priya's layer" (AC-04.9): <=60 words that stand alone,
 * with the headline metric and the stack beside them. A recruiter who reads
 * only this and nothing else should still be able to decide whether to forward
 * the link. Everything below it on the page is for Marcus.
 */
import { HeadlineMetric } from "@/components/project/MetricBlock";
import { formatDateRange, scopeLabel } from "@/lib/format";
import type { Project } from "@/lib/schemas";

export function CaseStudyHeader({ project }: { project: Project }) {
  const headline = project.metrics.find((m) => m.isHeadline);

  return (
    <header>
      <p className="text-ink-subtle flex flex-wrap items-center gap-x-[var(--space-3)] gap-y-[var(--space-1)] text-xs tracking-[var(--tracking-caps)] uppercase">
        <span>{scopeLabel(project)}</span>
        <span aria-hidden="true">·</span>
        <span>{formatDateRange(project.startDate, project.endDate)}</span>
        {project.hasUsers && project.userScale ? (
          <>
            <span aria-hidden="true">·</span>
            <span>{project.userScale}</span>
          </>
        ) : null}
        <span aria-hidden="true">·</span>
        {/* AC-04.8: reading-time estimate. */}
        <span>{project.readingTimeMinutes} min read</span>
      </p>

      <h1 className="mt-[var(--space-4)] text-2xl">{project.title}</h1>

      <p className="font-display text-ink-muted mt-[var(--space-4)] max-w-[var(--measure)] text-lg">
        {project.tagline}
      </p>

      {/* The summary block proper. Asymmetric: prose in the wide column, the
          number pulled out beside it (§11.5). */}
      <div className="mt-[var(--space-7)] grid gap-[var(--space-6)] lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-md max-w-[var(--measure)]">{project.summary}</p>

          <p className="text-ink-muted mt-[var(--space-5)] text-sm">
            <span className="text-ink-subtle">Stack: </span>
            {project.stack.join(" · ")}
          </p>
        </div>

        {headline ? (
          <div className="lg:col-span-5">
            <HeadlineMetric metric={headline} />
          </div>
        ) : null}
      </div>
    </header>
  );
}
