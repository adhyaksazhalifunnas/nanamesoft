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
import {
  getProjects,
  getShowcaseSkills,
  getSiteConfig,
  getSkillYearRange,
  getSkills,
} from "@/lib/content";
import { buildMetadata, personJsonLd } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const site = getSiteConfig();
  return buildMetadata({
    title: site.seo.defaultTitle,
    description: site.seo.defaultDescription,
    pathname: "/",
  });
}

export default function HomePage() {
  const site = getSiteConfig();
  const all = getProjects();
  const featured = getProjects({ featured: true });
  const skills = getSkills();
  const range = getSkillYearRange();

  // AC-02.1: the landing page shows 3–4 featured projects, /projects shows all.
  // Falling back to the first four keeps the section useful before anything has
  // been marked `featured`.
  const shown = (featured.length > 0 ? featured : all).slice(0, 4);

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
            ),
          ),
        }}
      />

      <Hero />

      <Section
        id="work"
        compactTop
        eyebrow="Selected work"
        title="Case studies, not screenshots"
        lede="Each one covers the problem, the constraints, the decision I made and what I rejected, and what the numbers looked like afterwards."
      >
        <ProjectShowcase projects={shown} featureFirst />
        <AllProjectsLink count={all.length} />
      </Section>

      <Section
        id="skills"
        eyebrow="Capability"
        title="What I work with, and for how long"
        lede="Proficiency is a four-level scale with published definitions rather than a percentage, because nobody can defend a percentage."
      >
        <SkillsTimeline groups={skills} range={range} />
      </Section>
    </>
  );
}
