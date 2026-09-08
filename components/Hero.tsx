import { site } from "@/content/site";

export default function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 sm:pt-32 sm:pb-24">
      <p className="text-sm font-medium tracking-wide text-accent uppercase">
        {site.role}
      </p>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
        {site.name}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
        {site.tagline}
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <a
          href="#projects"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast transition hover:opacity-90"
        >
          View my work
        </a>
        {site.resumeUrl && (
          <a
            href={site.resumeUrl}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            Résumé
          </a>
        )}
      </div>

      {site.location && (
        <p className="mt-8 text-sm text-muted">Based in {site.location}</p>
      )}
    </section>
  );
}
