"use client"; // disclosure state + Escape-to-close; no server equivalent

/**
 * MobileNav — the small-screen disclosure.
 *
 * Deliberately a real <button> driving a real panel with aria-expanded and
 * aria-controls, not a div with a role (§11.7: "a <div role='button'> is a
 * bug"). Escape closes it, focus returns to the trigger, and the panel is
 * removed from the accessibility tree when closed via `hidden`.
 */
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

type MobileNavProps = {
  links: ReadonlyArray<{ href: string; label: string }>;
};

export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="text-ink-muted hover:text-ink inline-flex h-11 w-11 items-center justify-center transition-colors duration-[var(--dur-fast)]"
      >
        <span className="visually-hidden">{open ? "Close menu" : "Open menu"}</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <path d="M4 4l10 10M14 4L4 14" />
          ) : (
            <path d="M2.5 5h13M2.5 9h13M2.5 13h13" />
          )}
        </svg>
      </button>

      {/* `hidden` rather than a display class: it keeps the panel out of the
          accessibility tree and out of the tab order when closed. */}
      <div
        id={panelId}
        hidden={!open}
        className="border-rule bg-ground absolute inset-x-0 top-full border-b"
      >
        <ul className="px-[var(--gutter)] py-[var(--space-3)]">
          {links.map((link) => (
            <li key={link.href} className="border-rule border-t first:border-t-0">
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-ink-muted hover:text-ink flex min-h-11 items-center text-base transition-colors duration-[var(--dur-fast)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
