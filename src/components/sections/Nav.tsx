/**
 * Nav — sticky header (PRD §11.8, "predictable navigation").
 *
 * Server Component. Only the mobile disclosure and the theme toggle are client
 * code, and they are separate leaves so the rest of the header costs nothing.
 *
 * The header is 1px-ruled rather than shadowed or blurred: §11.2 bans
 * glassmorphism outright, and a hairline reads as more considered anyway.
 */
import Link from "next/link";

import { MobileNav } from "@/components/sections/MobileNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getSiteConfig } from "@/lib/content";

export const NAV_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const site = getSiteConfig();

  return (
    <header className="border-rule bg-ground sticky top-0 z-50 border-b">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[var(--space-8)] max-w-[var(--container-max)] items-center justify-between px-[var(--gutter)]"
      >
        <Link
          href="/"
          className="font-display inline-flex min-h-11 items-center text-base font-semibold tracking-[var(--tracking-display)]"
        >
          {site.brand}
        </Link>

        <div className="flex items-center gap-[var(--space-1)]">
          <ul className="hidden items-center gap-[var(--space-5)] md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-ink-muted hover:text-ink text-sm transition-colors duration-[var(--dur-fast)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <ThemeToggle />
          <MobileNav links={NAV_LINKS} />
        </div>
      </nav>
    </header>
  );
}
