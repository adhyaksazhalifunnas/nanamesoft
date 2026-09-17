/**
 * Analytics — cookieless, deferred, and off by default (PRD D11).
 *
 * Plausible and Umami are both cookieless and collect no PII, which is why no
 * consent banner is needed (§5.7). With `provider: "none"` this renders
 * nothing at all, so a fresh clone ships zero third-party origins.
 *
 * Server Component: `next/script` with strategy="afterInteractive" keeps this
 * off the critical path (AC-15.4).
 */
import Script from "next/script";

import type { SiteConfig } from "@/lib/schemas";

export function Analytics({ config }: { config: SiteConfig["analytics"] }) {
  if (config.provider === "none") return null;

  if (config.provider === "plausible") {
    if (!config.domain) return null;
    return (
      <Script
        strategy="afterInteractive"
        data-domain={config.domain}
        src={config.scriptUrl ?? "https://plausible.io/js/script.js"}
      />
    );
  }

  // Umami
  if (!config.scriptUrl || !config.domain) return null;
  return (
    <Script
      strategy="afterInteractive"
      data-website-id={config.domain}
      src={config.scriptUrl}
    />
  );
}
