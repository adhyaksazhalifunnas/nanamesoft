/**
 * ArchitectureFigure — AC-04.3.
 *
 * Diagrams are authored as SVG files and served as images. No diagram renderer
 * is ever shipped to the client (§5.2) — Mermaid or similar would mean parsing
 * a graph language in the browser to draw a picture that was already known at
 * build time.
 *
 * The schema requires `alt` to be 20–500 characters, which is a deliberate
 * floor: "architecture diagram" is not a text alternative. The alt must convey
 * the relationships, because a screen-reader user has to be able to follow the
 * data flow from it alone.
 *
 * Full-bleed, which §11.5 permits at most twice per page. This is one of them.
 */
import Image from "next/image";

type ArchitectureFigureProps = {
  src: string;
  alt: string;
  caption?: string;
};

export function ArchitectureFigure({ src, alt, caption }: ArchitectureFigureProps) {
  return (
    <figure>
      <div className="border-rule bg-ground-raised border p-[var(--space-5)] sm:p-[var(--space-7)]">
        {/*
          Explicit dimensions are required everywhere for CLS (§5.2). SVG has no
          intrinsic size that next/image can read, so a generous nominal box
          plus `h-auto w-full` lets it scale while still reserving space.
        */}
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={900}
          className="h-auto w-full"
          // Diagrams sit well below the fold; the LCP element is always text.
          loading="lazy"
        />
      </div>
      {caption ? (
        <figcaption className="text-ink-subtle mt-[var(--space-3)] max-w-[var(--measure)] text-xs">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
