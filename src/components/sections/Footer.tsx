/**
 * Footer — email, résumé and profiles reachable from every page (AC-09.2).
 *
 * The email address is a real, readable `mailto:` rather than an obfuscated
 * one. §5.7 takes that trade deliberately: obfuscation costs recruiters more
 * than it costs scrapers.
 */
import Link from "next/link";

import { Container } from "@/components/primitives/Container";
import { getSiteConfig } from "@/lib/content";
import { formatLongDate } from "@/lib/format";

import { NAV_LINKS } from "./Nav";

export function Footer() {
  const site = getSiteConfig();

  return (
    <footer className="border-rule border-t py-[var(--space-8)]">
      <Container>
        <div className="grid gap-[var(--space-7)] md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-md">{site.name}</p>
            <a
              href={`mailto:${site.email}`}
              className="text-accent mt-[var(--space-2)] inline-flex min-h-11 items-center text-sm break-all underline"
            >
              {site.email}
            </a>
            <p className="text-ink-subtle mt-[var(--space-4)] text-xs">
              {site.availability.detail} · {site.availability.location}
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <h2 className="text-ink-subtle text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
              Pages
            </h2>
            <ul className="mt-[var(--space-3)] space-y-[var(--space-2)]">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-ink-muted hover:text-ink inline-flex min-h-11 items-center text-sm transition-colors duration-[var(--dur-fast)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className="text-ink-subtle text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
              Elsewhere
            </h2>
            <ul className="mt-[var(--space-3)] space-y-[var(--space-2)]">
              {site.socials.map((social) => (
                <li key={social.url}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-muted hover:text-ink inline-flex min-h-11 items-center text-sm transition-colors duration-[var(--dur-fast)]"
                  >
                    {social.label}
                    {/* AC-09.9 / §11.8: external links are labelled honestly. */}
                    <span className="visually-hidden"> (opens in a new tab)</span>
                    <span aria-hidden="true"> ↗</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={site.resumePath}
                  className="text-ink-muted hover:text-ink inline-flex min-h-11 items-center text-sm transition-colors duration-[var(--dur-fast)]"
                >
                  Résumé
                  <span className="text-ink-subtle">
                    {" "}
                    (PDF, updated {formatLongDate(site.resumeUpdated)})
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="border-rule text-ink-subtle mt-[var(--space-8)] max-w-[var(--measure)] border-t pt-[var(--space-5)] text-xs">
          © {new Date().getFullYear()} {site.name}. Built with Next.js. Repository data
          from the GitHub API, cached at build time.
        </p>
      </Container>
    </footer>
  );
}
