import type { NextConfig } from "next";

/**
 * Security headers (PRD §5.7).
 *
 * The CSP has no `unsafe-inline` for scripts. Two inline scripts exist — the
 * theme setter in layout.tsx and the JSON-LD blocks — and both are covered by
 * `strict-dynamic` plus the hashes Next emits for its own bootstrap. If you add
 * an analytics provider, add its origin to script-src and connect-src.
 */
const CSP_DIRECTIVES = [
  "default-src 'self'",
  // 'unsafe-inline' is ignored by browsers that understand 'strict-dynamic',
  // and is kept only as the fallback for those that do not.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
];

/**
 * `upgrade-insecure-requests` is deliberately conditional.
 *
 * It rewrites every http:// subresource to https://. Over a real HTTPS
 * deployment that is free hardening. Over plain HTTP it is fatal in WebKit,
 * which — unlike Chromium — does not exempt localhost: the stylesheet fails
 * with "SSL connect error" and the page renders completely unstyled. That is
 * how it was found, by the Safari leg of the E2E suite.
 *
 * §5.7 does not ask for this directive (HSTS covers the same ground for the
 * document, and every subresource here is a same-origin relative URL that
 * already inherits the page's scheme), so skipping it when serving over HTTP
 * costs nothing real.
 */
if (process.env.CSP_NO_HTTPS_UPGRADE !== "1") {
  CSP_DIRECTIVES.push("upgrade-insecure-requests");
}

const CSP = CSP_DIRECTIVES.join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /*
   * Every page lives under a locale prefix, so "/" has to go somewhere. A
   * config-level 308 is used rather than middleware: §13.3 asks the
   * architecture to stay portable to a plain VPS, and a redirect rule is one
   * line of Caddy or nginx config, while middleware is a running process.
   *
   * It deliberately does NOT negotiate Accept-Language. Guessing a visitor's
   * language from their browser and redirecting them is how a reader who wants
   * the English page ends up somewhere else with no obvious way back — and it
   * makes "/" uncacheable. English is the default; the switcher is one click.
   */
  async redirects() {
    return [{ source: "/", destination: "/en", permanent: true }];
  },

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
