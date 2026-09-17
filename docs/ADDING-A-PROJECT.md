# Adding a project

> Read this after two months away. It assumes you remember nothing.

The whole architecture exists so this takes **under 90 minutes**, with writing
time dominating and tooling time under ten (US-12). If it ever takes longer
than that, something has regressed and the regression is worth fixing —
the stale-portfolio failure mode in §2.2 of the PRD starts exactly here.

---

## The short version

```bash
pnpm new:project inventory-sync "Inventory Sync"
# fill in content/projects/inventory-sync.mdx
pnpm validate          # tells you precisely what is missing
pnpm sync:github       # pulls repository evidence
pnpm dev               # look at it
# flip status: published, then commit and push
```

No component, route, or layout file is edited. Ever. If you find yourself
opening `src/` to add a project, stop — that is a bug in the system, not a
task for you.

---

## What actually takes the time

Not the tooling. The five passes from §12.1 of the PRD:

| Pass      | Time      | What you are doing                                                                     |
| --------- | --------- | -------------------------------------------------------------------------------------- |
| Excavate  | 30 min    | Read your own commits, issues and README. Recover what you decided and why.            |
| Structure | 15 min    | Slot the raw material into Context / Constraint / Decision / Implementation / Outcome. |
| Quantify  | 20 min    | Find one honest number, and write down how you measured it.                            |
| Write     | 60–90 min | Prose. This is the job.                                                                |
| Layer     | 20 min    | Make it readable at two depths: recruiter at the summary, engineer further down.       |

Budget accordingly. The tooling below is the easy part.

---

## Step by step

### 1. Scaffold

```bash
pnpm new:project <slug> "<Title>"
```

The slug must be lowercase-kebab-case and must match the filename — the
validator enforces both, because the slug is the URL.

### 2. Fill in the frontmatter

Everything is validated by `ProjectFrontmatterSchema` in
[`src/lib/schemas.ts`](../src/lib/schemas.ts). The fields that carry the most
weight, and which the build will not let you skip:

**`decisions`** — at least two, each naming a rejected alternative and the
trade-off you accepted. §12.3 calls this the highest-value block on the site.
It is the section that demonstrates judgment rather than output, which is the
thing being hired.

**`limitations`** — at least one, and a published project needs either
measured metrics or two substantive limitations. §12.2: "this section buys more
credibility per word than any other on the page."

**`metrics[].method`** — required on every metric. A number without a
measurement method is a claim without evidence, and the schema makes that a
build error rather than a review note.

**`role`, `context`, `teamSize`, `hasUsers`** — honest scoping. "Solo ·
Personal" is not a weaker claim than "Lead · Production"; an inflated one that
gets caught in an interview is much worse than either.

### 3. Write the body

Two sections, both required once `status: published`:

- `## Context` — what existed, who it affected, what was going wrong.
- `## Implementation` — how the interesting part works. **One** excerpt of
  15–30 lines with commentary on why it looks like that. Do not paste the
  module; that is what the repository is for.

Everything else on the page — constraints, the decision table, metrics,
limitations, repository evidence — is generated from the frontmatter, so it
looks identical on every case study and cannot be quietly omitted.

### 4. Validate

```bash
pnpm validate
```

Errors name the file, the field, and what was expected. Warnings are worth
reading too: unresolved `TODO`s, banned phrases from §12.6, duty-framed
highlights, and a stale repository cache all surface here.

Errors block the build. Warnings do not — until you set `status: published`,
at which point a remaining `TODO` becomes an error.

### 5. Pull the repository evidence

```bash
GH_SYNC_TOKEN=github_pat_... pnpm sync:github
```

Needs a fine-grained PAT with read-only public repository metadata access.
GitHub's GraphQL API has no anonymous tier, so without a token there is
nothing to fetch — the script says so, keeps the existing cache, and exits 0.

`data/github-cache.json` is **committed on purpose**. That is what makes
`pnpm build` work with no network access and keeps a GitHub outage from ever
becoming a deploy failure.

### 6. Publish

Set `status: published`. That single field adds the case study to the landing
page (if `featured: true`), the `/projects` index, the sitemap, the previous/
next navigation, and search indexing — all at once.

---

## If you get stuck writing

§12.4 of the PRD has six prompts that unstick a thin case study. The first one
does most of the work:

1. What did you build first that you later threw away?
2. What broke in a way you did not anticipate?
3. What does this system do badly, and what would break it?
4. Which library did you _not_ use, and why?
5. If you had two more weeks, what is the first thing you would change?
6. What would you tell someone starting the same project?

---

## Adding images

Put them in `public/projects/<slug>/` and reference them from the frontmatter:

```yaml
cover:
  src: /projects/inventory-sync/cover.avif
  alt: A description of what the image actually shows
  width: 1600
  height: 900
```

Width and height are required — they are what keeps CLS at zero. The `alt` on
an architecture diagram must convey the **relationships**, not just say
"architecture diagram": a screen-reader user has to be able to follow the data
flow from that sentence alone, so the schema enforces a 20-character floor.

---

## The forcing function

The single hardest part of this process is reconstructing a decision six
months after you made it. §12.7 has the fix, and it costs nothing: drop a
`CASE_STUDY.md` skeleton into every new repository on day one and fill in the
decision beats _as you make them_. Prose can come later; the reasoning cannot
be recovered.
