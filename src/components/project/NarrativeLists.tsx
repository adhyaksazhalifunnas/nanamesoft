/**
 * ConstraintsList and LimitationsList.
 *
 * Both are rendered from frontmatter rather than written as prose, for the same
 * reason the Decision Table is: they are the two sections a tired author is
 * most likely to skip, and structure makes skipping them a build failure.
 *
 * §12.2 on Limitations: "this section buys more credibility per word than any
 * other on the page". It is styled to be read, not tucked away in small print.
 */

import type { Dictionary } from "@/i18n";

/**
 * `contentLang` is "en" on a non-English page and undefined on an English one:
 * the headings are translated but the items themselves are written once, in
 * English, and SC 3.1.2 wants that said in the markup. See lib/localize.ts.
 */
export function ConstraintsList({
  constraints,
  dictionary,
  contentLang,
}: {
  constraints: string[];
  dictionary: Dictionary;
  contentLang?: "en";
}) {
  return (
    <section aria-labelledby="constraints-heading">
      <h2
        id="constraints-heading"
        className="font-text text-ink-subtle text-xs font-medium tracking-[var(--tracking-caps)] uppercase"
      >
        {dictionary.caseStudy.constraints}
      </h2>
      <p className="text-ink-subtle mt-[var(--space-2)] max-w-[var(--measure)] text-xs">
        {dictionary.caseStudy.constraintsLede}
      </p>
      <ul
        lang={contentLang}
        className="mt-[var(--space-5)] max-w-[var(--measure)] space-y-[var(--space-3)]"
      >
        {constraints.map((constraint) => (
          <li
            key={constraint}
            className="border-rule text-ink-muted border-l pl-[var(--space-4)] text-base"
          >
            {constraint}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LimitationsList({
  limitations,
  dictionary,
  contentLang,
}: {
  limitations: string[];
  dictionary: Dictionary;
  contentLang?: "en";
}) {
  return (
    <section aria-labelledby="limitations-heading">
      <h2 id="limitations-heading" className="text-lg">
        {dictionary.caseStudy.limitations}
      </h2>
      <ul
        lang={contentLang}
        className="mt-[var(--space-5)] max-w-[var(--measure)] space-y-[var(--space-4)]"
      >
        {limitations.map((limitation) => (
          <li
            key={limitation}
            className="border-accent border-l-2 pl-[var(--space-5)] text-base"
          >
            {limitation}
          </li>
        ))}
      </ul>
    </section>
  );
}
