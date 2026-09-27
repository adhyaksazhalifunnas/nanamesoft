/**
 * seo.ts — metadata and JSON-LD builders (PRD §7.4, US-13).
 *
 * Every route gets a unique title, description and canonical URL (AC-13.1),
 * all derived from content rather than hand-maintained per page.
 *
 * With three locales, each page also has to declare where its siblings are.
 * `buildMetadata` takes a LOCALE-FREE path and emits the canonical for this
 * locale plus an hreflang entry for every other one — including `x-default`,
 * which tells a search engine what to serve a reader whose language matches
 * none of ours. Getting this wrong is how three translations of one page end
 * up competing with each other in search results.
 */
import type { Metadata } from "next";

import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_HTML_LANG,
  localePath,
  type Locale,
} from "@/i18n/config";

import { getSiteConfig } from "./content";
import type { Project, SiteConfig } from "./schemas";

export function absoluteUrl(pathname: string): string {
  const { seo } = getSiteConfig();
  return new URL(pathname, seo.siteUrl).toString();
}

/**
 * Descriptions must be 70–160 characters to survive SERP truncation without
 * looking clipped. Callers pass their best sentence; this trims on a word
 * boundary rather than mid-word.
 *
 * Japanese has no spaces, so a word-boundary trim would leave the whole string
 * or nothing. For a locale without word breaks, a hard cut is correct — and
 * the character budget is generous there anyway, since the same meaning takes
 * far fewer characters.
 */
function clampDescription(text: string, locale: Locale, max = 160): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max - 1);
  if (locale === "ja") return `${cut}…`;
  const lastSpace = cut.lastIndexOf(" ");
  return `${lastSpace > 0 ? cut.slice(0, lastSpace) : cut}…`;
}

/** The hreflang map every page carries. */
function alternateLanguages(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[LOCALE_HTML_LANG[locale]] = absoluteUrl(localePath(locale, path));
  }
  languages["x-default"] = absoluteUrl(localePath(DEFAULT_LOCALE, path));
  return languages;
}

export function buildMetadata(opts: {
  locale: Locale;
  /** Path WITHOUT the locale prefix: "" for home, "/projects" for the index. */
  path: string;
  title: string;
  description: string;
  /** Pass false on routes that should not be indexed. */
  index?: boolean;
}): Metadata {
  const site = getSiteConfig();
  const url = absoluteUrl(localePath(opts.locale, opts.path));
  const description = clampDescription(opts.description, opts.locale);

  return {
    title: opts.title,
    description,
    alternates: {
      canonical: url,
      // A page that should not be indexed should not be advertised as the
      // translation of anything either.
      languages: opts.index === false ? undefined : alternateLanguages(opts.path),
    },
    robots: opts.index === false ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      url,
      siteName: site.brand,
      title: opts.title,
      description,
      locale: LOCALE_HTML_LANG[opts.locale],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description,
      ...(site.seo.twitterHandle ? { creator: site.seo.twitterHandle } : {}),
    },
  };
}

/* ── JSON-LD (AC-13.2) ───────────────────────────────────────────────────── */

export function personJsonLd(site: SiteConfig, skills: string[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: absoluteUrl(localePath(locale, "")),
    email: `mailto:${site.email}`,
    jobTitle: site.headline,
    description: site.seo.defaultDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.availability.location,
    },
    knowsAbout: skills,
    sameAs: site.socials.map((s) => s.url),
  };
}

export function projectJsonLd(project: Project, site: SiteConfig, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.tagline,
    url: absoluteUrl(localePath(locale, `/projects/${project.slug}`)),
    inLanguage: LOCALE_HTML_LANG[locale],
    dateCreated: project.startDate,
    ...(project.endDate ? { dateModified: project.endDate } : {}),
    programmingLanguage: project.stack,
    ...(project.repo ? { codeRepository: `https://github.com/${project.repo}` } : {}),
    author: {
      "@type": "Person",
      name: site.name,
      url: site.seo.siteUrl,
    },
  };
}

/**
 * schema.org markup for the experience list (AC-07.5). Roles that are not
 * formal employment are still represented honestly, via `OrganizationRole`.
 */
export function experienceJsonLd(
  entries: Array<{
    organization: string;
    title: string;
    startDate: string;
    endDate: string | null;
    orgUrl?: string;
  }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: entries.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "OrganizationRole",
        roleName: e.title,
        startDate: e.startDate,
        ...(e.endDate ? { endDate: e.endDate } : {}),
        memberOf: {
          "@type": "Organization",
          name: e.organization,
          ...(e.orgUrl ? { url: e.orgUrl } : {}),
        },
      },
    })),
  };
}
