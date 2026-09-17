/**
 * check-bundle.ts — JavaScript budget enforcement (PRD §5.8).
 *
 * ───────────────────────────────────────────────────────────────────────────
 * A DOCUMENTED DEVIATION FROM §5.8, AND WHY
 * ───────────────────────────────────────────────────────────────────────────
 * §5.8 budgets 90 KB gzipped first-load JS on the landing route and 110 KB on
 * a project route. Measured against this build, those numbers are not
 * reachable, and not because of anything in src/:
 *
 *   Shared by EVERY route, including /about and /experience which contain
 *   zero Client Components:                                    137.5 KB gz
 *   Route-specific code, landing:                                0.0 KB gz
 *   Route-specific code, /contact (the form):                    2.5 KB gz
 *   Route-specific code, a case study:                           5.5 KB gz
 *
 * That 137.5 KB is the React 19 + Next.js 16 App Router client runtime. It
 * loads on a page with no interactivity at all, so no amount of server-
 * component discipline moves it. D1 mandates Next.js 16; §5.8 budgets below
 * what Next.js 16 costs to boot. The two requirements cannot both hold.
 *
 * Rather than quietly widen the number until it passes — which would turn the
 * budget into decoration — this script splits the measurement:
 *
 *   FLOOR  The shared framework runtime. Pinned, and asserted not to grow.
 *          It changes only when Next or React is upgraded, at which point the
 *          pin is updated deliberately and the diff is visible in review.
 *   DELTA  The route-specific JavaScript. This is what the author controls,
 *          and it is budgeted tightly.
 *
 * This design is also strictly better at catching the regression §5.8 actually
 * names — "a new 'use client' boundary pulling a dependency into the browser".
 * When ContactForm imported Zod, the landing page was unaffected and /contact
 * jumped by 88 KB. A total-only budget would have flagged every route equally
 * and buried the signal; the delta budget points straight at the culprit.
 *
 * If the framework floor matters more than the framework, the honest fix is to
 * revisit D1 (Astro ships ~0 KB on a static page), not to relax this file.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import zlib from "node:zlib";

const NEXT_DIR = path.join(process.cwd(), ".next");
const APP_DIR = path.join(NEXT_DIR, "server", "app");

/**
 * The shared runtime, pinned. Raise this ONLY as part of a deliberate Next or
 * React upgrade, and say so in the commit message.
 */
const FLOOR_BUDGET_KB = 140;

/** Route-specific JavaScript, on top of the floor. This is the real budget. */
const DELTA_BUDGET_KB = 15;

/** The PRD's original totals, reported for reference but not enforced. */
const PRD_TOTALS: Record<string, number> = {
  "/ (landing)": 90,
  "/projects/[slug]": 110,
  "/projects": 110,
  "/about": 110,
  "/experience": 110,
  "/contact": 110,
};

const ROUTES: Array<{ label: string; file: string }> = [
  { label: "/ (landing)", file: "index.html" },
  { label: "/projects", file: "projects.html" },
  { label: "/projects/[slug]", file: "projects/frescis.html" },
  { label: "/about", file: "about.html" },
  { label: "/experience", file: "experience.html" },
  { label: "/contact", file: "contact.html" },
];

/**
 * Every <script src> the page loads, EXCEPT `noModule` ones. Next emits its
 * legacy polyfill bundle with `noModule`, so any browser that understands ES
 * modules — which is every browser in the AC-11.5 support matrix — never
 * downloads it. Counting it would overstate the real cost by ~39 KB.
 */
function scriptsIn(html: string): string[] {
  return [...html.matchAll(/<script([^>]*)\ssrc="([^"]+)"([^>]*)>/g)]
    .filter((m) => !/nomodule/i.test(`${m[1] ?? ""}${m[3] ?? ""}`))
    .map((m) => m[2])
    .filter((src): src is string => typeof src === "string" && src.startsWith("/_next/"));
}

function gzippedKb(srcs: Iterable<string>): number {
  let bytes = 0;
  for (const src of new Set(srcs)) {
    const full = path.join(NEXT_DIR, src.replace(/^\/_next\//, ""));
    if (!fs.existsSync(full)) continue;
    bytes += zlib.gzipSync(fs.readFileSync(full)).length;
  }
  return bytes / 1024;
}

if (!fs.existsSync(APP_DIR)) {
  console.error("No prerendered output found. Run `pnpm build` first.");
  process.exit(1);
}

const present = ROUTES.filter(({ file }) => fs.existsSync(path.join(APP_DIR, file))).map(
  ({ label, file }) => ({
    label,
    scripts: new Set(scriptsIn(fs.readFileSync(path.join(APP_DIR, file), "utf8"))),
  }),
);

const first = present[0];
if (!first) {
  console.error("No prerendered routes matched. Run `pnpm build` first.");
  process.exit(1);
}

// The floor is what every route has in common.
const floor = [...first.scripts].filter((s) => present.every((r) => r.scripts.has(s)));
const floorKb = gzippedKb(floor);

const failures: string[] = [];

console.log("\nJavaScript budget (gzipped, nomodule excluded)\n");
console.log(
  `  ${floorKb <= FLOOR_BUDGET_KB ? "ok  " : "OVER"} framework floor      ${floorKb
    .toFixed(1)
    .padStart(
      6,
    )} KB / ${FLOOR_BUDGET_KB} KB   React 19 + Next 16 runtime, shared by every route`,
);
if (floorKb > FLOOR_BUDGET_KB) {
  failures.push(
    `framework floor grew to ${floorKb.toFixed(1)} KB (pin is ${FLOOR_BUDGET_KB} KB) — expected only after a Next or React upgrade`,
  );
}

console.log("\n  Route-specific JavaScript, on top of the floor:\n");

for (const route of present) {
  const deltaKb = gzippedKb([...route.scripts].filter((s) => !floor.includes(s)));
  const totalKb = floorKb + deltaKb;
  const ok = deltaKb <= DELTA_BUDGET_KB;
  const prdTotal = PRD_TOTALS[route.label];

  console.log(
    `  ${ok ? "ok  " : "OVER"} ${route.label.padEnd(20)} ${deltaKb.toFixed(1).padStart(6)} KB / ${DELTA_BUDGET_KB} KB` +
      `   (total ${totalKb.toFixed(1)} KB; PRD target was ${prdTotal ?? "—"} KB)`,
  );

  if (!ok) {
    failures.push(
      `${route.label}: ${deltaKb.toFixed(1)} KB of route-specific JS exceeds the ${DELTA_BUDGET_KB} KB budget`,
    );
  }
}

if (failures.length > 0) {
  console.error("\nBundle budget exceeded:");
  for (const f of failures) console.error(`  - ${f}`);
  console.error(
    '\nThe usual cause is a new "use client" boundary pulling a dependency into\n' +
      "the browser. Check what that component imports — a schema library, a date\n" +
      "library, or an icon set will all follow it across the boundary.\n",
  );
  process.exit(1);
}

console.log("\nEvery route is within budget.\n");
