/**
 * DecisionTable — AC-04.2, and per §12.3 the single highest-value block on the
 * site. It is what separates "I built a thing" from "I make defensible calls".
 *
 * Rendered from structured frontmatter rather than written as prose in MDX, so
 * every case study presents its decisions identically and none of the four
 * columns can be quietly omitted.
 *
 * Responsive strategy (AC-11.4): a real <table> at >=1024px, where the columns
 * are genuinely comparable side by side; below that the same <table> restyles
 * into stacked labelled rows. It stays one table either way, so the semantics
 * a screen reader gets never change with viewport width.
 */
import type { z } from "zod";

import type { Dictionary } from "@/i18n";
import type { DecisionSchema } from "@/lib/schemas";

type Decision = z.infer<typeof DecisionSchema>;

export function DecisionTable({
  decisions,
  dictionary,
  contentLang,
}: {
  decisions: Decision[];
  dictionary: Dictionary;
  /** "en" on a non-English page: the column headers are translated, the
      decisions themselves are not. See lib/localize.ts. */
  contentLang?: "en";
}) {
  return (
    <div className="decision-table">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">{dictionary.caseStudy.decisionTableCaption}</caption>
        <thead>
          <tr className="border-ink border-b">
            <th
              scope="col"
              className="text-ink-subtle w-[24%] py-[var(--space-3)] pr-[var(--space-4)] text-xs font-medium tracking-[var(--tracking-caps)] uppercase"
            >
              {dictionary.caseStudy.decisionColumn}
            </th>
            <th
              scope="col"
              className="text-ink-subtle w-[24%] py-[var(--space-3)] pr-[var(--space-4)] text-xs font-medium tracking-[var(--tracking-caps)] uppercase"
            >
              {dictionary.caseStudy.chosenColumn}
            </th>
            <th
              scope="col"
              className="text-ink-subtle w-[26%] py-[var(--space-3)] pr-[var(--space-4)] text-xs font-medium tracking-[var(--tracking-caps)] uppercase"
            >
              {dictionary.caseStudy.rejectedColumn}
            </th>
            <th
              scope="col"
              className="text-ink-subtle w-[26%] py-[var(--space-3)] text-xs font-medium tracking-[var(--tracking-caps)] uppercase"
            >
              {dictionary.caseStudy.tradeoffColumn}
            </th>
          </tr>
        </thead>
        <tbody lang={contentLang}>
          {decisions.map((d) => (
            <tr key={d.decision} className="border-rule border-b align-top">
              <th
                scope="row"
                data-label={dictionary.caseStudy.decisionColumn}
                className="py-[var(--space-4)] pr-[var(--space-4)] text-sm font-medium"
              >
                {d.decision}
              </th>
              <td
                data-label={dictionary.caseStudy.chosenColumn}
                className="py-[var(--space-4)] pr-[var(--space-4)] text-sm"
              >
                {d.chosen}
              </td>
              <td
                data-label={dictionary.caseStudy.rejectedColumn}
                className="text-ink-muted py-[var(--space-4)] pr-[var(--space-4)] text-sm"
              >
                <ul>
                  {d.alternatives.map((alt) => (
                    <li
                      key={alt}
                      className="before:text-ink-subtle before:mr-[var(--space-1)] before:content-['—']"
                    >
                      {alt}
                    </li>
                  ))}
                </ul>
              </td>
              <td
                data-label={dictionary.caseStudy.tradeoffColumn}
                className="text-ink-muted py-[var(--space-4)] text-sm"
              >
                {d.tradeoff}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* The rationale is the part that actually shows the thinking, but it is
          too long for a table cell. It sits below, keyed to each decision. */}
      <div className="mt-[var(--space-6)] space-y-[var(--space-5)]">
        {decisions.map((d) => (
          <div key={d.decision} className="border-rule border-l pl-[var(--space-5)]">
            <p className="text-ink-subtle text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
              {dictionary.caseStudy.why(d.decision)}
            </p>
            <p
              lang={contentLang}
              className="text-ink-muted mt-[var(--space-2)] max-w-[var(--measure)] text-sm"
            >
              {d.rationale}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
