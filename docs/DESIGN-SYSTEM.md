# Design system

The source of truth is [`src/styles/tokens.css`](../src/styles/tokens.css).
This file explains the rules around it and records the decisions that deviate
from PRD §11.

---

## The one rule

**No hard-coded colour, size, or duration in a component. Ever.**

Every value comes from a token. `src/styles/globals.css` bridges the tokens
into Tailwind's `@theme`, so `text-ink-muted`, `border-rule` and
`duration-[var(--dur-fast)]` all resolve to the same custom properties the
hand-written CSS uses.

Adding a token requires a justification entry in this file. There are two.

---

## Cascade layers — the thing that will bite you

Tailwind v4 emits everything inside `@layer theme, base, components,
utilities`. In the CSS cascade, an **unlayered rule beats every layered rule**,
regardless of specificity.

So a bare `a { color: inherit }` in `globals.css` silently defeats
`.text-ground`, `.text-accent`, and every other colour utility across the whole
site. That is not hypothetical — it shipped, and the primary call to action
rendered ink-on-ink and was invisible.

**Every element-level rule goes in `@layer base`. Every reusable class goes in
`@layer components`.** Nothing in `globals.css` is unlayered except the
`@keyframes` and `@supports` blocks, which are not subject to the cascade in a
way that matters.

The one deliberate exception is the reduced-motion kill switch in
`tokens.css`, which uses `!important` and must beat everything.

---

## Colour

One near-neutral ground, one ink, one accent. That is the entire palette.

The accent is `oklch(48% 0.15 35)` — a terracotta/oxblood red, retuned to
`oklch(72% 0.13 35)` in dark. §11.2 rules out purple, cyan and neon, which are
the template signatures of 2023–2026.

### Contrast is verified, not assumed

```bash
pnpm check:contrast
```

§11.3 requires that "every foreground/background token pair is contrast-
verified in both themes before use", but gives no instrument. That script is
the instrument: it parses the real values out of `tokens.css`, converts oklch
to sRGB, and checks each pair against its WCAG 2.2 AA threshold.

It is in `pnpm check` and in CI, because a rule nobody can run is a rule
nobody follows.

---

## Deviations from PRD §11, and why

### `--ink-subtle` was darkened

|       | PRD §11.3                     | Here                            |
| ----- | ----------------------------- | ------------------------------- |
| Light | `oklch(62% 0.01 60)` → 3.40:1 | `oklch(52% 0.01 60)` → 5.14:1   |
| Dark  | `oklch(56% 0.01 70)` → 4.11:1 | `oklch(60.8% 0.01 70)` → 5.00:1 |

The published values fail AC-14.3 (4.5:1 for normal text) in **both** themes,
and `--ink-subtle` is used for text set _below_ normal size. §11.3 also
requires every pair to be contrast-verified, so the token block contradicts the
rule printed directly above it. The measurable requirement wins.

### The Tailwind spacing scale is not overridden

An earlier version mapped `--spacing-1` … `--spacing-11` to the `--space-*`
tokens inside `@theme`. That collides with Tailwind's numeric spacing scale:
`min-h-11` stopped meaning 2.75rem (the 44px touch target) and started meaning
`var(--space-11)` — 12rem. Buttons rendered 192px tall.

Use `var(--space-N)` in arbitrary values (`px-[var(--space-5)]`) for the
editorial rhythm, and leave Tailwind's numeric scale alone for the mechanical
sizes — touch targets, icon boxes.

### Two added tokens

| Token             | Why                                                                                                                                                         |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--container-max` | §11.5 specifies a 12-column editorial grid but no container width. Every page-level block needs the same one or the columns do not line up across sections. |
| `--gutter`        | Same reason, for the horizontal padding.                                                                                                                    |

---

## Typography

Serif display + sans text — §11.4 calls this "the strongest editorial move
available", and it is uncommon in developer portfolios.

| Slot    | Family             | Why                                                                            |
| ------- | ------------------ | ------------------------------------------------------------------------------ |
| Display | **Fraunces**       | Variable, with optical sizing and a `WONK` axis. Real character at hero sizes. |
| Text    | **Public Sans**    | Humanist, variable, designed for long-form reading at 17px.                    |
| Mono    | **JetBrains Mono** | Code only.                                                                     |

Inter, Poppins and Montserrat are banned by §11.2 as instant "default" tells.
The E2E suite asserts none of them is in use.

### Font hosting

D8 says "self-hosted, no Google Fonts CDN". We use `next/font/google`, which
downloads the files at **build** time and serves them from our own origin.
There is no CDN request at runtime and no render-blocking third-party round
trip, which is what D8 is protecting against. If you want the `.woff2` files
physically in the repository, switch to `next/font/local` — nothing else
changes.

---

## Motion

The kill switch is token-level (AC-14.10): `prefers-reduced-motion: reduce`
collapses every duration token to `0.01ms` in `tokens.css`. **No component
has a reduced-motion branch of its own.** If you find yourself writing one,
the token is not being used.

### Reveal fires once — and why it is not pure CSS

The scroll reveal was first built with `animation-timeline: view()` and zero
JavaScript. It was smaller, ran off the main thread, and was wrong:
`view()` is _position_-linked, not event-linked, so scrolling back up plays the
entrance **in reverse** and the content fades out again. §11.6 forbids exactly
that — "reveal animations do not re-trigger when the visitor scrolls back up.
Repetition is irritating" — and there is no CSS-only way to make a `view()`
timeline monotonic.

So `Reveal` is a thin Client Component using `IntersectionObserver` with
`once: true`, as §5.5 budgeted. The no-JavaScript path is preserved: the hidden
start state is scoped to `.js` on `<html>`, added by the inline bootstrap
script, so with scripting off nothing is ever hidden.

The reading-progress bar **does** stay pure CSS (`animation-timeline:
scroll()`), because a progress indicator should be bidirectional — that is
what makes it a progress indicator.

### The signature moment

§11.6 budgets exactly one. It is the skills timeline: the year axis draws
itself and each era bar follows in sequence, once, when the section first
enters view. It communicates real structure — the passage of time — which is
the test §11.6 sets.

Do not add a second one. Two compete; three is a template.

---

## Component rules

- **Server by default.** `"use client"` requires a comment naming the
  interaction that forces it. There are exactly three: `ThemeToggle`,
  `MobileNav`, `ContactForm`, plus `Reveal` and the `error.tsx` boundary.
- **Composition over configuration.** No boolean-prop explosions.
- **Content-agnostic.** No component may assume how many items it receives.
  Three projects and eleven must both look intentional.
- **No component library.** shadcn/ui, Material and Chakra all carry
  recognisable visual defaults, which is the whole problem §11.2 is about.

---

## Enforcement

| Rule                              | Enforced by                             |
| --------------------------------- | --------------------------------------- |
| §11.2 anti-pattern register       | `tests/e2e/anti-patterns.spec.ts`       |
| Contrast (AC-14.3)                | `pnpm check:contrast` + axe in E2E      |
| WCAG 2.2 AA (AC-14.11)            | axe-core, 9 routes × 8 breakpoints      |
| Touch targets (AC-11.2)           | `tests/e2e/responsive.spec.ts`          |
| Measure 45–75ch (AC-11.3)         | same, measured in characters not pixels |
| No horizontal overflow (AC-11.1)  | same, at all eight widths               |
| Client-boundary discipline (§5.5) | `pnpm check:bundle`                     |
| Secrets out of `src/` (§5.7)      | ESLint `no-restricted-syntax`           |
