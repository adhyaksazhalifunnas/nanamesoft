/**
 * Hero — US-01, instant orientation.
 *
 * The constraint that shapes this component is AC-01.5: NO full-viewport hero.
 * The most valuable screen real estate on the site does not get spent on a name
 * and a scroll arrow. At >=1024px a peek of the next section must be visible at
 * the fold, so the hero is sized by its content and capped well under 100vh.
 *
 * Also gated by AC-01.7: no gradient mesh, no glassmorphic card, no animated
 * technology-logo row. None of those appear here, and the anti-pattern test in
 * tests/e2e asserts their absence rather than trusting review.
 *
 * Server Component. The entrance is CSS-only, and every word is in the DOM at
 * first paint regardless of whether it plays (AC-01.6).
 */
import Link from "next/link";

import { Container } from "@/components/primitives/Container";
import { getSiteConfig } from "@/lib/content";
import type { SiteConfig } from "@/lib/schemas";

const AVAILABILITY_DOT: Record<SiteConfig["availability"]["status"], string> = {
  open: "bg-accent",
  "selectively-open": "bg-ink-subtle",
  "not-looking": "bg-ink-subtle",
};

export function Hero() {
  const site = getSiteConfig();

  return (
    <section
      aria-labelledby="hero-heading"
      className="pt-[var(--space-8)] pb-[var(--space-9)]"
    >
      <Container>
        {/* Asymmetric editorial grid (§11.5): the hero occupies columns 1–9 and
            leaves 10–12 empty. The emptiness is the composition. */}
        <div className="md:grid md:grid-cols-12 md:gap-[var(--space-6)]">
          <div className="md:col-span-10 lg:col-span-9">
            {/* AC-01.3: availability and location, above the fold. */}
            <p className="text-ink-muted flex items-center gap-[var(--space-2)] text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
              <span
                aria-hidden="true"
                className={`inline-block h-1.5 w-1.5 rounded-full ${AVAILABILITY_DOT[site.availability.status]}`}
              />
              {site.availability.detail} · {site.availability.location}
            </p>

            {/* The single --size-3xl element on the page (§11.4). */}
            <h1
              id="hero-heading"
              className="mt-[var(--space-5)] text-3xl leading-[var(--leading-tight)]"
            >
              {site.name}
            </h1>

            {/* AC-01.1/AC-01.2: the specific role statement, not a job title. */}
            <p className="font-display text-ink mt-[var(--space-5)] max-w-[34ch] text-xl">
              {site.headline}
            </p>

            <p className="text-md text-ink-muted mt-[var(--space-5)] max-w-[var(--measure)]">
              {site.valueProp}
            </p>

            <div className="mt-[var(--space-7)] flex flex-wrap items-center gap-[var(--space-3)]">
              {/* AC-01.1: the primary CTA is above the fold. */}
              <Link
                href="/projects"
                className="bg-ink text-ground inline-flex min-h-11 items-center px-[var(--space-5)] text-sm font-medium transition-opacity duration-[var(--dur-fast)] hover:opacity-85"
              >
                Read the case studies
              </Link>
              <a
                href={`mailto:${site.email}`}
                className="border-rule hover:border-accent hover:text-accent inline-flex min-h-11 items-center border px-[var(--space-5)] text-sm font-medium transition-colors duration-[var(--dur-fast)]"
              >
                {site.email}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
