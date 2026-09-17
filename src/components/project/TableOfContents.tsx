/**
 * TableOfContents — AC-04.8, shown on case studies over 800 words.
 *
 * Server Component: the entries are derived from the MDX source at build time
 * and from the fixed structural sections the page renders itself. There is no
 * scroll-spy, deliberately — highlighting the "current" section requires a
 * scroll listener or an observer for a cue the reader did not ask for, and
 * §11.6 deletes motion that does not teach the visitor something.
 *
 * On wide viewports it sits in the margin (§11.5 "margin notes possible" at xl)
 * and is sticky; below lg it renders inline above the body.
 */

export type TocEntry = { id: string; label: string };

/** Extracts `## Heading` lines, skipping any inside a fenced code block. */
export function headingsFromMdx(source: string): TocEntry[] {
  const entries: TocEntry[] = [];
  let inFence = false;

  for (const line of source.split("\n")) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (!match?.[1]) continue;

    const label = match[1].replace(/[*_`]/g, "");
    entries.push({ id: slugifyHeading(label), label });
  }

  return entries;
}

/** Matches github-slugger, which is what rehype-slug uses for the real ids. */
function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\p{M}\- ]/gu, "")
    .replace(/ /g, "-");
}

export function TableOfContents({ entries }: { entries: TocEntry[] }) {
  if (entries.length < 3) return null;

  return (
    <nav aria-labelledby="toc-heading" className="lg:sticky lg:top-[var(--space-9)]">
      <h2
        id="toc-heading"
        className="font-text text-ink-subtle text-xs font-medium tracking-[var(--tracking-caps)] uppercase"
      >
        On this page
      </h2>
      <ol className="mt-[var(--space-3)] space-y-[var(--space-2)]">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              className="text-ink-muted hover:text-accent text-xs transition-colors duration-[var(--dur-fast)]"
            >
              {entry.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
