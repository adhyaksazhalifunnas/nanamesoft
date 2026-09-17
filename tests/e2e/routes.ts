/**
 * The routes every suite sweeps. Case-study routes are discovered from the
 * sitemap rather than hard-coded, so adding a project automatically widens
 * test coverage instead of quietly leaving the new page unchecked.
 */
export const STATIC_ROUTES = [
  "/",
  "/projects",
  "/about",
  "/experience",
  "/contact",
] as const;

/** The widths in AC-11.1. 320 is the floor the reflow criteria assume. */
export const BREAKPOINTS = [320, 375, 390, 768, 1024, 1280, 1440, 1920] as const;

export async function projectRoutes(request: {
  get: (url: string) => Promise<{ text: () => Promise<string> }>;
}): Promise<string[]> {
  const res = await request.get("/sitemap.xml");
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1] as string).pathname)
    .filter((p) => p.startsWith("/projects/"));
}
