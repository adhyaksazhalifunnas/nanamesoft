/**
 * Footer — email, résumé and profiles reachable from every page (AC-09.2).
 *
 * The email address is a real, readable `mailto:` rather than an obfuscated
 * one. §5.7 takes that trade deliberately: obfuscation costs recruiters more
 * than it costs scrapers.
 */
import Link from "next/link";

import { Container } from "@/components/primitives/Container";
import type { Dictionary } from "@/i18n";
import { localePath, type Locale } from "@/i18n/config";
import { formatLongDate } from "@/lib/format";
import type { SiteConfig } from "@/lib/schemas";

import { NAV_ITEMS } from "./Nav";

type FooterProps = {
  locale: Locale;
  dictionary: Dictionary;
  site: SiteConfig;
};

export function Footer({ locale, dictionary, site }: FooterProps) {
  return (
    <footer className="border-rule border-t py-[var(--space-8)]">
      <Container>
        <div className="grid gap-[var(--space-7)] md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-md">{site.brand}</p>
            <p className="text-ink-muted text-sm">{site.name}</p>
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

          <nav aria-label={dictionary.footer.pages} className="md:col-span-3">
            <h2 className="text-ink-subtle text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
              {dictionary.footer.pages}
            </h2>
            <ul className="mt-[var(--space-3)] space-y-[var(--space-2)]">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link
                    href={localePath(locale, item.path)}
                    className="text-ink-muted hover:text-ink inline-flex min-h-11 items-center text-sm transition-colors duration-[var(--dur-fast)]"
                  >
                    {dictionary.nav[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className="text-ink-subtle text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
              {dictionary.footer.elsewhere}
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
                    <span className="visually-hidden">
                      {" "}
                      {dictionary.evidence.openInNewTab}
                    </span>
                    <span aria-hidden="true"> ↗</span>
                  </a>
                </li>
              ))}
              {site.resume ? (
                <li>
                  <a
                    href={site.resume.path}
                    className="text-ink-muted hover:text-ink inline-flex min-h-11 items-center text-sm transition-colors duration-[var(--dur-fast)]"
                  >
                    {dictionary.contact.resume}
                    <span className="text-ink-subtle">
                      {" "}
                      {dictionary.footer.resumeMeta(formatLongDate(site.resume.updated))}
                    </span>
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <p className="border-rule text-ink-subtle mt-[var(--space-8)] max-w-[var(--measure)] border-t pt-[var(--space-5)] text-xs">
          © {new Date().getFullYear()} {site.brand} · {site.name}.{" "}
          {dictionary.footer.colophon}
        </p>
      </Container>
    </footer>
  );
}
