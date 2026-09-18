/**
 * /about — US-08.
 *
 * Two blocks: the prose (AC-08.1, 150–350 words, first person, no cliché from
 * §12.6) and the CS background (AC-08.2). The course takeaways are the part
 * that matters: a list of course codes is filler, a sentence on what each one
 * actually produced is evidence.
 *
 * AC-08.5: there is no photograph slot wired in here by default. If you add
 * one, it must be a real photograph — an AI-generated avatar would contradict
 * the entire premise of the site.
 */
import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { getEducation, getSiteConfig } from "@/lib/content";
import { formatDateRange } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const site = getSiteConfig();
  return buildMetadata({
    title: "About",
    description: `Background, computer science education and coursework for ${site.name}, and how I approach engineering problems.`,
    pathname: "/about",
  });
}

export default function AboutPage() {
  const site = getSiteConfig();
  const education = getEducation();

  return (
    <>
      <Container as="div" className="py-[var(--space-8)] lg:py-[var(--space-9)]">
        <header className="max-w-[var(--measure)]">
          <p className="text-accent text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
            Background
          </p>
          <h1 className="mt-[var(--space-3)] text-2xl">About</h1>
        </header>

        <div className="text-md mt-[var(--space-7)] max-w-[var(--measure)] space-y-[var(--space-5)]">
          {site.about.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </Container>

      {education.map((entry) => (
        <Section
          key={entry.id}
          id={`education-${entry.id}`}
          eyebrow="Computer science background"
          title={entry.institution}
        >
          <div className="grid gap-[var(--space-7)] lg:grid-cols-12">
            <div className="lg:col-span-4">
              <dl className="space-y-[var(--space-4)]">
                <div>
                  <dt className="text-ink-subtle text-xs">Programme</dt>
                  <dd className="mt-[var(--space-1)] text-sm">
                    {entry.degree}
                    {entry.field ? `, ${entry.field}` : ""}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-subtle text-xs">Dates</dt>
                  <dd className="tabular mt-[var(--space-1)] text-sm">
                    {entry.expected && entry.endDate
                      ? `${formatDateRange(entry.startDate, null)} · expected ${entry.endDate}`
                      : formatDateRange(entry.startDate, entry.endDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-subtle text-xs">Location</dt>
                  <dd className="mt-[var(--space-1)] text-sm">{entry.location}</dd>
                </div>
                {entry.gpa ? (
                  <div>
                    <dt className="text-ink-subtle text-xs">GPA</dt>
                    <dd className="tabular mt-[var(--space-1)] text-sm">
                      {entry.gpa.value} / {entry.gpa.scale}
                    </dd>
                  </div>
                ) : null}
                {entry.focusAreas.length > 0 ? (
                  <div>
                    <dt className="text-ink-subtle text-xs">Focus</dt>
                    <dd className="mt-[var(--space-1)] text-sm">
                      {entry.focusAreas.join(" · ")}
                    </dd>
                  </div>
                ) : null}
              </dl>

              {entry.institutionUrl ? (
                <a
                  href={entry.institutionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent mt-[var(--space-5)] inline-flex min-h-11 items-center text-sm underline underline-offset-4"
                >
                  {entry.institution}
                  <span className="visually-hidden"> (opens in a new tab)</span>
                  <span aria-hidden="true"> ↗</span>
                </a>
              ) : null}
            </div>

            <div className="lg:col-span-8">
              <h3 className="font-text text-ink-subtle text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
                Coursework, and what it produced
              </h3>
              <ul className="divide-rule border-rule mt-[var(--space-4)] divide-y border-y">
                {entry.courses.map((course) => (
                  <li key={course.name} className="py-[var(--space-4)]">
                    <p className="text-base">
                      {course.code ? (
                        <span className="tabular text-ink-subtle mr-[var(--space-2)]">
                          {course.code}
                        </span>
                      ) : null}
                      {course.name}
                      {course.term ? (
                        <span className="text-ink-subtle ml-[var(--space-2)] text-xs">
                          {course.term}
                        </span>
                      ) : null}
                    </p>
                    <p className="text-ink-muted mt-[var(--space-2)] max-w-[var(--measure)] text-sm">
                      {course.takeaway}
                    </p>
                    {course.projects.length > 0 || course.repoUrl ? (
                      <p className="mt-[var(--space-2)] text-xs">
                        {course.projects.map((slug, i) => (
                          <span key={slug}>
                            {i > 0 ? ", " : ""}
                            <Link
                              href={`/projects/${slug}`}
                              className="text-accent underline underline-offset-2"
                            >
                              {slug}
                            </Link>
                          </span>
                        ))}
                        {course.repoUrl ? (
                          <a
                            href={course.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent ml-[var(--space-2)] underline underline-offset-2"
                          >
                            Repository
                            <span className="visually-hidden"> (opens in a new tab)</span>
                            <span aria-hidden="true"> ↗</span>
                          </a>
                        ) : null}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>

              {entry.thesis ? (
                <div className="mt-[var(--space-6)]">
                  <h3 className="font-text text-ink-subtle text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
                    Thesis
                  </h3>
                  <p className="font-display text-md mt-[var(--space-3)]">
                    {entry.thesis.title}
                  </p>
                  <p className="text-ink-muted mt-[var(--space-2)] max-w-[var(--measure)] text-sm">
                    {entry.thesis.abstract}
                  </p>
                </div>
              ) : null}

              {entry.honors.length > 0 ? (
                <div className="mt-[var(--space-6)]">
                  <h3 className="font-text text-ink-subtle text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
                    Honours
                  </h3>
                  <ul className="text-ink-muted mt-[var(--space-3)] max-w-[var(--measure)] space-y-[var(--space-2)] text-sm">
                    {entry.honors.map((honor) => (
                      <li key={honor}>{honor}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {entry.activities.length > 0 ? (
                <div className="mt-[var(--space-6)]">
                  <h3 className="font-text text-ink-subtle text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
                    Activities
                  </h3>
                  <ul className="text-ink-muted mt-[var(--space-3)] max-w-[var(--measure)] space-y-[var(--space-2)] text-sm">
                    {entry.activities.map((activity) => (
                      <li key={activity}>{activity}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </Section>
      ))}
    </>
  );
}
