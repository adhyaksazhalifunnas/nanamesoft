/**
 * /projects/[slug] — the case study (US-04).
 *
 * Section order follows §12.2 exactly, because that order is the information
 * architecture: a recruiter gets everything she needs from the header and
 * summary block without scrolling, and an engineer gets progressively deeper
 * material the further down he reads. That is the whole design problem of this
 * site, and it is solved by sequence rather than by tabs or accordions.
 *
 * Fully static. `generateStaticParams` enumerates every MDX file, so adding a
 * project creates its route with no edit to this file (AC-12.2, AC-12.3).
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArchitectureFigure } from "@/components/project/ArchitectureFigure";
import { CaseStudyHeader } from "@/components/project/CaseStudyHeader";
import { DecisionTable } from "@/components/project/DecisionTable";
import { MetricsTable } from "@/components/project/MetricBlock";
import { ConstraintsList, LimitationsList } from "@/components/project/NarrativeLists";
import { Prose } from "@/components/project/Prose";
import { RepoEvidence } from "@/components/project/RepoEvidence";
import { SourceLinks } from "@/components/project/SourceLinks";
import { headingsFromMdx, TableOfContents } from "@/components/project/TableOfContents";
import { Container } from "@/components/primitives/Container";
import {
  getAllProjectSlugs,
  getProject,
  getProjectNeighbours,
  getSiteConfig,
} from "@/lib/content";
import { buildMetadata, projectJsonLd } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return buildMetadata({
    title: project.seoTitle ?? project.title,
    description: project.seoDescription ?? project.tagline,
    pathname: `/projects/${project.slug}`,
    // Drafts are reachable by URL for preview but must never be indexed.
    index: project.status === "published",
  });
}

/** AC-04.8: a table of contents once the page is long enough to need one. */
const TOC_WORD_THRESHOLD = 800;

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const site = getSiteConfig();
  const { previous, next } = getProjectNeighbours(project.slug);

  // The structural sections this page renders itself, plus the h2s the author
  // wrote in MDX. Order matches the rendered order so the list reads top-down.
  const toc = [
    ...headingsFromMdx(project.body).filter((h) => h.label === "Context"),
    { id: "constraints-heading", label: "Constraints" },
    ...(project.architecture ? [{ id: "architecture", label: "Architecture" }] : []),
    { id: "decisions", label: "Decisions" },
    ...headingsFromMdx(project.body).filter((h) => h.label !== "Context"),
    ...(project.metrics.length > 0 ? [{ id: "outcome", label: "Outcome" }] : []),
    { id: "limitations-heading", label: "Limitations" },
    { id: "repo-evidence-heading", label: "Repository evidence" },
  ];

  const showToc = project.wordCount >= TOC_WORD_THRESHOLD;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectJsonLd(project, site)),
        }}
      />

      {/* AC-10.2: reading progress. Pure CSS — see .reading-progress. */}
      <div className="reading-progress" aria-hidden="true" />

      <article className="py-[var(--space-8)] lg:py-[var(--space-9)]">
        <Container>
          {project.status === "draft" ? (
            <p className="border-accent text-accent mb-[var(--space-6)] border px-[var(--space-4)] py-[var(--space-3)] text-sm">
              Draft — this case study is not finished and is hidden from every listing and
              from search engines.
            </p>
          ) : null}

          <CaseStudyHeader project={project} />
        </Container>

        <Container>
          <div className="mt-[var(--space-9)] lg:grid lg:grid-cols-12 lg:gap-[var(--space-7)]">
            {showToc ? (
              <aside className="mb-[var(--space-7)] lg:order-2 lg:col-span-3 lg:mb-0">
                <TableOfContents entries={toc} />
              </aside>
            ) : null}

            <div
              className={`space-y-[var(--space-9)] ${showToc ? "lg:order-1 lg:col-span-9" : "lg:col-span-9"}`}
            >
              {/* CONTEXT and IMPLEMENTATION come from the MDX body; every other
                  section is generated from structured frontmatter. */}
              <Prose source={project.body} />

              <ConstraintsList constraints={project.constraints} />

              {project.architecture ? (
                <section id="architecture" aria-label="Architecture">
                  <ArchitectureFigure {...project.architecture} />
                </section>
              ) : null}

              <section id="decisions" aria-labelledby="decisions-heading">
                <h2 id="decisions-heading" className="text-lg">
                  Decisions
                </h2>
                <p className="text-ink-subtle mt-[var(--space-3)] max-w-[var(--measure)] text-sm">
                  What I chose, what I turned down, and what each choice cost.
                </p>
                <div className="mt-[var(--space-6)]">
                  <DecisionTable decisions={project.decisions} />
                </div>
              </section>

              {project.metrics.length > 0 ? (
                <section id="outcome" aria-labelledby="outcome-heading">
                  <h2 id="outcome-heading" className="text-lg">
                    Outcome
                  </h2>
                  <p className="text-ink-subtle mt-[var(--space-3)] max-w-[var(--measure)] text-sm">
                    Every number below states how it was measured. A metric without a
                    method is a claim without evidence.
                  </p>
                  <div className="mt-[var(--space-6)]">
                    <MetricsTable metrics={project.metrics} />
                  </div>
                </section>
              ) : null}

              <LimitationsList limitations={project.limitations} />

              <SourceLinks links={project.links} />

              <RepoEvidence repo={project.repo} />
            </div>
          </div>
        </Container>

        <Container>
          <nav
            aria-label="More case studies"
            className="border-rule mt-[var(--space-9)] flex flex-col gap-[var(--space-5)] border-t pt-[var(--space-6)] sm:flex-row sm:justify-between"
          >
            {previous ? (
              <Link href={`/projects/${previous.slug}`} className="group text-sm">
                <span className="text-ink-subtle block text-xs">Previous</span>
                <span className="group-hover:text-accent transition-colors duration-[var(--dur-fast)]">
                  <span aria-hidden="true">← </span>
                  {previous.title}
                </span>
              </Link>
            ) : (
              <span />
            )}

            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="group text-sm sm:text-right"
              >
                <span className="text-ink-subtle block text-xs">Next</span>
                <span className="group-hover:text-accent transition-colors duration-[var(--dur-fast)]">
                  {next.title}
                  <span aria-hidden="true"> →</span>
                </span>
              </Link>
            ) : (
              <span />
            )}
          </nav>

          <p className="mt-[var(--space-7)]">
            <Link
              href="/contact"
              className="bg-ink text-ground inline-flex min-h-11 items-center px-[var(--space-5)] text-sm font-medium transition-opacity duration-[var(--dur-fast)] hover:opacity-85"
            >
              Get in touch
            </Link>
          </p>
        </Container>
      </article>
    </>
  );
}
