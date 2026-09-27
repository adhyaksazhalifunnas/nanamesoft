/**
 * Root layout — fonts, tokens, skip link, analytics (PRD §5.3).
 *
 * This lives inside the [locale] segment because every page does, which makes
 * it the app's root layout: it owns <html> and <body>. `dynamicParams = false`
 * means a path like /xyz is a 404 rather than a page rendered with a nonsense
 * locale, so nothing downstream has to defend against an invalid locale.
 *
 * Server Component. The only JavaScript is the bootstrap script, which is
 * deliberately inline and blocking (see below).
 */
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { Analytics } from "@/components/Analytics";
import { Footer } from "@/components/sections/Footer";
import { Nav } from "@/components/sections/Nav";
import { getDictionary } from "@/i18n";
import { LOCALE_HTML_LANG, LOCALES, toLocale } from "@/i18n/config";
import { getSiteConfig } from "@/lib/content";
import { localizeSite } from "@/lib/localize";

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
 *
 * Japanese is handled separately in styles/noto-sans-jp.css: neither Latin
 * family has a single CJK glyph, and the JP face is split into unicode-range
 * slices so a reader only downloads the ones their page actually uses.
 */
const fraunces = localFont({
  src: "../../../public/fonts/fraunces-latin-wght-normal.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-fraunces",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const publicSans = localFont({
  src: [
    {
      path: "../../../public/fonts/public-sans-latin-wght-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../../public/fonts/public-sans-latin-wght-italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-public-sans",
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
});

const jetbrainsMono = localFont({
  src: "../../../public/fonts/jetbrains-mono-latin-wght-normal.woff2",
  weight: "100 800",
  display: "swap",
  variable: "--font-jetbrains-mono",
  preload: false,
  fallback: ["ui-monospace", "SF Mono", "Menlo", "monospace"],
});

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/** Every locale is prerendered; anything else 404s rather than rendering. */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const site = localizeSite(getSiteConfig(), locale);

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
      locale: LOCALE_HTML_LANG[locale],
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

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const dictionary = getDictionary(locale);
  const site = localizeSite(getSiteConfig(), locale);

  return (
    <html
      lang={LOCALE_HTML_LANG[locale]}
      className={`${fraunces.variable} ${publicSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOTSTRAP_SCRIPT }} />
      </head>
      <body>
        {/* AC-14.5: the skip link is the first focusable element on every page. */}
        <a href="#main" className="skip-link">
          {dictionary.nav.skipToContent}
        </a>

        <Nav locale={locale} dictionary={dictionary} site={site} />

        <main id="main" tabIndex={-1}>
          {children}
        </main>

        <Footer locale={locale} dictionary={dictionary} site={site} />

        <Analytics config={site.analytics} />
      </body>
    </html>
  );
}
