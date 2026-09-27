/**
 * /contact — US-09.
 *
 * AC-09.1: two routes, always. The email address is a real, readable mailto:
 * that works with JavaScript disabled, and the form is a convenience on top of
 * it. Some recruiters will never use a form; some visitors will never open
 * their mail client. Offering one of the two is the common mistake.
 */
import type { Metadata } from "next";

import { Container } from "@/components/primitives/Container";
import { ContactForm } from "@/components/sections/ContactForm";
import { getDictionary } from "@/i18n";
import { LOCALE_HTML_LANG, toLocale } from "@/i18n/config";
import { getSiteConfig } from "@/lib/content";
import { formatLongDateLocalized } from "@/lib/format";
import { localizeSite } from "@/lib/localize";
import { buildMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const dictionary = getDictionary(locale);
  const site = localizeSite(getSiteConfig(), locale);
  return buildMetadata({
    locale,
    path: "/contact",
    title: dictionary.nav.contact,
    description: dictionary.contact.metaDescription(site.name, site.availability.detail),
  });
}

export default async function ContactPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const dictionary = getDictionary(locale);
  const site = localizeSite(getSiteConfig(), locale);

  return (
    <Container as="div" className="py-[var(--space-8)] lg:py-[var(--space-9)]">
      <header className="max-w-[var(--measure)]">
        <p className="text-accent text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
          {dictionary.contact.eyebrow}
        </p>
        <h1 className="mt-[var(--space-3)] text-2xl">
          {dictionary.contact.title(site.shortName)}
        </h1>
        <p className="text-md text-ink-muted mt-[var(--space-5)]">
          {site.availability.detail} · {site.availability.location}
        </p>
      </header>

      <div className="mt-[var(--space-8)] grid gap-[var(--space-8)] lg:grid-cols-12 lg:gap-[var(--space-7)]">
        <div className="min-w-0 lg:col-span-7">
          <h2 className="font-text text-ink-subtle text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
            {dictionary.contact.sendMessage}
          </h2>
          <div className="mt-[var(--space-5)]">
            <ContactForm email={site.email} t={dictionary.contact.form} />
          </div>
        </div>

        <div className="min-w-0 lg:col-span-5">
          <h2 className="font-text text-ink-subtle text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
            {dictionary.contact.orDirectly}
          </h2>

          <p className="mt-[var(--space-5)]">
            <a
              href={`mailto:${site.email}`}
              className="font-display text-md text-accent break-all underline underline-offset-4"
            >
              {site.email}
            </a>
          </p>

          <p className="text-ink-muted mt-[var(--space-3)] text-sm">
            {dictionary.contact.notObfuscated}
          </p>

          <ul className="divide-rule border-rule mt-[var(--space-7)] divide-y border-y">
            {site.socials.map((social) => (
              <li key={social.url}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent flex min-h-11 items-center justify-between py-[var(--space-3)] text-sm transition-colors duration-[var(--dur-fast)]"
                >
                  {social.label}
                  <span className="visually-hidden">
                    {" "}
                    {dictionary.evidence.openInNewTab}
                  </span>
                  <span aria-hidden="true" className="text-ink-subtle">
                    ↗
                  </span>
                </a>
              </li>
            ))}
            {site.resume ? (
              <li>
                {/* AC-09.8: a meaningful filename, labelled with format and recency. */}
                <a
                  href={site.resume.path}
                  className="hover:text-accent flex min-h-11 items-center justify-between py-[var(--space-3)] text-sm transition-colors duration-[var(--dur-fast)]"
                  download={`${site.name.replace(/\s+/g, "-")}-resume-${site.resume.updated.slice(0, 7)}.pdf`}
                >
                  {dictionary.contact.resume}
                  <span className="text-ink-subtle text-xs">
                    {dictionary.contact.resumeMeta(
                      formatLongDateLocalized(
                        site.resume.updated,
                        LOCALE_HTML_LANG[locale],
                      ),
                    )}
                  </span>
                </a>
              </li>
            ) : null}
          </ul>

          <p className="text-ink-subtle mt-[var(--space-6)] text-xs">
            {dictionary.contact.privacyNote}
          </p>
        </div>
      </div>
    </Container>
  );
}
