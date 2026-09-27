/**
 * /[locale]/projects/[slug] — the case study (US-04).
 *
 * Section order follows §12.2 exactly, because that order is the information
 * architecture: a recruiter gets everything she needs from the header and
 * summary block without scrolling, and an engineer gets progressively deeper
 * material the further down he reads. That is the whole design problem of this
 * site, and it is solved by sequence rather than by tabs or accordions.
 *
 * On a non-English locale the header and summary block are translated and the
 * body below is not — so the page says so, once, where the language changes.
 * Silently switching language mid-page is worse than admitting it.
 *
 * Fully static across every locale. `generateStaticParams` enumerates the
 * product of locales and MDX files, so adding a project creates its routes
 * with no edit to this file (AC-12.2, AC-12.3).
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
import { getDictionary } from "@/i18n";
import { LOCALES, LOCALE_HTML_LANG, localePath, toLocale } from "@/i18n/config";
import {
  getAllProjectSlugs,
  getProject,
  getProjectNeighbours,
  getSiteConfig,
} from "@/lib/content";
import { englishRun, localizeProject, localizeSite } from "@/lib/localize";
import { buildMetadata, projectJsonLd } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getAllProjectSlugs().map((slug) => ({ locale, slug })),
  );
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = toLocale(localeParam);
  const base = getProject(slug);
  if (!base) return {};
  const project = localizeProject(base, locale);

  return buildMetadata({
    locale,
    path: `/projects/${project.slug}`,
    title: project.seoTitle ?? project.title,
    description: project.seoDescription ?? project.tagline,
    // Drafts are reachable by URL for preview but must never be indexed.
    index: project.status === "published",
  });
}

/** AC-04.8: a table of contents once the page is long enough to need one. */
const TOC_WORD_THRESHOLD = 800;

export default async function ProjectPage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = toLocale(localeParam);
  const base = getProject(slug);
  if (!base) notFound();

  const project = localizeProject(base, locale);
  const dictionary = getDictionary(locale);
  const site = localizeSite(getSiteConfig(), locale);
  const { previous, next } = getProjectNeighbours(project.slug);
  // The case study's own prose is written once, in English. On a translated
  // page the markup has to say where that switch happens (SC 3.1.2).
  const contentLang = englishRun(locale);

  // The structural sections this page renders itself, plus the h2s the author
  // wrote in MDX. Order matches the rendered order so the list reads top-down.
  const toc = [
    ...headingsFromMdx(project.body).filter((h) => h.label === "Context"),
    { id: "constraints-heading", label: dictionary.caseStudy.constraints },
    ...(project.architecture ? [{ id: "architecture", label: "Architecture" }] : []),
    { id: "decisions", label: dictionary.caseStudy.decisions },
    ...headingsFromMdx(project.body).filter((h) => h.label !== "Context"),
    ...(project.metrics.length > 0
      ? [{ id: "outcome", label: dictionary.caseStudy.outcome }]
      : []),
    { id: "limitations-heading", label: dictionary.caseStudy.limitations },
    { id: "repo-evidence-heading", label: dictionary.evidence.heading },
  ];

  const showToc = project.wordCount >= TOC_WORD_THRESHOLD;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectJsonLd(project, site, locale)),
        }}
      />

      {/* AC-10.2: reading progress. Pure CSS — see .reading-progress. */}
      <div className="reading-progress" aria-hidden="true" />

      <article className="py-[var(--space-8)] lg:py-[var(--space-9)]">
        <Container>
          {project.status === "draft" ? (
            <p className="border-accent text-accent mb-[var(--space-6)] border px-[var(--space-4)] py-[var(--space-3)] text-sm">
              {dictionary.caseStudy.draftNotice}
            </p>
          ) : null}

          <CaseStudyHeader project={project} locale={locale} dictionary={dictionary} />
        </Container>

        <Container>
          <div className="mt-[var(--space-9)] lg:grid lg:grid-cols-12 lg:gap-[var(--space-7)]">
            {showToc ? (
              <aside className="mb-[var(--space-7)] lg:order-2 lg:col-span-3 lg:mb-0">
                <TableOfContents
                  entries={toc}
                  heading={dictionary.caseStudy.onThisPage}
                />
              </aside>
            ) : null}

            <div
              className={`space-y-[var(--space-9)] ${showToc ? "lg:order-1 lg:col-span-9" : "lg:col-span-9"}`}
            >
              {/* The body stays English on every locale — say so once, here,
                  rather than letting the reader discover it mid-sentence. */}
              {locale !== "en" ? (
                <p
                  className="border-rule text-ink-subtle max-w-[var(--measure)] border-l pl-[var(--space-4)] text-xs"
                  lang={LOCALE_HTML_LANG[locale]}
                >
                  {dictionary.caseStudy.bodyInEnglish}
                </p>
              ) : null}

              {/* CONTEXT and IMPLEMENTATION come from the MDX body; every other
                  section is generated from structured frontmatter. */}
              <div lang={contentLang}>
                <Prose source={project.body} />
              </div>

              <ConstraintsList
                constraints={project.constraints}
                dictionary={dictionary}
                contentLang={contentLang}
              />

              {project.architecture ? (
                <section id="architecture" aria-label="Architecture">
                  <ArchitectureFigure {...project.architecture} />
                </section>
              ) : null}

              <section id="decisions" aria-labelledby="decisions-heading">
                <h2 id="decisions-heading" className="text-lg">
                  {dictionary.caseStudy.decisions}
                </h2>
                <p className="text-ink-subtle mt-[var(--space-3)] max-w-[var(--measure)] text-sm">
                  {dictionary.caseStudy.decisionsLede}
                </p>
                <div className="mt-[var(--space-6)]">
                  <DecisionTable
                    decisions={project.decisions}
                    dictionary={dictionary}
                    contentLang={contentLang}
                  />
                </div>
              </section>

              {project.metrics.length > 0 ? (
                <section id="outcome" aria-labelledby="outcome-heading">
                  <h2 id="outcome-heading" className="text-lg">
                    {dictionary.caseStudy.outcome}
                  </h2>
                  <p className="text-ink-subtle mt-[var(--space-3)] max-w-[var(--measure)] text-sm">
                    {dictionary.caseStudy.outcomeLede}
                  </p>
                  <div className="mt-[var(--space-6)]">
                    <MetricsTable metrics={project.metrics} dictionary={dictionary} />
                  </div>
                </section>
              ) : null}

              <LimitationsList
                limitations={project.limitations}
                dictionary={dictionary}
                contentLang={contentLang}
              />

              <SourceLinks links={project.links} dictionary={dictionary} />

              <RepoEvidence
                repo={project.repo}
                locale={LOCALE_HTML_LANG[locale]}
                dictionary={dictionary}
              />
            </div>
          </div>
        </Container>

        <Container>
          <nav
            aria-label={dictionary.caseStudy.moreCaseStudies}
            className="border-rule mt-[var(--space-9)] flex flex-col gap-[var(--space-5)] border-t pt-[var(--space-6)] sm:flex-row sm:justify-between"
          >
            {previous ? (
              <Link
                href={localePath(locale, `/projects/${previous.slug}`)}
                className="group text-sm"
              >
                <span className="text-ink-subtle block text-xs">
                  {dictionary.caseStudy.previous}
                </span>
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
                href={localePath(locale, `/projects/${next.slug}`)}
                className="group text-sm sm:text-right"
              >
                <span className="text-ink-subtle block text-xs">
                  {dictionary.caseStudy.next}
                </span>
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
              href={localePath(locale, "/contact")}
              className="bg-ink text-ground inline-flex min-h-11 items-center px-[var(--space-5)] text-sm font-medium transition-opacity duration-[var(--dur-fast)] hover:opacity-85"
            >
              {dictionary.caseStudy.getInTouch}
            </Link>
          </p>
        </Container>
      </article>
    </>
  );
}
