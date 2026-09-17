# Portfolio

A developer portfolio that argues rather than files. It takes four to six
repositories and rebuilds each one as a technical case study — the constraint,
what was tried first, the decision and its trade-off, and how it was proved —
with live GitHub data rendered next to the claims it backs.

Built to the specification in [`docs/prd/PRD-github-portfolio-1.0.md`](docs/prd/PRD-github-portfolio-1.0.md).

---

## Quick start

```bash
pnpm install
pnpm dev
```

Nothing needs configuring. Every environment variable is optional.

---

## The idea

A GitHub profile stores evidence and presents no reasoning. A recruiter sees a
language bar and a README that starts with `npm install`; nothing there answers
the only question they have, which is whether this person can be trusted with
their problems.

So the structured data is the spine of the site. Each case study's frontmatter
carries its decisions, metrics and limitations as **typed fields**, not prose,
and a Zod schema refuses to build without them:

- at least **two decisions**, each naming a rejected alternative and the
  trade-off accepted
- every metric carries its **measurement method** — a number without one is a
  claim without evidence
- a **limitations** section, because its absence is a credibility problem

"I forgot the Outcome section" is a red build, not a silent quality regression
that ships.

---

## Adding a project

```bash
pnpm new:project inventory-sync "Inventory Sync"
```

Write one MDX file. The route, the index entry, the landing card, the sitemap
entry and the Open Graph image all generate themselves. No component, route or
layout file is edited.

Full process: [`docs/ADDING-A-PROJECT.md`](docs/ADDING-A-PROJECT.md).

---

## Commands

| Command               | What it does                                                            |
| --------------------- | ----------------------------------------------------------------------- |
| `pnpm dev`            | Dev server on :3000                                                     |
| `pnpm build`          | Validate content, then build                                            |
| `pnpm check`          | Typecheck → lint → validate → contrast → unit tests → build → JS budget |
| `pnpm validate`       | Schema, cross-file references, and the §12.6 editorial rules            |
| `pnpm check:contrast` | Every token pair against WCAG 2.2 AA, both themes                       |
| `pnpm check:bundle`   | JavaScript budget, split into framework floor and route delta           |
| `pnpm sync:github`    | Pull repository data into the committed cache                           |
| `pnpm new:project`    | Scaffold a case study from the template                                 |
| `pnpm test`           | Unit tests                                                              |
| `pnpm test:e2e`       | Playwright: axe, anti-patterns, responsive, no-JS                       |

---

## Structure

```
content/            ◀── the only place you edit to add content
  projects/*.mdx      case studies: frontmatter + Context and Implementation
  site.ts             identity, links, SEO defaults
  experience.ts       roles, typed
  skills.ts           skills with levels and acquisition years
  education.ts        CS background and course takeaways
data/
  github-cache.json   generated AND COMMITTED — builds work offline
scripts/
  validate-content.ts the build gate
  sync-github.ts      GraphQL + REST → cache
  check-contrast.ts   §11.3, made runnable
  check-bundle.ts     §5.8 budget enforcement
  new-project.ts      scaffolder
src/
  app/                routes; one runtime function (/api/contact)
  components/         primitives, sections, project blocks, motion
  lib/                schemas, loaders, github cache reader, SEO
  styles/tokens.css   the design system's single source of truth
tests/
  unit/               Vitest
  e2e/                Playwright: a11y, anti-patterns, responsive
docs/                 ADDING-A-PROJECT, DESIGN-SYSTEM, DEPLOYMENT
```

---

## What is enforced, and where

The PRD's rules are not review notes here. They run.

| Rule                                                                                                                              | Enforced by                        |
| --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Five narrative beats, ≥2 decisions, limitations present                                                                           | Zod, build-blocking                |
| Every metric has a method                                                                                                         | Zod, build-blocking                |
| Proficient/deep skills cite a project                                                                                             | Zod, build-blocking                |
| Cross-file slug references resolve                                                                                                | `validate-content.ts`              |
| §12.6 banned phrases, duty-framed bullets                                                                                         | `validate-content.ts` (warning)    |
| §11.2 anti-pattern register — no gradient hero, no glassmorphism, no skill percentages, no banned typeface, no full-viewport hero | Playwright                         |
| WCAG 2.2 AA, 9 routes × 8 breakpoints                                                                                             | axe-core                           |
| Contrast of every token pair, both themes                                                                                         | `check-contrast.ts`                |
| No horizontal overflow at 320–1920px                                                                                              | Playwright                         |
| Touch targets ≥44px                                                                                                               | Playwright                         |
| Prose stays within 75 characters                                                                                                  | Playwright, measured in `ch`       |
| Site usable with JavaScript disabled                                                                                              | Playwright                         |
| Secrets never read under `src/`                                                                                                   | ESLint                             |
| JavaScript budget                                                                                                                 | `check-bundle.ts`, fails the build |

---

## Stack

Next.js 16 (App Router, RSC) · React 19 · TypeScript strict · Tailwind CSS v4 ·
Zod 4 · MDX · Shiki · Vitest · Playwright + axe-core · pnpm

Server Components by default. `"use client"` appears four times and each one
carries a comment naming the interaction that forces it.

---

## Two documented deviations from the PRD

Both are recorded in full where they live, not buried here.

**`--ink-subtle` was darkened.** The value published in §11.3 measures 3.40:1
in light and 4.11:1 in dark, failing AC-14.3's 4.5:1 for normal text — and it
is used for text set _below_ normal size. §11.3 also requires every pair to be
contrast-verified, so the token block contradicts the rule above it. See
[`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md).

**The JavaScript budget is measured differently.** §5.8 budgets 90 KB gzipped
on the landing route. The React 19 + Next 16 App Router runtime is 137.5 KB
before a line of this project's code runs — it loads on `/about`, which has no
Client Components at all. D1 mandates Next 16; §5.8 budgets below what Next 16
costs to boot, and the two cannot both hold. `check-bundle.ts` therefore pins
the framework floor and budgets the route-specific delta, which is the part
anyone here controls. Current deltas: 0 KB on the landing page, 2.5 KB on
`/contact`, 5.5 KB on a case study. Rationale is in the script's header.

---

## Status

The system is complete and every gate above passes. The content is not:
case studies are scaffolded as drafts with real repository metadata and
`TODO` markers where the narrative goes. `pnpm validate` lists exactly what
is outstanding, and launch gate G1 (≥4 published case studies) is reported on
every run.
