/**
 * jp-font.ts — vendors exactly the Noto Sans JP slices this site needs, and
 * then keeps proving that the set is still complete.
 *
 * Neither Fraunces nor Public Sans contains a single CJK glyph, so Japanese
 * needs its own face. The whole family is 4.98 MB across 124 unicode-range
 * slices — far too much to commit, and unnecessary: the Japanese text on this
 * site is a bounded, known set (the `ja` dictionary plus the translated
 * summary layer), so only a handful of slices can ever be requested.
 *
 * The risk with subsetting is silent: add one new Japanese sentence containing
 * an uncovered kanji and it renders in a fallback face that nobody notices in
 * review. So this script has two modes, and the second one runs in CI:
 *
 *   pnpm sync:jp-font   — network. Works out which slices the current text
 *                         needs, downloads them, writes the @font-face CSS.
 *   pnpm check:fonts    — offline. Fails if any Japanese character in the
 *                         repository is not covered by a vendored slice.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const FONT_DIR = path.join(ROOT, "public", "fonts", "noto-sans-jp");
const CSS_OUT = path.join(ROOT, "src", "styles", "noto-sans-jp.css");
const MANIFEST = path.join(FONT_DIR, "slices.json");

/** Files scanned for Japanese text. */
const SOURCES = [
  "src/i18n/dictionaries/ja.ts",
  "content/site.ts",
  ...fs
    .readdirSync(path.join(ROOT, "content", "projects"))
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => path.join("content", "projects", f)),
];

/**
 * Codepoints the Latin faces already cover. Public Sans supplies ASCII, the
 * Latin supplements and general punctuation, and the first family in the stack
 * wins per glyph — so those characters never reach the Japanese face and must
 * not drag a slice in with them.
 */
function needsJapaneseFace(codepoint: number): boolean {
  if (codepoint < 0x0250) return false; // ASCII, Latin-1, Latin Extended-A/B
  if (codepoint >= 0x2000 && codepoint <= 0x206f) return false; // general punctuation
  if (codepoint >= 0x2190 && codepoint <= 0x21ff) return false; // arrows
  if (codepoint >= 0x2600 && codepoint <= 0x26ff) return false; // misc symbols
  return true;
}

function collectCodepoints(): Map<number, string> {
  const found = new Map<number, string>();

  for (const relative of SOURCES) {
    const file = path.join(ROOT, relative);
    if (!fs.existsSync(file)) continue;
    for (const char of fs.readFileSync(file, "utf8")) {
      const cp = char.codePointAt(0);
      if (cp === undefined || !needsJapaneseFace(cp)) continue;
      if (!found.has(cp)) found.set(cp, relative);
    }
  }

  return found;
}

/* ── Fontsource CSS parsing ──────────────────────────────────────────────── */

type Slice = { file: string; ranges: Array<[number, number]> };

function covers(slice: Slice, codepoint: number): boolean {
  return slice.ranges.some(([from, to]) => codepoint >= from && codepoint <= to);
}

/* ── Modes ───────────────────────────────────────────────────────────────── */

/**
 * The upstream variable font. Fontsource ships 124 pre-cut slices, which is
 * the right shape for a site whose Japanese text is unknown in advance — but
 * ours is known, and the slices are cut by frequency, so 472 characters spread
 * across 42 of them and cost 778 KB. Cutting our own subset from the original
 * gets the same glyphs into a fraction of that.
 */
const UPSTREAM_TTF =
  "https://github.com/google/fonts/raw/main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf";

/**
 * Ranges kept beyond the characters currently in use, so that ordinary edits
 * to the Japanese text do not require a re-subset. Kana and CJK punctuation
 * are a few hundred glyphs and cost very little; kanji are the expensive part
 * and are included only where actually used.
 */
const ALWAYS_KEEP: Array<[number, number]> = [
  [0x3000, 0x303f], // CJK symbols and punctuation
  [0x3041, 0x309f], // hiragana
  [0x30a0, 0x30ff], // katakana
  [0xff01, 0xff60], // fullwidth forms
  [0xffe0, 0xffe6], // fullwidth currency
];

async function sync(): Promise<void> {
  const needed = collectCodepoints();
  console.log(`Japanese characters in use: ${needed.size}`);

  const codepoints = new Set<number>(needed.keys());
  for (const [from, to] of ALWAYS_KEEP) {
    for (let cp = from; cp <= to; cp++) codepoints.add(cp);
  }
  console.log(`Subsetting to ${codepoints.size} codepoints (incl. kana and punctuation)`);

  // The upstream face is several megabytes and never enters the repository;
  // it is cached outside it so a re-run does not re-download.
  const cacheDir = path.join(os.tmpdir(), "nanamesoft-fonts");
  fs.mkdirSync(cacheDir, { recursive: true });
  const source = path.join(cacheDir, "NotoSansJP-variable.ttf");

  if (!fs.existsSync(source)) {
    console.log("Downloading the upstream variable font…");
    const res = await fetch(UPSTREAM_TTF);
    if (!res.ok) throw new Error(`Upstream font returned ${res.status}`);
    fs.writeFileSync(source, Buffer.from(await res.arrayBuffer()));
  }
  console.log(`  source: ${(fs.statSync(source).size / 1024 / 1024).toFixed(1)} MB`);

  fs.mkdirSync(FONT_DIR, { recursive: true });
  const outFile = "noto-sans-jp-subset.woff2";
  const outPath = path.join(FONT_DIR, outFile);

  const unicodesFile = path.join(cacheDir, "unicodes.txt");
  fs.writeFileSync(
    unicodesFile,
    [...codepoints]
      .sort((a, b) => a - b)
      .map((c) => c.toString(16))
      .join(","),
  );

  // pyftsubset is the only tool here that is not Node. `pnpm check:fonts`
  // stays pure Node on purpose, so CI never needs Python — only this manual,
  // occasional sync does.
  // Invoked as a module rather than the `pyftsubset` console script, which is
  // not always on PATH on Windows even when fonttools is installed.
  const result = spawnSync(
    "python",
    [
      "-m",
      "fontTools.subset",
      source,
      `--unicodes-file=${unicodesFile}`,
      "--flavor=woff2",
      `--output-file=${outPath}`,
      // Keeping every OpenType feature costs 276 KB; the default set 188 KB.
      // `kern` and `palt` are the two that matter for Japanese setting —
      // kerning, and proportional alternate widths so the text does not read
      // as evenly-spaced monospace. 144 KB.
      "--layout-features=kern,palt",
      "--no-hinting",
      "--desubroutinize",
    ],
    { stdio: "inherit", shell: true },
  );

  if (result.status !== 0) {
    console.error("pyftsubset failed. Install it with `pip install fonttools brotli`.");
    process.exit(1);
  }

  // Anything left from the previous slice-based approach is now dead weight.
  for (const existing of fs.readdirSync(FONT_DIR)) {
    if (existing.endsWith(".woff2") && existing !== outFile) {
      fs.unlinkSync(path.join(FONT_DIR, existing));
      console.log(`  removed superseded slice ${existing}`);
    }
  }

  const ranges: Array<[number, number]> = [];
  for (const cp of [...codepoints].sort((a, b) => a - b)) {
    const last = ranges.at(-1);
    if (last && cp === last[1] + 1) last[1] = cp;
    else ranges.push([cp, cp]);
  }

  fs.writeFileSync(
    MANIFEST,
    `${JSON.stringify(
      [
        {
          file: outFile,
          ranges: ranges.map(([f, t]) =>
            f === t ? f.toString(16) : `${f.toString(16)}-${t.toString(16)}`,
          ),
        },
      ],
      null,
      2,
    )}
`,
  );

  const rangeCss = ranges
    .map(([f, t]) =>
      f === t
        ? `U+${f.toString(16).toUpperCase()}`
        : `U+${f.toString(16).toUpperCase()}-${t.toString(16).toUpperCase()}`,
    )
    .join(",");

  fs.writeFileSync(
    CSS_OUT,
    [
      "/*",
      " * GENERATED by scripts/jp-font.ts — do not edit by hand.",
      " *",
      " * Noto Sans JP, subset to the glyphs this site's Japanese text actually",
      " * uses, plus all kana and CJK punctuation so ordinary edits do not need a",
      " * re-subset. The full family is 4.98 MB; this is a fraction of that.",
      " *",
      " * The unicode-range means an English or Indonesian page never requests it:",
      " * the browser fetches the file only when a glyph on the page falls inside.",
      " *",
      " * Licence: SIL Open Font License 1.1 — see public/fonts/LICENSE.md.",
      " * Regenerate with `pnpm sync:jp-font` (needs Python and fonttools).",
      " * `pnpm check:fonts` fails the build if new Japanese text needs a glyph",
      " * this subset does not carry.",
      " */",
      "",
      "@font-face {",
      "  font-family: 'Noto Sans JP';",
      "  font-style: normal;",
      "  font-weight: 100 900;",
      "  font-display: swap;",
      `  src: url('/fonts/noto-sans-jp/${outFile}') format('woff2-variations');`,
      `  unicode-range: ${rangeCss};`,
      "}",
      "",
    ].join("\n"),
  );

  console.log(`\nSubset written: ${(fs.statSync(outPath).size / 1024).toFixed(0)} KB`);
  console.log(`Wrote ${path.relative(ROOT, CSS_OUT)}\n`);
}

function check(): void {
  if (!fs.existsSync(MANIFEST)) {
    console.error(
      "No Japanese font manifest. Run `pnpm sync:jp-font` to vendor the slices.",
    );
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8")) as Array<{
    file: string;
    ranges: string[];
  }>;

  const slices: Slice[] = manifest.map((entry) => ({
    file: entry.file,
    ranges: entry.ranges.map((r) => {
      const [from, to] = r.split("-");
      const start = Number.parseInt(from ?? "0", 16);
      return [start, to ? Number.parseInt(to, 16) : start] as [number, number];
    }),
  }));

  const missingFiles = slices.filter((s) => !fs.existsSync(path.join(FONT_DIR, s.file)));
  if (missingFiles.length > 0) {
    console.error(`Missing font files: ${missingFiles.map((s) => s.file).join(", ")}`);
    process.exit(1);
  }

  const needed = collectCodepoints();
  const uncovered: Array<{ char: string; source: string }> = [];

  for (const [cp, source] of needed) {
    if (!slices.some((s) => covers(s, cp))) {
      uncovered.push({ char: String.fromCodePoint(cp), source });
    }
  }

  if (uncovered.length > 0) {
    console.error(
      `\n${uncovered.length} Japanese character(s) have no vendored font slice:\n`,
    );
    for (const { char, source } of uncovered.slice(0, 40)) {
      console.error(
        `  ${char}  (U+${char.codePointAt(0)?.toString(16).toUpperCase()})  first seen in ${source}`,
      );
    }
    console.error("\nThey would render in a fallback face. Run `pnpm sync:jp-font`.\n");
    process.exit(1);
  }

  const bytes = slices.reduce(
    (total, s) => total + fs.statSync(path.join(FONT_DIR, s.file)).size,
    0,
  );

  console.log(
    `Japanese font: ${needed.size} characters covered by ${slices.length} vendored slice(s), ${(bytes / 1024).toFixed(0)} KB.`,
  );
}

if (process.argv.includes("--sync")) {
  await sync();
} else {
  check();
}
