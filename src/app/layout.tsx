/**
 * Root layout — fonts, tokens, skip link, analytics (PRD §5.3).
 *
 * Server Component. Nothing here ships JavaScript except the theme script,
 * which is deliberately inline and blocking (see below).
 */
import type { Metadata, Viewport } from "next";
import { Fraunces, JetBrains_Mono, Public_Sans } from "next/font/google";

import { Analytics } from "@/components/Analytics";
import { Footer } from "@/components/sections/Footer";
import { Nav } from "@/components/sections/Nav";
import { getSiteConfig } from "@/lib/content";

import "@/styles/globals.css";

/**
 * Two families plus mono, per §11.4. Serif display + sans text is the strongest
 * editorial move available and is uncommon in developer portfolios.
 *
 * next/font downloads these at BUILD time and serves them from our own origin,
 * so there is no Google Fonts CDN request at runtime and no render-blocking
 * third-party round trip — which is what D8 is actually protecting against.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-public-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export function generateMetadata(): Metadata {
  const site = getSiteConfig();
  return {
    metadataBase: new URL(site.seo.siteUrl),
    title: {
      default: site.seo.defaultTitle,
      template: `%s — ${site.name}`,
    },
    description: site.seo.defaultDescription,
    authors: [{ name: site.name, url: site.seo.siteUrl }],
    creator: site.name,
    openGraph: {
      type: "website",
      siteName: site.name,
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
