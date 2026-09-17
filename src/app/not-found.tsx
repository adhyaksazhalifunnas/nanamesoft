import Link from "next/link";

import { Container } from "@/components/primitives/Container";

export default function NotFound() {
  return (
    <Container as="div" className="py-[var(--space-10)]">
      <p className="text-accent text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
        404
      </p>
      <h1 className="mt-[var(--space-3)] text-2xl">That page does not exist</h1>
      <p className="text-md text-ink-muted mt-[var(--space-5)] max-w-[var(--measure)]">
        The link may be out of date, or the case study it pointed at may still be a draft.
      </p>
      <p className="mt-[var(--space-7)] flex flex-wrap gap-[var(--space-4)]">
        <Link
          href="/projects"
          className="bg-ink text-ground inline-flex min-h-11 items-center px-[var(--space-5)] text-sm font-medium transition-opacity duration-[var(--dur-fast)] hover:opacity-85"
        >
          See the case studies
        </Link>
        <Link
          href="/"
          className="border-rule hover:border-accent hover:text-accent inline-flex min-h-11 items-center border px-[var(--space-5)] text-sm font-medium transition-colors duration-[var(--dur-fast)]"
        >
          Back home
        </Link>
      </p>
    </Container>
  );
}
