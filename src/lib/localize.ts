/**
 * localize.ts — the single place that decides which language a piece of
 * CONTENT renders in.
 *
 * UI strings come from the dictionaries in src/i18n, which are complete by
 * construction (a missing key is a type error). Content is different: a case
 * study can be published before anyone has translated its summary, and that
 * must not be a build failure or a blank page. So content falls back to
 * English, silently and per field.
 *
 * Keeping the fallback in one function rather than scattering `?? project.x`
 * across components means the rule is stated once and cannot drift.
 */
import type { Locale } from "@/i18n/config";
import type { Project, SiteConfig } from "./schemas";

/** A project with its recruiter-facing strings resolved for one locale. */
export type LocalizedProject = Project & {
  /** True when this locale has no translation and English is being shown. */
  isFallback: boolean;
};

export function localizeProject(project: Project, locale: Locale): LocalizedProject {
  if (locale === "en") return { ...project, isFallback: false };

  const translation = project.translations?.[locale];
  if (!translation) return { ...project, isFallback: true };

  return {
    ...project,
    tagline: translation.tagline,
    summary: translation.summary,
    // The headline metric's label sits inside the summary block, so it belongs
    // to the same layer. Everything else about the metric — the numbers and
    // the measurement method — is language-neutral and stays as authored.
    metrics: translation.headlineMetricLabel
      ? project.metrics.map((m) =>
          m.isHeadline ? { ...m, label: translation.headlineMetricLabel as string } : m,
        )
      : project.metrics,
    isFallback: false,
  };
}

export function localizeProjects(
  projects: Project[],
  locale: Locale,
): LocalizedProject[] {
  return projects.map((p) => localizeProject(p, locale));
}

/** Site identity resolved for one locale, with the same per-field fallback. */
export function localizeSite(site: SiteConfig, locale: Locale): SiteConfig {
  if (locale === "en") return site;

  const t = site.translations?.[locale];
  if (!t) return site;

  return {
    ...site,
    headline: t.headline,
    valueProp: t.valueProp,
    about: t.about,
    availability: {
      ...site.availability,
      detail: t.availabilityDetail,
      location: t.availabilityLocation,
    },
    seo: {
      ...site.seo,
      defaultTitle: t.seoDefaultTitle ?? site.seo.defaultTitle,
      defaultDescription: t.seoDefaultDescription ?? site.seo.defaultDescription,
    },
  };
}

/**
 * The `lang` value for a run of content that exists only in English.
 *
 * WCAG 2.2 SC 3.1.2 (Language of Parts, level AA). A Japanese page that slips
 * into an English paragraph without saying so is read aloud with Japanese
 * phonemes, which is worse than useless. Marking the run costs one attribute
 * and switches the synthesiser's voice.
 *
 * SC 3.1.2 exempts proper names and technical terms, so this goes on PROSE —
 * a course takeaway, a role summary, a thesis abstract — and not on a stack
 * list, a course code or an institution name. On English pages it returns
 * undefined, so no attribute is rendered at all.
 */
export function englishRun(locale: Locale): "en" | undefined {
  return locale === "en" ? undefined : "en";
}
