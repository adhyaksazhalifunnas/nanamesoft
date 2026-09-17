/**
 * MetricBlock / MetricsTable — AC-04.4.
 *
 * Every metric carries its measurement method. The schema makes `method`
 * required, so a number can never reach this component without one — which is
 * the whole mechanism by which "reduced latency by 83%" becomes checkable
 * rather than decorative.
 *
 * Numerals are tabular everywhere (§11.4) so a column of figures lines up.
 */
import type { z } from "zod";

import type { MetricSchema } from "@/lib/schemas";

type Metric = z.infer<typeof MetricSchema>;

/** The single headline number, shown inside the summary block (§12.2). */
export function HeadlineMetric({ metric }: { metric: Metric }) {
  return (
    <figure className="border-rule border p-[var(--space-5)]">
      <p className="tabular font-display text-lg leading-[var(--leading-tight)]">
        <span className="text-ink-subtle">{metric.baseline}</span>
        <span aria-hidden="true" className="text-ink-subtle mx-[var(--space-3)]">
          →
        </span>
        <span className="text-accent">{metric.result}</span>
        {metric.delta ? (
          <span className="text-md text-ink-muted ml-[var(--space-3)]">
            ({metric.delta})
          </span>
        ) : null}
      </p>
      <figcaption className="text-ink-muted mt-[var(--space-3)] text-xs">
        {metric.label} — {metric.method}
        {metric.instrument ? ` · ${metric.instrument}` : ""}
      </figcaption>
    </figure>
  );
}

export function MetricsTable({ metrics }: { metrics: Metric[] }) {
  if (metrics.length === 0) return null;

  return (
    <div className="metrics-table">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">
          Measured outcomes, with the baseline, the result, and how each was measured
        </caption>
        <thead>
          <tr className="border-ink border-b">
            <th
              scope="col"
              className="text-ink-subtle py-[var(--space-3)] pr-[var(--space-4)] text-xs font-medium tracking-[var(--tracking-caps)] uppercase"
            >
              Metric
            </th>
            <th
              scope="col"
              className="text-ink-subtle py-[var(--space-3)] pr-[var(--space-4)] text-xs font-medium tracking-[var(--tracking-caps)] uppercase"
            >
              Before
            </th>
            <th
              scope="col"
              className="text-ink-subtle py-[var(--space-3)] pr-[var(--space-4)] text-xs font-medium tracking-[var(--tracking-caps)] uppercase"
            >
              After
            </th>
            <th
              scope="col"
              className="text-ink-subtle py-[var(--space-3)] text-xs font-medium tracking-[var(--tracking-caps)] uppercase"
            >
              How it was measured
            </th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((m) => (
            <tr key={m.label} className="border-rule border-b align-top">
              <th
                scope="row"
                className="py-[var(--space-4)] pr-[var(--space-4)] text-sm font-medium"
              >
                {m.label}
              </th>
              <td
                data-label="Before"
                className="tabular text-ink-muted py-[var(--space-4)] pr-[var(--space-4)] text-sm"
              >
                {m.baseline}
              </td>
              <td
                data-label="After"
                className="tabular py-[var(--space-4)] pr-[var(--space-4)] text-sm"
              >
                {m.result}
                {m.delta ? (
                  <span className="text-accent ml-[var(--space-2)] text-xs">
                    {m.delta}
                  </span>
                ) : null}
              </td>
              <td
                data-label="How it was measured"
                className="text-ink-muted py-[var(--space-4)] text-sm"
              >
                {m.method}
                {m.instrument ? (
                  <span className="text-ink-subtle block text-xs">{m.instrument}</span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
