import Image from "next/image";
import Section from "./Section";
import { projects, type Project } from "@/content/site";

function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/60 ${
        featured ? "sm:col-span-2" : ""
      }`}
    >
      <div
        className={`relative w-full overflow-hidden bg-linear-to-br from-accent/25 via-accent/10 to-transparent ${
          featured ? "aspect-[2.6/1]" : "aspect-[16/10]"
        }`}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={`Screenshot of ${project.title}`}
            fill
            sizes={
              featured
                ? "(min-width: 640px) 62rem, 100vw"
                : "(min-width: 640px) 31rem, 100vw"
            }
            className="object-cover"
          />
        ) : (
          // TODO: add a screenshot to /public and set `image` in content/site.ts
          // to replace this placeholder.
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted">
              Add a screenshot
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-border px-2.5 py-1 text-xs text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>

        {(project.liveUrl || project.repoUrl) && (
          <div className="mt-5 flex gap-4 text-sm font-medium">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:underline"
              >
                Live ↗
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-muted transition-colors hover:text-text"
              >
                Code ↗
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <Section id="projects" eyebrow="Selected work" title="Projects">
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} featured={i === 0} />
        ))}
      </div>
    </Section>
  );
}
