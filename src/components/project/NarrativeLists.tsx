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

export function ConstraintsList({ constraints }: { constraints: string[] }) {
  return (
    <section aria-labelledby="constraints-heading">
      <h2
        id="constraints-heading"
        className="font-text text-ink-subtle text-xs font-medium tracking-[var(--tracking-caps)] uppercase"
      >
        Constraints
      </h2>
      <p className="text-ink-subtle mt-[var(--space-2)] max-w-[var(--measure)] text-xs">
        What I could not change. Without these, none of the decisions below look hard.
      </p>
      <ul className="mt-[var(--space-5)] max-w-[var(--measure)] space-y-[var(--space-3)]">
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

export function LimitationsList({ limitations }: { limitations: string[] }) {
  return (
    <section aria-labelledby="limitations-heading">
      <h2 id="limitations-heading" className="text-lg">
        Limitations, and what I would do differently
      </h2>
      <ul className="mt-[var(--space-5)] max-w-[var(--measure)] space-y-[var(--space-4)]">
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
