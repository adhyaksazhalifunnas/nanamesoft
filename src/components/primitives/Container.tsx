/**
 * Container — the shared horizontal frame (PRD §11.5).
 *
 * Every page-level block goes through this so the editorial grid lines up
 * across sections. Extra viewport width past --container-max becomes margin,
 * never longer lines.
 */
import type { ElementType, ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  as?: ElementType;
  /**
   * `wide` is for the 12-column asymmetric compositions; `prose` caps at the
   * measure for anything that is read rather than scanned.
   */
  width?: "wide" | "prose";
  className?: string;
};

export function Container({
  children,
  as: Tag = "div",
  width = "wide",
  className = "",
}: ContainerProps) {
  const max =
    width === "prose" ? "max-w-[var(--measure)]" : "max-w-[var(--container-max)]";
  return (
    <Tag className={`mx-auto w-full px-[var(--gutter)] ${max} ${className}`}>
      {children}
    </Tag>
  );
}
