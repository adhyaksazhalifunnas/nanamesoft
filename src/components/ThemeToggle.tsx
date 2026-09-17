"use client"; // needs localStorage and a click handler — no server equivalent

/**
 * ThemeToggle — cycles light / dark / system.
 *
 * "System" is a real third state, not a default: a visitor who has never
 * chosen stays on `prefers-color-scheme`, and one who has chosen can get back
 * to it. Only an explicit choice is stored, which is what makes the inline
 * bootstrap script in layout.tsx a no-op for most visitors.
 *
 * The current theme is read with `useSyncExternalStore` rather than copied
 * into state inside an effect. The theme lives in the DOM (`data-theme` on
 * <html>, set before first paint) and in localStorage — both external stores —
 * so this is the pattern React actually provides for the job. It also gives a
 * correct server snapshot for free, so there is no hydration mismatch and no
 * `mounted` flag.
 */
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark" | "system";

const ORDER: Theme[] = ["system", "light", "dark"];

const LABELS: Record<Theme, string> = {
  system: "Match system theme",
  light: "Light theme",
  dark: "Dark theme",
};

/** Subscribers are notified by the toggle itself; nothing else changes it. */
const listeners = new Set<() => void>();

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function getSnapshot(): Theme {
  const attr = document.documentElement.dataset.theme;
  return attr === "light" || attr === "dark" ? attr : "system";
}

/** On the server nothing is stored yet, so "system" is the honest answer. */
function getServerSnapshot(): Theme {
  return "system";
}

function apply(theme: Theme): void {
  try {
    if (theme === "system") {
      delete document.documentElement.dataset.theme;
      localStorage.removeItem("theme");
    } else {
      document.documentElement.dataset.theme = theme;
      localStorage.setItem("theme", theme);
    }
  } catch {
    // Private mode or blocked storage: the DOM change above still applied, so
    // the toggle works for this page view and simply is not remembered.
  }
  for (const listener of listeners) listener();
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function cycle() {
    apply(ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length] ?? "system");
  }

  return (
    <button
      type="button"
      onClick={cycle}
      // Announce the CURRENT state, not the action: a screen-reader user needs
      // to know what the theme is. The change is announced by the label update.
      aria-label={LABELS[theme]}
      title={LABELS[theme]}
      className="text-ink-muted hover:text-ink inline-flex h-11 w-11 items-center justify-center transition-colors duration-[var(--dur-fast)]"
    >
      <ThemeIcon theme={theme} />
    </button>
  );
}

/** Hand-drawn marks rather than an icon set — §11.2 bans logo/emoji furniture. */
function ThemeIcon({ theme }: { theme: Theme }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.25,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (theme === "light") {
    return (
      <svg {...common}>
        <circle cx="9" cy="9" r="3.4" />
        <path d="M9 1.4v1.8M9 14.8v1.8M16.6 9h-1.8M3.2 9H1.4M14.4 3.6l-1.3 1.3M4.9 13.1l-1.3 1.3M14.4 14.4l-1.3-1.3M4.9 4.9L3.6 3.6" />
      </svg>
    );
  }

  if (theme === "dark") {
    return (
      <svg {...common}>
        <path d="M15 10.4A6.4 6.4 0 1 1 7.6 3a5 5 0 0 0 7.4 7.4z" />
      </svg>
    );
  }

  // System: a circle filled on one half.
  return (
    <svg {...common}>
      <circle cx="9" cy="9" r="6.4" />
      <path d="M9 2.6v12.8" />
      <path d="M9 2.6a6.4 6.4 0 0 1 0 12.8z" fill="currentColor" stroke="none" />
    </svg>
  );
}
