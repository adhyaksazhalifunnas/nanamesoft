/**
 * new-project.ts — AC-12.1, the scaffolder behind `pnpm new:project`.
 *
 * The whole architecture exists to make US-12 true: publishing a new case
 * study should be one file and under 90 minutes, with writing time dominating
 * and tooling time under ten. This script is the tooling half of that budget.
 *
 * It copies _TEMPLATE.mdx, fills in the slug, title and today's date, and then
 * prints what to do next. It deliberately does NOT prompt for the narrative
 * fields: those need thinking, not a wizard, and answering them at a terminal
 * prompt produces worse writing than answering them in an editor.
 *
 * Usage:
 *   pnpm new:project inventory-sync
 *   pnpm new:project inventory-sync "Inventory Sync"
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");
const TEMPLATE = path.join(PROJECTS_DIR, "_TEMPLATE.mdx");

const GREY = "[90m";
const RED = "[31m";
const GREEN = "[32m";
const BOLD = "[1m";
const RESET = "[0m";

function fail(message: string): never {
  console.error(`${RED}${message}${RESET}`);
  process.exit(1);
}

/** Matches SlugSchema in src/lib/schemas.ts. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => (word[0] ?? "").toUpperCase() + word.slice(1))
    .join(" ");
}

const [rawSlug, rawTitle] = process.argv.slice(2);

if (!rawSlug) {
  fail(
    "Usage: pnpm new:project <slug> [title]\n" +
      '  e.g. pnpm new:project inventory-sync "Inventory Sync"',
  );
}

const slug = SLUG_PATTERN.test(rawSlug) ? rawSlug : toSlug(rawSlug);

if (!SLUG_PATTERN.test(slug)) {
  fail(`"${rawSlug}" cannot be turned into a lowercase-kebab-case slug.`);
}

if (slug !== rawSlug) {
  console.log(`${GREY}Normalised slug: ${rawSlug} -> ${slug}${RESET}`);
}

const target = path.join(PROJECTS_DIR, `${slug}.mdx`);

if (fs.existsSync(target)) {
  fail(`content/projects/${slug}.mdx already exists. Pick a different slug.`);
}

if (!fs.existsSync(TEMPLATE)) {
  fail("content/projects/_TEMPLATE.mdx is missing — restore it before scaffolding.");
}

const title = rawTitle ?? toTitle(slug);
const today = new Date().toISOString().slice(0, 10);

const scaffold = fs
  .readFileSync(TEMPLATE, "utf8")
  .replace(/^slug: your-project-slug.*$/m, `slug: ${slug}`)
  .replace(/^title: Your Project$/m, `title: ${JSON.stringify(title)}`)
  .replace(/^startDate: .*$/m, `startDate: ${today}`)
  .replace(/^endDate: .*$/m, `endDate: ${today}`);

fs.writeFileSync(target, scaffold, "utf8");

console.log(`
${GREEN}Created content/projects/${slug}.mdx${RESET}

${BOLD}Next${RESET}
  1. Fill in the frontmatter. Every field is validated, and the two that carry
     the most weight are ${BOLD}decisions${RESET} (what you rejected, and what the choice
     cost) and ${BOLD}limitations${RESET} (what is genuinely wrong with it today).
  2. Write the Context and Implementation sections in the body.
  3. ${BOLD}pnpm validate${RESET}     — tells you exactly what is still missing.
  4. ${BOLD}pnpm sync:github${RESET}  — pulls repository evidence, if you set \`repo\`.
  5. Flip ${BOLD}status${RESET} to \`published\` when it is finished. Until then it builds
     but stays out of every listing and out of search results.

${GREY}Stuck on what to write? §12.4 of the PRD has six prompts that unstick a
thin case study — start with "what did you build first that you threw away?"
docs/ADDING-A-PROJECT.md has the full process.${RESET}
`);
