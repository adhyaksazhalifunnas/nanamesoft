/**
 * The routes every suite sweeps.
 *
 * Case-study routes are discovered from the sitemap rather than hard-coded, so
 * adding a project — or a locale — automatically widens coverage instead of
 * quietly leaving new pages unchecked.
 */
export const LOCALES = ["en", "id", "ja"] as const;

export const DEFAULT_LOCALE = "en";

const PATHS = ["", "/projects", "/about", "/experience", "/contact"] as const;

/** Every static page, in the default locale. */
export const STATIC_ROUTES = PATHS.map((p) => `/${DEFAULT_LOCALE}${p}`);

/** Every static page in every locale — used where language actually matters. */
export const ALL_LOCALE_ROUTES = LOCALES.flatMap((locale) =>
  PATHS.map((p) => `/${locale}${p}`),
);

/** The widths in AC-11.1. 320 is the floor the reflow criteria assume. */
export const BREAKPOINTS = [320, 375, 390, 768, 1024, 1280, 1440, 1920] as const;

export async function projectRoutes(
  request: { get: (url: string) => Promise<{ text: () => Promise<string> }> },
  locale: string = DEFAULT_LOCALE,
): Promise<string[]> {
  const res = await request.get("/sitemap.xml");
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1] as string).pathname)
    .filter((p) => p.startsWith(`/${locale}/projects/`));
}
