/**
 * sitemap.xml — AC-13.4, generated from content rather than maintained by hand.
 *
 * Every route appears once per locale, and each entry declares its siblings
 * through `alternates.languages`. Without that, three translations of one page
 * look like three unrelated pages to a crawler and compete with each other.
 *
 * Drafts are excluded because `getProjects()` only returns published entries.
 */
import type { MetadataRoute } from "next";

import { DEFAULT_LOCALE, LOCALES, LOCALE_HTML_LANG, localePath } from "@/i18n/config";
import { getProjects, getSiteConfig } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const { seo } = getSiteConfig();
  const url = (p: string) => new URL(p, seo.siteUrl).toString();
  const now = new Date();

  /** The hreflang block every entry carries. */
  const alternatesFor = (path: string) => ({
    languages: Object.fromEntries([
      ...LOCALES.map((l) => [LOCALE_HTML_LANG[l], url(localePath(l, path))]),
      ["x-default", url(localePath(DEFAULT_LOCALE, path))],
    ]),
  });

  const staticPaths: Array<{
    path: string;
    changeFrequency: "monthly" | "yearly";
    priority: number;
  }> = [
    { path: "", changeFrequency: "monthly", priority: 1 },
    { path: "/projects", changeFrequency: "monthly", priority: 0.9 },
    { path: "/about", changeFrequency: "yearly", priority: 0.7 },
    { path: "/experience", changeFrequency: "yearly", priority: 0.7 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
  ];

  const projects = getProjects();

  return LOCALES.flatMap((locale) => [
    ...staticPaths.map((entry) => ({
      url: url(localePath(locale, entry.path)),
      lastModified: now,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: alternatesFor(entry.path),
    })),
    ...projects.map((project) => ({
      url: url(localePath(locale, `/projects/${project.slug}`)),
      lastModified: project.endDate ? new Date(project.endDate) : now,
      changeFrequency: "yearly" as const,
      priority: 0.8,
      alternates: alternatesFor(`/projects/${project.slug}`),
    })),
  ]);
}
