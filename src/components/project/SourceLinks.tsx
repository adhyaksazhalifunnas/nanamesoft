/**
 * SourceLinks — AC-04.7.
 *
 * Deep links to specific files, with line ranges where they help, in addition
 * to the repository link. This is the difference between "here is my repo, go
 * look" and "here is the 78-line function the whole case study is about" —
 * the second respects a hiring manager's fifteen minutes.
 */
import type { z } from "zod";

import type { LinkSchema } from "@/lib/schemas";

type ProjectLink = z.infer<typeof LinkSchema>;

const KIND_LABEL: Record<ProjectLink["kind"], string> = {
  repo: "Repository",
  source: "Source",
  demo: "Demo",
  docs: "Docs",
  writeup: "Write-up",
  release: "Release",
  other: "Link",
};

export function SourceLinks({ links }: { links: ProjectLink[] }) {
  if (links.length === 0) return null;

  return (
    <section aria-labelledby="source-links-heading">
      <h2
        id="source-links-heading"
        className="font-text text-ink-subtle text-xs font-medium tracking-[var(--tracking-caps)] uppercase"
      >
        Go straight to the code
      </h2>
      <ul className="divide-rule border-rule mt-[var(--space-4)] max-w-[var(--measure)] divide-y border-y">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent flex min-h-11 items-center justify-between gap-[var(--space-4)] py-[var(--space-3)] text-sm transition-colors duration-[var(--dur-fast)]"
            >
              <span>
                {link.label}
                <span className="visually-hidden"> (opens in a new tab)</span>
              </span>
              <span className="text-ink-subtle shrink-0 text-xs">
                {KIND_LABEL[link.kind]}
                <span aria-hidden="true"> ↗</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
