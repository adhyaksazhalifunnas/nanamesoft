/**
 * /projects — the full index.
 *
 * US-17 (filtering) is P2 and explicitly gated on having more than eight
 * projects: below that it is friction, not help. So there is no filter UI here
 * yet, and adding one later changes this file only.
 */
import type { Metadata } from "next";

import { Container } from "@/components/primitives/Container";
import { ProjectShowcase } from "@/components/sections/ProjectShowcase";
import { getDictionary } from "@/i18n";
import { toLocale } from "@/i18n/config";
import { getProjects } from "@/lib/content";
import { localizeProjects } from "@/lib/localize";
import { buildMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const dictionary = getDictionary(locale);
  const count = getProjects().length;

  return buildMetadata({
    locale,
    path: "/projects",
    title: dictionary.projects.title,
    description: dictionary.projects.metaDescription(count),
  });
}

export default async function ProjectsPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const dictionary = getDictionary(locale);
  const projects = localizeProjects(getProjects(), locale);

  return (
    <Container as="div" className="py-[var(--space-8)] lg:py-[var(--space-9)]">
      <header className="max-w-[var(--measure)]">
        <p className="text-accent text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
          {dictionary.projects.eyebrow}
        </p>
        <h1 className="mt-[var(--space-3)] text-2xl">{dictionary.projects.title}</h1>
        <p className="text-md text-ink-muted mt-[var(--space-5)]">
          {dictionary.projects.lede}
        </p>
      </header>

      <div className="mt-[var(--space-8)] lg:mt-[var(--space-9)]">
        <ProjectShowcase
          projects={projects}
          headingLevel={2}
          locale={locale}
          dictionary={dictionary}
        />
      </div>
    </Container>
  );
}
