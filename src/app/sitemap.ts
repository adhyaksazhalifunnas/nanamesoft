/**
 * sitemap.xml — AC-13.4, generated from content rather than maintained by hand.
 * Drafts are excluded because `getProjects()` only returns published entries.
 */
import type { MetadataRoute } from "next";

import { getProjects, getSiteConfig } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const { seo } = getSiteConfig();
  const url = (p: string) => new URL(p, seo.siteUrl).toString();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    {
      url: url("/projects"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    { url: url("/about"), lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    {
      url: url("/experience"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    { url: url("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = getProjects().map((project) => ({
    url: url(`/projects/${project.slug}`),
    lastModified: project.endDate ? new Date(project.endDate) : now,
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes];
}
