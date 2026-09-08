import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium text-accent">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 text-muted">
        That page does not exist, or it moved somewhere else.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast transition hover:opacity-90"
      >
        Back home
      </Link>
    </section>
  );
}
