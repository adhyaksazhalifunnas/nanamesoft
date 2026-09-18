/**
 * seo.ts — metadata and JSON-LD builders (PRD §7.4, US-13).
 *
 * Every route gets a unique title, description, and canonical URL (AC-13.1),
 * all derived from content rather than hand-maintained per page.
 */
import type { Metadata } from "next";

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
 */
function clampDescription(text: string, max = 160): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export function buildMetadata(opts: {
  title: string;
  description: string;
  pathname: string;
  /** Pass false on routes that should not be indexed. */
  index?: boolean;
}): Metadata {
  const site = getSiteConfig();
  const url = absoluteUrl(opts.pathname);
  const description = clampDescription(opts.description);

  return {
    title: opts.title,
    description,
    alternates: { canonical: url },
    robots: opts.index === false ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      url,
      siteName: site.brand,
      title: opts.title,
      description,
      locale: site.seo.locale,
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

export function personJsonLd(site: SiteConfig, skills: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.seo.siteUrl,
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

export function projectJsonLd(project: Project, site: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.tagline,
    url: absoluteUrl(`/projects/${project.slug}`),
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
