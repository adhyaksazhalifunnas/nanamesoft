/**
 * format.ts — display formatting shared across server components.
 *
 * Kept separate from content.ts so it can be unit-tested without touching the
 * filesystem, and imported by client components without pulling `fs` in.
 */

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** "2023-02" -> "Feb 2023". Accepts YYYY-MM or YYYY-MM-DD. */
export function formatMonth(value: string): string {
  const [year, month] = value.split("-");
  const index = Number(month) - 1;
  const name = MONTHS[index];
  if (!year || !name) return value;
  return `${name} ${year}`;
}

/** "Feb 2023 – Jun 2023", or "Feb 2023 – Present" when endDate is null. */
export function formatDateRange(start: string, end: string | null): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`;
}

/** "17 September 2026" — used for the honest "data as of" line (AC-05.3). */
export function formatLongDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

/**
 * Scope label for a project header: "Solo · Freelance · 2 people".
 * Reads as an honest disclosure rather than a badge (AC-04.6).
 *
 * The words come from the caller's dictionary rather than a map in here, so
 * this stays a formatter and the translations stay in one place.
 */
export function scopeLabel(
  opts: { role: string; context: string; teamSize: number },
  labels: {
    roles: Record<string, string>;
    contexts: Record<string, string>;
    people: (count: number) => string;
  },
): string {
  const parts = [
    labels.roles[opts.role] ?? opts.role,
    labels.contexts[opts.context] ?? opts.context,
  ];
  if (opts.teamSize > 1) parts.push(labels.people(opts.teamSize));
  return parts.join(" · ");
}

/**
 * Dates are formatted in the reader's locale. "Feb 2023" means nothing to a
 * Japanese reader; 2023年2月 does, and Intl already knows how to say it.
 */
export function formatMonthLocalized(value: string, locale: string): string {
  const [year, month] = value.split("-");
  if (!year || !month) return value;
  const date = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(locale, { year: "numeric", month: "short" });
}

export function formatDateRangeLocalized(
  start: string,
  end: string | null,
  locale: string,
  presentLabel: string,
): string {
  const from = formatMonthLocalized(start, locale);
  return `${from} – ${end ? formatMonthLocalized(end, locale) : presentLabel}`;
}

export function formatLongDateLocalized(iso: string, locale: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
