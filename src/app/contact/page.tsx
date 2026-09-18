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
import { getSiteConfig } from "@/lib/content";
import { formatLongDate } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const site = getSiteConfig();
  return buildMetadata({
    title: "Contact",
    description: `Get in touch with ${site.name} by email or through the contact form. ${site.availability.detail}`,
    pathname: "/contact",
  });
}

export default function ContactPage() {
  const site = getSiteConfig();

  return (
    <Container as="div" className="py-[var(--space-8)] lg:py-[var(--space-9)]">
      <header className="max-w-[var(--measure)]">
        <p className="text-accent text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
          Say hello
        </p>
        <h1 className="mt-[var(--space-3)] text-2xl">Write to {site.shortName}</h1>
        <p className="text-md text-ink-muted mt-[var(--space-5)]">
          {site.availability.detail} · {site.availability.location}
        </p>
      </header>

      <div className="mt-[var(--space-8)] grid gap-[var(--space-8)] lg:grid-cols-12 lg:gap-[var(--space-7)]">
        <div className="min-w-0 lg:col-span-7">
          <h2 className="font-text text-ink-subtle text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
            Send a message
          </h2>
          <div className="mt-[var(--space-5)]">
            <ContactForm email={site.email} />
          </div>
        </div>

        <div className="min-w-0 lg:col-span-5">
          <h2 className="font-text text-ink-subtle text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
            Or reach me directly
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
            The address is written out rather than obfuscated. Obfuscation costs
            recruiters more than it costs scrapers.
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
                  <span className="visually-hidden"> (opens in a new tab)</span>
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
                  Résumé
                  <span className="text-ink-subtle text-xs">
                    PDF · updated {formatLongDate(site.resume.updated)}
                  </span>
                </a>
              </li>
            ) : null}
          </ul>

          <p className="text-ink-subtle mt-[var(--space-6)] text-xs">
            This form stores nothing. It sends your message to my inbox and keeps no copy,
            no cookie and no analytics profile of you.
          </p>
        </div>
      </div>
    </Container>
  );
}
