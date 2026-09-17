"use client"; // IntersectionObserver — §11.6 requires the reveal to fire once

/**
 * Reveal — scroll entrance, fired once per element.
 *
 * This was first built with pure CSS scroll-driven animations (no JavaScript
 * at all), which was smaller and ran off the main thread. It was wrong:
 * `animation-timeline: view()` is *position*-linked, not event-linked, so
 * scrolling back up plays the entrance in reverse and the content fades out
 * again. §11.6 forbids exactly that — "Reveal animations do not re-trigger
 * when the visitor scrolls back up. Repetition is irritating." — and there is
 * no CSS-only way to make a view() timeline monotonic. Hence §5.5's original
 * budget for a thin Client Component, which is what this is.
 *
 * The no-JavaScript path is preserved (AC-10.5). The hidden start state lives
 * behind `.js` on <html>, which the inline bootstrap script in layout.tsx
 * adds. With scripting off the class never appears, the start state never
 * applies, and every element renders at full opacity from first paint. The
 * same is true under `prefers-reduced-motion: reduce` (AC-14.10).
 *
 * Cost: one observer and ~1 KB, shared across every Reveal on the page.
 */
import { useEffect, useRef } from "react";

import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /**
   * Stagger index. Siblings pass 0, 1, 2… and each waits --stagger longer
   * than the last. Capped at 6 per §11.6 — longer chains feel slow.
   */
  index?: number;
  className?: string;
};

const MAX_STAGGER_STEPS = 5;

export function Reveal({ children, index = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Already revealed (fast navigation back to a visited page): do nothing.
    if (node.dataset.revealed !== undefined) return;

    // No observer support: show it rather than leave it hidden.
    if (typeof IntersectionObserver === "undefined") {
      node.dataset.revealed = "";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = "";
          // once: true — unobserve immediately so scrolling back up cannot
          // re-fire it, and so the observer stops doing work.
          observer.unobserve(entry.target);
        }
      },
      // Start the entrance slightly before the element reaches the fold, so it
      // is finished by the time the reader's eye arrives.
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const step = Math.min(index, MAX_STAGGER_STEPS);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={
        { "--reveal-delay": `calc(${step} * var(--stagger))` } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
