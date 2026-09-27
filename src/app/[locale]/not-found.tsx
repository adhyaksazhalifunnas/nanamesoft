/**
 * Not found, inside the locale segment so it keeps the reader's language.
 *
 * `notFound()` from a page renders this within the locale's layout, so the nav
 * and footer stay translated. Anything outside a known locale never reaches
 * here — `dynamicParams = false` makes those a plain 404.
 */
import Link from "next/link";

import { Container } from "@/components/primitives/Container";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, localePath } from "@/i18n/config";

export default function NotFound() {
  // A not-found boundary receives no route params, so there is no locale to
  // read. English is the honest fallback for a route that does not exist.
  const locale = DEFAULT_LOCALE;
  const dictionary = getDictionary(locale);

  return (
    <Container as="div" className="py-[var(--space-10)]">
      <p className="text-accent text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
        {dictionary.notFound.code}
      </p>
      <h1 className="mt-[var(--space-3)] text-2xl">{dictionary.notFound.title}</h1>
      <p className="text-md text-ink-muted mt-[var(--space-5)] max-w-[var(--measure)]">
        {dictionary.notFound.body}
      </p>
      <p className="mt-[var(--space-7)] flex flex-wrap gap-[var(--space-4)]">
        <Link
          href={localePath(locale, "/projects")}
          className="bg-ink text-ground inline-flex min-h-11 items-center px-[var(--space-5)] text-sm font-medium transition-opacity duration-[var(--dur-fast)] hover:opacity-85"
        >
          {dictionary.notFound.seeProjects}
        </Link>
        <Link
          href={localePath(locale, "")}
          className="border-rule hover:border-accent hover:text-accent inline-flex min-h-11 items-center border px-[var(--space-5)] text-sm font-medium transition-colors duration-[var(--dur-fast)]"
        >
          {dictionary.notFound.backHome}
        </Link>
      </p>
    </Container>
  );
}
