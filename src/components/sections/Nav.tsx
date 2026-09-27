/**
 * Nav — sticky header (PRD §11.8, "predictable navigation").
 *
 * Server Component. Only the mobile disclosure, the theme toggle and the
 * language switcher are client code, and they are separate leaves so the rest
 * of the header costs nothing.
 *
 * The header is 1px-ruled rather than shadowed or blurred: §11.2 bans
 * glassmorphism outright, and a hairline reads as more considered anyway.
 */
import Link from "next/link";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileNav } from "@/components/sections/MobileNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Dictionary } from "@/i18n";
import { localePath, type Locale } from "@/i18n/config";
import type { SiteConfig } from "@/lib/schemas";

/** Route paths WITHOUT the locale prefix; the label comes from the dictionary. */
export const NAV_ITEMS = [
  { path: "/projects", key: "projects" },
  { path: "/experience", key: "experience" },
  { path: "/about", key: "about" },
  { path: "/contact", key: "contact" },
] as const;

type NavProps = {
  locale: Locale;
  dictionary: Dictionary;
  site: SiteConfig;
};

export function Nav({ locale, dictionary, site }: NavProps) {
  const links = NAV_ITEMS.map((item) => ({
    href: localePath(locale, item.path),
    label: dictionary.nav[item.key],
  }));

  return (
    <header className="border-rule bg-ground sticky top-0 z-50 border-b">
      <nav
        aria-label={dictionary.nav.primary}
        className="mx-auto flex h-[var(--space-8)] max-w-[var(--container-max)] items-center justify-between px-[var(--gutter)]"
      >
        <Link
          href={localePath(locale, "")}
          className="font-display inline-flex min-h-11 items-center text-base font-semibold tracking-[var(--tracking-display)]"
        >
          {site.brand}
        </Link>

        <div className="flex items-center gap-[var(--space-1)]">
          <ul className="hidden items-center gap-[var(--space-5)] md:flex">
            {links.map((link) => (
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

          <LanguageSwitcher
            label={dictionary.language.label}
            currentLabel={dictionary.language.current}
          />
          <ThemeToggle labels={dictionary.theme} />
          <MobileNav
            links={links}
            openLabel={dictionary.nav.openMenu}
            closeLabel={dictionary.nav.closeMenu}
          />
        </div>
      </nav>
    </header>
  );
}
