/**
 * RepoEvidence — US-05, live GitHub data rendered next to the claims it backs.
 *
 * Every value here comes from the committed build-time cache. There is not one
 * client-side GitHub request on this page (AC-05.2), and the component returns
 * null rather than an error when a repository is missing, private, or has never
 * been synced (AC-05.4).
 *
 * AC-05.3: the "data as of" line is not decoration. Showing a stale number
 * without a date is misleading; showing it with one is honest.
 * AC-05.6: stars and forks at or below 2 are hidden. A "0 ★" badge is worse
 * than no badge.
 */
import {
  getCacheAge,
  getRepoData,
  repoAge,
  shouldShowForks,
  shouldShowStars,
  significantLanguages,
} from "@/lib/github";
import { formatLongDate, formatNumber } from "@/lib/format";

export function RepoEvidence({ repo }: { repo: string | undefined }) {
  const data = getRepoData(repo);
  if (!data) return null;

  const { syncedAt } = getCacheAge();
  const languages = significantLanguages(data);

  return (
    <section
      aria-labelledby="repo-evidence-heading"
      className="border-rule border-t pt-[var(--space-6)]"
    >
      <h2
        id="repo-evidence-heading"
        className="font-text text-ink-subtle text-xs font-medium tracking-[var(--tracking-caps)] uppercase"
      >
        Repository evidence
      </h2>

      {data.stale ? (
        <p className="text-ink-subtle mt-[var(--space-3)] text-xs">
          This repository could not be read at the last sync. The figures below are the
          last known values.
        </p>
      ) : null}

      {languages.length > 0 ? (
        <div className="mt-[var(--space-5)]">
          {/* The bar is decorative; the list beneath it carries the same
              information as text, so nothing depends on colour (AC-14.9). */}
          <div
            aria-hidden="true"
            className="flex h-1.5 w-full overflow-hidden rounded-[var(--radius-sm)]"
          >
            {languages.map((lang) => (
              <span
                key={lang.name}
                style={{ width: `${lang.percent}%`, background: lang.color }}
              />
            ))}
          </div>
          <ul className="text-ink-muted mt-[var(--space-3)] flex flex-wrap gap-x-[var(--space-4)] gap-y-[var(--space-1)] text-xs">
            {languages.map((lang) => (
              <li key={lang.name} className="tabular">
                {lang.name} {lang.percent}%
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <dl className="mt-[var(--space-6)] grid grid-cols-2 gap-[var(--space-5)] sm:grid-cols-3 lg:grid-cols-4">
        <Fact label="Commits" value={formatNumber(data.commitCount)} />
        <Fact label="Repository age" value={repoAge(data)} />
        <Fact label="First commit" value={formatLongDate(data.createdAt)} />
        <Fact label="Last push" value={formatLongDate(data.pushedAt)} />
        {data.contributorCount ? (
          <Fact label="Contributors" value={formatNumber(data.contributorCount)} />
        ) : null}
        {shouldShowStars(data) ? (
          <Fact label="Stars" value={formatNumber(data.stars)} />
        ) : null}
        {shouldShowForks(data) ? (
          <Fact label="Forks" value={formatNumber(data.forks)} />
        ) : null}
        {data.license ? <Fact label="License" value={data.license.spdxId} /> : null}
        {data.latestRelease ? (
          <Fact label="Latest release" value={data.latestRelease.tagName} />
        ) : null}
      </dl>

      {data.topics.length > 0 ? (
        <ul className="text-ink-subtle mt-[var(--space-5)] flex flex-wrap gap-x-[var(--space-3)] gap-y-[var(--space-1)] text-xs">
          {data.topics.map((topic) => (
            <li key={topic}>#{topic}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-[var(--space-6)] flex flex-wrap items-center gap-[var(--space-4)]">
        {/* AC-05.5: a prominent, correctly labelled repository link. */}
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="border-rule hover:border-accent hover:text-accent inline-flex min-h-11 items-center border px-[var(--space-5)] text-sm font-medium transition-colors duration-[var(--dur-fast)]"
        >
          {data.nameWithOwner} on GitHub
          <span className="visually-hidden"> (opens in a new tab)</span>
          <span aria-hidden="true" className="ml-[var(--space-2)]">
            ↗
          </span>
        </a>

        {data.homepageUrl ? (
          <a
            href={data.homepageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent text-sm underline underline-offset-4"
          >
            Live site
            <span className="visually-hidden"> (opens in a new tab)</span>
            <span aria-hidden="true"> ↗</span>
          </a>
        ) : null}
      </div>

      <p className="text-ink-subtle mt-[var(--space-4)] text-xs">
        Repository data as of <time dateTime={syncedAt}>{formatLongDate(syncedAt)}</time>.
        Fetched at build time, not on page load.
      </p>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-ink-subtle text-xs">{label}</dt>
      <dd className="tabular mt-[var(--space-1)] text-sm">{value}</dd>
    </div>
  );
}
