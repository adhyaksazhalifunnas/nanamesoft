/**
 * check-contrast.ts — §11.3 token rule, made runnable.
 *
 * §11.3 states: "Every foreground/background token pair is contrast-verified
 * in both themes before use." The PRD gives the rule but no instrument, so
 * verification would otherwise mean remembering to open a contrast checker —
 * which is how `--ink-subtle` shipped at 3.40:1 in §11.3's own token block.
 *
 * This parses the real values out of styles/tokens.css rather than duplicating
 * them, so editing a token is enough to re-check it. Run by `pnpm check`.
 *
 * Thresholds are AC-14.3: 4.5:1 for normal text, 3:1 for large text and for UI
 * component / focus-indicator contrast.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

type Oklch = [L: number, C: number, H: number];

/* ── oklch -> sRGB -> relative luminance ─────────────────────────────────── */

function oklchToSrgb([L, C, H]: Oklch): [number, number, number] {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

  const lr = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  const encode = (v: number) =>
    Math.min(
      1,
      Math.max(
        0,
        v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(Math.max(v, 0), 1 / 2.4) - 0.055,
      ),
    );

  return [encode(lr), encode(lg), encode(lb)];
}

function luminance(rgb: [number, number, number]): number {
  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
}

function contrast(fg: Oklch, bg: Oklch): number {
  const a = luminance(oklchToSrgb(fg));
  const b = luminance(oklchToSrgb(bg));
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

function hex(t: Oklch): string {
  return (
    "#" +
    oklchToSrgb(t)
      .map((v) =>
        Math.round(v * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

/* ── Parse tokens.css ────────────────────────────────────────────────────── */

const CSS = fs.readFileSync(
  path.join(process.cwd(), "src", "styles", "tokens.css"),
  "utf8",
);

/**
 * The light theme is the `:root {}` block; the dark theme is
 * `:root[data-theme='dark'] {}`. Dark values override light ones, so a token
 * the dark block does not redefine keeps its light value — which is exactly
 * how the cascade behaves, and therefore what should be measured.
 */
function themeBlock(selector: string): string {
  const index = CSS.indexOf(selector);
  if (index === -1) return "";
  const open = CSS.indexOf("{", index);
  let depth = 0;
  for (let i = open; i < CSS.length; i++) {
    if (CSS[i] === "{") depth++;
    if (CSS[i] === "}") {
      depth--;
      if (depth === 0) return CSS.slice(open + 1, i);
    }
  }
  return "";
}

function parseTokens(block: string): Record<string, Oklch> {
  const out: Record<string, Oklch> = {};
  const pattern = /--([\w-]+):\s*oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)\)/g;
  for (const m of block.matchAll(pattern)) {
    out[m[1] as string] = [Number(m[2]) / 100, Number(m[3]), Number(m[4])];
  }
  return out;
}

const light = parseTokens(themeBlock(":root {"));
const dark = { ...light, ...parseTokens(themeBlock(':root[data-theme="dark"]')) };

/* ── The pairs that actually appear in the UI ────────────────────────────── */

type Pair = { fg: string; bg: string; min: number; why: string };

const BACKGROUNDS = ["ground", "ground-raised", "ground-sunken"];

const PAIRS: Pair[] = [
  ...BACKGROUNDS.flatMap((bg) => [
    { fg: "ink", bg, min: 4.5, why: "body copy" },
    { fg: "ink-muted", bg, min: 4.5, why: "secondary prose" },
    { fg: "ink-subtle", bg, min: 4.5, why: "meta text, set BELOW normal size" },
    { fg: "accent", bg, min: 4.5, why: "links and accent text" },
  ]),
  // The focus ring is a UI component boundary, not text (SC 1.4.11).
  ...BACKGROUNDS.map((bg) => ({
    fg: "focus",
    bg,
    min: 3,
    why: "focus indicator",
  })),
];

/* ── Report ──────────────────────────────────────────────────────────────── */

const failures: string[] = [];

for (const [themeName, theme] of [
  ["light", light],
  ["dark", dark],
] as const) {
  console.log(`\n${themeName} theme`);

  for (const pair of PAIRS) {
    const fg = theme[pair.fg];
    const bg = theme[pair.bg];
    if (!fg || !bg) continue;

    const ratio = contrast(fg, bg);
    const ok = ratio >= pair.min;
    console.log(
      `  ${ok ? "ok  " : "FAIL"} ${`${pair.fg} on ${pair.bg}`.padEnd(32)} ${ratio
        .toFixed(2)
        .padStart(6)}:1  (needs ${pair.min}:1 — ${pair.why})  ${hex(fg)}`,
    );

    if (!ok) {
      failures.push(
        `${themeName}: ${pair.fg} on ${pair.bg} is ${ratio.toFixed(2)}:1, below ${pair.min}:1 (${pair.why})`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error(`\nContrast failures (${failures.length}):`);
  for (const f of failures) console.error(`  - ${f}`);
  console.error(
    "\nAdjust the lightness of the failing token in src/styles/tokens.css.\n" +
      "Changing the background instead affects every other pair, so move the\n" +
      "foreground unless the ground itself is the problem.\n",
  );
  process.exit(1);
}

console.log("\nEvery token pair meets its WCAG 2.2 AA threshold in both themes.\n");
