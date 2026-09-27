/**
 * /experience — US-07.
 *
 * Reverse-chronological, with outcome-framed bullets. The `type` discriminator
 * means academic, open-source and freelance entries render through the same
 * model as employment (AC-07.6) — a record with no formal job is still a real
 * record, and disguising that would be the dishonest option.
 *
 * AC-07.5: schema.org markup is emitted as JSON-LD rather than inline
 * microdata, which keeps the markup readable and is what Google prefers.
 */
import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/primitives/Container";
import { Reveal } from "@/components/motion/Reveal";
import { getDictionary, type Dictionary } from "@/i18n";
import { LOCALE_HTML_LANG, localePath, toLocale, type Locale } from "@/i18n/config";
import { getExperience, getSiteConfig } from "@/lib/content";
import { formatDateRangeLocalized } from "@/lib/format";
import { englishRun } from "@/lib/localize";
import { buildMetadata, experienceJsonLd } from "@/lib/seo";
import type { Experience } from "@/lib/schemas";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const dictionary = getDictionary(locale);
  const site = getSiteConfig();
  return buildMetadata({
    locale,
    path: "/experience",
    title: dictionary.experience.title,
    description: dictionary.experience.metaDescription(site.name),
  });
}

export default async function ExperiencePage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const dictionary = getDictionary(locale);
  const entries = getExperience();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            experienceJsonLd(
              entries.map((e) => ({
                organization: e.confidential
                  ? "Undisclosed organisation"
                  : e.organization,
                title: e.title,
                startDate: e.startDate,
                endDate: e.endDate,
                ...(e.orgUrl && !e.confidential ? { orgUrl: e.orgUrl } : {}),
              })),
            ),
          ),
        }}
      />

      <Container as="div" className="py-[var(--space-8)] lg:py-[var(--space-9)]">
        <header className="max-w-[var(--measure)]">
          <p className="text-accent text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
            {dictionary.experience.eyebrow}
          </p>
          <h1 className="mt-[var(--space-3)] text-2xl">{dictionary.experience.title}</h1>
          <p className="text-md text-ink-muted mt-[var(--space-5)]">
            {dictionary.experience.lede}
          </p>
        </header>

        {entries.length === 0 ? (
          <p className="text-md text-ink-muted mt-[var(--space-8)] max-w-[var(--measure)]">
            {dictionary.experience.empty}
          </p>
        ) : (
          <ol className="mt-[var(--space-8)] lg:mt-[var(--space-9)]">
            {entries.map((entry, i) => (
              <li key={entry.id}>
                <Reveal index={i}>
                  <ExperienceEntry
                    entry={entry}
                    locale={locale}
                    dictionary={dictionary}
                  />
                </Reveal>
              </li>
            ))}
          </ol>
        )}
      </Container>
    </>
  );
}

function ExperienceEntry({
  entry,
  locale,
  dictionary,
}: {
  entry: Experience;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const organization = entry.confidential
    ? dictionary.experience.undisclosed
    : entry.organization;

  return (
    <article className="border-rule grid gap-[var(--space-4)] border-t py-[var(--space-7)] lg:grid-cols-12 lg:gap-[var(--space-6)]">
      <div className="lg:col-span-3">
        <p className="tabular text-ink-muted text-sm">
          {formatDateRangeLocalized(
            entry.startDate,
            entry.endDate,
            LOCALE_HTML_LANG[locale],
            dictionary.common.present,
          )}
        </p>
        <p className="text-ink-subtle mt-[var(--space-1)] text-xs">
          {dictionary.experience.types[entry.type]} ·{" "}
          {dictionary.experience.modes[entry.workMode]}
        </p>
        <p className="text-ink-subtle mt-[var(--space-1)] text-xs">{entry.location}</p>
      </div>

      <div className="lg:col-span-9">
        <h2 className="text-md">
          {entry.title}
          <span className="font-text text-ink-muted font-normal"> · </span>
          {entry.orgUrl && !entry.confidential ? (
            <a
              href={entry.orgUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-text text-ink-muted hover:text-accent font-normal underline underline-offset-4 transition-colors duration-[var(--dur-fast)]"
            >
              {organization}
              <span className="visually-hidden"> {dictionary.evidence.openInNewTab}</span>
              <span aria-hidden="true"> ↗</span>
            </a>
          ) : (
            <span className="font-text text-ink-muted font-normal">{organization}</span>
          )}
        </h2>

        {/* The record itself is written once, in English (see englishRun). */}
        <p
          lang={englishRun(locale)}
          className="text-ink-muted mt-[var(--space-3)] max-w-[var(--measure)] text-base"
        >
          {entry.summary}
        </p>

        <ul
          lang={englishRun(locale)}
          className="mt-[var(--space-4)] max-w-[var(--measure)] space-y-[var(--space-3)]"
        >
          {entry.highlights.map((highlight) => (
            <li
              key={highlight}
              className="border-rule border-l pl-[var(--space-4)] text-base"
            >
              {highlight}
            </li>
          ))}
        </ul>

        {entry.stack.length > 0 ? (
          <p className="text-ink-subtle mt-[var(--space-4)] text-xs">
            {entry.stack.join(" · ")}
          </p>
        ) : null}

        {/* AC-07.3: link to the case study when one exists. */}
        {entry.projects.length > 0 ? (
          <p className="mt-[var(--space-3)] text-sm">
            {entry.projects.map((slug, i) => (
              <span key={slug}>
                {i > 0 ? ", " : ""}
                <Link
                  href={localePath(locale, `/projects/${slug}`)}
                  className="text-accent underline underline-offset-4"
                >
                  {dictionary.experience.readCaseStudy(slug)}
                </Link>
              </span>
            ))}
          </p>
        ) : null}
      </div>
    </article>
  );
}
