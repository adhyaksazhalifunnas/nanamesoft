# Deployment

---

## Local

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

Nothing needs configuring. Every environment variable is optional and each
degrades gracefully — see [`.env.example`](../.env.example) for what each one
turns on.

### The full gate

```bash
pnpm check
```

Runs, in order: typecheck → lint → content validation → contrast → unit tests →
build → JavaScript budget. Cheap checks first, so a typo fails in seconds.

E2E and accessibility are separate because they need browsers:

```bash
pnpm exec playwright install chromium webkit
pnpm test:e2e
```

---

## Vercel (launch target, D9)

1. Import the repository at [vercel.com/new](https://vercel.com/new). Next.js
   is detected; no build configuration is needed.
2. Add the environment variables you want active (all optional — see below).
3. Set `seo.siteUrl` in [`content/site.ts`](../content/site.ts) to the real
   domain. Canonical URLs, Open Graph tags, the sitemap and `robots.txt` are
   all derived from it, so a wrong value here is wrong in five places.

### Environment variables

| Variable                         | Where                           | Unset behaviour                                                          |
| -------------------------------- | ------------------------------- | ------------------------------------------------------------------------ |
| `GH_SYNC_TOKEN`                  | **GitHub Actions secrets only** | Sync warns, keeps the committed cache, exits 0. Builds still succeed.    |
| `RESEND_API_KEY`                 | Vercel                          | Contact submissions are validated and logged, not delivered.             |
| `CONTACT_FROM_EMAIL`             | Vercel                          | Same.                                                                    |
| `TURNSTILE_SECRET_KEY`           | Vercel                          | Verification skipped; honeypot, timing check and rate limit still apply. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Vercel                          | Same.                                                                    |

`GH_SYNC_TOKEN` must **never** be added to Vercel. It is a build-time-only
credential and the runtime has no use for it; §5.7 keeps it in CI alone, and
an ESLint rule fails the build if anything under `src/` reads it.

---

## The GitHub token

A **fine-grained** personal access token with:

- Repository access: public repositories (read-only)
- Permissions: **Metadata: Read-only**, and nothing else
- Expiry: **90 days**

Add it as the `GH_SYNC_TOKEN` secret under Settings → Secrets and variables →
Actions.

> **Set a calendar reminder for 85 days out.** When it expires the nightly sync
> starts warning instead of syncing — which is the designed failure, so nothing
> breaks, but the "data as of" date quietly stops moving and you will not
> notice for weeks.

### Why a token is required at all

GitHub's GraphQL API has no anonymous tier. Unauthenticated REST gets 60
requests an hour; GraphQL gets zero. Without a token `pnpm sync:github` says so
plainly, keeps the existing cache, and exits 0.

---

## The nightly sync

`.github/workflows/sync-github.yml` runs at 03:00 UTC, and commits
`data/github-cache.json` **only if it changed**. A commit per night with no
diff would mean a deploy per night with no change.

Trigger it by hand from the Actions tab (`workflow_dispatch`) to test it —
Appendix D asks for exactly that before launch.

### Why the cache is committed

`data/github-cache.json` is deliberately not in `.gitignore`.

- `pnpm build` succeeds with no network access (AC-16.1, launch gate G7).
- A GitHub outage degrades the _freshness of the next build_, never the site.
- Builds are deterministic: the same commit produces the same output.

---

## Rollback

Vercel keeps every deployment. Promote a previous one from the dashboard —
that is the fastest path and needs no git operation.

For a content mistake, reverting the commit and pushing is enough; the build is
a pure function of the repository.

---

## Custom domain

1. Add the domain in Vercel → Settings → Domains.
2. Point DNS as instructed (usually a `CNAME` to `cname.vercel-dns.com`).
3. Update `seo.siteUrl` in `content/site.ts` **and redeploy** — otherwise the
   canonical URLs still point at the old host, which is worse for SEO than
   having no custom domain at all.
4. Re-verify the property in Google Search Console and resubmit the sitemap.

---

## Migrating off Vercel (§13.3)

The architecture is constrained to portable primitives so this stays a weekend,
not a rewrite. There is no middleware, no Edge Config, no ISR, and exactly one
runtime function.

1. `output: "export"` in `next.config.ts` produces a fully static `out/`
   directory — every route except `/api/contact` is already static.
2. Serve `out/` with Caddy (automatic TLS) or nginx.
3. Run `/api/contact` as a tiny Node service behind the same host, or replace
   it with any form provider and keep the `mailto:` route unchanged.
4. Move the security headers from `next.config.ts` into the web server config.
   They are plain headers; nothing is Vercel-specific.

Analytics and Speed Insights are the only pieces that need replacing, and both
are already optional.

---

## Pre-launch

Appendix D of the PRD is the full checklist. The items that are easiest to
forget:

- [ ] `pnpm build` with the network disabled (proves G7)
- [ ] Contact form delivers a real message to the real inbox
- [ ] Every error state of `/api/contact` triggered by hand
- [ ] Nightly sync run once via `workflow_dispatch`
- [ ] Open Graph previews checked in LinkedIn, Slack and X
- [ ] Search Console property added, sitemap submitted
- [ ] Real phone test: iOS Safari and Android Chrome
- [ ] No secrets in the built output — CI greps for this, but look once yourself
