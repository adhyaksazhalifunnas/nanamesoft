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
 */
export function scopeLabel(opts: {
  role: string;
  context: string;
  teamSize: number;
}): string {
  const roleLabel =
    {
      solo: "Solo",
      lead: "Team lead",
      contributor: "Contributor",
      "team-member": "Team member",
    }[opts.role] ?? opts.role;

  const contextLabel =
    {
      personal: "Personal",
      academic: "Academic",
      freelance: "Freelance",
      employment: "Employment",
      "open-source": "Open source",
    }[opts.context] ?? opts.context;

  const parts = [roleLabel, contextLabel];
  if (opts.teamSize > 1) parts.push(`${opts.teamSize} people`);
  return parts.join(" · ");
}
