"use client"; // usePathname — the switcher must keep you on the same page

/**
 * LanguageSwitcher.
 *
 * Two decisions worth stating, because neither is the obvious one.
 *
 * 1. It is a native <details>/<summary> disclosure, not a div with click
 *    handlers. That makes it open, close and keyboard-operate with NO
 *    JavaScript, which keeps AC-15.6 true: with scripting off you can still
 *    change language. Screen readers get the disclosure semantics for free,
 *    so there is no ARIA to get wrong.
 *
 * 2. The options are real links to the SAME page in another locale, not
 *    buttons that navigate to the locale's home page. Dropping a reader back
 *    at the home page because they wanted to read the page they were already
 *    on is the single most irritating thing a language switcher does.
 *    `usePathname` is what makes that possible, and it is the only reason
 *    this is a Client Component. It resolves during server rendering too, so
 *    the hrefs are correct in the static HTML before any hydration.
 *
 * Each language is named in its own language (English / Bahasa Indonesia /
 * 日本語) — see the note in src/i18n/config.ts.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import {
  LOCALE_LABELS,
  LOCALE_SHORT,
  LOCALES,
  localePath,
  splitLocalePath,
} from "@/i18n/config";

type LanguageSwitcherProps = {
  /** Accessible name for the control, already translated. */
  label: string;
  /** Suffix announced on the language already active. */
  currentLabel: string;
};

export function LanguageSwitcher({ label, currentLabel }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const { locale: active, rest } = splitLocalePath(pathname);
  const ref = useRef<HTMLDetailsElement>(null);

  // Progressive enhancement only: <details> already opens and closes on its
  // own. This adds the two behaviours a native disclosure lacks — Escape to
  // dismiss, and closing when focus or a pointer leaves. Without JavaScript
  // the menu simply stays open until it is clicked again, which is fine.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    function close() {
      if (node && node.open) node.open = false;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || !node?.open) return;
      close();
      node.querySelector("summary")?.focus();
    }

    function onPointerDown(event: PointerEvent) {
      if (node && !node.contains(event.target as Node)) close();
    }

    function onFocusIn(event: FocusEvent) {
      if (node && !node.contains(event.target as Node)) close();
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, []);

  return (
    <details ref={ref} className="language-switcher relative">
      <summary
        className="text-ink-muted hover:text-ink flex min-h-11 cursor-pointer items-center gap-[var(--space-1)] px-[var(--space-2)] text-sm transition-colors duration-[var(--dur-fast)]"
        // The visible text is a short code, so the control needs its full name
        // for anyone who cannot see the layout around it.
        aria-label={`${label}: ${LOCALE_LABELS[active]}`}
      >
        <GlobeMark />
        <span aria-hidden="true">{LOCALE_SHORT[active]}</span>
      </summary>

      <div className="border-rule bg-ground absolute top-full right-0 z-50 mt-[var(--space-1)] min-w-48 border">
        <ul>
          {LOCALES.map((locale) => {
            const isActive = locale === active;
            return (
              <li key={locale} className="border-rule border-t first:border-t-0">
                <Link
                  href={localePath(locale, rest)}
                  hrefLang={locale}
                  // `page` is the correct token: this link points at the
                  // current page, in a different language.
                  aria-current={isActive ? "page" : undefined}
                  className={`hover:text-accent flex min-h-11 items-center justify-between gap-[var(--space-4)] px-[var(--space-4)] text-sm transition-colors duration-[var(--dur-fast)] ${
                    isActive ? "text-accent" : "text-ink-muted"
                  }`}
                >
                  <span lang={locale}>{LOCALE_LABELS[locale]}</span>
                  {isActive ? (
                    <>
                      <span className="visually-hidden">{currentLabel}</span>
                      <span aria-hidden="true">·</span>
                    </>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </details>
  );
}

/** Hand-drawn, to match the theme toggle — §11.2 rules out icon-set furniture. */
function GlobeMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="6.6" />
      <path d="M2.4 9h13.2" />
      <path d="M9 2.4c1.7 1.8 2.6 4.1 2.6 6.6S10.7 13.8 9 15.6C7.3 13.8 6.4 11.5 6.4 9S7.3 4.2 9 2.4z" />
    </svg>
  );
}
