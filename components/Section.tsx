/** Shared shell for every homepage section: consistent width, padding and heading. */
export default function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-border/70 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <p className="text-sm font-medium tracking-wide text-accent uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
