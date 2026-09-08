# Personal Portfolio

A single-page personal portfolio built with **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS v4**.

All of the content lives in one file — [`content/site.ts`](content/site.ts) — so you can make the site yours without touching a component.

## Features

- Single-page layout: hero → projects → about → experience → contact
- Content and components fully separated; every placeholder is marked `TODO:`
- Light and dark themes via CSS custom properties (follows the OS setting, no JS)
- SEO metadata, Open Graph tags, `robots.txt` and `sitemap.xml` generated from your config
- Accessible by default: skip link, semantic landmarks, focus styles, reduced-motion support
- Zero runtime dependencies beyond React and Next.js

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Make it yours

Everything you need to edit is in **[`content/site.ts`](content/site.ts)**. Work through it top to bottom:

| Field | What it controls |
| --- | --- |
| `site.name` | Nav, hero heading, page `<title>`, footer |
| `site.role` | Eyebrow text above the hero, `<title>` suffix |
| `site.tagline` | Hero paragraph and the meta description |
| `site.url` | Canonical URL for SEO, Open Graph, sitemap — set this once deployed |
| `site.email` | "Get in touch" button and the contact section |
| `site.location` | Line under the hero buttons (set to `null` to hide) |
| `site.about` | About paragraphs — one array entry per paragraph |
| `site.skills` | Skill pill groups in the about section |
| `site.socials` | Links in the contact section — delete any you do not use |
| `site.resumeUrl` | Résumé button (set to `null` to hide) |
| `projects` | Project cards. The **first** one renders full width as the featured card |
| `experience` | Work history. Delete the array *and* `<Experience />` in `app/page.tsx` to remove the section |

Then:

1. **Find leftovers.** Run `grep -rn "TODO:" content app components` — it should come back empty when you are done.
2. **Add a favicon.** Drop `icon.png` (or `favicon.ico`) into `app/`. Next.js picks it up automatically.
3. **Add project screenshots.** Put images in `public/` (e.g. `public/projects/my-app.png`) and set each project's `image` field to `"/projects/my-app.png"`. Leave it as `null` for a gradient placeholder.
4. **Add a résumé.** Save it as `public/resume.pdf`, or set `site.resumeUrl` to `null`.
5. **Change the accent color.** Edit `--accent` (and `--accent-contrast`) in [`app/globals.css`](app/globals.css) — light and dark values are defined separately.

## Project structure

```
app/
  layout.tsx      Root layout, fonts, SEO metadata, nav + footer
  page.tsx        Homepage — composes the sections
  globals.css     Tailwind import and theme tokens
  not-found.tsx   404 page
  robots.ts       Generated /robots.txt
  sitemap.ts      Generated /sitemap.xml
components/
  Nav.tsx         Sticky header
  Hero.tsx        Intro block
  Projects.tsx    Project grid and card
  About.tsx       Bio and skills
  Experience.tsx  Work history timeline
  Contact.tsx     Email and social links
  Footer.tsx      Copyright line
  Section.tsx     Shared section wrapper (width, padding, heading)
content/
  site.ts         >>> ALL of your content lives here <<<
public/           Static assets: images, resume.pdf
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server at http://localhost:3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Deploying

### Vercel (recommended)

Push this repo to GitHub, then import it at [vercel.com/new](https://vercel.com/new). No configuration needed — Vercel detects Next.js automatically. Set `site.url` to your live domain afterwards so the SEO metadata is correct.

### GitHub Pages (static export)

This site has no server-side code, so it can be exported as static HTML:

1. Uncomment `output: "export"` and `images: { unoptimized: true }` in [`next.config.ts`](next.config.ts).
2. Run `npm run build` — the site is written to `out/`.
3. Publish `out/` to GitHub Pages (a GitHub Actions workflow is the usual route).

If you deploy to `username.github.io/repo-name` rather than a custom domain, also set `basePath: "/repo-name"` in `next.config.ts`.

## License

MIT — see [LICENSE](LICENSE).
