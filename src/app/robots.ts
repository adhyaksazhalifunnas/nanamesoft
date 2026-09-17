/** robots.txt — AC-13.4. */
import type { MetadataRoute } from "next";

import { getSiteConfig } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  const { seo } = getSiteConfig();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Nothing to index behind the one runtime endpoint.
      disallow: "/api/",
    },
    sitemap: new URL("/sitemap.xml", seo.siteUrl).toString(),
    host: seo.siteUrl,
  };
}
