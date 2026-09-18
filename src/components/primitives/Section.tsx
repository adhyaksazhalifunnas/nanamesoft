/**
 * Section — the shared vertical rhythm for a page-level block (PRD §11.5).
 *
 * Section gaps run --space-9 to --space-11. Large empty regions are a design
 * decision here, not an oversight: "deliberate emptiness" reads as confidence,
 * and the instinct to fill it is the instinct that produces generic layouts.
 *
 * Sections are separated by a hairline rule rather than a card border, per the
 * "hairline rules over boxes" principle.
 */
import type { ReactNode } from "react";

import { Container } from "./Container";
import { Reveal } from "@/components/motion/Reveal";

type SectionProps = {
  id: string;
  /** Small caps label above the heading. Never used for body copy. */
  eyebrow?: string;
  title: string;
  /** Optional one-line intro under the heading. */
  lede?: string;
  children: ReactNode;
  /** Set false on the first section after the hero, which needs no divider. */
  divider?: boolean;
  /**
   * Shortens the top padding. Used only on the section directly after the
   * hero, so that its first line is visible at the fold on desktop — AC-01.5
   * wants a peek of real content there, not just a divider.
   */
  compactTop?: boolean;
};

export function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
  divider = true,
  compactTop = false,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`${compactTop ? "pt-[var(--space-6)] pb-[var(--space-9)] lg:pb-[var(--space-10)]" : "py-[var(--space-9)] lg:py-[var(--space-10)]"} ${
        divider ? "border-rule border-t" : ""
      }`}
    >
      <Container>
        <Reveal>
          <header className="max-w-[var(--measure)]">
            {eyebrow ? (
              <p className="text-accent mb-[var(--space-3)] text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
                {eyebrow}
              </p>
            ) : null}
            <h2 id={`${id}-heading`} className="text-xl">
              {title}
            </h2>
            {lede ? (
              <p className="text-md text-ink-muted mt-[var(--space-4)]">{lede}</p>
            ) : null}
          </header>
        </Reveal>

        <div className="mt-[var(--space-7)] lg:mt-[var(--space-8)]">{children}</div>
      </Container>
    </section>
  );
}
