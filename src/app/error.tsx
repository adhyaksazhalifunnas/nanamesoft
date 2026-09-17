"use client"; // Next.js requires error boundaries to be Client Components

import { useEffect } from "react";

import { Container } from "@/components/primitives/Container";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The digest is the only safe handle on a server error in production; the
    // message itself is redacted by Next and must not be shown to a visitor.
    console.error("Route error:", error.digest ?? error.message);
  }, [error]);

  return (
    <Container as="div" className="py-[var(--space-10)]">
      <p className="text-accent text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
        Error
      </p>
      <h1 className="mt-[var(--space-3)] text-2xl">Something broke on this page</h1>
      <p className="text-md text-ink-muted mt-[var(--space-5)] max-w-[var(--measure)]">
        This is my bug, not yours. Reloading usually fixes it.
      </p>
      <p className="mt-[var(--space-7)]">
        <button
          type="button"
          onClick={reset}
          className="bg-ink text-ground inline-flex min-h-11 items-center px-[var(--space-5)] text-sm font-medium transition-opacity duration-[var(--dur-fast)] hover:opacity-85"
        >
          Try again
        </button>
      </p>
    </Container>
  );
}
