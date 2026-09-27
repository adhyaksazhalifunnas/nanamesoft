"use client"; // Next.js requires error boundaries to be Client Components

import { useEffect } from "react";
import { useParams } from "next/navigation";

import { Container } from "@/components/primitives/Container";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import { ERROR_STRINGS } from "@/i18n/error-strings";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // An error boundary gets no props from the route, but the dynamic segment is
  // still readable — so a reader who broke a Japanese page gets a Japanese
  // apology rather than being dropped into English at the worst moment.
  const params = useParams<{ locale?: string }>();
  const locale =
    typeof params?.locale === "string" && isLocale(params.locale)
      ? params.locale
      : DEFAULT_LOCALE;
  const strings = ERROR_STRINGS[locale];

  useEffect(() => {
    // The digest is the only safe handle on a server error in production; the
    // message itself is redacted by Next and must not be shown to a visitor.
    console.error("Route error:", error.digest ?? error.message);
  }, [error]);

  return (
    <Container as="div" className="py-[var(--space-10)]">
      <p className="text-accent text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
        {strings.code}
      </p>
      <h1 className="mt-[var(--space-3)] text-2xl">{strings.title}</h1>
      <p className="text-md text-ink-muted mt-[var(--space-5)] max-w-[var(--measure)]">
        {strings.body}
      </p>
      <p className="mt-[var(--space-7)]">
        <button
          type="button"
          onClick={reset}
          className="bg-ink text-ground inline-flex min-h-11 items-center px-[var(--space-5)] text-sm font-medium transition-opacity duration-[var(--dur-fast)] hover:opacity-85"
        >
          {strings.tryAgain}
        </button>
      </p>
    </Container>
  );
}
