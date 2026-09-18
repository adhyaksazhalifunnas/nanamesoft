/**
 * Root layout — fonts, tokens, skip link, analytics (PRD §5.3).
 *
 * Server Component. Nothing here ships JavaScript except the theme script,
 * which is deliberately inline and blocking (see below).
 */
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { Analytics } from "@/components/Analytics";
import { Footer } from "@/components/sections/Footer";
import { Nav } from "@/components/sections/Nav";
import { getSiteConfig } from "@/lib/content";

import "@/styles/globals.css";

/**
 * Two families plus mono, per §11.4. Serif display + sans text is the strongest
 * editorial move available and is uncommon in developer portfolios.
 *
 * Self-hosted from public/fonts via next/font/local (D8). An earlier version
 * used next/font/google, which also serves from our own origin at runtime but
 * has to DOWNLOAD the files at build time — so a build with no network access
 * failed outright, breaking AC-16.1 and launch gate G7. Vendored files remove
 * the last network dependency from `pnpm build`.
 *
 * Budget (§5.8: <=2 families, <=4 files, <=120 KB): Fraunces (36.6 KB) and
 * both Public Sans styles (26.8 + 28.3 KB) are preloaded — 91.7 KB. JetBrains
 * Mono (40.4 KB) is code-only and not preloaded, so the browser fetches it
 * only on a page that actually renders a code block.
 */
const fraunces = localFont({
  src: "../../public/fonts/fraunces-latin-wght-normal.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-fraunces",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const publicSans = localFont({
  src: [
    {
      path: "../../public/fonts/public-sans-latin-wght-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../public/fonts/public-sans-latin-wght-italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-public-sans",
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
});

const jetbrainsMono = localFont({
  src: "../../public/fonts/jetbrains-mono-latin-wght-normal.woff2",
  weight: "100 800",
  display: "swap",
  variable: "--font-jetbrains-mono",
  preload: false,
  fallback: ["ui-monospace", "SF Mono", "Menlo", "monospace"],
});

export function generateMetadata(): Metadata {
  const site = getSiteConfig();
  return {
    metadataBase: new URL(site.seo.siteUrl),
    title: {
      default: site.seo.defaultTitle,
      template: `%s — ${site.brand}`,
    },
    description: site.seo.defaultDescription,
    authors: [{ name: site.name, url: site.seo.siteUrl }],
    creator: site.name,
    openGraph: {
      type: "website",
      siteName: site.brand,
      locale: site.seo.locale,
    },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // safe-area insets on notched devices (AC-11.6)
};

/**
 * Two jobs, both of which have to happen before first paint:
 *
 *  1. Apply the stored theme. Deferring this produces a flash of the wrong
 *     theme, which is a worse trade than the ~250 bytes it costs. With no
 *     stored preference it does nothing and `prefers-color-scheme` takes over.
 *
 *  2. Add `.js` to <html>. Every scroll-reveal start state is scoped to that
 *     class, so a visitor with scripting disabled never gets content hidden by
 *     an animation that can never run (AC-10.5). Setting it here rather than
 *     from React avoids a flash of visible-then-hidden content on load.
 */
const BOOTSTRAP_SCRIPT = `document.documentElement.classList.add("js");try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const site = getSiteConfig();

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${publicSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOTSTRAP_SCRIPT }} />
      </head>
      <body>
        {/* AC-14.5: the skip link is the first focusable element on every page. */}
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <Nav />

        <main id="main" tabIndex={-1}>
          {children}
        </main>

        <Footer />

        <Analytics config={site.analytics} />
      </body>
    </html>
  );
}
