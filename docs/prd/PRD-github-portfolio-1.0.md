# Product Requirements Document
## AI-Assisted Interactive GitHub-Based Developer Portfolio

| Field | Value |
|---|---|
| **Document version** | 1.0 |
| **Date** | 7 September 2026 |
| **Status** | Approved for build |
| **Owner** | `[YOUR_NAME]` — solo developer, designer, and product owner |
| **Codename** | `portfolio-v1` |
| **Target launch** | MVP live within 9 weeks of kickoff (9 one-week sprints, S0–S8) |
| **Primary audience of this doc** | The solo developer building it |

**Placeholder convention:** tokens written as `[LIKE_THIS]` are values you fill in before or during Sprint 0. They are collected in one place in Appendix A so you can find-and-replace them in a single pass.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Solution Overview](#3-solution-overview)
4. [User Personas](#4-user-personas)
5. [Technical Architecture](#5-technical-architecture)
6. [Functional Requirements](#6-functional-requirements)
7. [API Specifications](#7-api-specifications)
8. [Data Models](#8-data-models)
9. [Implementation Plan](#9-implementation-plan)
10. [Success Metrics](#10-success-metrics)
11. [Design System Requirements](#11-design-system-requirements)
12. [Content Strategy](#12-content-strategy)
13. [Future Roadmap](#13-future-roadmap)
14. [Appendices](#14-appendices)

---

# 1. Executive Summary

## 1.1 Vision

A developer's GitHub profile is a filing cabinet, not an argument. It stores evidence of work but presents none of the reasoning: why the problem was worth solving, which approaches were rejected, what broke in production, what the numbers looked like afterward. A recruiter opening a repository sees a language bar, a commit count, and a README that usually begins with installation instructions. Nothing in that view answers the only question they actually have, which is *can this person be trusted with our problems.*

This portfolio closes that gap. It takes a small, deliberately curated set of repositories — four to six, not forty — and rebuilds each one as a technical case study written the way a senior engineer would explain the project to a peer at a whiteboard: here was the constraint, here is what I tried first and why it failed, here is the decision I made and the trade-off I accepted, here is how I proved it worked. The GitHub API supplies the live substrate underneath that narrative — languages, commit cadence, repository age, stars, contributor counts, real file trees — so every claim in the prose sits next to verifiable evidence in the same viewport. The story is the product; the repository is the receipt.

The second half of the vision is aesthetic, and it is not decoration. In 2026 the majority of new developer portfolios are recognizably machine-generated: the same violet-to-cyan gradient hero, the same glassmorphic cards on a dark grid background, the same three-column icon row of technology logos, the same `Inter` at three weights. A hiring manager who has seen forty of these in a week reads the forty-first as noise, and — fairly or not — reads its author as someone who accepted a default. Deliberate, editorial, human-crafted design is therefore a *credibility* requirement rather than a taste preference. The typographic system, the asymmetric layouts, the restraint in motion, and the willingness to leave large areas of the page empty all serve one function: signalling that a person with judgment made decisions here, which is precisely the claim the case studies are making in prose.

## 1.2 Value Proposition

> **For** recruiters and engineering hiring managers evaluating `[YOUR_NAME]`,
> **who** need to assess real engineering capability in minutes and cannot get it from a résumé bullet or a raw GitHub profile,
> **this portfolio** is a curated technical narrative
> **that** converts a handful of real repositories into decision-level case studies backed by live repository data,
> **unlike** template portfolios that show screenshots and technology logos,
> **because** it makes the engineering reasoning — not the output artifact — the thing on display.

## 1.3 Key Objectives

| # | Objective | Specific metric | Target | How measured |
|---|---|---|---|---|
| O1 | Establish technical credibility fast | Time for a first-time visitor to reach a state where they can name the developer's stack, level, and one concrete project | ≤ 60 s | Moderated test with 5 recruiters, stopwatch + recall questionnaire |
| O2 | Communicate engineering depth | % of case studies containing all five narrative beats (Context, Constraint, Decision, Implementation, Outcome) | 100% | Editorial checklist in PR template |
| O3 | Make expansion cheap | Developer effort to publish a new project case study | ≤ 90 min, ≤ 1 new file + 1 config line, 0 component changes | Timed on the first post-launch addition |
| O4 | Perform excellently | Core Web Vitals at p75 on mobile | LCP ≤ 2.0 s, INP ≤ 150 ms, CLS ≤ 0.05 | Real-user monitoring via Vercel Speed Insights |
| O5 | Be accessible to everyone | WCAG 2.2 Level AA conformance | 0 automated violations, manual keyboard + screen-reader pass | axe-core in CI + manual audit |
| O6 | Avoid the generic-AI look | Blind design test: "does this look AI-generated?" | ≤ 1 of 8 reviewers says yes | Survey against a control set of 5 template portfolios |
| O7 | Convert interest into contact | Contact-intent rate (email click, résumé download, or form submit) among sessions > 60 s | ≥ 8% | Privacy-friendly analytics events |
| O8 | Rank for the developer's name | Position for `"[YOUR_NAME]" developer` and `[YOUR_NAME] portfolio` | Page 1, position 1–3 | Google Search Console, 90 days post-launch |

## 1.4 Expected Impact

**Primary impact.** A measurable increase in the quality of inbound conversations. The success signal is not traffic; it is a hiring manager opening a first call with *"I read your write-up on the caching layer in `[PROJECT_1]` — walk me through the invalidation strategy."* That sentence means the portfolio did the screening work in advance, and the interview starts at design-discussion depth instead of at "so tell me about yourself."

**Secondary impact.** The portfolio doubles as a forcing function for the developer's own practice. Committing to publish a decision-level write-up for every significant project changes how projects get built: architecture decisions get recorded while they are fresh, benchmarks get run because a number is needed for the Outcome section, and README quality rises because the README becomes source material. The content pipeline improves the engineering, not just the marketing.

**Tertiary impact.** A reusable, well-documented Next.js + MDX content system that the developer fully understands and can lift into future work — a client site, a technical blog, a documentation portal.

## 1.5 Success Criteria (launch gate)

The MVP ships only when all of the following are true. This is the definition of done for Phase 4.

| ID | Gate | Threshold |
|---|---|---|
| G1 | Case studies published | ≥ 4 complete, each with all five narrative beats |
| G2 | Lighthouse (mobile, throttled) | Performance ≥ 95, Accessibility 100, Best Practices ≥ 95, SEO 100 |
| G3 | Automated accessibility | 0 axe-core violations at any breakpoint |
| G4 | Keyboard-only traversal | Every interactive element reachable and operable; visible focus everywhere |
| G5 | `prefers-reduced-motion` | Site fully usable and coherent with all non-essential motion disabled |
| G6 | Responsive integrity | No horizontal scroll or overlap at 320 / 375 / 768 / 1024 / 1440 / 1920 px |
| G7 | Cold-start resilience | Full build succeeds with the GitHub API unreachable, using the committed cache |
| G8 | Metadata | Unique title, description, canonical URL, and OG image per route |
| G9 | Contact path | At least two working, spam-resistant contact routes verified end-to-end |
| G10 | External review | 3 peer engineers and 1 recruiter have reviewed and their blocking notes are resolved |

---

# 2. Problem Statement

## 2.1 Current Market Situation

**The screening funnel is brutally short.** Long-standing recruiter eye-tracking research (The Ladders' widely cited 2012 and 2018 studies) put initial résumé review at roughly 6–7.4 seconds. Portfolio links get more than that, but not much: the realistic budget for a portfolio landing view before a recruiter decides whether to keep scrolling is on the order of 10–30 seconds. Everything that matters must be legible above the fold or immediately below it.

**Volume has collapsed the value of the default.** Since generative tooling became standard for side projects, the marginal cost of producing a polished-looking portfolio has fallen to roughly zero. The predictable result is that polish no longer differentiates. When every candidate has a dark-mode site with a gradient hero, animated technology-logo marquee, and glassmorphic project cards, that aesthetic stops being a signal of effort and starts being a signal of its absence. The differentiator has migrated from *visual quality* to *evidence of judgment*.

**GitHub is evidence, not argument.** A repository page is optimized for people who already want to use or contribute to the code. Its information hierarchy — file tree first, README second, language bar in the sidebar — is exactly wrong for evaluation. It answers "how do I run this?" when the evaluator is asking "what did you decide, and why?" Commit graphs are the only narrative element, and they measure activity rather than thought.

**Portfolios rot.** The common failure mode is not a bad portfolio; it is a stale one. A portfolio built as bespoke, hand-tuned markup for each project makes every addition a small refactor. The developer's velocity on it drops toward zero within a year, and the site quietly becomes a liability that advertises 2024's skills in 2026.

## 2.2 User Pain Points — Real Scenarios

**Scenario A — The recruiter with 40 tabs.**
Priya screens for a mid-level backend role. She has 40 candidate links and 90 minutes, which is about 2 minutes each. She opens a portfolio and sees a full-viewport hero: a name, the phrase "Full-Stack Developer & Problem Solver," and a scroll indicator. She scrolls. Six technology logos animate in. She scrolls again. Three cards labelled "E-Commerce Platform," "Task Manager," and "Weather App," each with a screenshot and a "View on GitHub" button. She has now spent 45 seconds and learned nothing that separates this candidate from the previous eleven. She closes the tab.
> *"I'm not trying to be unfair. But if I can't tell within a minute what makes you different, I have thirty-nine other people to look at."*

**Scenario B — The hiring manager who wants to dig.**
Marcus needs to know whether a candidate can own a service. He clicks through to the most promising repository. The README opens with a logo, badges, `npm install`, and a feature bullet list. He scans for an architecture section and finds none. He opens `/src` and starts reading code — which is the right signal but the wrong use of his time; he has fifteen minutes and he is now doing archaeology. He gives up and writes "unclear — screen by phone" in the tracker, which converts a possible fast-track into another two weeks of process.
> *"Show me one hard decision you made and one thing you'd do differently. That tells me more than the whole repo."*

**Scenario C — The developer who stopped updating.**
The developer ships something genuinely good in month seven. Adding it to the portfolio means hand-writing a new section, matching the visual treatment of the existing three, sourcing a screenshot, wiring the route, and fixing whatever broke in the layout. It is a four-hour job for a fifteen-minute win. It gets deferred. Six months later the portfolio's newest project is a year old, and the developer has started apologising for it in cover letters.
> *"The site is technically live. I just don't want anyone to look at it."*

## 2.3 Opportunity Size and Cost of Inaction

**Opportunity.** The portfolio does not need traffic; it needs leverage on a small number of high-value decisions. A single senior-level offer differing by even a modest band, or one screening round skipped, dwarfs the build cost. The realistic mechanism is:

| Lever | Mechanism | Plausible effect |
|---|---|---|
| Screen-pass rate | Recruiter can articulate the candidate's value in one sentence after 60 s | Higher pass rate at the top of funnel |
| Interview starting depth | Hiring manager arrives having read a decision narrative | Conversation opens at design level, not background level |
| Round compression | Written technical depth substitutes for one screening round | Shorter time-to-offer |
| Negotiating position | Concrete, verifiable engineering evidence supports level placement | Better banding |

**Cost of inaction.** A generic portfolio is not neutral — it is mildly negative. It occupies the credibility slot in an application without filling it, and it costs the developer the option value of every conversation that would have gone deeper. The stale-portfolio failure mode is worse: it actively misrepresents the candidate's current level downward.

**Cost of the wrong build.** A bespoke, per-project hand-built site costs roughly 60–100 hours up front and then imposes a recurring 3–5 hour tax per project addition, which is exactly the tax that causes abandonment. The architecture in §5 is designed to move that recurring cost to under 90 minutes, which is the single most important non-visual requirement in this document.

---

# 3. Solution Overview

## 3.1 How the Solution Works

The system has four layers. Content is authored as files, enriched at build time with live GitHub data, rendered to static HTML, and served from the edge.

```
┌──────────────────────────────────────────────────────────────────────┐
│  1. AUTHORING LAYER  (what the developer touches)                    │
│     content/projects/*.mdx      — case studies, frontmatter + prose  │
│     content/experience.ts       — roles, typed                       │
│     content/skills.ts           — skills + acquisition timeline      │
│     content/education.ts        — CS background, coursework          │
│     content/site.ts             — identity, links, SEO defaults      │
└───────────────────────────┬──────────────────────────────────────────┘
                            │ Zod-validated at build; build FAILS on invalid content
                            ▼
┌──────────────────────────────────────────────────────────────────────┐
│  2. ENRICHMENT LAYER  (build-time only, never at runtime)            │
│     scripts/sync-github.ts                                           │
│       ├─ GitHub GraphQL v4  → one batched query for all repos        │
│       ├─ GitHub REST v3     → README, languages, latest release      │
│       ├─ writes  data/github-cache.json  (COMMITTED to the repo)     │
│       └─ on any failure → reuse committed cache, warn, exit 0        │
└───────────────────────────┬──────────────────────────────────────────┘
                            ▼
┌──────────────────────────────────────────────────────────────────────┐
│  3. RENDER LAYER  (Next.js 16, App Router, React Server Components)  │
│     Static generation of every route at build time                   │
│     Server Components do all data work — zero data-fetching JS ships │
│     Client Components only where interaction demands it              │
│     Satori/Next OG → per-project Open Graph images                   │
└───────────────────────────┬──────────────────────────────────────────┘
                            ▼
┌──────────────────────────────────────────────────────────────────────┐
│  4. DELIVERY LAYER                                                   │
│     Static output → CDN edge                                         │
│     Two serverless functions only: /api/contact, /api/revalidate     │
│     Portable to a VPS (Caddy + static dir + tiny Node service)       │
└──────────────────────────────────────────────────────────────────────┘
```

### The content-to-page pipeline, concretely

1. The developer writes `content/projects/inventory-sync.mdx`. Its frontmatter names the repository (`repo: "[GITHUB_USERNAME]/inventory-sync"`), the five narrative beats, and any metrics worth surfacing.
2. `pnpm sync:github` runs. It issues one GraphQL query covering every repository referenced by any MDX file, plus REST calls for READMEs and language breakdowns, and writes `data/github-cache.json`.
3. `pnpm build` runs. Zod parses every content file; a missing `outcome` beat or an unparseable date fails the build loudly rather than shipping a half-written case study.
4. Next.js statically generates `/`, `/projects`, `/projects/[slug]` (one per MDX file), `/about`, `/experience`, and `/contact`, plus an OG image per route.
5. The output deploys. Adding project number seven is: write one MDX file, run sync, push. No component is edited, no route is registered, no layout is adjusted.

### Why build-time rather than runtime

| Concern | Runtime API calls | Build-time cache (chosen) |
|---|---|---|
| Rate limits | 60/hr unauthenticated; a crawler storm exhausts it | Irrelevant — a handful of calls per deploy |
| Token exposure | A token must live in the runtime environment | Token exists only in CI |
| Latency | Every visitor pays GitHub's response time | Zero; data is baked into HTML |
| Failure mode | GitHub outage degrades the live site | GitHub outage degrades only the freshness of the next build |
| Cost | Serverless invocations per visit | Zero |
| Freshness | Real-time | Stale by at most 24 h (nightly rebuild) — irrelevant for star counts |

The freshness trade is trivially acceptable: nobody's hiring decision turns on whether a star count is eleven or twelve.

## 3.2 Technical Approach and Key Decisions

| ID | Decision | Choice | Rationale | Rejected alternative |
|---|---|---|---|---|
| D1 | Framework | **Next.js 16 (App Router)** | Best-in-class static generation + SEO, RSC keeps JS small, largest ecosystem for a solo maintainer, and it is itself a hiring signal | Astro (fewer islands friction but harder shared motion state); SvelteKit (smaller ecosystem) |
| D2 | Rendering strategy | **Full SSG**, no ISR at launch | Content changes on the developer's schedule, not the world's | SSR (unnecessary cost and failure surface) |
| D3 | GitHub data | **Build-time fetch + committed JSON cache** | Deterministic builds, no runtime token, offline-capable builds | Runtime API routes (rate limits, token, latency) |
| D4 | Content store | **MDX + typed content collections, in-repo** | Version-controlled with code, zero vendor, type-safe, PR-reviewable | Headless CMS (vendor lock, free-tier ceiling, extra build dep) |
| D5 | Validation | **Zod schemas, build-blocking** | Turns "I forgot the Outcome section" from a silent quality regression into a red build | Runtime guards (too late) |
| D6 | Styling | **Tailwind CSS v4 + CSS custom properties for design tokens** | Fast iteration, no runtime CSS-in-JS cost, tokens stay portable | Vanilla CSS modules (slower iteration solo); styled-components (runtime cost) |
| D7 | Animation | **Motion for React** + native CSS scroll-driven animations where supported | Motion covers orchestration and gestures; CSS scroll-driven animations run off the main thread and cost nothing | GSAP + ScrollTrigger (heavier, licensing considerations, overkill here) |
| D8 | Typography | **Two self-hosted variable families, no Google Fonts CDN** | Removes a third-party origin, kills a render-blocking round trip, and is the single strongest anti-generic lever | Inter + a display font from a CDN (the default look, plus a network dependency) |
| D9 | Hosting (launch) | **Vercel free tier**, custom domain ready | Zero-config for Next.js, edge CDN, preview deploys, Speed Insights | Self-hosted VPS at launch (premature ops burden) |
| D10 | Hosting (later) | **Migration path to VPS pre-designed** | Constrain to portable primitives from day one so migration is a weekend, not a rewrite | Vercel-only features (Middleware-heavy patterns, Edge Config) |
| D11 | Analytics | **Privacy-first, cookieless** (Plausible or Umami) | No consent banner, no PII, tiny script, still measures the KPIs in §10 | Google Analytics (banner, weight, overkill) |
| D12 | Contact | **Serverless route + provider send + honeypot & rate limit**, plus visible `mailto:` | Form for convenience, direct address for trust; recruiters often prefer the latter | Form-only (some recruiters won't use it); mailto-only (higher friction) |
| D13 | Testing | **Vitest (unit) + Playwright (E2E, visual, a11y) + axe-core in CI** | Catches the failure modes that actually matter for a static site: broken content, layout regression, a11y drift | Heavy unit-test coverage of presentational components (low value) |
| D14 | Package manager | **pnpm** | Fast, disk-efficient, strict dependency resolution | npm (slower, looser) |

### The Next.js version note

Next.js 16 is the current LTS line (released October 2025); Next.js 15's support window ends 21 October 2026. Build on **16**. The App Router architecture you selected is identical between the two, so this is a version bump rather than an architectural change — but starting on 15 would mean a forced upgrade within weeks of launch.

## 3.3 Core Differentiators

| Differentiator | What competitors do | What this does | Why it wins |
|---|---|---|---|
| **Decision narratives** | "Built with React and Node" | "Chose optimistic UI over a spinner because the p95 write was 400 ms; here's the rollback path when the write fails" | Demonstrates judgment, which is the thing being hired |
| **Evidence adjacency** | Screenshot + GitHub link | Live language breakdown, commit cadence, and repo age rendered *next to* the claim they support | Claims become checkable, which makes all other claims more credible |
| **Editorial design** | Gradient hero, glass cards, logo grid | Asymmetric editorial grid, strong type hierarchy, generous negative space, one restrained accent | Reads as human judgment; survives the "forty-first tab" test |
| **Motion with intent** | Everything fades up on scroll | Motion only where it clarifies structure or state; full `prefers-reduced-motion` parity | Signals restraint — a senior trait |
| **Sub-90-minute expansion** | Hand-built per-project sections | One MDX file, schema-enforced | The portfolio stays current, which is where most portfolios die |
| **Failure-tolerant build** | Runtime API dependency | Committed cache; builds succeed offline | Nothing breaks on the day someone important visits |
| **Anti-résumé specificity** | "Passionate problem solver" | "Reduced sync job p95 from 8.2 s to 1.4 s by batching writes" | Numbers are the fastest credibility transfer mechanism that exists |

## 3.4 Explicit Non-Goals

Stating these prevents scope creep, which is the main risk to a solo eight-week build.

- **Not a blog.** No post feed, no tags, no RSS at MVP. (Roadmap item, §13.)
- **Not a CMS.** No admin UI, no auth, no database.
- **Not multi-user.** One person's portfolio. No theming, no tenancy.
- **No visible AI features.** No chatbot, no "ask my portfolio," no AI summaries in the UI. AI is a development tool here, not a product feature. This is deliberate: an AI chatbot on a portfolio in 2026 is itself a generic-AI signal.
- **No automatic repository import.** Curation is the point. A "here are all 47 of my repos" grid actively dilutes the signal.
- **No comments, likes, or social features.**
- **No i18n at MVP.** English only.

---

# 4. User Personas

## 4.1 Persona 1 — Priya Raman, Technical Recruiter

| Attribute | Detail |
|---|---|
| **Role** | Technical Recruiter, 60–400 person product company |
| **Experience** | 6 years recruiting, 4 of them technical |
| **Technical proficiency** | **Low–moderate.** Fluent in technology *names* and how they cluster; cannot read code. Knows React and Postgres go together; cannot evaluate a reducer. |
| **Devices** | Desktop Chrome for screening (dual monitor, LinkedIn + ATS + portfolio); iPhone Safari in evenings and between meetings — roughly 35% of her portfolio views |
| **Time budget** | 60–120 seconds per portfolio, first pass |
| **Volume** | 30–60 candidate links per week |

**A day in her workflow.** Sourcing sprint: she opens 15 tabs from a LinkedIn search, moves left to right, and triages into "screen," "maybe," and "no." She is looking for three things — does the stack match the requisition, is the level plausible, and is there anything concrete she can put in the pitch email to the hiring manager. She copies one sentence from each promising portfolio into her notes. If she cannot find a copyable sentence, the candidate becomes "maybe," and "maybe" almost never converts.

**Pain points**
- Cannot distinguish a competent engineer from a tutorial-follower when both show the same three project types.
- Vague self-description ("passionate about clean code") gives her nothing to forward.
- Technology lists without context — she cannot tell if "Kubernetes" means *deployed to* or *operated*.
- Portfolios that require scrolling through a full-viewport animated hero before any information appears.
- No obvious contact route, or a contact form that feels like it goes nowhere.

**Quotes**
> *"I need one sentence I can paste into an email to the hiring manager that makes them say 'yes, book it.' If I have to write that sentence myself, I probably won't."*
> *"A logo wall tells me you've heard of Docker. It doesn't tell me you've debugged a container at 2am."*

**What she needs from this site**
- Above the fold: name, a specific role claim, and a location/availability signal.
- One scroll: three to four projects with a plain-language one-liner each — *what it does and why it was hard*.
- Skimmable, quotable specificity — numbers, named systems, real scale.
- Contact address visible without a form, plus a résumé download.
- Fast on mobile Safari over cellular.

**Design implications:** hero must carry real information, not just a name and a scroll cue. Every project needs a jargon-light one-liner *above* the technical detail. Résumé and email must be reachable in one interaction from any page.

---

## 4.2 Persona 2 — Marcus Delgado, Senior Engineering Manager

| Attribute | Detail |
|---|---|
| **Role** | Engineering Manager, platform team of 9 |
| **Experience** | 12 years engineering, 4 managing |
| **Technical proficiency** | **Expert.** Will read your code. Will judge your commit messages. Will notice if your "microservices architecture" is three Express apps. |
| **Devices** | MacBook Pro, Firefox, wide display. Occasionally reads on an iPad in the evening. |
| **Time budget** | 5–15 minutes, but only on candidates Priya has already passed through |
| **Volume** | 5–8 deep looks per open requisition |

**A day in his workflow.** He opens the portfolio with the résumé in an adjacent tab. He goes straight past the About section to the projects, picks the one closest to his team's domain, and reads for evidence of three things: *did this person understand the problem before coding, did they make a defensible trade-off, and do they know what they got wrong.* He will open the repository and read `git log`, the test directory, and error handling. He is explicitly hunting for signs of exaggeration, because catching one costs him ten minutes and missing one costs him a bad hire.

**Pain points**
- Case studies that describe features instead of decisions.
- Claims with no mechanism — "improved performance by 60%" with no baseline, no method, no measurement.
- Solo projects written in the first-person plural to imply a team.
- No acknowledgement of limitations, which reads as either inexperience or dishonesty.
- Having to reverse-engineer the architecture from the file tree.

**Quotes**
> *"Anyone can build a CRUD app. I want to know what you did when the naive approach stopped working."*
> *"The most useful thing on a portfolio is the 'what I'd do differently' section. It's the only place people tell the truth."*
> *"If the numbers don't come with a method, I assume they came from vibes."*

**What he needs from this site**
- An architecture diagram or a clear textual description of component boundaries and data flow.
- Explicit trade-offs with the rejected alternative named.
- Metrics with baseline, method, and instrument.
- Honest scope labelling: solo vs. team, personal vs. production, users vs. no users.
- A "limitations / what I'd change" section — its presence is itself the signal.
- Direct deep links into the specific files that implement the interesting part.

**Design implications:** each case study needs a scannable decision table, a diagram, a metrics block with methodology, and a limitations section. Deep links to specific source files must be first-class, not just a repo link.

---

## 4.3 Persona 3 — `[YOUR_NAME]`, The Developer-Owner

| Attribute | Detail |
|---|---|
| **Role** | Computer science student / early-career software engineer; sole builder, designer, author, and maintainer |
| **Technical proficiency** | **High and growing.** Comfortable with modern React and TypeScript; learning production infrastructure. |
| **Time budget** | ~8–12 hours/week for the build; ~1–2 hours/month for maintenance afterward |
| **Motivation** | Land better interviews; have a public artifact worth being proud of |

**Workflow.** Builds in focused evening and weekend blocks. Context-switches hard between coursework, projects, and this site, so anything requiring more than fifteen minutes of re-orientation gets deferred indefinitely. Finishes a project, wants to publish it that weekend while the details are fresh, and will abandon the attempt if it turns into a refactor.

**Pain points**
- Layout drift: adding a fourth project breaks a grid tuned for three.
- The blank page problem — knowing a case study is needed but not what goes in it.
- Losing the reasoning: six months later, the *why* behind a decision is gone.
- Fear of design regression — one hand-tweaked new section that doesn't match the others.
- Dependency rot on a project touched once a quarter.

**Quotes**
> *"I'll write the case study if I know exactly what sections it needs. If it's a blank file, it won't happen."*
> *"I need to be able to come back after two months away and add a project without re-reading my own codebase."*

**What he needs from this site**
- A single-file addition path with a template and schema enforcement.
- Content authoring that is writing, not coding.
- Loud, specific build failures ("`projects/x.mdx`: missing required field `outcome.metrics`") rather than silent degradation.
- A documented, repeatable release process in the README.
- Dependency updates batched and automated (Renovate/Dependabot, grouped, weekly).

**Design implications:** the content schema is not internal plumbing — it is a UX surface for the primary maintainer. Error messages, the `new-project` template, and the README are product features with real requirements.

---

## 4.4 Persona Priority and Conflict Resolution

| Priority | Persona | Governs |
|---|---|---|
| **P0** | Priya (recruiter) | The landing page, above-the-fold content, mobile performance, contact access |
| **P0** | `[YOUR_NAME]` (owner) | Content architecture, schemas, build tooling, docs |
| **P1** | Marcus (hiring manager) | Case study depth, diagrams, metrics, source deep links |

**Resolution rule.** Priya and Marcus want opposite things — brevity vs. depth. Do not compromise between them; **layer** them. Every page is progressively disclosed: the top 20% of any page must fully satisfy Priya, and the remaining 80% must fully satisfy Marcus. Never average the two into a page that is too long to skim and too shallow to convince. Where a conflict cannot be layered, Priya wins on the landing page and Marcus wins on project detail pages.

---

# 5. Technical Architecture

## 5.1 Stack Decision Matrix

Weighted against the five criteria in the brief. Scores 1–5; weights sum to 100.

| Criterion | Weight | Next.js 16 | Astro 5 | SvelteKit 2 |
|---|---|---|---|---|
| Solo-dev maintainability (docs, ecosystem, answers to your future questions) | 25 | 5 (125) | 4 (100) | 3 (75) |
| Modern frontend practice / hiring signal | 20 | 5 (100) | 4 (80) | 4 (80) |
| Animation & interaction capability | 20 | 5 (100) | 3 (60) | 4 (80) |
| SEO & static performance | 20 | 4 (80) | 5 (100) | 4 (80) |
| Deployment flexibility (Vercel → VPS) | 15 | 4 (60) | 5 (75) | 4 (60) |
| **Weighted total** | **100** | **465** | **415** | **375** |

**Decision: Next.js 16, App Router.** Astro wins on raw payload, but this site's differentiator is a rich, orchestrated motion layer with shared state across scroll-linked sections — exactly where Astro's island boundaries add friction. Next.js's one weakness (baseline JS payload) is directly addressable: React Server Components by default, aggressive client-boundary discipline, and CSS scroll-driven animations instead of JS where the browser supports them. The performance targets in §10 are achievable in Next.js with discipline, and the maintainability and ecosystem gap is decisive for a solo builder who will step away from this codebase for months at a time.

## 5.2 Complete Technology Stack

| Layer | Technology | Version | Purpose | Notes |
|---|---|---|---|---|
| Runtime | Node.js | 22 LTS | Build + serverless | Pin in `.nvmrc` and `package.json engines` |
| Package manager | pnpm | 10.x | Dependencies | `packageManager` field pins exact version |
| Framework | Next.js | 16.x (LTS) | App Router, RSC, SSG, metadata, OG images | 15.x support ends Oct 2026 — start on 16 |
| UI library | React | 19.x | Components | Server Components default |
| Language | TypeScript | 5.7+ | Type safety | `strict: true`, `noUncheckedIndexedAccess: true` |
| Styling | Tailwind CSS | 4.x | Utilities | CSS-first config; tokens as CSS custom properties |
| Design tokens | CSS custom properties | — | Colors, type scale, spacing, motion | Single source of truth in `styles/tokens.css` |
| Animation | Motion for React (`motion`) | 12.x | Orchestration, gestures, layout, presence | Successor to Framer Motion; import only what's used |
| Animation (CSS) | Scroll-driven animations | native | Scroll-linked reveals, progress bars | Off main thread; `@supports` progressive enhancement |
| Content | MDX (`next-mdx-remote-client` or `@next/mdx`) | 5.x | Case study prose + components | Compiled at build time |
| Content validation | Zod | 4.x | Schema enforcement | Build-blocking |
| Syntax highlighting | Shiki | 3.x | Code blocks | Build-time; zero client JS; dual light/dark themes |
| Diagrams | Hand-authored inline SVG (+ optional Mermaid → SVG at build) | — | Architecture diagrams | Never ship a diagram renderer to the client |
| Icons | Lucide React (tree-shaken) or hand-drawn SVG | latest | Sparing UI icons | **No technology logo grids** |
| Fonts | 2 self-hosted variable families via `next/font/local` | — | Typography | `.woff2`, subset, `display: swap`, preloaded |
| Images | `next/image` + AVIF/WebP | — | Screenshots, OG | Explicit dimensions everywhere (CLS) |
| GitHub client | `octokit` (GraphQL + REST) | 4.x | Build-time sync only | Never bundled into client code |
| Email | Resend (or SMTP via Nodemailer) | latest | Contact form delivery | Free tier sufficient |
| Spam control | Honeypot + timing check + Cloudflare Turnstile | — | Contact form | Turnstile is privacy-friendly and free |
| Analytics | Plausible or Umami (self-hostable) | — | KPIs in §10 | Cookieless, no consent banner needed |
| RUM | Vercel Speed Insights (or `web-vitals` → analytics) | — | Field Core Web Vitals | Replaceable on VPS migration |
| Testing (unit) | Vitest | 3.x | Schema, utils, transforms | Fast, ESM-native |
| Testing (E2E/a11y/visual) | Playwright + `@axe-core/playwright` | latest | Flows, a11y, screenshots | Runs in CI on every PR |
| Linting | ESLint 9 (flat) + `eslint-plugin-jsx-a11y` | latest | Code + a11y lint | |
| Formatting | Prettier + `prettier-plugin-tailwindcss` | latest | Consistency | |
| Git hooks | Husky + lint-staged | latest | Pre-commit gate | |
| CI/CD | GitHub Actions | — | Validate, test, sync, deploy | Also runs the nightly GitHub sync |
| Hosting (launch) | Vercel | — | Edge CDN, previews | Free tier |
| Hosting (later) | VPS: Caddy + static + Node sidecar | — | Full control, custom domain | §13.3 |
| Dependency updates | Renovate | — | Grouped weekly PRs | Prevents rot |

## 5.3 Project Structure

```
portfolio/
├── .github/workflows/
│   ├── ci.yml                  # lint, typecheck, test, build, axe, Lighthouse budget
│   └── sync-github.yml         # nightly cron → sync → commit cache → trigger deploy
├── content/                    # ◀── THE ONLY PLACE YOU EDIT TO ADD CONTENT
│   ├── projects/
│   │   ├── _TEMPLATE.mdx       # copy this to start a new case study
│   │   ├── inventory-sync.mdx
│   │   └── ...
│   ├── experience.ts
│   ├── skills.ts
│   ├── education.ts
│   └── site.ts                 # name, headline, links, SEO defaults, résumé path
├── data/
│   └── github-cache.json       # generated + COMMITTED (build works offline)
├── scripts/
│   ├── sync-github.ts          # GraphQL + REST → cache
│   ├── validate-content.ts     # Zod parse of everything; exits 1 on failure
│   └── new-project.ts          # interactive scaffold: pnpm new:project
├── src/
│   ├── app/
│   │   ├── layout.tsx          # fonts, tokens, skip link, analytics
│   │   ├── page.tsx            # landing
│   │   ├── projects/
│   │   │   ├── page.tsx        # index
│   │   │   └── [slug]/
│   │   │       ├── page.tsx    # case study
│   │   │       └── opengraph-image.tsx
│   │   ├── about/page.tsx
│   │   ├── experience/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── api/
│   │   │   ├── contact/route.ts
│   │   │   └── revalidate/route.ts
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   ├── components/
│   │   ├── primitives/         # Text, Stack, Grid, Container, VisuallyHidden
│   │   ├── sections/           # Hero, ProjectShowcase, SkillsTimeline, ...
│   │   ├── project/            # DecisionTable, MetricBlock, ArchitectureFigure,
│   │   │                       # RepoEvidence, SourceLink, LimitationsList
│   │   └── motion/             # Reveal, ScrollProgress, MagneticLink, useReducedMotion
│   ├── lib/
│   │   ├── content.ts          # typed loaders: getProjects(), getProject(slug)
│   │   ├── schemas.ts          # ALL Zod schemas
│   │   ├── github.ts           # cache reader + types
│   │   ├── seo.ts              # metadata + JSON-LD builders
│   │   └── analytics.ts
│   └── styles/
│       ├── tokens.css          # design tokens — single source of truth
│       └── globals.css
├── public/
│   ├── fonts/                  # self-hosted .woff2
│   ├── resume.pdf
│   └── projects/               # screenshots, diagrams
├── tests/
│   ├── unit/
│   └── e2e/
├── docs/
│   ├── ADDING-A-PROJECT.md     # ◀── read this after 2 months away
│   ├── DESIGN-SYSTEM.md
│   └── DEPLOYMENT.md
└── lighthouserc.json
```

## 5.4 Data Flow

### Build-time flow

```
GitHub GraphQL v4 ──┐
                    ├──▶ scripts/sync-github.ts ──▶ data/github-cache.json (committed)
GitHub REST v3   ───┘         │
                              └─ on error ─▶ keep existing cache, emit ::warning::, exit 0
                                                          │
content/*.mdx, *.ts ──▶ scripts/validate-content.ts ──────┤
        (Zod; exit 1 on failure)                          │
                                                          ▼
                                              next build (SSG)
                                                          │
                              ┌───────────────────────────┼───────────────────────────┐
                              ▼                           ▼                           ▼
                    static HTML per route        per-route OG images        sitemap + robots
                              │
                              ▼
                        CDN edge / static dir
```

### Runtime flow (visitor)

```
Visitor ──▶ CDN edge ──▶ static HTML + CSS + minimal JS hydration
                              │
                              ├──▶ contact submit ──▶ POST /api/contact
                              │                          ├─ honeypot + timing check
                              │                          ├─ Turnstile verify
                              │                          ├─ in-memory/KV rate limit (5/hr/IP)
                              │                          ├─ Zod validate
                              │                          └─ Resend send ──▶ inbox
                              │
                              └──▶ analytics beacon (cookieless, no PII)
```

### Repository-update flow

```
Nightly cron (03:00 UTC) ──▶ sync-github.yml
        │
        ├─ run sync ──▶ diff data/github-cache.json
        ├─ no change ──▶ exit (no deploy)
        └─ changed ──▶ commit "chore: sync github data" ──▶ push ──▶ deploy hook
```

An optional GitHub webhook on push to a showcased repository can `POST /api/revalidate` with an HMAC-signed payload to trigger an immediate rebuild. This is P2 — the nightly cron is sufficient for MVP.

## 5.5 Rendering and Client-Boundary Policy

The performance budget is enforced by a rule, not by hope:

> **Everything is a Server Component until a specific interaction forces otherwise.** A `"use client"` directive requires a one-line justification comment naming the interaction that needs it.

| Component | Boundary | Justification |
|---|---|---|
| `Hero` | Server | Static content; entrance motion via CSS |
| `ProjectCard` | Server shell + tiny client wrapper | Hover/pointer state only |
| `SkillsTimeline` | Client | Filter state, keyboard nav |
| `ScrollProgress` | Client | Reads scroll position |
| `Reveal` | Client (thin) | IntersectionObserver; CSS-only fallback path |
| `ContactForm` | Client | Form state, validation, async submit |
| `Nav` | Client | Mobile menu open/close, scroll-spy |
| Everything in `components/project/` | Server | Pure rendering of build-time data |

**JavaScript budget:** ≤ 90 KB gzipped first-load JS on the landing route; ≤ 110 KB on a project detail route. Enforced in CI via a bundle-size check that fails the build on regression.

## 5.6 Scalability Considerations

Scalability here means *content scale* and *maintenance scale*, not traffic — a static site on a CDN absorbs any plausible traffic.

| Dimension | At MVP | Designed ceiling | Mechanism |
|---|---|---|---|
| Projects | 4–6 | 50+ | File-driven routes via `generateStaticParams`; add pagination + filter above ~20 |
| Build time | < 60 s | < 3 min at 50 projects | One batched GraphQL query regardless of repo count; Shiki highlighting cached |
| GitHub API budget | ~10 calls/build | ~60 calls/build at 50 repos | Against a 5,000/hr authenticated ceiling — a rounding error |
| Cache file size | ~50 KB | ~600 KB | Store only fields actually rendered; prune raw README bodies to what's used |
| Experience entries | 3–6 | Unbounded | Typed array; timeline auto-scales |
| Skills | 20–30 | 100+ | Grouped by category with per-group collapse |
| Traffic | ~100/mo | Millions | Static + CDN; no origin compute on page views |

**Content-scale guardrail.** Past ~12 projects, curation quality matters more than capacity. Add a `featured: boolean` and a `tier` field to the project schema from day one so the landing page can show 4 while `/projects` shows all — this costs nothing now and prevents a refactor later.

## 5.7 Security Considerations

| Risk | Mitigation |
|---|---|
| GitHub token exposure | Token is a fine-grained PAT with **read-only, public-repo metadata scope only**. Lives exclusively in GitHub Actions secrets. Never referenced in `src/`. Enforced by an ESLint rule banning `process.env.GITHUB_TOKEN` outside `scripts/`. |
| Token rotation | 90-day expiry; calendar reminder; documented in `docs/DEPLOYMENT.md`. |
| Contact form spam | Layered: honeypot field, minimum fill-time check (< 2 s = bot), Cloudflare Turnstile, per-IP rate limit (5/hr), server-side Zod validation, 2,000-char body cap. |
| Contact form abuse as a relay | Never reflect user input into the outbound `From`/`Reply-To` without validation; send to a fixed recipient only. |
| Email address harvesting | Display the address as a real, accessible `mailto:` (obfuscation hurts recruiters more than it hurts scrapers) but keep the primary intake through the form. Accept the trade-off. |
| XSS via MDX | MDX is authored only by the owner and compiled at build time. No user-generated content is rendered anywhere. |
| XSS via GitHub data | All GitHub-sourced strings (repo descriptions, topics) are rendered as text, never as HTML. README content is either rendered as plain text or sanitized with `rehype-sanitize`. |
| Supply chain | pnpm lockfile committed; Renovate PRs reviewed; `pnpm audit` in CI; no `postinstall` scripts from untrusted packages. |
| Headers | CSP (`script-src 'self'` + analytics origin; no `unsafe-inline` — use nonces), `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` denying camera/mic/geolocation. |
| Dependency of the CDN | Static output is portable; the VPS path in §13.3 is the escape hatch. |
| Secrets in the client bundle | Only `NEXT_PUBLIC_*` variables reach the client; CI greps the build output for known secret patterns. |
| PII | The site collects nothing except what a visitor voluntarily types into the contact form. Analytics is cookieless and IP-anonymized. A short privacy note is linked from the footer. |

## 5.8 Performance Budget

| Metric | Budget | Enforcement |
|---|---|---|
| LCP (mobile, p75 field) | ≤ 2.0 s | Speed Insights; Lighthouse CI lab check ≤ 2.5 s |
| INP (p75 field) | ≤ 150 ms | Speed Insights |
| CLS (p75 field) | ≤ 0.05 | Speed Insights; explicit media dimensions |
| First-load JS (landing) | ≤ 90 KB gz | `next build` output check in CI |
| First-load JS (project page) | ≤ 110 KB gz | Same |
| Total page weight (landing) | ≤ 600 KB | Lighthouse budget in `lighthouserc.json` |
| Fonts | ≤ 2 families, ≤ 4 files, ≤ 120 KB total | Manual review at each design change |
| Largest image | ≤ 200 KB after AVIF | `next/image` + build-time check |
| Third-party origins | ≤ 2 (analytics, Turnstile) | CSP allowlist review |

*(Google's published "good" thresholds are LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. The budgets above are deliberately tighter so that normal drift still lands in the green band.)*

---

# 6. Functional Requirements

## 6.1 Priority Definitions

| Level | Meaning | Rule |
|---|---|---|
| **P0** | MVP-blocking. The site cannot launch without it. | Ship all P0 before starting any P1. |
| **P1** | High value, ships in the launch window if time allows; otherwise within 4 weeks post-launch. | |
| **P2** | Nice to have. Post-MVP backlog. | Never start a P2 while a P0 is open. |

## 6.2 User Stories with Acceptance Criteria

---

### US-01 — Instant orientation (Hero) · **P0**

> **As** Priya the recruiter, **I want** to understand who this person is and what they build within five seconds of the page loading, **so that** I can decide whether to keep reading.

**Acceptance criteria**

- **AC-01.1** Above the fold at 375 × 667 px, the following are all visible without scrolling: full name, a specific role/specialization statement, a one-sentence value proposition containing at least one concrete technical noun, and a primary CTA.
- **AC-01.2** The role statement is specific. "Full-Stack Developer & Problem Solver" fails; "Backend-leaning full-stack developer — TypeScript, Go, and Postgres; I build data-sync systems" passes.
- **AC-01.3** Availability/location status is present (e.g. "Final-year CS · Jakarta · open to internships from Jan 2027").
- **AC-01.4** LCP element is text or a preloaded image and renders in ≤ 2.0 s on Slow 4G.
- **AC-01.5** No full-viewport-height empty hero. Content from the next section must be visually detectable at the fold on desktop (≥ 1024 px) — a peek of the next section, not a scroll arrow alone.
- **AC-01.6** Entrance animation completes within 600 ms and is skipped entirely under `prefers-reduced-motion`, with all text present in the DOM from first paint regardless.
- **AC-01.7** Contains no gradient mesh background, no glassmorphic card, and no animated technology-logo row. *(Explicit anti-pattern gate — see §11.2.)*

---

### US-02 — Skimmable project showcase · **P0**

> **As** Priya, **I want** a scannable set of projects with plain-language descriptions, **so that** I can find one sentence worth forwarding to a hiring manager.

**Acceptance criteria**

- **AC-02.1** Landing page shows 3–4 featured projects; `/projects` shows all.
- **AC-02.2** Each card displays: project name, a ≤ 140-character plain-language "what it does and why it was hard" line, 3–5 primary technologies as text, one headline metric where one exists, and the project's role/scope label (Solo / Team / Production / Personal).
- **AC-02.3** The one-liner is comprehensible to a non-engineer. Reviewed against this rule at authoring time.
- **AC-02.4** Card technology display is **text, not logos**.
- **AC-02.5** Entire card is a single link target to the case study; the whole card is clickable and is one tab stop, not several.
- **AC-02.6** Cards use a consistent grid that reflows at 3 / 2 / 1 columns without layout shift and without any card-count-dependent tuning.
- **AC-02.7** Adding a fifth project requires no change to any component file.

---

### US-03 — Interactive animated project cards · **P0**

> **As** a visitor, **I want** project cards that respond to my attention, **so that** the interface feels considered and alive without being distracting.

**Acceptance criteria**

- **AC-03.1** On pointer hover: a coordinated transition (elevation/border/accent shift plus a subtle image or type response) completing in ≤ 250 ms with an ease-out curve.
- **AC-03.2** Keyboard focus produces a state that is **at least as prominent** as hover, plus a visible focus ring meeting WCAG 2.2 SC 2.4.11 (Focus Not Obscured) and 3:1 contrast against adjacent colors.
- **AC-03.3** On touch devices, no hover-dependent information exists; all card content is visible without interaction.
- **AC-03.4** Animation uses only `transform` and `opacity` (compositor-only properties). No animation of `width`, `height`, `top`, `left`, or `box-shadow` spread.
- **AC-03.5** Under `prefers-reduced-motion: reduce`, movement is replaced by an instantaneous or ≤ 100 ms color/border state change. State is still clearly communicated.
- **AC-03.6** No cumulative layout shift is caused by any card interaction (CLS contribution = 0).
- **AC-03.7** Effects are restrained: no 3D tilt, no particle field, no cursor-following spotlight glow. *(Anti-pattern gate.)*

---

### US-04 — Deep technical case study · **P0**

> **As** Marcus the hiring manager, **I want** each project page to explain the problem, constraints, decisions, implementation, and results, **so that** I can evaluate engineering judgment without reading the whole repository.

**Acceptance criteria**

- **AC-04.1** Every case study contains all five required beats in order: **Context**, **Constraint**, **Decision**, **Implementation**, **Outcome**. Build fails if any is missing (Zod-enforced).
- **AC-04.2** A **Decision Table** is present with ≥ 2 rows, each naming: the decision, the option chosen, ≥ 1 named rejected alternative, and the accepted trade-off.
- **AC-04.3** An architecture representation is present — an inline SVG diagram, or a structured textual description of components and data flow. Diagrams have a text alternative conveying the same relationships.
- **AC-04.4** Where metrics are claimed, each includes baseline, result, measurement method, and instrument. A metric without a method fails review.
- **AC-04.5** A **Limitations / What I'd do differently** section is required and must be non-empty.
- **AC-04.6** Scope is explicitly labelled: solo vs. team, production vs. personal, real users vs. none, timeline.
- **AC-04.7** Deep links to specific source files (with line ranges where useful) are provided for the interesting implementation points, in addition to the repository link.
- **AC-04.8** A reading-time estimate and an in-page table of contents are shown for pages over 800 words.
- **AC-04.9** The page opens with a ≤ 60-word summary block that stands alone — Priya's layer.

---

### US-05 — Live GitHub evidence · **P0**

> **As** Marcus, **I want** real repository data displayed next to the narrative, **so that** I can verify the claims are attached to actual work.

**Acceptance criteria**

- **AC-05.1** Each case study renders, from the build-time cache: primary language + language percentage breakdown, total commits, first-commit and last-commit dates, repository age, stars and forks (shown only when > 0), open-source license, and topics.
- **AC-05.2** All values are static HTML — zero client-side GitHub requests.
- **AC-05.3** A "data as of `<date>`" timestamp is displayed so stale values are honest rather than misleading.
- **AC-05.4** If a repository is private or unavailable, the case study still renders fully, with the evidence block gracefully omitted and no error surfaced to the visitor.
- **AC-05.5** A prominent, correctly labelled link to the repository is present.
- **AC-05.6** Vanity metrics are not inflated: star counts of 0–2 are hidden rather than displayed, because a "0 ★" badge is worse than no badge.

---

### US-06 — Skills timeline · **P0**

> **As** Priya, **I want** to see which technologies this person knows and how long they've used them, **so that** I can match them against the requisition.

**Acceptance criteria**

- **AC-06.1** Skills are grouped into categories (Languages, Frameworks, Data, Infrastructure, Tooling, Practices).
- **AC-06.2** Each skill shows the year first used and a proficiency band from a fixed, defined vocabulary: **Learning / Working / Proficient / Deep**. Definitions of each band are displayed on the page.
- **AC-06.3** Proficiency is **never** rendered as a percentage, star rating, or progress bar. *(Anti-pattern gate — "React 87%" is meaningless and reads as generated.)*
- **AC-06.4** Each skill at Proficient or Deep links to at least one project that evidences it.
- **AC-06.5** The timeline visualization is keyboard-navigable and exposes the same information to screen readers as a semantic list.
- **AC-06.6** On viewports < 768 px the timeline degrades to a grouped list without horizontal scrolling.
- **AC-06.7** Adding a skill is a one-line edit to `content/skills.ts`.

---

### US-07 — Experience history · **P0**

> **As** Priya, **I want** a clear chronological record of roles and their outcomes, **so that** I can assess trajectory.

**Acceptance criteria**

- **AC-07.1** Reverse-chronological list. Each entry: organization, title, start/end dates (or "Present"), employment type, location/remote, 2–4 outcome-oriented bullets, and technologies used.
- **AC-07.2** Bullets are outcome-framed, not duty-framed: "Cut nightly report generation from 40 min to 6 min by replacing N+1 queries with a single windowed aggregate" — not "Responsible for reports."
- **AC-07.3** Where an entry relates to a showcased project, it links to that case study.
- **AC-07.4** Gaps are not disguised; dates are honest.
- **AC-07.5** Marked up with `schema.org` structured data where applicable.
- **AC-07.6** Entries with no formal employment (open source, coursework capstones, freelance) are supported by the same model with a `type` discriminator.

---

### US-08 — About & CS background · **P0**

> **As** a visitor, **I want** to understand the person's background and how they think, **so that** I can judge fit beyond the technical checklist.

**Acceptance criteria**

- **AC-08.1** About section is 150–350 words, first-person, specific, and contains no phrase from the banned-clichés list in §12.6.
- **AC-08.2** A dedicated Computer Science Background block lists institution, program, expected/actual graduation, and 4–8 relevant courses **with a one-line note on what each course actually produced or taught** — not a bare course-code list.
- **AC-08.3** Academic projects, thesis, research, or teaching-assistant work is included where it exists and is labelled as academic.
- **AC-08.4** Notable coursework links to a repository or case study wherever one exists.
- **AC-08.5** Any photograph is a real photograph, presented at a considered size and crop; no AI-generated avatar. *(Anti-pattern gate.)*

---

### US-09 — Contact workflow · **P0**

> **As** Priya, **I want** an obvious and trustworthy way to reach this person, **so that** I can move to a conversation immediately.

**Acceptance criteria**

- **AC-09.1** At least two routes are always available: a visible `mailto:` email address and a contact form.
- **AC-09.2** Email address and résumé download are reachable from every page (footer at minimum) in one interaction.
- **AC-09.3** Form fields: name (required, 2–80 chars), email (required, valid), organization (optional), message (required, 20–2,000 chars). Optional "how did you find me" select.
- **AC-09.4** Client-side validation is inline, on blur, non-blocking, and announced to screen readers via `aria-live`. Server-side Zod validation is authoritative.
- **AC-09.5** Success state is explicit and includes the expected response time and the direct email as a fallback.
- **AC-09.6** Failure state never loses the user's typed message and always offers the `mailto:` fallback pre-filled where possible.
- **AC-09.7** Spam protection: honeypot + minimum fill time + Turnstile + 5 requests/hour/IP. Legitimate users never see a puzzle.
- **AC-09.8** Résumé PDF downloads with a meaningful filename (`[YOUR_NAME]-resume-2026-09.pdf`) and the link is labelled with format and file size.
- **AC-09.9** Links to GitHub, LinkedIn, and any other professional profile open in a new tab with `rel="noopener noreferrer"` and accessible labels.

---

### US-10 — Scroll-based storytelling · **P0**

> **As** a visitor, **I want** the page to unfold in a way that guides my attention, **so that** the narrative feels intentional rather than like a stack of boxes.

**Acceptance criteria**

- **AC-10.1** Sections reveal on scroll with a staggered entrance (≤ 400 ms per element, ≤ 80 ms stagger between siblings).
- **AC-10.2** A thin reading-progress indicator is present on case study pages.
- **AC-10.3** At least one section uses a scroll-linked transition that communicates real structure — e.g. a sticky project title while its detail sections scroll past, or a timeline axis that advances with scroll position.
- **AC-10.4** **Scroll is never hijacked.** No scroll-jacking, no forced snap that fights the user, no horizontal scroll on a vertically scrolled page. Native scroll velocity is preserved.
- **AC-10.5** All content is present in the DOM and readable with JavaScript disabled; scroll effects are progressive enhancement only.
- **AC-10.6** Under `prefers-reduced-motion`, all reveals become immediate opacity-only transitions or are removed entirely; nothing is hidden as a result.
- **AC-10.7** Scroll handlers use IntersectionObserver or CSS scroll-driven animations. No `scroll` event listener performing layout reads.
- **AC-10.8** Scroll animation maintains 60 fps on a mid-range Android device (baseline: Moto G Power class, 4× CPU throttle in DevTools).

---

### US-11 — Responsive across devices · **P0**

> **As** Priya on her phone between meetings, **I want** the full experience on mobile, **so that** I don't have to defer the review to my desktop.

**Acceptance criteria**

- **AC-11.1** Verified at 320, 375, 390, 768, 1024, 1280, 1440, 1920 px. No horizontal overflow, no overlap, no clipped text at any width.
- **AC-11.2** Touch targets ≥ 44 × 44 px with ≥ 8 px separation (WCAG 2.2 SC 2.5.8).
- **AC-11.3** Body text ≥ 16 px on mobile; measure stays within 45–75 characters at all widths.
- **AC-11.4** Layout adapts structurally, not just by shrinking: the editorial asymmetry of the desktop grid resolves to a deliberate single-column rhythm rather than a squashed version of the desktop layout.
- **AC-11.5** Works in Safari iOS, Chrome Android, Firefox, and Edge — current and current-minus-one.
- **AC-11.6** Respects safe-area insets on notched devices.
- **AC-11.7** Landscape phone orientation is usable.

---

### US-12 — Add a project in under 90 minutes · **P0**

> **As** the developer, **I want** to publish a new case study by writing one file, **so that** the portfolio doesn't go stale.

**Acceptance criteria**

- **AC-12.1** `pnpm new:project` scaffolds a pre-filled MDX file from `_TEMPLATE.mdx` with all required frontmatter keys present and commented.
- **AC-12.2** Placing a valid MDX file in `content/projects/` causes the route, the index entry, the landing card (if `featured`), the sitemap entry, and the OG image to be generated automatically.
- **AC-12.3** No component, route, or layout file is edited.
- **AC-12.4** Invalid content fails the build with a message naming the file, the field, and the expected shape.
- **AC-12.5** `pnpm sync:github` fetches data for the new repository without configuration beyond the `repo` field in frontmatter.
- **AC-12.6** `docs/ADDING-A-PROJECT.md` documents the process end to end and is verified by following it from a cold start.
- **AC-12.7** The full path from empty file to deployed page is measured at ≤ 90 minutes for a project the developer already understands (writing time dominates; tooling time ≤ 10 minutes).

---

### US-13 — Discoverability and sharing · **P1**

> **As** the developer, **I want** the site to rank for my name and preview well when shared, **so that** the link works as a credential.

**Acceptance criteria**

- **AC-13.1** Unique `<title>`, meta description, and canonical URL per route.
- **AC-13.2** `Person` JSON-LD on the home page; `CreativeWork` (or `SoftwareSourceCode`) JSON-LD per project.
- **AC-13.3** Auto-generated OG image per route, 1200 × 630, containing the project title, the one-liner, and the primary technologies — generated at build time via `next/og`.
- **AC-13.4** `sitemap.xml` and `robots.txt` generated automatically from content.
- **AC-13.5** Verified in Google Search Console; Rich Results Test passes with no errors.
- **AC-13.6** OG previews verified rendering correctly in LinkedIn, Slack, and X/Twitter.

---

### US-14 — Accessible to everyone · **P0**

> **As** a visitor using assistive technology, **I want** full access to all content and functionality, **so that** I can evaluate this candidate on equal terms.

**Acceptance criteria**

- **AC-14.1** WCAG 2.2 Level AA conformance. *(WCAG 3.0 remains a W3C Working Draft as of 2026 and is not a conformance target; 2.2 AA is the operative standard.)*
- **AC-14.2** Semantic landmarks throughout; a single `<h1>` per page; heading levels never skip.
- **AC-14.3** Text contrast ≥ 4.5:1 (≥ 3:1 for large text); UI component and focus-indicator contrast ≥ 3:1.
- **AC-14.4** Every interactive element is keyboard operable, in a logical order, with a visible focus indicator that is never obscured by sticky headers (SC 2.4.11).
- **AC-14.5** A "Skip to content" link is the first focusable element.
- **AC-14.6** All meaningful images have descriptive alt text; decorative images have `alt=""`.
- **AC-14.7** Verified manually with VoiceOver (Safari) and NVDA (Firefox); the full narrative is comprehensible via screen reader alone.
- **AC-14.8** Usable at 200% browser zoom and at 320 px width with 400% zoom (SC 1.4.10 reflow).
- **AC-14.9** No information is conveyed by color alone.
- **AC-14.10** `prefers-reduced-motion` honored globally through a single token-level mechanism, not per-component patches.
- **AC-14.11** axe-core reports zero violations across all routes and breakpoints in CI.

---

### US-15 — Fast on any connection · **P0**

> **As** any visitor, **I want** the site to load quickly on a mediocre connection, **so that** I don't abandon it.

**Acceptance criteria**

- **AC-15.1** All performance budgets in §5.8 are met.
- **AC-15.2** Fonts are self-hosted, subset, preloaded, with `font-display: swap` and a metric-compatible fallback stack to minimize layout shift on swap.
- **AC-15.3** Images use `next/image` with explicit dimensions, AVIF/WebP, and lazy loading below the fold; the LCP image (if any) is `priority`.
- **AC-15.4** No render-blocking third-party resources. Analytics loads deferred.
- **AC-15.5** Lighthouse CI runs on every PR and fails the build on budget regression.
- **AC-15.6** The site is usable (content readable, navigation functional) with JavaScript disabled.

---

### US-16 — Graceful degradation of data · **P1**

> **As** the developer, **I want** the site to survive GitHub outages and API changes, **so that** a bad day at GitHub is never a bad day for my portfolio.

**Acceptance criteria**

- **AC-16.1** `pnpm build` succeeds with no network access, using the committed cache.
- **AC-16.2** `pnpm sync:github` failing does not fail the build — it warns and exits 0, leaving the previous cache intact.
- **AC-16.3** A missing repository entry in the cache degrades only the evidence block on that one page.
- **AC-16.4** Cache staleness beyond 14 days emits a CI warning.
- **AC-16.5** The GitHub response is parsed through a Zod schema, so an upstream shape change fails the sync script with a clear message rather than writing a malformed cache.

---

### US-17 — Project filtering and search · **P2**

> **As** Marcus, **I want** to filter projects by technology, **so that** I can find work relevant to my team's stack.

**Acceptance criteria**

- **AC-17.1** `/projects` offers filtering by technology and by project type.
- **AC-17.2** Filter state is reflected in the URL query string and is shareable.
- **AC-17.3** Filters are keyboard-accessible; result-count changes are announced via `aria-live`.
- **AC-17.4** An empty result state offers a clear reset.
- **AC-17.5** Filtering is client-side over pre-rendered data; no additional network request.
- **AC-17.6** Implement only once the project count exceeds 8. Below that it is friction, not help.

---

## 6.3 Requirements Traceability

| Story | Priority | Persona served | Success gate | Sprint |
|---|---|---|---|---|
| US-01 Hero | P0 | Priya | G2, O1 | S3 |
| US-02 Showcase | P0 | Priya | O1 | S3 |
| US-03 Animated cards | P0 | All | G5, O6 | S5 |
| US-04 Case study | P0 | Marcus | G1, O2 | S4 |
| US-05 GitHub evidence | P0 | Marcus | G7 | S4 |
| US-06 Skills timeline | P0 | Priya | O1 | S3 |
| US-07 Experience | P0 | Priya | O1 | S3 |
| US-08 About / CS | P0 | Priya, Marcus | O1 | S3 |
| US-09 Contact | P0 | Priya | G9, O7 | S6 |
| US-10 Scroll story | P0 | All | G5, O6 | S5 |
| US-11 Responsive | P0 | Priya | G6 | S2–S7 |
| US-12 Add a project | P0 | Owner | O3 | S1 |
| US-13 SEO / sharing | P1 | Owner | O8 | S6 |
| US-14 Accessibility | P0 | All | G3, G4, O5 | S2–S7 |
| US-15 Performance | P0 | All | G2, O4 | S7 |
| US-16 Data resilience | P1 | Owner | G7 | S4 |
| US-17 Filtering | P2 | Marcus | — | Post-MVP |

## 6.4 User Flows

### Flow A — Recruiter fast screen (target: under 60 seconds)

```
Land on /  (from LinkedIn / résumé link)
   │
   ├─ 0–5 s   Read hero: name, specific role, value proposition, availability
   │
   ├─ 5–20 s  Scroll → featured projects. Read 3 one-liners + headline metrics.
   │
   ├─ 20–40 s Scroll → skills grouped by category with years and bands
   │          Scroll → experience: most recent role + outcome bullets
   │
   ├─ 40–55 s DECISION POINT
   │            ├─ Interested → footer: copy email OR download résumé  ──▶ CONVERSION
   │            ├─ Curious    → click one project ──▶ Flow B
   │            └─ Not a fit  → close (acceptable outcome; the site did its job fast)
   │
   └─ Design requirement: every step above must be reachable by scrolling only.
      No click is required to obtain any of the screening-level information.
```

### Flow B — Hiring manager deep evaluation (target: 5–15 minutes)

```
Land on /projects/[slug]  (direct link, or from Flow A)
   │
   ├─ Read the ≤60-word summary block                    [Priya layer]
   ├─ Scan the metrics block: baseline → result → method [credibility check]
   ├─ Read Context + Constraint                          [was the problem understood?]
   ├─ Study the Decision Table                           [is the judgment defensible?]
   │     └─ chosen | rejected alternative | trade-off accepted
   ├─ Read the architecture diagram + data flow
   ├─ Read Implementation, following ≥1 deep source link into the repo
   ├─ Read Limitations / What I'd do differently         [honesty check — the real signal]
   ├─ Check the GitHub evidence block                    [does the repo corroborate?]
   │
   └─ NEXT ACTION (all available at the end of the page)
        ├─ Next / previous project (prev-next pager)
        ├─ Back to all projects
        └─ Contact  ──▶ Flow C
```

### Flow C — Contact

```
Reach contact (footer link on any page, hero CTA, or end-of-case-study CTA)
   │
   ├─ PATH 1 — Direct  (preferred by most recruiters)
   │     └─ Click visible mailto: → their mail client opens → done
   │
   ├─ PATH 2 — Résumé
   │     └─ Download PDF (labelled with format + size) → done
   │
   └─ PATH 3 — Form
         ├─ Fill name, email, [organization], message
         ├─ Inline validation on blur; errors announced via aria-live
         ├─ Submit → optimistic pending state (button disabled, spinner, no layout shift)
         ├─ POST /api/contact
         │     ├─ 200 → success panel: confirmation + expected response time + mailto fallback
         │     ├─ 400 → field-level errors restored onto the form; input preserved
         │     ├─ 429 → "You've sent several messages recently" + mailto fallback
         │     └─ 5xx → "Something went wrong" + mailto fallback with subject/body pre-filled
         └─ Message content is NEVER lost on any failure path
```

### Flow D — Developer adds a project (target: under 90 minutes)

```
pnpm new:project
   │  └─ prompts: title, slug, repo, one-liner → writes content/projects/<slug>.mdx from template
   │
   ├─ Fill frontmatter (10 min): summary, role, timeline, stack, featured, tier, metrics
   ├─ Write the five beats (45–60 min): Context, Constraint, Decision, Implementation, Outcome
   ├─ Write the Decision Table (≥2 rows) and Limitations (10 min)
   ├─ Add screenshot / diagram to public/projects/<slug>/ (5 min)
   │
   ├─ pnpm sync:github        → cache updated with the new repo
   ├─ pnpm validate           → Zod check; fix any named field errors
   ├─ pnpm dev                → visual check at 375 / 768 / 1440
   │
   └─ git commit && git push  → CI validates, tests, builds → deploy → live
```

---

# 7. API Specifications

The site has a deliberately tiny API surface: **two build-time consumers** (GitHub) and **two runtime endpoints**. Everything else is static.

## 7.1 GitHub Integration (build-time)

### 7.1.1 Authentication

| Property | Value |
|---|---|
| Token type | Fine-grained Personal Access Token |
| Scope | Public repositories, **read-only**, metadata + contents |
| Storage | GitHub Actions secret `GH_SYNC_TOKEN`; local `.env.local` (gitignored) |
| Header | `Authorization: Bearer <token>` |
| Rotation | Every 90 days; documented in `docs/DEPLOYMENT.md` |
| Never | Referenced in `src/`, exposed as `NEXT_PUBLIC_*`, or present at runtime |

### 7.1.2 Rate limits and budget

| Limit | Value | Our usage |
|---|---|---|
| REST, authenticated | 5,000 requests/hour | ~3 per repo per build (≈18 at 6 repos) |
| REST, unauthenticated | 60 requests/hour | Fallback only; never relied upon |
| GraphQL, authenticated | 5,000 points/hour | 1 batched query ≈ 1–10 points per build |
| Secondary: concurrent | 100 | We use 1 |
| Secondary: points/min (REST) | 900 | Far below |

**Strategy.** Use **one** GraphQL query to fetch metadata for all repositories at once (this is the whole point of choosing GraphQL here), then a small number of REST calls per repo for the things GraphQL doesn't expose conveniently. Even at 50 projects this stays under 1% of the hourly budget.

**Handling.** Read `x-ratelimit-remaining` after every response. Below 100, abort the sync gracefully and keep the existing cache. On `403`/`429`, honor `retry-after`; retry with exponential backoff (1 s, 2 s, 4 s) up to 3 attempts, then abort gracefully.

### 7.1.3 GraphQL query (single batched call)

```graphql
query PortfolioRepos($owner: String!) {
  r0: repository(owner: $owner, name: "inventory-sync") { ...RepoFields }
  r1: repository(owner: $owner, name: "second-project") { ...RepoFields }
  # ...aliased once per project; generated programmatically from content frontmatter
}

fragment RepoFields on Repository {
  name
  nameWithOwner
  description
  url
  homepageUrl
  isPrivate
  isArchived
  createdAt
  pushedAt
  stargazerCount
  forkCount
  diskUsage
  licenseInfo { spdxId name }
  primaryLanguage { name color }
  languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
    totalSize
    edges { size node { name color } }
  }
  repositoryTopics(first: 20) { nodes { topic { name } } }
  defaultBranchRef {
    name
    target {
      ... on Commit {
        history(first: 1) { totalCount nodes { committedDate messageHeadline oid } }
      }
    }
  }
  latestRelease { tagName publishedAt url }
}
```

### 7.1.4 REST calls (per repository, as needed)

| Purpose | Method + path | Notes |
|---|---|---|
| README (for excerpt/fallback) | `GET /repos/{owner}/{repo}/readme` | `Accept: application/vnd.github.raw` |
| Commit activity (52-week sparkline) | `GET /repos/{owner}/{repo}/stats/commit_activity` | May return `202` while GitHub computes stats — retry once after 2 s, then skip |
| Contributors | `GET /repos/{owner}/{repo}/contributors?per_page=10` | Used only to label solo vs. team honestly |
| Rate limit check | `GET /rate_limit` | Does not count against the limit |

### 7.1.5 Sync script contract

```ts
// scripts/sync-github.ts — contract
//
// Inputs:   content/projects/*.mdx  →  frontmatter.repo  ("owner/name")
//           env GH_SYNC_TOKEN
// Output:   data/github-cache.json  (committed to the repository)
// Exit 0:   always on network/API failure — the previous cache is preserved
// Exit 1:   only if the GitHub response fails Zod parsing AND no prior cache exists
//
// Guarantees:
//   - Never writes a partial or malformed cache (write to temp file, validate, then rename)
//   - Never removes an existing repo entry because of a transient fetch failure
//   - Always sets cache.syncedAt to an ISO-8601 UTC timestamp
```

### 7.1.6 Error handling matrix

| Condition | Detection | Behavior | Visitor impact |
|---|---|---|---|
| Network unreachable | fetch throws | Warn, keep cache, exit 0 | None |
| 401 / 403 (bad token) | status | Error annotation in CI, keep cache, exit 0 | None; CI shows a red warning |
| 429 / secondary limit | status + `retry-after` | Backoff ×3, then keep cache, exit 0 | None |
| 404 (repo renamed/deleted) | status | Keep last known entry, flag `stale: true`, warn | Evidence block shows "data as of" older date |
| Repo made private | `isPrivate: true` | Omit evidence block for that project | Case study renders without evidence |
| Malformed response | Zod parse failure | Fail loudly, keep cache, exit 1 if no cache exists | None |
| `202` on stats endpoint | status | Retry once after 2 s, then omit commit sparkline | Sparkline absent |
| Cache older than 14 days | `syncedAt` diff | CI warning annotation | None |

## 7.2 Runtime Endpoint — `POST /api/contact`

**Purpose:** deliver a contact message to the owner's inbox.
**Runtime:** Node (serverless function). **Auth:** none (public). **Rate limit:** 5 requests/hour per IP.

### Request

```http
POST /api/contact
Content-Type: application/json

{
  "name": "Priya Raman",
  "email": "priya@examplecorp.com",
  "organization": "Example Corp",
  "message": "We're hiring a backend engineer and your inventory-sync write-up was exactly the kind of thinking we need. Are you open to a chat next week?",
  "source": "linkedin",
  "_hp": "",
  "_t": 1757241600000,
  "turnstileToken": "0.abc123..."
}
```

| Field | Type | Rules |
|---|---|---|
| `name` | string | required, 2–80 chars, trimmed |
| `email` | string | required, RFC-valid, ≤ 254 chars |
| `organization` | string | optional, ≤ 120 chars |
| `message` | string | required, 20–2,000 chars |
| `source` | enum | optional: `linkedin` \| `github` \| `referral` \| `search` \| `other` |
| `_hp` | string | honeypot — **must be empty**; any value ⇒ silent 200 with no send |
| `_t` | number | epoch ms when the form was rendered; `now - _t < 2000` ⇒ treated as bot |
| `turnstileToken` | string | required in production; verified server-side |

### Responses

```jsonc
// 200 OK
{ "ok": true, "message": "Message received. I typically reply within 48 hours." }

// 400 Bad Request — field-level validation
{
  "ok": false,
  "error": "VALIDATION_FAILED",
  "fields": {
    "email": "Enter a valid email address.",
    "message": "Please write at least 20 characters."
  }
}

// 403 Forbidden — bot verification failed
{ "ok": false, "error": "VERIFICATION_FAILED",
  "message": "Verification failed. Please email me directly at [YOUR_EMAIL]." }

// 429 Too Many Requests
{ "ok": false, "error": "RATE_LIMITED", "retryAfter": 3600,
  "message": "You've sent several messages recently. Please email me directly at [YOUR_EMAIL]." }

// 500 Internal Server Error
{ "ok": false, "error": "SEND_FAILED",
  "message": "Something went wrong on my end. Please email me directly at [YOUR_EMAIL]." }
```

**Error-handling principles**

1. **Never lose the message.** The client retains form state on every non-200 response.
2. **Always offer the fallback.** Every error message includes the direct email address.
3. **Fail closed on bots, open on humans.** Honeypot and timing traps return `200` with no send — a bot must not learn it was detected. Genuine humans never face a CAPTCHA puzzle (Turnstile is invisible in the common case).
4. **Never leak internals.** Provider errors are logged server-side; the client sees only a generic message.
5. **Idempotency-ish.** A duplicate submission (same email + message hash) within 60 s returns the success response without re-sending.

## 7.3 Runtime Endpoint — `POST /api/revalidate` · **P2**

**Purpose:** allow a GitHub webhook to trigger a rebuild when a showcased repository is pushed to.

```http
POST /api/revalidate
X-Hub-Signature-256: sha256=<hmac>
Content-Type: application/json

{ "repository": { "full_name": "[GITHUB_USERNAME]/inventory-sync" } }
```

| Concern | Handling |
|---|---|
| Auth | HMAC-SHA256 over the raw body using `GH_WEBHOOK_SECRET`; **timing-safe comparison**; reject with `401` on mismatch |
| Allowlist | `repository.full_name` must appear in the content set, else `204` (ignore silently) |
| Debounce | At most one rebuild per repo per 10 minutes |
| Response | `202 Accepted` on trigger; `204 No Content` on ignore |
| Failure | Never blocks; the nightly cron is the guaranteed path |

## 7.4 Internal Data Access (not HTTP)

Content is read at build time through typed functions, not fetched. This is documented here because it is the interface the developer actually uses.

```ts
// src/lib/content.ts
getProjects(opts?: { featured?: boolean }): Promise<Project[]>  // sorted by `order`, then date desc
getProject(slug: string): Promise<Project | null>
getAllProjectSlugs(): Promise<string[]>                          // feeds generateStaticParams
getExperience(): Experience[]                                    // reverse-chronological
getSkills(): SkillGroup[]
getEducation(): Education[]
getSiteConfig(): SiteConfig

// src/lib/github.ts
getRepoData(nameWithOwner: string): RepoData | null              // null-safe by design
getCacheAge(): { syncedAt: string; days: number }
```

---

# 8. Data Models

All schemas live in `src/lib/schemas.ts` and are the single source of truth. Types are **inferred** from the Zod schemas (`z.infer<typeof ProjectSchema>`) so the type and the validator can never drift apart.

## 8.1 Entity Relationship Overview

```
                          ┌──────────────┐
                          │  SiteConfig  │  (singleton)
                          └──────────────┘

  ┌───────────┐   references (repo)   ┌──────────────┐
  │  Project  │ ────────────────────▶ │  RepoData    │  (generated cache, read-only)
  └─────┬─────┘        nullable       └──────────────┘
        │
        │ referenced by slug
        │
        ├────────────────┬────────────────────┐
        ▼                ▼                    ▼
  ┌───────────┐   ┌─────────────┐      ┌─────────────┐
  │   Skill   │   │ Experience  │      │  Education  │
  │ .projects │   │ .projects   │      │ .courses[]  │
  │  [slug]   │   │   [slug]    │      │  .projects  │
  └─────┬─────┘   └─────────────┘      └─────────────┘
        │
        │ grouped by
        ▼
  ┌─────────────┐
  │ SkillGroup  │
  └─────────────┘
```

**Relationship rules**

| Relationship | Cardinality | Integrity rule |
|---|---|---|
| Project → RepoData | 1 : 0..1 | A missing repo entry is valid; the evidence block is omitted |
| Skill → Project | M : N (by slug) | Every referenced slug **must** exist — build fails otherwise |
| Experience → Project | 1 : 0..N (by slug) | Same referential check |
| Education → Project | 1 : 0..N (by slug) | Same referential check |
| SkillGroup → Skill | 1 : N | Every skill belongs to exactly one group |

A `validate-content.ts` step performs the cross-file referential integrity check *after* individual schema parsing, because Zod alone cannot see across files.

## 8.2 Project Content Model

```ts
import { z } from 'zod';

const SlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  'Slug must be lowercase kebab-case');

const MetricSchema = z.object({
  label:      z.string().min(3).max(60),        // "Sync job p95 latency"
  baseline:   z.string().min(1).max(40),        // "8.2 s"
  result:     z.string().min(1).max(40),        // "1.4 s"
  delta:      z.string().max(40).optional(),    // "−83%"
  method:     z.string().min(10).max(200),      // REQUIRED: how it was measured
  instrument: z.string().max(80).optional(),    // "k6, 200 VU, 5 min, staging"
  isHeadline: z.boolean().default(false),
});

const DecisionSchema = z.object({
  decision:    z.string().min(10).max(120),   // "How to invalidate the read cache"
  chosen:      z.string().min(5).max(200),
  alternatives: z.array(z.string().min(3).max(200)).min(1,
    'Name at least one rejected alternative — the trade-off is the signal'),
  rationale:   z.string().min(20).max(600),
  tradeoff:    z.string().min(10).max(400),   // what you knowingly gave up
});

const LinkSchema = z.object({
  label: z.string().min(2).max(60),
  href:  z.string().url(),
  kind:  z.enum(['repo', 'source', 'demo', 'docs', 'writeup', 'release', 'other']),
});

export const ProjectFrontmatterSchema = z.object({
  // ── Identity ──────────────────────────────────────────────
  slug:      SlugSchema,
  title:     z.string().min(2).max(80),
  tagline:   z.string().min(20).max(140),   // AC-02.2: the plain-language one-liner
  summary:   z.string().min(120).max(400),  // AC-04.9: the ≤60-word standalone block

  // ── Curation ──────────────────────────────────────────────
  featured:  z.boolean().default(false),
  tier:      z.enum(['flagship', 'supporting', 'archive']).default('supporting'),
  order:     z.number().int().min(0).default(100),
  status:    z.enum(['draft', 'published']).default('draft'),

  // ── Honest scoping (AC-04.6) ──────────────────────────────
  role:      z.enum(['solo', 'lead', 'contributor', 'team-member']),
  teamSize:  z.number().int().min(1).max(500).default(1),
  context:   z.enum(['personal', 'academic', 'freelance', 'employment', 'open-source']),
  hasUsers:  z.boolean().default(false),
  userScale: z.string().max(60).optional(),  // "~400 monthly active" — omit if unknown

  // ── Timeline ──────────────────────────────────────────────
  startDate: z.string().date(),                       // ISO YYYY-MM-DD
  endDate:   z.string().date().nullable().default(null), // null = ongoing

  // ── Technical ─────────────────────────────────────────────
  repo:      z.string().regex(/^[\w.-]+\/[\w.-]+$/).optional(),  // "owner/name"
  stack:     z.array(z.string().min(1).max(40)).min(1).max(12),
  domains:   z.array(z.enum(['frontend','backend','data','infra','mobile','ml','devtools','security']))
               .min(1),

  // ── Narrative structure (AC-04.1) ─────────────────────────
  problem:     z.string().min(80).max(1000),
  constraints: z.array(z.string().min(10).max(300)).min(1),
  decisions:   z.array(DecisionSchema).min(2, 'A case study needs at least two real decisions'),
  metrics:     z.array(MetricSchema).default([]),
  limitations: z.array(z.string().min(15).max(400)).min(1,
    'Limitations are required — their absence is a credibility problem'),

  // ── Media & links ─────────────────────────────────────────
  cover:       z.object({
    src: z.string().startsWith('/'),
    alt: z.string().min(10).max(200),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }).optional(),
  architecture: z.object({
    src: z.string().startsWith('/'),
    alt: z.string().min(20).max(500),   // must convey the relationships, not just "diagram"
    caption: z.string().max(300).optional(),
  }).optional(),
  links: z.array(LinkSchema).default([]),

  // ── SEO ───────────────────────────────────────────────────
  seoTitle:       z.string().max(60).optional(),
  seoDescription: z.string().min(70).max(160).optional(),
})
.refine(d => d.endDate === null || d.endDate >= d.startDate,
  { message: 'endDate must be on or after startDate', path: ['endDate'] })
.refine(d => d.role !== 'solo' || d.teamSize === 1,
  { message: 'role "solo" requires teamSize 1', path: ['teamSize'] })
.refine(d => !d.hasUsers || !!d.userScale,
  { message: 'If hasUsers is true, provide userScale', path: ['userScale'] })
.refine(d => d.status !== 'published' || d.metrics.length > 0 || d.limitations.length >= 2,
  { message: 'A published project needs either measured metrics or a substantive limitations section',
    path: ['metrics'] });

export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>;
export type Project = ProjectFrontmatter & { body: string; readingTimeMinutes: number };
```

### Example frontmatter

```yaml
---
slug: inventory-sync
title: Inventory Sync
tagline: Keeps stock counts consistent across three storefronts that all write at once.
summary: >
  A conflict-resolving synchronization service for a small retailer running Shopify,
  a POS terminal, and a warehouse spreadsheet. Concurrent writes were producing
  oversells. I replaced last-write-wins with a versioned reconciliation loop and cut
  p95 sync latency from 8.2 s to 1.4 s.
featured: true
tier: flagship
order: 10
status: published
role: solo
teamSize: 1
context: freelance
hasUsers: true
userScale: "~40 daily operator sessions"
startDate: 2026-01-14
endDate: 2026-04-02
repo: "[GITHUB_USERNAME]/inventory-sync"
stack: [TypeScript, Node.js, PostgreSQL, Redis, Docker]
domains: [backend, data]
problem: >
  Three systems wrote to the same stock counts with no coordination. Last-write-wins
  meant a POS sale and a warehouse adjustment landing within the same second could
  silently discard one of them, producing oversells that surfaced days later as
  cancelled customer orders.
constraints:
  - "No control over the Shopify webhook delivery order or its at-least-once semantics."
  - "The POS terminal was offline for up to 4 hours a day and batched its writes."
  - "Single 1 GB VPS; no budget for managed infrastructure."
decisions:
  - decision: How to resolve concurrent writes to the same SKU
    chosen: Per-SKU version vector with a deterministic reconciliation function
    alternatives:
      - "Last-write-wins on timestamp (the status quo)"
      - "Pessimistic row locking in Postgres"
    rationale: >
      Timestamps were unreliable because the POS clock drifted and batched writes
      arrived hours late. Row locking would have serialized the whole ingest path and
      couldn't express "offline device catching up" at all. Version vectors let a late
      write be merged rather than dropped or blocked.
    tradeoff: >
      Reconciliation is now the most complex code in the system and needs its own test
      suite. I accepted higher code complexity to remove silent data loss.
  - decision: Where to hold the pending-write queue
    chosen: A Postgres table with SKIP LOCKED polling
    alternatives:
      - "Redis lists (Redis was already in the stack for caching)"
      - "A managed queue such as SQS"
    rationale: >
      The reconciliation step needs to read the current stock row and the pending writes
      in one transaction. Keeping the queue in Postgres made that a single query instead
      of a distributed read, and it removed the possibility of the queue and the data
      disagreeing after a crash. A managed queue was out of budget on a single VPS.
    tradeoff: >
      Polling costs a query every 250 ms even when idle, and throughput is bounded by
      Postgres rather than by Redis. At this scale that ceiling is roughly two orders of
      magnitude above the real load, so I took the consistency instead.
metrics:
  - label: Sync job p95 latency
    baseline: "8.2 s"
    result: "1.4 s"
    delta: "−83%"
    method: "Timed end-to-end from webhook receipt to committed row, over 7 days of production traffic"
    instrument: "Application traces exported to a Postgres timing table"
    isHeadline: true
  - label: Oversell incidents per month
    baseline: "6"
    result: "0"
    method: "Counted from the client's cancelled-order log across three months post-launch"
limitations:
  - "Reconciliation is single-writer per SKU; it would not scale past roughly 50 writes/second on this hardware."
  - "No automatic recovery if the version vector table itself is corrupted — recovery is a documented manual replay."
  - "I would use an append-only event log next time; reconstructing history from the current schema is painful."
links:
  - { label: "Reconciliation loop", href: "https://github.com/[GITHUB_USERNAME]/inventory-sync/blob/main/src/sync/reconcile.ts#L40-L118", kind: source }
  - { label: "Architecture notes", href: "https://github.com/[GITHUB_USERNAME]/inventory-sync/blob/main/docs/adr/0003-version-vectors.md", kind: docs }
---
```

## 8.3 Experience Model

```ts
export const ExperienceSchema = z.object({
  id:           SlugSchema,
  organization: z.string().min(2).max(100),
  orgUrl:       z.string().url().optional(),
  title:        z.string().min(2).max(100),
  type:         z.enum(['full-time','part-time','internship','contract','freelance',
                        'open-source','volunteer','academic']),
  location:     z.string().max(80),
  workMode:     z.enum(['on-site','hybrid','remote']),
  startDate:    z.string().regex(/^\d{4}-\d{2}$/),                    // YYYY-MM
  endDate:      z.string().regex(/^\d{4}-\d{2}$/).nullable(),         // null = present
  summary:      z.string().min(40).max(300),
  highlights:   z.array(z.string().min(25).max(300)).min(2).max(5),   // outcome-framed
  stack:        z.array(z.string().max(40)).max(15).default([]),
  projects:     z.array(SlugSchema).default([]),                      // FK → Project.slug
  confidential: z.boolean().default(false),  // if true, org shown generically ("a fintech startup")
})
.refine(d => d.endDate === null || d.endDate >= d.startDate,
  { message: 'endDate must be on or after startDate', path: ['endDate'] });
```

**Validation rules beyond the schema** (enforced in `validate-content.ts`):

| Rule | Reason |
|---|---|
| Every `projects[]` slug resolves to an existing project | Prevents dead links |
| At most one entry may have `endDate: null` per `type: full-time` | Catches copy-paste errors |
| `highlights` must not begin with "Responsible for", "Worked on", or "Helped with" | AC-07.2 — duty framing is the most common résumé failure |
| Entries sorted by `startDate` descending at render time, not authoring time | Removes a manual chore |

## 8.4 Skills Model

```ts
export const SkillSchema = z.object({
  id:          SlugSchema,
  name:        z.string().min(1).max(40),
  category:    z.enum(['language','framework','data','infrastructure','tooling','practice']),
  level:       z.enum(['learning','working','proficient','deep']),   // AC-06.3: never a %
  firstUsed:   z.number().int().min(2000).max(2100),                 // year
  lastUsed:    z.number().int().min(2000).max(2100).nullable().default(null), // null = current
  projects:    z.array(SlugSchema).default([]),                      // FK → Project.slug
  note:        z.string().max(160).optional(),   // "Comfortable with generics and pgx; not with query planning internals"
  showcase:    z.boolean().default(false),       // surface on the landing page
})
.refine(d => d.lastUsed === null || d.lastUsed >= d.firstUsed,
  { message: 'lastUsed must be ≥ firstUsed', path: ['lastUsed'] })
.refine(d => !['proficient','deep'].includes(d.level) || d.projects.length > 0,
  { message: 'Proficient/deep skills must reference at least one project as evidence (AC-06.4)',
    path: ['projects'] });
```

**The level vocabulary** — displayed on the page so the scale is not left to interpretation:

| Level | Public definition |
|---|---|
| **Learning** | Currently building with it; still reaching for documentation constantly. |
| **Working** | Can build features independently; would need help with unusual problems. |
| **Proficient** | Can design and own a component in it; understand the common failure modes. |
| **Deep** | Can debug it under pressure, reason about its internals, and teach it. |

Publishing these definitions is itself an anti-generic signal — it is the opposite of an unexplained "92%" bar.

## 8.5 Education / CS Background Model

```ts
export const CourseSchema = z.object({
  code:      z.string().max(20).optional(),        // "CS 3410"
  name:      z.string().min(3).max(120),
  term:      z.string().max(30).optional(),        // "Fall 2025"
  grade:     z.string().max(10).optional(),        // include only if it helps
  takeaway:  z.string().min(20).max(240),          // AC-08.2: REQUIRED — what it produced/taught
  projects:  z.array(SlugSchema).default([]),      // FK → Project.slug
  repoUrl:   z.string().url().optional(),
});

export const EducationSchema = z.object({
  id:           SlugSchema,
  institution:  z.string().min(2).max(120),
  institutionUrl: z.string().url().optional(),
  degree:       z.string().min(2).max(120),        // "B.Sc. Computer Science"
  field:        z.string().max(120).optional(),
  location:     z.string().max(80),
  startDate:    z.string().regex(/^\d{4}-\d{2}$/),
  endDate:      z.string().regex(/^\d{4}-\d{2}$/).nullable(),
  expected:     z.boolean().default(false),        // true → render "Expected <date>"
  gpa:          z.object({ value: z.number().min(0).max(5), scale: z.number().min(4).max(5) })
                  .optional(),                     // include only if it is a strength
  focusAreas:   z.array(z.string().max(60)).max(6).default([]),
  courses:      z.array(CourseSchema).min(4).max(8),   // AC-08.2
  thesis:       z.object({
    title: z.string().max(200),
    abstract: z.string().min(80).max(800),
    advisor: z.string().max(80).optional(),
    url: z.string().url().optional(),
  }).optional(),
  honors:       z.array(z.string().max(160)).default([]),
  activities:   z.array(z.string().max(160)).default([]),
});
```

## 8.6 Site Configuration Model

```ts
export const SiteConfigSchema = z.object({
  name:        z.string().min(2).max(80),
  headline:    z.string().min(20).max(120),   // AC-01.2: must be specific
  valueProp:   z.string().min(40).max(200),
  availability: z.object({
    status: z.enum(['open','selectively-open','not-looking']),
    detail: z.string().max(120),              // "Open to internships from Jan 2027"
    location: z.string().max(80),
  }),
  email:       z.string().email(),
  resumePath:  z.string().startsWith('/').endsWith('.pdf'),
  resumeUpdated: z.string().date(),
  socials:     z.array(z.object({
    platform: z.enum(['github','linkedin','x','mastodon','bluesky','email','other']),
    url: z.string().url(),
    label: z.string().max(60),
  })).min(1),
  githubUsername: z.string().min(1).max(39),
  seo: z.object({
    siteUrl: z.string().url(),
    defaultTitle: z.string().max(60),
    defaultDescription: z.string().min(70).max(160),
    twitterHandle: z.string().max(16).optional(),
    locale: z.string().default('en_US'),
  }),
  analytics: z.object({
    provider: z.enum(['plausible','umami','none']),
    domain: z.string().max(120).optional(),
    scriptUrl: z.string().url().optional(),
  }),
});
```

## 8.7 GitHub Cache Model (generated — do not hand-edit)

```ts
export const RepoDataSchema = z.object({
  nameWithOwner: z.string(),
  description:   z.string().nullable(),
  url:           z.string().url(),
  homepageUrl:   z.string().url().nullable(),
  isPrivate:     z.boolean(),
  isArchived:    z.boolean(),
  createdAt:     z.string().datetime(),
  pushedAt:      z.string().datetime(),
  stars:         z.number().int().min(0),
  forks:         z.number().int().min(0),
  license:       z.object({ spdxId: z.string(), name: z.string() }).nullable(),
  primaryLanguage: z.object({ name: z.string(), color: z.string() }).nullable(),
  languages:     z.array(z.object({
    name: z.string(), color: z.string(), bytes: z.number().int(), percent: z.number().min(0).max(100),
  })),
  topics:        z.array(z.string()),
  commitCount:   z.number().int().min(0),
  lastCommit:    z.object({
    date: z.string().datetime(), messageHeadline: z.string(), oid: z.string(),
  }).nullable(),
  commitActivity: z.array(z.number().int().min(0)).length(52).nullable(), // weekly, oldest→newest
  contributorCount: z.number().int().min(1).nullable(),
  latestRelease: z.object({
    tagName: z.string(), publishedAt: z.string().datetime(), url: z.string().url(),
  }).nullable(),
  readmeExcerpt: z.string().max(2000).nullable(),
  stale:         z.boolean().default(false),
});

export const GitHubCacheSchema = z.object({
  version:  z.literal(1),
  syncedAt: z.string().datetime(),
  repos:    z.record(z.string(), RepoDataSchema),   // key = "owner/name"
});
```

## 8.8 Validation Rules Summary

| Category | Rule | Enforced by | Failure mode |
|---|---|---|---|
| Structural | All required frontmatter fields present and correctly typed | Zod | Build fails, field named |
| Narrative | ≥ 2 decisions, each with ≥ 1 rejected alternative | Zod `.min()` | Build fails |
| Narrative | Limitations section non-empty | Zod `.min(1)` | Build fails |
| Narrative | Published projects need metrics **or** ≥ 2 limitations | Zod `.refine()` | Build fails |
| Evidential | Every metric has a `method` | Zod required field | Build fails |
| Evidential | Proficient/Deep skills reference ≥ 1 project | Zod `.refine()` | Build fails |
| Referential | Every project slug referenced anywhere exists | `validate-content.ts` | Build fails, both files named |
| Referential | Every `repo` in frontmatter is a valid `owner/name` | Zod regex | Build fails |
| Temporal | `endDate ≥ startDate` everywhere | Zod `.refine()` | Build fails |
| Editorial | No `highlights` entry starts with a duty-framing phrase | `validate-content.ts` | Build **warns** (not blocking) |
| Editorial | No banned cliché from §12.6 appears in `summary`/About | `validate-content.ts` | Build **warns** |
| Media | Every image has non-empty, ≥ 10-char alt text | Zod | Build fails |
| SEO | Descriptions 70–160 chars | Zod | Build fails |
| Uniqueness | Slugs unique across projects | `validate-content.ts` | Build fails |

## 8.9 Storage Requirements

| Asset | Per unit | At MVP (5 projects) | At 25 projects |
|---|---|---|---|
| MDX case study | 8–20 KB | ~70 KB | ~350 KB |
| Typed content files | — | ~15 KB | ~40 KB |
| `github-cache.json` | ~6 KB/repo | ~35 KB | ~160 KB |
| Screenshots (AVIF, ≤ 200 KB) | ≤ 200 KB × 3 | ~2 MB | ~10 MB |
| Architecture SVGs | 5–40 KB | ~120 KB | ~600 KB |
| Fonts (2 variable families) | — | ~110 KB | ~110 KB |
| Résumé PDF | ~200 KB | ~200 KB | ~200 KB |
| **Repository total** | | **≈ 3 MB** | **≈ 12 MB** |
| **Built output (`.next`)** | | **≈ 25 MB** | **≈ 70 MB** |

Comfortably inside every free-tier limit and inside a small VPS. **No database is required at any scale contemplated by this document.** If the site ever needs one, that is a signal that scope has drifted well beyond a portfolio.

---

# 9. Implementation Plan

## 9.1 Planning Assumptions

| Assumption | Value |
|---|---|
| Available capacity | 10 hours/week (2 weekday evenings × 2 h + 1 weekend block × 6 h) |
| Sprint length | 1 week |
| Total MVP effort | ~90 hours across 9 sprints (Sprint 0 – Sprint 8) |
| Buffer | Sprint 8 is the buffer sprint — it absorbs overrun from anywhere earlier. Solo estimates are optimistic by nature. |
| Working style | One sprint goal at a time; no parallel workstreams |

**Mapping to the original four phases:** Phase 1 (foundation & core sections) = Sprints 0–3 · Phase 2 (GitHub presentation & case studies) = Sprint 4 · Phase 3 (animation, scroll storytelling, refinement) = Sprint 5 · Phase 4 (performance, deployment prep, launch) = Sprints 6–8.

**The single biggest risk to this plan is content, not code.** Writing four decision-level case studies is 20–25 hours of genuine cognitive work and it cannot be compressed. Sprint 0 starts the writing before any code exists, precisely so that content is not the thing blocking launch in week 8.

## 9.2 Sprint Breakdown

### Sprint 0 — Foundation & Content Kickoff (Week 1, ~10 h)

**Goal:** the repository exists, the toolchain works, and case-study writing has begun.

| # | Task | Est. |
|---|---|---|
| 0.1 | `create-next-app` (TS, App Router, Tailwind v4), pnpm, strict tsconfig | 1.0 h |
| 0.2 | ESLint 9 flat config + jsx-a11y, Prettier, Husky, lint-staged | 1.0 h |
| 0.3 | GitHub repo, branch protection, CI skeleton (`lint → typecheck → build`) | 1.0 h |
| 0.4 | Vercel project connected; preview deploys verified on a PR | 0.5 h |
| 0.5 | **Select the 4–6 repositories to showcase** (decision, written down with reasons) | 1.0 h |
| 0.6 | Draft case study #1 — all five beats, ugly prose is fine | 3.0 h |
| 0.7 | Draft case study #2 | 2.5 h |

**Exit criteria:** CI green on `main`; a hello-world page deployed to a preview URL; two case-study drafts exist as plain markdown.
**Dependencies:** none.

---

### Sprint 1 — Content System (Week 2, ~10 h)

**Goal:** US-12 works. Adding a project is a one-file operation.

| # | Task | Est. |
|---|---|---|
| 1.1 | Write all Zod schemas in `src/lib/schemas.ts` (§8) | 2.5 h |
| 1.2 | MDX pipeline: `@next/mdx` + `remark-gfm` + `rehype-slug` + `rehype-autolink-headings` + Shiki | 2.0 h |
| 1.3 | `src/lib/content.ts` — typed loaders, reading-time calculation | 1.5 h |
| 1.4 | `scripts/validate-content.ts` — Zod parse + cross-file referential integrity | 1.5 h |
| 1.5 | `scripts/new-project.ts` + `content/projects/_TEMPLATE.mdx` | 1.0 h |
| 1.6 | Migrate the two Sprint-0 drafts into valid MDX; fix schema friction found in the process | 1.0 h |
| 1.7 | Wire `validate` into CI as a blocking step | 0.5 h |

**Exit criteria:** `pnpm new:project` → fill in → `pnpm validate` passes → typed data is available to components. Deliberately break a file and confirm the error message names the file *and* the field.
**Dependencies:** Sprint 0.
**Risk:** schema over-engineering. Timebox 1.1 to 2.5 h; the schema will be revised in Sprint 4 once real rendering exposes what is missing.

---

### Sprint 2 — Design System & Layout Shell (Week 3, ~10 h)

**Goal:** the visual language exists as tokens and primitives before any page is built.

| # | Task | Est. |
|---|---|---|
| 2.1 | Choose and license 2 typefaces; self-host, subset, wire `next/font/local` | 2.0 h |
| 2.2 | `styles/tokens.css` — full token set per §11.3 (color, type scale, space, motion, radii) | 2.0 h |
| 2.3 | Primitives: `Container`, `Stack`, `Grid`, `Text`, `VisuallyHidden`, `SkipLink` | 2.0 h |
| 2.4 | Root layout, header/nav (with mobile menu), footer | 2.0 h |
| 2.5 | Focus-visible system, reduced-motion global mechanism, dark/light token pairs | 1.0 h |
| 2.6 | `docs/DESIGN-SYSTEM.md` — token reference and usage rules | 1.0 h |

**Exit criteria:** a token showcase route renders the full type scale, color pairs, and spacing rhythm. Keyboard traversal of nav works. Contrast verified for every token pair.
**Dependencies:** Sprint 0.
**Note:** this sprint is where the anti-generic outcome is actually won or lost (§11). Do not rush it and do not start it by opening a component library.

---

### Sprint 3 — Core Content Sections (Week 4, ~10 h)

**Goal:** US-01, US-02, US-06, US-07, US-08 — the entire landing page, without motion.

| # | Task | Est. |
|---|---|---|
| 3.1 | `Hero` section (AC-01.1–01.3, 01.5, 01.7) | 2.0 h |
| 3.2 | `ProjectShowcase` + static `ProjectCard` (AC-02.x) | 2.0 h |
| 3.3 | `SkillsTimeline` — grouped, level bands, keyboard nav, mobile fallback | 2.5 h |
| 3.4 | `ExperienceList` — reverse-chronological, outcome bullets, project links | 1.5 h |
| 3.5 | `About` + `EducationBlock` with course takeaways | 1.5 h |
| 3.6 | Responsive pass at all breakpoints; fix overflow | 0.5 h |

**Exit criteria:** the full landing page renders real content, is fully responsive, and passes axe with zero violations — with no animation code written yet.
**Dependencies:** Sprints 1 and 2.

---

### Sprint 4 — GitHub Integration & Case Study Pages (Week 5, ~10 h)

**Goal:** US-04, US-05, US-16 — the depth layer.

| # | Task | Est. |
|---|---|---|
| 4.1 | `scripts/sync-github.ts` — GraphQL batch + REST, Zod-validated, atomic write | 3.0 h |
| 4.2 | Failure handling: backoff, rate-limit guard, cache preservation, staleness warning | 1.5 h |
| 4.3 | `RepoEvidence` component — languages, commits, age, license, "data as of" | 1.5 h |
| 4.4 | `/projects/[slug]` page + `generateStaticParams` | 1.0 h |
| 4.5 | Case study components: `DecisionTable`, `MetricBlock`, `ArchitectureFigure`, `LimitationsList`, `SourceLink`, in-page TOC | 2.0 h |
| 4.6 | `/projects` index page | 1.0 h |

**Exit criteria:** two full case studies render end to end with live evidence. `pnpm build` succeeds with the network disabled (G7).
**Dependencies:** Sprints 1 and 3.
**Risk:** GraphQL query iteration is fiddly. Test the query in GitHub's GraphQL Explorer *before* writing any script code.

---

### Sprint 5 — Motion & Interaction (Week 6, ~10 h)

**Goal:** US-03, US-10 — the layer that makes it feel crafted.

| # | Task | Est. |
|---|---|---|
| 5.1 | `useReducedMotion` hook + motion token wiring; global kill switch | 1.0 h |
| 5.2 | `Reveal` component — IntersectionObserver, staggered, CSS-only fallback | 1.5 h |
| 5.3 | `ProjectCard` interaction states — hover, focus, touch parity (AC-03.x) | 2.0 h |
| 5.4 | One scroll-linked structural transition (sticky title / advancing timeline axis) | 2.5 h |
| 5.5 | `ScrollProgress` on case studies; page transitions | 1.0 h |
| 5.6 | Performance pass: verify compositor-only properties, profile at 4× CPU throttle | 1.5 h |
| 5.7 | Full reduced-motion audit of every animated element | 0.5 h |

**Exit criteria:** 60 fps scroll on a throttled mid-range profile; the site is fully coherent with motion disabled; CLS contribution from interaction is 0.
**Dependencies:** Sprints 3 and 4.
**Risk:** this is the scope-creep sprint. Hard rule — if an effect does not clarify structure or state, it does not ship.

---

### Sprint 6 — Contact, SEO & Sharing (Week 7, ~10 h)

**Goal:** US-09, US-13.

| # | Task | Est. |
|---|---|---|
| 6.1 | `ContactForm` — fields, inline validation, `aria-live`, state preservation | 2.5 h |
| 6.2 | `POST /api/contact` — Zod, honeypot, timing check, Turnstile, rate limit, Resend | 2.5 h |
| 6.3 | All error and success states (§7.2), verified by forcing each response | 1.0 h |
| 6.4 | Metadata API: per-route title/description/canonical; JSON-LD (`Person`, `CreativeWork`) | 1.5 h |
| 6.5 | `opengraph-image.tsx` per project via `next/og` | 1.5 h |
| 6.6 | `sitemap.ts`, `robots.ts`, favicon set, web manifest | 1.0 h |

**Exit criteria:** a real message arrives in the inbox; every error path verified; OG previews verified in LinkedIn, Slack, and X.
**Dependencies:** Sprint 2.

---

### Sprint 7 — Testing, Performance & Hardening (Week 8, ~10 h)

**Goal:** US-14, US-15 — clear every launch gate.

| # | Task | Est. |
|---|---|---|
| 7.1 | Vitest: schema validation, content loaders, date/format utils | 1.5 h |
| 7.2 | Playwright E2E: Flow A, Flow B, Flow C (all three contact paths) | 2.0 h |
| 7.3 | `@axe-core/playwright` across every route × 3 breakpoints, wired into CI | 1.5 h |
| 7.4 | Manual screen-reader pass: VoiceOver/Safari and NVDA/Firefox | 1.5 h |
| 7.5 | Lighthouse CI with `lighthouserc.json` budgets; bundle-size check in CI | 1.0 h |
| 7.6 | Performance remediation against §5.8 budgets | 1.5 h |
| 7.7 | Security headers, CSP with nonces, `pnpm audit`, secret-scan of build output | 1.0 h |

**Exit criteria:** gates G2–G6 and G8 all pass in CI.
**Dependencies:** Sprints 3–6.

---

### Sprint 8 — Content Completion, Review & Launch (Week 9, ~10 h — the buffer sprint)

**Goal:** ship.

| # | Task | Est. |
|---|---|---|
| 8.1 | Complete case studies #3 and #4 to publication standard | 4.0 h |
| 8.2 | Editorial pass on all copy against the §12.6 banned-phrase list | 1.0 h |
| 8.3 | External review: 3 engineers + 1 recruiter; collect blocking notes (G10) | 1.0 h |
| 8.4 | Resolve blocking review notes | 2.0 h |
| 8.5 | Nightly `sync-github.yml` cron; Renovate config; `docs/DEPLOYMENT.md` | 1.0 h |
| 8.6 | Final gate checklist G1–G10; production deploy; Search Console submission | 1.0 h |

**Exit criteria:** all ten launch gates pass. Live.

## 9.3 Timeline and Dependencies

```
Week: 1     2     3     4     5     6     7     8     9
      ├─S0──┼─S1──┼─S2──┼─S3──┼─S4──┼─S5──┼─S6──┼─S7──┼─S8──┤
      Setup  Content Design Sections GitHub Motion Contact Test  Launch
             system  system          + case        + SEO   + perf
                                       studies

Dependency graph:
  S0 ──┬──▶ S1 ──┬──▶ S3 ──┬──▶ S4 ──┬──▶ S5 ──┐
       │         │         │         │         ├──▶ S7 ──▶ S8
       └──▶ S2 ──┴─────────┘         └──▶ S6 ──┘
                                              (S6 needs only S2)

Content writing runs in PARALLEL from Sprint 0 onward — it is never on the code critical path.
```

**Critical path:** S0 → S1 → S3 → S4 → S5 → S7 → S8. Sprints 2 and 6 have slack and can absorb overruns elsewhere.

## 9.4 Solo Developer Workflow

| Practice | Rule | Why it matters solo |
|---|---|---|
| **Branching** | `main` is always deployable. Work on `feat/*`, merge via PR — even alone. | The PR is your review checkpoint and your CI gate. |
| **Self-review** | Read your own diff in the GitHub UI before merging. | Catches roughly a third of your own mistakes, cheaply. |
| **Commits** | Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`). | Makes the history readable — and the history is itself a hiring signal. |
| **Sprint discipline** | One sprint goal at a time. Anything out of scope goes to `BACKLOG.md`, not into the branch. | Scope creep is the #1 killer of solo projects. |
| **Session ritual** | Start each session by reading the sprint's exit criteria. End by writing 2 lines in `NOTES.md`: what you did, what's next. | You will lose context between sessions. This is the cheapest possible fix. |
| **Timeboxing** | Stuck for 45 minutes? Write down the blocker, switch to a different task, return next session. | Solo rabbit holes have nobody to pull you out. |
| **Definition of done** | Merged + deployed to preview + acceptance criteria verified + no new axe violations. | Prevents a pile of 90%-finished features. |
| **Content batching** | Write case-study prose in dedicated writing sessions, never mixed with coding sessions. | Different cognitive mode; mixing produces bad code and worse prose. |
| **Dependency hygiene** | Renovate PRs reviewed weekly, grouped, merged in one batch. | Prevents the 6-month rot that kills portfolio maintainability. |
| **The 2-month test** | Every quarter, follow `docs/ADDING-A-PROJECT.md` literally. If any step is unclear, fix the doc immediately. | The docs *are* the maintainability guarantee. |

## 9.5 Testing Strategy

| Layer | Tool | Coverage target | Runs on | Rationale |
|---|---|---|---|---|
| **Content validation** | Zod + `validate-content.ts` | 100% of content files | Every build | Highest-value layer — most defects here are content, not code |
| **Unit** | Vitest | Schemas, loaders, formatters, GitHub response transforms | Every PR | Test logic, not markup |
| **Component** | Vitest + Testing Library | Only components with real logic (`SkillsTimeline` filtering, `ContactForm` validation) | Every PR | Don't test presentational components — the visual tests cover those |
| **Integration** | Vitest | `sync-github.ts` against recorded API fixtures, including every §7.1.6 failure case | Every PR | The failure paths are the point; test them explicitly |
| **E2E** | Playwright | Flows A, B, C end to end | Every PR | Confirms the user journeys, not the units |
| **Accessibility** | `@axe-core/playwright` | Every route × 375/768/1440 | Every PR | Zero violations is a hard gate |
| **Visual regression** | Playwright screenshots | Landing, project index, one case study, contact — light + dark, 3 widths | Every PR | Catches the layout drift that unit tests never will |
| **Performance** | Lighthouse CI | Landing + one case study, mobile throttled | Every PR | Budget regressions fail the build |
| **Manual** | VoiceOver, NVDA, real iPhone, real Android | Full site | Before each release | Automation catches ~40% of a11y issues; the rest needs a human |
| **Content review** | Human editorial checklist | Every new case study | On authoring | The five beats, the method on every metric, no banned phrases |

**Explicit non-goal:** a coverage percentage target. Chasing 80% on a static site produces tests of JSX. Test the schemas, the transforms, the failure paths, and the user flows — and skip the rest.

## 9.6 Deployment Strategy

### Environments

| Environment | Trigger | URL | Purpose |
|---|---|---|---|
| Local | `pnpm dev` | `localhost:3000` | Development |
| Preview | Any PR | `pr-<n>-portfolio.vercel.app` | Review + Lighthouse + axe |
| Production | Merge to `main` | `[YOUR_DOMAIN]` | Live |

### CI pipeline (`.github/workflows/ci.yml`)

```
PR opened / updated
  ├─ install (pnpm, frozen lockfile, cached)
  ├─ lint            (ESLint + Prettier check)
  ├─ typecheck       (tsc --noEmit)
  ├─ validate        (Zod content + referential integrity)   ← blocking
  ├─ test:unit       (Vitest)
  ├─ build           (next build; bundle-size budget check)  ← blocking
  ├─ test:e2e        (Playwright against the preview build)
  ├─ test:a11y       (axe-core, all routes × 3 breakpoints)  ← blocking, 0 violations
  ├─ lighthouse      (budgets from lighthouserc.json)        ← blocking
  └─ deploy preview  (Vercel)

Merge to main
  └─ deploy production + purge CDN cache
```

### Scheduled sync (`.github/workflows/sync-github.yml`)

```yaml
on:
  schedule:
    - cron: '0 3 * * *'      # 03:00 UTC daily
  workflow_dispatch:          # manual trigger

steps:
  - checkout
  - setup pnpm + install
  - run sync:github            # env: GH_SYNC_TOKEN
  - if data/github-cache.json changed:
      commit "chore: sync github data [skip ci]"
      push                     # push to main triggers the production deploy
  - else: exit 0 (no deploy)
```

### Rollback

| Method | Time | When |
|---|---|---|
| Vercel instant rollback to previous deployment | < 30 s | Anything visibly broken in production |
| `git revert` + push | ~2 min | When the fix should be recorded in history |
| Restore `data/github-cache.json` from a previous commit | ~1 min | Bad sync wrote wrong data |

### Domain and DNS (when ready)

1. Register `[YOUR_DOMAIN]`.
2. Add it in Vercel; add the `A`/`CNAME` records it specifies.
3. Verify automatic TLS provisioning.
4. Set `www` → apex as a 308 permanent redirect (pick one canonical host and keep it forever).
5. Update `siteConfig.seo.siteUrl`; redeploy so canonicals, sitemap, and OG URLs all update.
6. Submit the new property in Google Search Console; keep the old preview URL indexed-blocked.

## 9.7 Risk Register

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Case-study writing takes far longer than estimated | **High** | **High** | Start in Sprint 0; write 2 before any page exists; template removes the blank-page problem |
| R2 | Design perfectionism consumes Sprints 2 and 5 | **High** | **High** | Sprint 2 exit criteria are objective (tokens exist, contrast passes). Set a hard "ship the B+ version" rule; refine post-launch |
| R3 | Motion work balloons in Sprint 5 | Medium | Medium | The rule in AC-03.7 and AC-10.4 is a written scope boundary, not a preference |
| R4 | GitHub API shape changes | Low | Medium | Zod-parsed responses fail loudly; committed cache means the site never breaks |
| R5 | Performance budget missed after motion lands | Medium | Medium | Lighthouse CI from Sprint 2 onward, so regressions surface the week they happen — not in Sprint 7 |
| R6 | Contact form abused | Low | Low | Four-layer defense (§7.2); `mailto:` always works as a fallback |
| R7 | Solo motivation drops around week 5–6 | Medium | High | Deploy something visible every sprint; the preview URL is the reward mechanism |
| R8 | Selected projects turn out to have thin stories | Medium | High | Do the selection in Sprint 0.5 by *first* writing the one-liner and the headline metric. If you can't write those, pick a different repo |
| R9 | Schema churn forces content rewrites | Medium | Low | Accept one deliberate schema revision at the end of Sprint 4; freeze after that |
| R10 | Dependency rot post-launch | High (over time) | Medium | Renovate + a quarterly 2-hour maintenance block on the calendar |

---

# 10. Success Metrics

## 10.1 KPI Dashboard

### Tier 1 — Outcome metrics (do people want to talk to you?)

| KPI | Definition | Target | Instrument | Review |
|---|---|---|---|---|
| Contact-intent rate | (mailto clicks + résumé downloads + form submits) ÷ sessions > 60 s | ≥ 8% | Analytics events | Monthly |
| Qualified inbound | Messages referencing a *specific project or decision* | ≥ 1/month during an active search | Manual inbox tally | Monthly |
| Interview depth signal | % of first calls that open with a portfolio-specific technical question | ≥ 50% | Manual log after each call | Per search cycle |
| Résumé download rate | Downloads ÷ sessions > 30 s | ≥ 12% | Analytics event | Monthly |

### Tier 2 — Engagement metrics (are people actually reading?)

| KPI | Definition | Target | Instrument | Review |
|---|---|---|---|---|
| Median session duration | All sessions | ≥ 90 s | Analytics | Monthly |
| Landing → project CTR | Sessions viewing ≥ 1 case study ÷ all sessions | ≥ 35% | Analytics | Monthly |
| Case-study completion | Sessions reaching the Limitations section | ≥ 40% of case-study views | Scroll-depth event at the Limitations anchor | Monthly |
| Repo click-through | Clicks to GitHub from a case study | ≥ 15% of case-study views | Outbound link event | Monthly |
| Bounce (< 15 s, single page) | | ≤ 40% | Analytics | Monthly |
| Mobile share | Mobile sessions ÷ all | Tracked, not targeted | Analytics | Quarterly |

### Tier 3 — Technical quality (is it well built?)

| KPI | Target | Instrument | Review |
|---|---|---|---|
| LCP p75 (mobile, field) | ≤ 2.0 s | Speed Insights / CrUX | Weekly first month, then monthly |
| INP p75 (field) | ≤ 150 ms | Speed Insights | Same |
| CLS p75 (field) | ≤ 0.05 | Speed Insights | Same |
| Lighthouse Performance (mobile, lab) | ≥ 95 | Lighthouse CI | Every PR |
| Lighthouse Accessibility | 100 | Lighthouse CI | Every PR |
| axe violations | 0 | CI | Every PR |
| First-load JS (landing) | ≤ 90 KB gz | CI bundle check | Every PR |
| Build duration | ≤ 90 s | CI | Every PR |
| Uptime | ≥ 99.9% | Uptime monitor | Monthly |

### Tier 4 — Maintainability (will it still be current in a year?)

| KPI | Target | Instrument | Review |
|---|---|---|---|
| Time to publish a new project | ≤ 90 min | Timed and logged in `NOTES.md` | Per addition |
| Files touched to add a project | 1 MDX + assets, 0 components | `git diff --stat` on the addition commit | Per addition |
| Content freshness | Newest project ≤ 6 months old | Manual | Quarterly |
| Dependency currency | 0 major versions behind on framework; 0 high/critical advisories | Renovate + `pnpm audit` | Monthly |
| GitHub cache age | ≤ 2 days | CI warning | Automatic |
| Doc accuracy | `ADDING-A-PROJECT.md` followed literally with zero corrections needed | The quarterly 2-month test | Quarterly |

## 10.2 Portfolio Quality Evaluation Rubric

Score each case study out of 25 before publishing. **A score below 18 means it is not ready.**

| Dimension | 1 — Weak | 3 — Adequate | 5 — Strong |
|---|---|---|---|
| **Problem clarity** | "I built a task app" | States what the app does and who for | States the specific failure the existing situation produced, with a consequence |
| **Constraint honesty** | No constraints mentioned | Lists generic constraints ("limited time") | Names real, specific constraints that actually shaped the design |
| **Decision quality** | Lists technologies used | Explains why one technology was chosen | Names the rejected alternative and the trade-off knowingly accepted |
| **Evidence** | No numbers, or numbers with no method | Numbers with a stated result | Baseline → result → method → instrument, all present |
| **Self-awareness** | No limitations section | Generic limitations ("could add more tests") | Specific, technical, and slightly uncomfortable to admit |

**Whole-site checks** (all must pass at launch and at every quarterly review):

- [ ] A non-technical reader can state what you build after 60 seconds on the landing page.
- [ ] An engineer can name one non-obvious technical decision you made after 5 minutes on any case study.
- [ ] Nothing on the site is untrue, exaggerated, or ambiguously scoped.
- [ ] No sentence appears that could appear verbatim on ten thousand other portfolios.
- [ ] Every technology claim is backed by a linked project.
- [ ] The newest thing on the site is less than six months old.

## 10.3 Measurement Implementation

**Analytics events** (cookieless, no PII):

| Event | Properties | KPI served |
|---|---|---|
| `contact_email_click` | `location` (footer / hero / case-study) | Contact-intent |
| `resume_download` | `location` | Résumé rate |
| `contact_form_submit` | `outcome` (success / error) | Contact-intent |
| `project_card_click` | `slug`, `position` | Landing → project CTR |
| `case_study_complete` | `slug` | Completion rate |
| `repo_link_click` | `slug`, `kind` (repo / source / demo) | Repo CTR |
| `source_link_click` | `slug`, `file` | Depth signal (Marcus is reading) |

**Review cadence**

| Interval | Activity |
|---|---|
| Weekly (first month) | Core Web Vitals field data; fix regressions immediately |
| Monthly | Tier 1 + Tier 2 review; one hypothesis about the weakest metric; one change |
| Quarterly | Full rubric re-score of every case study; dependency batch; the 2-month doc test; content freshness |
| Per job search | Interview-depth log; ask two interviewers directly what the portfolio did or didn't do |

**Qualitative measurement is not optional.** After each search cycle, ask one recruiter and one hiring manager: *"What did you take away from my portfolio, and what did you wish was there?"* Two of those answers are worth more than a month of analytics.

---

# 11. Design System Requirements

## 11.1 Design Philosophy

The design goal is one specific reaction: **"a person with taste made deliberate decisions here."** Every rule below serves that. The reference points are not other developer portfolios — they are editorial: a well-set magazine feature, a technical book's typography, a gallery catalogue. Borrowing from a different discipline is the single most reliable way to escape a saturated visual language.

Three governing principles:

1. **Typography carries the design.** If the type system is strong, the site needs almost nothing else. If it is weak, no amount of animation will save it.
2. **Restraint is the signal.** Anyone can add. Knowing what to leave out is what reads as senior — in design exactly as in code.
3. **Every element earns its place.** If you cannot say what a decorative element communicates, delete it.

## 11.2 Anti-Pattern Register (hard constraints)

These are **requirements**, not preferences. Each maps to an acceptance criterion. The presence of any of them is a build-review blocker.

| ❌ Banned | Why it reads as generated | ✅ Instead |
|---|---|---|
| Purple→blue / blue→cyan gradient hero | The single most recognizable template signature of 2023–2026 | One flat, unusual, committed background color; or paper-white with strong type |
| Glassmorphism (`backdrop-blur` + translucent cards) | Default aesthetic of every AI-scaffolded UI | Flat surfaces distinguished by a hairline rule, a color shift, or spacing alone |
| Animated technology-logo grid | Communicates "I have heard of Docker," nothing more | Skills as text, grouped, with years and evidence links |
| Skill percentage bars ("React 87%") | Meaningless; nobody can defend the number | The four-level vocabulary with published definitions (§8.4) |
| Dark background + neon accent + grid pattern | The "AI/cyber" default | A considered palette that could plausibly be a print piece |
| Full-viewport hero with only a name + scroll arrow | Wastes the most valuable screen real estate on the site | Hero carries real information (AC-01.1) |
| 3D card tilt on mouse move | Ubiquitous library default | A single restrained state change on hover/focus |
| Cursor-following spotlight / custom cursor | Reduces usability; screams template | Native cursor; strong hover and focus affordances |
| Typewriter text effect | Delays content the visitor came for | Static text, present at first paint |
| Particle / constellation background | Costs CPU, communicates nothing | Nothing. Empty space is a design element. |
| `Inter` / `Poppins` / `Montserrat` as the sole family | The three most-used defaults; instantly legible as a default | A characterful serif or a distinctive grotesque, paired deliberately |
| Emoji as section icons | Reads as informal and generated | Typographic hierarchy, or hand-drawn SVG marks |
| Centered everything | The path of least resistance | Asymmetric editorial grid with intentional alignment |
| "Passionate developer" / "I love turning coffee into code" | Cliché; occupies space that could hold a fact | Concrete, specific, first-person statements |
| AI-generated avatar or illustration | Undermines the whole "human-crafted" premise | A real photograph, or no image at all |
| A chatbot that answers questions about you | The most 2026 of all generated-portfolio tells | Well-written prose |

## 11.3 Design Tokens

```css
/* styles/tokens.css — the single source of truth */
:root {
  /* ── Color ────────────────────────────────────────────────
     One near-neutral ground, one ink, one accent. That's it.
     Choose an accent that is NOT purple, NOT cyan, NOT neon.
     Good directions: oxblood, deep ochre, ink-blue, forest, terracotta. */
  --ground:        oklch(97.5% 0.008 85);    /* warm off-white, not #fff */
  --ground-raised: oklch(99% 0.006 85);
  --ground-sunken: oklch(94% 0.010 85);
  --ink:           oklch(21% 0.015 60);      /* near-black, warm, not #000 */
  --ink-muted:     oklch(46% 0.012 60);
  --ink-subtle:    oklch(62% 0.010 60);
  --rule:          oklch(88% 0.008 70);      /* hairlines */
  --accent:        oklch(48% 0.150 35);      /* [CHOOSE ONE] — used sparingly */
  --accent-weak:   oklch(94% 0.035 35);
  --focus:         oklch(55% 0.180 250);     /* distinct from accent, ≥3:1 on all grounds */

  /* ── Type ─────────────────────────────────────────────────
     Two families. Display = character. Text = readability.
     Mono only for code. Never a fourth family. */
  --font-display: '[DISPLAY_FAMILY]', Georgia, 'Times New Roman', serif;
  --font-text:    '[TEXT_FAMILY]', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono:    'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;

  /* Modular scale, ratio 1.25 (major third) — restrained and readable.
     Display sizes use clamp() so the editorial feel survives on mobile. */
  --size-2xs: 0.694rem;
  --size-xs:  0.833rem;
  --size-sm:  0.9rem;
  --size-base: 1.0625rem;                        /* 17px — generous body */
  --size-md:  clamp(1.2rem,  0.5vw + 1.1rem, 1.35rem);
  --size-lg:  clamp(1.5rem,  1.0vw + 1.3rem, 1.85rem);
  --size-xl:  clamp(1.9rem,  2.0vw + 1.4rem, 2.6rem);
  --size-2xl: clamp(2.4rem,  3.5vw + 1.5rem, 3.9rem);
  --size-3xl: clamp(3.0rem,  6.0vw + 1.4rem, 6.0rem);   /* hero only, once per page */

  --leading-tight: 1.08;    /* display */
  --leading-snug:  1.32;    /* subheads */
  --leading-body:  1.62;    /* body — generous, editorial */
  --measure:       66ch;    /* max line length for prose */
  --tracking-display: -0.022em;
  --tracking-body:     0em;
  --tracking-caps:     0.09em;

  /* ── Space — 4px base, non-linear at the top for editorial rhythm ── */
  --space-1: 0.25rem;  --space-2: 0.5rem;   --space-3: 0.75rem;
  --space-4: 1rem;     --space-5: 1.5rem;   --space-6: 2rem;
  --space-7: 3rem;     --space-8: 4rem;     --space-9: 6rem;
  --space-10: 8rem;    --space-11: 12rem;   /* section gaps — be generous */

  /* ── Motion ────────────────────────────────────────────── */
  --dur-instant: 80ms;
  --dur-fast:    160ms;   /* state changes */
  --dur-base:    240ms;   /* most transitions */
  --dur-slow:    400ms;   /* entrances */
  --dur-slower:  650ms;   /* orchestrated sequences */
  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);      /* entrances — decisive */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);     /* moves */
  --ease-spring: linear(0, 0.4 12%, 0.9 28%, 1.04 44%, 1 60%, 1);  /* playful, use rarely */
  --stagger:     70ms;

  /* ── Form ──────────────────────────────────────────────── */
  --radius-none: 0;        /* the editorial default — sharp corners */
  --radius-sm:   2px;
  --radius-md:   4px;      /* maximum. No 16px pill cards. */
  --rule-width:  1px;
  --focus-ring:  2px solid var(--focus);
  --focus-offset: 3px;
}

:root[data-theme='dark'] {
  --ground:        oklch(17% 0.012 60);   /* warm near-black, never pure #000 */
  --ground-raised: oklch(21% 0.012 60);
  --ground-sunken: oklch(13% 0.012 60);
  --ink:           oklch(93% 0.008 85);
  --ink-muted:     oklch(72% 0.010 70);
  --ink-subtle:    oklch(56% 0.010 70);
  --rule:          oklch(30% 0.010 60);
  --accent:        oklch(72% 0.130 35);   /* lighter in dark — same hue, re-tuned */
  --accent-weak:   oklch(26% 0.050 35);
  --focus:         oklch(75% 0.150 250);
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --dur-instant: 0.01ms; --dur-fast: 0.01ms; --dur-base: 0.01ms;
    --dur-slow: 0.01ms;    --dur-slower: 0.01ms; --stagger: 0ms;
  }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Token rules**

- No hard-coded color, size, or duration anywhere in a component. Ever. Enforced by review.
- A new token requires a written justification in `docs/DESIGN-SYSTEM.md`.
- Every foreground/background token pair is contrast-verified in both themes before use.
- `--radius-md: 4px` is the ceiling. Rounded corners are the fastest route back to the generic look.

## 11.4 Typography Guidelines

**Family selection.** Two families, self-hosted, variable where available.

| Slot | Requirement | Good directions | Avoid |
|---|---|---|---|
| Display | Real character; used for the hero, section heads, and project titles | A high-contrast serif (Newsreader, Fraunces, Instrument Serif, Bodoni-adjacent), or a distinctive grotesque (Space Grotesk, Söhne-like, Neue Haas-adjacent) | Inter, Poppins, Montserrat, Raleway |
| Text | Optimized for long-form reading at 17px | A humanist sans with true italics and a real small-caps or a workhorse text serif | Anything with only one weight |
| Mono | Code only | JetBrains Mono, IBM Plex Mono, Berkeley Mono | Courier |

The strongest editorial move available: **serif display + sans text.** It is uncommon in developer portfolios, immediately signals "print," and costs nothing.

**Hierarchy rules**

| Rule | Detail |
|---|---|
| One `--size-3xl` per page | The hero. Nothing else competes with it. |
| Establish hierarchy with size *and* weight *and* color | Never with color alone (AC-14.9), never with size alone (flat and boring). |
| Body copy is `--size-base` (17px) at `--leading-body` | Generous. This is a reading site. |
| Prose never exceeds `--measure` (66ch) | Even in a wide layout. Wide columns are the #1 readability failure. |
| Display type gets negative tracking | `--tracking-display`; large type set at 0 looks loose and amateur. |
| Small caps or uppercase for eyebrows/labels only | With `--tracking-caps`. Never for body copy. |
| No text over a busy image | If an image needs an overlay to make text legible, the composition is wrong. |
| Numerals: tabular in tables and metrics, proportional in prose | `font-variant-numeric: tabular-nums` on every metric block. |

## 11.5 Layout Principles

| Principle | Rule |
|---|---|
| **Asymmetric editorial grid** | 12-column grid, but content rarely fills it symmetrically. A case study might set prose in columns 2–8, pull a metric block into 9–12, and let a diagram break to the full bleed. This asymmetry is the strongest anti-generic layout move. |
| **Deliberate emptiness** | Section gaps of `--space-9` to `--space-11`. Large empty regions are a design decision, and they read as confidence. Resist filling them. |
| **Vertical rhythm** | Every vertical measurement is a token multiple. Consistent rhythm is invisible when present and obvious when absent. |
| **Optical alignment over mathematical** | Align to what the eye reads as the edge — a large quotation mark or a bullet may need to hang outside the text block. |
| **Content-driven breakpoints** | Break where the content stops working (measure exceeds 75ch, cards get too narrow), not at device widths. |
| **Structural mobile adaptation** | The mobile layout is a re-composed single-column editorial rhythm, not a compressed desktop grid (AC-11.4). |
| **Hairline rules over boxes** | A 1px rule in `--rule` separates content more elegantly than a bordered card. Use cards sparingly. |
| **Full-bleed sparingly** | At most 2 full-bleed elements per page — typically one architecture diagram and one large project image. |
| **One anchor per viewport** | At any scroll position, exactly one element should be the clear focal point. |

## 11.6 Animation Principles

| Principle | Rule | Implementation |
|---|---|---|
| **Motion must mean something** | Every animation communicates state, hierarchy, causality, or continuity. Decorative motion is deleted. | Review question: "what does the visitor learn from this?" |
| **Fast in, slower out** | Entrances `--dur-slow` with `--ease-out`; exits `--dur-fast`. Things should appear decisively and leave quickly. | |
| **Compositor only** | Animate `transform` and `opacity`. Nothing else. | AC-03.4; verify in DevTools' Layers panel |
| **Stagger, don't cascade** | ≤ 80 ms between siblings, max 6 elements in a sequence. Longer chains feel slow and manipulative. | `--stagger` |
| **Never gate content on motion** | All text is in the DOM and readable at first paint. Animation only changes how it arrives. | AC-10.5 |
| **Never hijack scroll** | Native velocity is preserved. No forced snap, no lerp-smoothed scrolling, no horizontal takeover. | AC-10.4 |
| **Reduced motion is a first-class path** | Not a degradation — a designed alternative. Test it as a real state. | Token-level kill switch (§11.3) |
| **Once per element** | Reveal animations do not re-trigger when the visitor scrolls back up. Repetition is irritating. | `IntersectionObserver` with `once: true` |
| **Budget: one signature moment** | Exactly one memorable interaction on the site. Two competes; three is a template. | Choose it deliberately in Sprint 5 |
| **CSS first, JS second** | Use native CSS scroll-driven animations where supported; Motion only for orchestration, gestures, layout, and presence. | `@supports (animation-timeline: view())` |

**Signature moment candidates** (pick exactly one):

- The skills timeline axis advances as you scroll, with each skill's era marking itself as it enters.
- The case study's architecture diagram assembles component by component as the corresponding prose scrolls into view.
- Project titles set at `--size-2xl` remain sticky while their case-study sections scroll beneath, so the title and current section are always paired.

## 11.7 Component Design Philosophy

| Principle | Detail |
|---|---|
| **Primitives before components** | Build `Container`, `Stack`, `Grid`, `Text` first. Everything else composes them. This is what makes the system extensible. |
| **Content-agnostic** | No component may assume how many items it receives. Three projects and eleven projects must both look intentional. |
| **Server by default** | `"use client"` requires a comment naming the interaction that forces it (§5.5). |
| **Composition over configuration** | `<Card><Card.Media/><Card.Body/></Card>`, not `<Card variant="media-top" size="lg" hasFooter />`. Boolean-prop explosions are unmaintainable solo. |
| **Accessible by construction** | Semantic elements first. ARIA only where semantics genuinely cannot express the pattern. A `<div role="button">` is a bug. |
| **States are designed, not defaulted** | Every interactive component ships with default, hover, focus-visible, active, disabled, and loading states specified — plus empty and error where relevant. |
| **Loading states must not shift layout** | Skeletons match final dimensions exactly, or use a fixed-height container. |
| **No component library** | shadcn/ui, Material, Chakra all carry recognizable visual defaults. Hand-build the ~15 components this site needs. This is a design *and* a differentiation decision. |

## 11.8 Interaction Guidelines

| Guideline | Requirement |
|---|---|
| Feedback within 100 ms | Every interaction produces a visible response immediately, even if the result takes longer. |
| Focus is designed, not inherited | A custom `:focus-visible` treatment at ≥ 3:1 contrast, never obscured by sticky elements (SC 2.4.11). |
| Hover is never the only affordance | Every hover state has a focus equivalent that is at least as prominent (AC-03.2). |
| Touch parity | No information or action available only on hover (AC-03.3). |
| Generous targets | ≥ 44 × 44 px with ≥ 8 px separation (SC 2.5.8). |
| Whole-card links | The entire card is one link and one tab stop (AC-02.5). |
| Predictable navigation | Nav position and behavior are consistent across every page. |
| Honest external links | External links carry a visual indicator and an accessible label; `rel="noopener noreferrer"`. |
| Errors are recoverable and specific | "Enter a valid email address" — never "Invalid input." Input is never destroyed. |
| No unexpected context change | Nothing opens a new window, moves focus, or navigates on focus or on input change (SC 3.2.1, 3.2.2). |

## 11.9 Responsive Breakpoints

| Name | Width | Layout behavior |
|---|---|---|
| `xs` | 320–479 | Single column; `--space-7` section gaps; display type at scale floor |
| `sm` | 480–767 | Single column; slightly wider gutters |
| `md` | 768–1023 | 2-column project grid; timeline becomes horizontal; asymmetry begins |
| `lg` | 1024–1279 | Full 12-column editorial grid; asymmetric compositions active |
| `xl` | 1280–1599 | Wider gutters; prose still capped at `--measure`; margin notes possible |
| `2xl` | ≥ 1600 | Container capped; extra width becomes margin, not longer lines |

**Rule:** these are starting points. Add a breakpoint wherever the content breaks, and delete any that aren't earning their place.

---

# 12. Content Strategy

## 12.1 The Transformation Framework: Repository → Case Study

A repository is raw material. The transformation runs in five passes.

### Pass 1 — Excavate (30 min per project)

Before writing anything, gather the facts. Most of them are already in the repository.

| Source | What to extract |
|---|---|
| `git log --reverse \| head -50` | What you built first — reveals your actual starting hypothesis |
| `git log --oneline --graph` | Where the work concentrated; where you refactored, and why |
| Commit messages containing "fix", "revert", "refactor" | **Gold.** Each one is a moment where reality contradicted your plan |
| Issues and PRs (even your own) | Problems you articulated at the time, in your own words |
| README history (`git log -p README.md`) | How your understanding of the project changed |
| `/docs`, ADRs, or design notes | Decisions already written down |
| Dependency changes over time | Tools you adopted and abandoned, and why |
| The test suite | What you were afraid would break — that fear is a design constraint |

**The single most productive question:** *What did I try first that didn't work?* The answer is almost always the most interesting thing about the project, and it is almost always missing from the README.

### Pass 2 — Structure (15 min)

Fill in this skeleton in one sitting, in bullet points, no prose:

```
CONTEXT      — What existed before? Who was affected? What was going wrong?
CONSTRAINT   — What couldn't you change? (budget, hardware, API, deadline, skill, data)
DECISION     — What were the 2–4 real forks in the road? What did you pick, and against what?
IMPLEMENTATION — How does it actually work? What's the interesting part of the code?
OUTCOME      — What changed? How do you know? What's still wrong with it?
```

If any beat is empty, you have found the gap — go back to Pass 1 for that beat specifically.

### Pass 3 — Quantify (20 min)

Every claim gets a number, or it gets rewritten as an observation.

| Weak claim | Strong claim |
|---|---|
| "Improved performance" | "Cut p95 request latency from 840 ms to 120 ms (k6, 200 VU, 5 min, staging)" |
| "Handles a lot of data" | "Processes ~2.1 M rows per nightly run in 4 min 20 s on a 2-vCPU VPS" |
| "Made it more reliable" | "Failed sync jobs fell from ~6/week to 0 over 3 months (from the job log)" |
| "Cleaner code" | "Cut the sync module from 1,400 to 380 lines by extracting the reconciliation loop" |

**If you cannot measure it, say so honestly.** "I didn't benchmark this properly — the improvement was obvious in use but I have no numbers" is *far* stronger than an invented percentage. Hiring managers can smell a fabricated metric instantly, and one fake number invalidates every real one on the page.

### Pass 4 — Write (60–90 min)

Draft the five beats as prose, in the voice guide of §12.5. Write badly and fast; edit after.

### Pass 5 — Layer (20 min)

Add the reader-specific layers in this order:

1. The ≤ 60-word summary at the top (Priya's layer — write it last, when you know what the piece says).
2. The headline metric, pulled out visually.
3. The Decision Table (Marcus's fastest path to judging you).
4. Deep source links at the specific interesting lines.
5. The Limitations section — written honestly, not defensively.

## 12.2 Recommended Case Study Page Structure

```
┌─ HEADER ────────────────────────────────────────────────────┐
│  Project title  ·  Solo · Freelance · Jan–Apr 2026          │
│  Tagline (≤140 chars, plain language)                       │
│  [ Repository ]  [ Live demo ]        · 8 min read          │
└─────────────────────────────────────────────────────────────┘

┌─ SUMMARY BLOCK ─── PRIYA LAYER — must stand alone ──────────┐
│  ≤60 words: what it is, why it was hard, what changed.      │
│  ┌──────────────────────────────────────────────┐           │
│  │  HEADLINE METRIC   8.2 s ──▶ 1.4 s  (−83%)   │           │
│  │  p95 sync latency, 7 days production traffic │           │
│  └──────────────────────────────────────────────┘           │
│  Stack: TypeScript · Node.js · PostgreSQL · Redis · Docker  │
└─────────────────────────────────────────────────────────────┘

┌─ CONTEXT ───────────────────────────────────────────────────┐
│  What existed, who it affected, what was going wrong.       │
│  2–3 paragraphs. Concrete. Names the actual failure.        │
└─────────────────────────────────────────────────────────────┘

┌─ CONSTRAINTS ───────────────────────────────────────────────┐
│  Bulleted. Real constraints only. These make the decisions  │
│  that follow legible — without them nothing looks hard.     │
└─────────────────────────────────────────────────────────────┘

┌─ ARCHITECTURE ──────────────────────────────────────────────┐
│  Inline SVG diagram (full-bleed) with a substantive alt.    │
│  Caption explaining the data flow in one or two sentences.  │
└─────────────────────────────────────────────────────────────┘

┌─ DECISIONS ─── MARCUS LAYER — the highest-value section ────┐
│  ┌──────────┬──────────┬───────────────┬─────────────────┐  │
│  │ Decision │ Chosen   │ Rejected      │ Trade-off taken │  │
│  ├──────────┼──────────┼───────────────┼─────────────────┤  │
│  │ ...      │ ...      │ ...           │ ...             │  │
│  └──────────┴──────────┴───────────────┴─────────────────┘  │
│  Below the table: 1–2 paragraphs on the hardest decision.   │
└─────────────────────────────────────────────────────────────┘

┌─ IMPLEMENTATION ────────────────────────────────────────────┐
│  How the interesting part actually works.                   │
│  ONE well-chosen code excerpt (15–30 lines) with commentary │
│  on why it looks like that. Deep links to the real files.   │
│  Do NOT paste the whole module — that's what the repo is.   │
└─────────────────────────────────────────────────────────────┘

┌─ OUTCOME ───────────────────────────────────────────────────┐
│  Metrics table: metric · baseline · result · method · tool  │
│  Plus qualitative outcomes (what the users/client noticed). │
└─────────────────────────────────────────────────────────────┘

┌─ LIMITATIONS & WHAT I'D DO DIFFERENTLY ─── the honesty tell ┐
│  Specific, technical, mildly uncomfortable. This section    │
│  buys more credibility per word than any other on the page. │
└─────────────────────────────────────────────────────────────┘

┌─ REPOSITORY EVIDENCE ─── generated, not written ────────────┐
│  Languages · commits · first & last commit · age · license  │
│  · topics · stars/forks (only if >2) · "data as of <date>"  │
└─────────────────────────────────────────────────────────────┘

┌─ FOOTER ────────────────────────────────────────────────────┐
│  ← Previous project      Next project →                     │
│  [ Get in touch ]                                           │
└─────────────────────────────────────────────────────────────┘
```

## 12.3 What Each Reader Needs to See

| Reader | Needs | Where it lives | Time to find it |
|---|---|---|---|
| **Recruiter (Priya)** | What it does in plain language | Tagline + summary block | 5 s |
| | Technologies as text | Stack line | 10 s |
| | One impressive, quotable number | Headline metric | 10 s |
| | Scope (solo? production? real users?) | Header meta line | 15 s |
| | Whether to forward this | The whole summary block | 30 s |
| **Hiring manager (Marcus)** | Was the problem understood? | Context + Constraints | 1 min |
| | Is the judgment defensible? | Decision Table | 2 min |
| | How does it actually work? | Architecture + Implementation | 4 min |
| | Are the claims real? | Outcome methods + repo evidence | 2 min |
| | Is this person honest? | Limitations | 1 min |
| | Can they write code I'd merge? | Deep source links → GitHub | 5 min |
| **Peer engineer** | Is this interesting? | Implementation excerpt | 2 min |
| | Would I do it this way? | Decision Table + Limitations | 3 min |

## 12.4 Technical Depth Framework

Depth is a ladder. Every case study should climb from rung 1 to rung 5. Most portfolios stop at rung 2.

| Rung | Level | Example | Signal sent |
|---|---|---|---|
| 1 | **What** | "A sync service between Shopify, a POS, and a warehouse sheet." | You built something |
| 2 | **How** | "Node workers consume webhooks into a Postgres queue, reconciled every 30 s." | You can describe a system |
| 3 | **Why** | "Version vectors instead of timestamps, because the POS clock drifted and batched writes arrived hours late." | **You make decisions** |
| 4 | **What else** | "Row locking would have serialized ingest and couldn't express an offline device catching up at all." | **You evaluate alternatives** |
| 5 | **What's wrong** | "Single-writer per SKU caps this around 50 writes/s. Next time: an append-only event log — reconstructing history from this schema is painful." | **You have real judgment** |

**Depth calibration by reader:** the page must be readable by a recruiter at rung 1–2 without scrolling past the summary, and by an engineer at rung 3–5 by reading on. That is the entire information-architecture problem of this site, and progressive disclosure is the solution.

**Universal depth prompts** — if a case study feels thin, answer these:

1. What did you build first that you later threw away?
2. What broke in a way you didn't anticipate?
3. What does this system do badly, and what would break it?
4. Which library did you *not* use, and why?
5. If you had two more weeks, what is the first thing you'd change?
6. What did you learn that you'd tell someone starting the same project?

## 12.5 Voice and Tone

| Attribute | Do | Don't |
|---|---|---|
| Person | First person singular. "I chose…" | "We" for solo work. It reads as inflation and it will be caught. |
| Tense | Past for the work, present for how the system behaves. | Mixing arbitrarily. |
| Register | Precise and plain. Write like a good technical blog post, not a press release. | Marketing language. "Leveraged cutting-edge technologies to deliver a seamless experience." |
| Confidence | Direct about what you did. Honest about what you don't know. | Hedging everything ("I kind of tried to…") *or* overclaiming ("architected an enterprise-grade platform"). |
| Jargon | Use real terms precisely, and define anything non-obvious in a clause. | Jargon as decoration. If you can't define it, don't use it. |
| Specificity | Names, numbers, versions, dates, real constraints. | "Various technologies," "significant improvements," "many users." |
| Length | Case study 800–1,600 words. About section 150–350. Taglines ≤ 140 chars. | 4,000-word essays. Nobody finishes them. |

## 12.6 Banned Phrase List

Checked automatically by `validate-content.ts` (warning-level) and manually at editorial review.

**Résumé clichés:** passionate about · results-driven · detail-oriented · team player · think outside the box · wear many hats · hit the ground running · fast-paced environment · synergy · go-getter · self-starter

**Developer clichés:** turning coffee into code · I love to code · clean code enthusiast · pixel-perfect · full-stack ninja/rockstar/guru/wizard · always learning · code that speaks for itself

**Empty intensifiers:** cutting-edge · state-of-the-art · seamless · robust (unqualified) · scalable (unquantified) · leveraging · utilize (say "use") · revolutionize · game-changing · best-in-class · next-generation

**Vague quantifiers:** significantly improved · greatly enhanced · dramatically reduced · a lot of users · high performance · optimized (without a number)

**Fabrication tells:** enterprise-grade (on a personal project) · production-ready (if it never went to production) · architected (if you wrote it alone in a weekend — "built" is fine and more honest)

## 12.7 Content Maintenance Cadence

| Interval | Action |
|---|---|
| On completing any project | Write the five-beat skeleton **within one week**, while the reasoning is still in your head. Prose can come later; the skeleton cannot be reconstructed. |
| Monthly | Update availability status; check for broken external links. |
| Quarterly | Re-score every case study against the §10.2 rubric; refresh the About section; verify the newest project is < 6 months old. |
| On any new role | Add the experience entry within two weeks; update skills. |
| Before any job search | Full read-through as a stranger. Every claim re-verified. Résumé regenerated and dated. |
| Annually | Reconsider which projects are featured. Demote to `tier: archive` rather than deleting — the trajectory is itself a signal. |

**The forcing function:** add a `CASE_STUDY.md` skeleton to every new project repository on day one. Fill in the Decision beats *as you make them*. Reconstructing a decision six months later is the single hardest part of this entire content strategy, and this makes it unnecessary.

---

# 13. Future Roadmap

## 13.1 Post-MVP Feature Backlog

### Horizon 1 — Weeks 1–8 after launch (polish and close gaps)

| Feature | Value | Effort | Priority |
|---|---|---|---|
| Case studies #5 and #6 | Content depth is the highest-leverage improvement available | 8 h | **P1** |
| Project filtering by technology (US-17) | Only once > 8 projects exist | 4 h | P2 |
| Dark/light manual toggle with persistence | Tokens already support it; small polish win | 2 h | P1 |
| `prefers-contrast: more` support | Accessibility completeness | 2 h | P2 |
| Print stylesheet for case studies | Some hiring managers genuinely print | 2 h | P2 |
| `/uses` page (tools, editor, hardware) | Personality, and cheap to write | 2 h | P2 |
| OG image A/B refinement | Improves link click-through from LinkedIn | 2 h | P2 |
| 404 page with a real project suggestion | Small delight, recovers dead links | 1 h | P2 |

### Horizon 2 — Months 3–6 (extend the surface)

| Feature | Value | Effort | Notes |
|---|---|---|---|
| **Technical writing section** | The highest-value addition after case studies. Regular writing is the strongest signal of engineering thought there is. | 12 h | Reuse the entire MDX + Zod pipeline; add `content/writing/*.mdx`, an index route, and RSS |
| RSS/Atom feed | Lets peers subscribe; costs almost nothing | 2 h | Requires the writing section |
| Reading list / annotated bibliography | Shows intellectual direction | 3 h | Low effort, surprisingly high signal |
| Interactive code demos in case studies | Sandpack or a small embedded runtime for one algorithm | 8 h | Only where it genuinely aids comprehension; watch the JS budget |
| Timeline view of the whole career | Merges education + experience + projects on one axis | 6 h | Data models already support it |
| "Now" page | Current focus; keeps the site feeling alive between projects | 1 h | |
| Analytics dashboard route (private) | Self-hosted Umami embed for KPI review | 4 h | |

### Horizon 3 — Months 6–12 (deepen)

| Feature | Value | Effort |
|---|---|---|
| Per-project changelogs sourced from GitHub releases | Shows ongoing ownership rather than abandonment | 5 h |
| Contribution graph across all showcased repos | One honest view of sustained activity | 4 h |
| Talk / presentation section | If speaking happens | 4 h |
| Testimonials or references | Only real, attributed, permissioned ones | 3 h |
| Multi-language (i18n) | Only if targeting a specific non-English market | 15 h |
| Case study video walkthroughs (3–5 min) | High effort, high impact for some readers | 6 h each |

## 13.2 Custom Domain Preparation

**Do this early even if you launch on `*.vercel.app`** — it is cheap, and retrofitting canonical URLs after indexing is annoying.

| Step | When | Detail |
|---|---|---|
| 1. Choose and register the domain | Before launch | Prefer `firstnamelastname.dev` / `.com`. Avoid hyphens, numbers, and clever TLDs that people mistype over the phone. |
| 2. Make `siteUrl` a single configurable value | Sprint 6 | Already in `siteConfig.seo.siteUrl`; every canonical, sitemap entry, and OG URL derives from it |
| 3. Add the domain in Vercel | At launch | Vercel provisions TLS automatically |
| 4. DNS records | At launch | `A` → Vercel's apex IP, or `CNAME www` → `cname.vercel-dns.com` |
| 5. Pick a canonical host and keep it | At launch | `www` vs. apex — choose once, 308-redirect the other, never revisit |
| 6. Email on the domain | Optional | `hello@[YOUR_DOMAIN]` via a forwarding service; more professional than a personal Gmail on a résumé |
| 7. Search Console | Launch day | Add the property, submit the sitemap, verify ownership via DNS TXT |
| 8. Update every external link | Launch week | LinkedIn, GitHub profile README, résumé PDF, email signature |
| 9. Monitor | First month | Watch Search Console for coverage errors and Core Web Vitals field data |

**Domain checklist:** short · spellable aloud without correction · pronounceable · no ambiguity between similar letters · available across social handles if that matters to you · renewal auto-enabled with a working payment method.

## 13.3 VPS Migration Considerations

The architecture is deliberately portable. The output is static HTML plus two small serverless functions — both of which map onto a tiny Node service.

**Trigger conditions.** Migrate only if one of these becomes true. Do not migrate for its own sake.

| Trigger | Why it forces the move |
|---|---|
| Vercel free-tier limits are hit | Unlikely for a portfolio, but possible with heavy image traffic |
| You want a service that needs a persistent process | A demo API, a WebSocket, a scheduled worker beyond CI cron |
| You want the ops experience as a portfolio artifact in itself | Legitimate and, honestly, a good reason — running your own infrastructure is itself a case study |
| Data residency or cost control matters | Unlikely here |

**Target architecture**

```
[YOUR_DOMAIN]  ─── DNS ──▶  VPS (1–2 vCPU, 2 GB RAM, ~$5–12/month)
                              │
                              ├─ Caddy (automatic TLS via Let's Encrypt, HTTP/3)
                              │    ├─ /            → static files from /srv/portfolio/current
                              │    └─ /api/*       → reverse proxy → 127.0.0.1:3001
                              │
                              ├─ Node service (systemd unit) — contact + revalidate only
                              │
                              ├─ Deploy: GitHub Actions → build → rsync to /srv/portfolio/<sha>
                              │          → atomic symlink swap of `current` → reload Caddy
                              │
                              └─ Ops: ufw (22/80/443), fail2ban, unattended-upgrades,
                                      Uptime Kuma or an external uptime monitor,
                                      Umami self-hosted for analytics
```

**Migration checklist**

- [ ] Provision the VPS; harden SSH (key-only, no root login, non-standard port optional)
- [ ] `ufw` allow 80/443 + SSH only; enable `fail2ban` and `unattended-upgrades`
- [ ] Install Caddy; configure the site block with automatic TLS
- [ ] Port `/api/contact` and `/api/revalidate` to a minimal Node/Hono service under systemd
- [ ] Replace Vercel Speed Insights with the `web-vitals` library reporting to your analytics
- [ ] Build a GitHub Actions deploy job: build → `rsync` to a SHA-named directory → atomic symlink swap
- [ ] Keep the Vercel deployment live in parallel for two weeks as a rollback
- [ ] Cut DNS over with a low TTL (300 s) set 24 h in advance
- [ ] Verify TLS grade, security headers, and Core Web Vitals post-cutover
- [ ] Set up off-site backup of `/srv` and the systemd units (the repo is the real backup, but configuration drifts)
- [ ] **Write the migration up as a case study.** It is a genuinely good one.

**What to avoid in the meantime** so that this stays a weekend job: no Vercel-specific Middleware logic, no Edge Config, no Vercel KV as a hard dependency (use it only for the contact rate limit, behind a swappable interface), and no image optimization that assumes Vercel's loader.

## 13.4 AI-Assisted Development Improvements

The constraint holds: **AI is a build-time tool, never a visible product feature.** No chatbot, no "ask my portfolio," no AI-generated summaries in the UI. The following improve how the site is *built and maintained*, and none of them are visible to a visitor.

| Improvement | How it works | Guardrail |
|---|---|---|
| **Case-study interview prompt** | A saved prompt that interrogates you about a finished project using the §12.4 depth prompts, and returns your own answers organized into the five beats | Every word published is yours. AI structures your thinking; it does not supply the content. |
| **Excavation assistant** | Feed `git log`, issue titles, and the README diff history into a model and ask "what decisions are implied here that aren't documented?" | Output is a list of *questions to answer*, never prose to publish. |
| **Editorial pass** | Check drafts against the §12.6 banned-phrase list, flag unquantified claims, flag passive constructions and duty-framing | Suggestions only; you make every edit. |
| **Consistency auditor** | Ask a model to read all case studies and flag inconsistencies in voice, structure, or depth level | Catches drift that is invisible when you're close to the text. |
| **Alt-text drafting** | Generate first-draft alt text for architecture diagrams, which you then correct | You verify every one. Wrong alt text is worse than none. |
| **Accessibility review agent** | A CI step that renders each page to text and asks whether the narrative is coherent in reading order | Complements axe; does not replace manual screen-reader testing. |
| **Commit message quality** | A pre-commit hook suggesting a Conventional Commit line from the staged diff | Your commit history is a hiring signal; keep it genuinely yours. |
| **Dependency triage** | Summarize Renovate PR changelogs and flag breaking changes | Reduces the friction that causes dependency rot. |
| **Test generation for schemas** | Generate edge-case fixtures for the Zod schemas and GitHub response parsing | Highest-value, lowest-risk AI use in the whole project — pure test data. |
| **Design critique** | Screenshot a page and ask specifically: "does this look AI-generated, and why?" | A cheap, fast proxy for the O6 blind test between real review rounds. |

**The honesty line.** If asked in an interview whether you used AI to build this, the true answer should be comfortable to give: *"Yes — for scaffolding, test fixtures, and editing. Every technical decision and every word of the case studies is mine, and I can walk you through any of them."* Build it so that answer stays true, because you will be asked to defend a decision from a case study in an interview, and the only way to do that is to have actually made it.

## 13.5 What Will Never Be Built

Recording these prevents re-litigating them at 1 a.m. in month four.

| Never | Reason |
|---|---|
| A visitor-facing AI chatbot | The most recognizable generated-portfolio signal of 2026. Directly contradicts the core differentiator. |
| A comment system | Moderation burden; no upside. |
| Automatic import of all repositories | Curation *is* the product. A 47-repo grid dilutes every good project on the page. |
| A headless CMS | Adds a vendor and a failure mode to solve a problem that does not exist for one author. |
| User accounts or authentication | No feature needs them. |
| A newsletter signup | Unless the writing section becomes genuinely regular — and then reconsider from scratch. |
| Gamification (visitor achievements, easter-egg hunts) | Undermines the professional register the whole design is built to establish. |
| A visitor counter or "views" badge | Vanity metric; reads as amateur. |

---

# 14. Appendices

## Appendix A — Placeholder Register

Fill these in before or during Sprint 0. Find-and-replace across the repository and this document.

| Placeholder | Meaning | Example |
|---|---|---|
| `[YOUR_NAME]` | Full name as it should appear publicly | |
| `[YOUR_EMAIL]` | Public contact address | |
| `[GITHUB_USERNAME]` | GitHub handle | |
| `[YOUR_DOMAIN]` | Custom domain, once registered | |
| `[DISPLAY_FAMILY]` | Chosen display typeface | |
| `[TEXT_FAMILY]` | Chosen text typeface | |
| `[PROJECT_1]`…`[PROJECT_6]` | Selected repositories | |
| Accent hue in `--accent` | The one committed accent color | |

## Appendix B — Project Selection Worksheet (Sprint 0.5)

For each candidate repository, answer these **before** committing to it. If you cannot answer 1, 2, and 5, pick a different repository.

1. In one sentence a non-engineer understands: what does it do and why was it hard?
2. What is the single most interesting technical decision I made, and what did I reject?
3. What number can I honestly attach to the outcome? (If none: what qualitative outcome can I describe precisely?)
4. What did I try first that didn't work?
5. What is genuinely wrong with it today?
6. Does it demonstrate a skill I want to be hired for?
7. Is it visually presentable, or is the story carried entirely by prose and diagrams? (Either is fine — but know which.)

**Portfolio-level balance.** Aim for coverage rather than repetition:

| Slot | Purpose |
|---|---|
| 1 flagship | The deepest story; the one you most want discussed in an interview |
| 1–2 breadth | Demonstrates a different domain (frontend vs. backend vs. data vs. infra) |
| 1 collaborative | If any exists — shows you work with others |
| 1 recent | Under six months old; proves current activity |

Four excellent case studies beat eight adequate ones. Every additional weak project lowers the average impression of all the others.

## Appendix C — Definition of Done (per feature)

- [ ] Acceptance criteria for the user story all verified manually
- [ ] TypeScript strict, no `any`, no `@ts-expect-error` without a comment
- [ ] `pnpm validate` passes
- [ ] Responsive at 375 / 768 / 1440 px
- [ ] Keyboard-only operable with a visible focus indicator
- [ ] `prefers-reduced-motion` behavior verified
- [ ] Zero new axe violations
- [ ] No performance-budget regression (Lighthouse CI green)
- [ ] Light and dark themes both correct
- [ ] Merged via PR with a self-review of the diff
- [ ] Deployed to preview and checked on a real phone

## Appendix D — Pre-Launch Checklist

**Content**
- [ ] ≥ 4 case studies, each scoring ≥ 18/25 on the §10.2 rubric
- [ ] About section written, no banned phrases
- [ ] CS background with course takeaways
- [ ] Experience entries with outcome-framed bullets
- [ ] Skills with levels, years, and project evidence
- [ ] Résumé PDF current, correctly named, and dated
- [ ] Every external link verified
- [ ] Full read-through as a stranger; every claim true

**Technical**
- [ ] All launch gates G1–G10 pass
- [ ] Real phone test: iOS Safari and Android Chrome
- [ ] Contact form delivers a real message to the real inbox
- [ ] All error states of `/api/contact` manually triggered and verified
- [ ] `pnpm build` succeeds with the network disabled
- [ ] Security headers verified; CSP has no `unsafe-inline`
- [ ] No secrets in the built output
- [ ] Nightly sync workflow tested via `workflow_dispatch`
- [ ] Renovate configured

**Distribution**
- [ ] Search Console property added, sitemap submitted
- [ ] OG previews verified in LinkedIn, Slack, and X
- [ ] Analytics receiving events; all §10.3 events firing
- [ ] Uptime monitor configured
- [ ] Link added to LinkedIn, GitHub profile README, résumé, and email signature

**Review**
- [ ] 3 engineers reviewed; blocking notes resolved
- [ ] 1 recruiter reviewed and passed the 60-second test
- [ ] Blind "does this look AI-generated?" survey run against a control set (O6)

## Appendix E — Sources

Facts in this document that depend on current external state were verified on 7 September 2026:

- Next.js release and support timeline (v16 current LTS; v15 support ends 21 Oct 2026) — [endoflife.date/nextjs](https://endoflife.date/nextjs)
- GitHub REST API rate limits (60/hr unauthenticated, 5,000/hr authenticated, secondary limits, `x-ratelimit-*` headers) — [GitHub Docs: Rate limits for the REST API](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)
- GitHub GraphQL API rate limits (5,000 points/hr) — [GitHub Docs: Rate limits for the GraphQL API](https://docs.github.com/en/graphql/overview/rate-limits-and-query-limits-for-the-graphql-api)
- Core Web Vitals "good" thresholds (LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1) — [corewebvitals.io](https://www.corewebvitals.io/core-web-vitals)
- WCAG 3.0 remains a W3C Working Draft; WCAG 2.2 AA is the operative conformance target — [AbilityNet: WCAG 3.0 overview and update 2026](https://abilitynet.org.uk/resources/digital-accessibility/what-expect-wcag-30-web-content-accessibility-guidelines)

Résumé-screening duration figures referenced in §2.1 come from The Ladders' eye-tracking studies (2012, 2018) and are widely cited but should be treated as directional rather than precise.

---

*End of document.*
