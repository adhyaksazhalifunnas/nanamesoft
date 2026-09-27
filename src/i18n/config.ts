/**
 * i18n configuration.
 *
 * A DELIBERATE DEPARTURE FROM PRD §3.4, which lists "No i18n at MVP. English
 * only" as an explicit non-goal. The owner overrode it. What follows keeps the
 * departure as small as the requirement allows:
 *
 *   - Translated: the UI chrome, and the "Priya layer" from §12.3 — the
 *     tagline, summary and headline metric a recruiter reads in the first 60
 *     seconds, plus the About prose and availability line.
 *   - Not translated: case-study bodies. They run to ~7,800 words of argued
 *     technical prose, and machine-translated Japanese that nobody on the team
 *     can check is worse for credibility than clean English. An engineer
 *     reading to that depth reads English; a recruiter deciding in 60 seconds
 *     does not have to.
 *
 * Every route is statically generated per locale, so the site stays fully
 * static and D2 ("Full SSG, no ISR") still holds.
 */

export const LOCALES = ["en", "id", "ja"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/**
 * Each language is named in its OWN language. A Japanese reader looking for
 * their language scans for 日本語, not for "Japanese" — writing the list in
 * English defeats the point of the switcher for the people who need it most.
 */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  id: "Bahasa Indonesia",
  ja: "日本語",
};

/** The `lang` attribute and hreflang value for each locale. */
export const LOCALE_HTML_LANG: Record<Locale, string> = {
  en: "en",
  id: "id",
  ja: "ja",
};

/** A short code for the switcher trigger, where the full name does not fit. */
export const LOCALE_SHORT: Record<Locale, string> = {
  en: "EN",
  id: "ID",
  ja: "日本",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Narrows a route param to a Locale.
 *
 * Next generates its route types with `params: { locale: string }`, so a page
 * cannot declare the union directly. `dynamicParams = false` already makes an
 * unknown locale a 404, so by the time a page runs the value is always valid —
 * the fallback exists to satisfy the type, not to paper over a real case.
 */
export function toLocale(value: string): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/**
 * Splits "/ja/projects/frescis" into its locale and the rest of the path.
 * Used by the switcher so that changing language keeps you on the same page
 * rather than dropping you at the home page — which is the single most
 * irritating thing a language switcher can do.
 */
export function splitLocalePath(pathname: string): {
  locale: Locale;
  rest: string;
} {
  const [, first = "", ...others] = pathname.split("/");
  if (isLocale(first)) {
    return { locale: first, rest: others.length > 0 ? `/${others.join("/")}` : "" };
  }
  return { locale: DEFAULT_LOCALE, rest: pathname === "/" ? "" : pathname };
}

export function localePath(locale: Locale, rest: string): string {
  return `/${locale}${rest}`;
}
