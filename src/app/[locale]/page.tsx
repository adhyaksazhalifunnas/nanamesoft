/**
 * Landing page.
 *
 * Reading order is the priority order from §12.3: orientation (Priya, 5s),
 * then evidence of work, then the skills she has to match against a req, then
 * a way to reach you. Nothing above the fold is decorative.
 */
import type { Metadata } from "next";

import { Section } from "@/components/primitives/Section";
import { Hero } from "@/components/sections/Hero";
import { AllProjectsLink, ProjectShowcase } from "@/components/sections/ProjectShowcase";
import { SkillsTimeline } from "@/components/sections/SkillsTimeline";
import { getDictionary } from "@/i18n";
import { toLocale } from "@/i18n/config";
import {
  getProjects,
  getShowcaseSkills,
  getSiteConfig,
  getSkillYearRange,
  getSkills,
} from "@/lib/content";
import { localizeProjects, localizeSite } from "@/lib/localize";
import { buildMetadata, personJsonLd } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const site = localizeSite(getSiteConfig(), locale);
  return buildMetadata({
    locale,
    path: "",
    title: site.seo.defaultTitle,
    description: site.seo.defaultDescription,
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const dictionary = getDictionary(locale);
  const site = localizeSite(getSiteConfig(), locale);

  const all = getProjects();
  const featured = getProjects({ featured: true });
  const skills = getSkills();
  const range = getSkillYearRange();

  // AC-02.1: the landing page shows 3–4 featured projects, /projects shows all.
  // Falling back to the first four keeps the section useful before anything has
  // been marked `featured`.
  const shown = localizeProjects(
    (featured.length > 0 ? featured : all).slice(0, 4),
    locale,
  );

  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD is data, not markup; this is the documented way to emit it.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            personJsonLd(
              site,
              getShowcaseSkills().map((s) => s.name),
              locale,
            ),
          ),
        }}
      />

      <Hero locale={locale} dictionary={dictionary} site={site} />

      <Section
        id="work"
        compactTop
        eyebrow={dictionary.home.workEyebrow}
        title={dictionary.home.workTitle}
        lede={dictionary.home.workLede}
      >
        <ProjectShowcase
          projects={shown}
          featureFirst
          locale={locale}
          dictionary={dictionary}
        />
        <AllProjectsLink count={all.length} locale={locale} dictionary={dictionary} />
      </Section>

      <Section
        id="skills"
        eyebrow={dictionary.home.skillsEyebrow}
        title={dictionary.home.skillsTitle}
        lede={dictionary.home.skillsLede}
      >
        <SkillsTimeline
          groups={skills}
          range={range}
          locale={locale}
          dictionary={dictionary}
        />
      </Section>
    </>
  );
}
