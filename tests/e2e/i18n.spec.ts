/**
 * The language switcher, and the things a three-language site gets wrong.
 *
 * Every assertion here corresponds to a specific way this feature fails in
 * practice, not to a line of the implementation.
 */
import { expect, test, type Page } from "@playwright/test";

import { ALL_LOCALE_ROUTES, LOCALES, STATIC_ROUTES } from "./routes";

/**
 * Opens the disclosure and returns it.
 *
 * A closed <details> keeps its contents out of the accessibility tree, so the
 * options are genuinely unreachable until it opens — which is what a reader
 * does first, and therefore what these tests do first.
 */
async function openSwitcher(page: Page) {
  const switcher = page.locator("details.language-switcher");
  await expect(switcher).toBeVisible();
  await switcher.locator("summary").click();
  await expect(switcher).toHaveAttribute("open", "");
  return switcher;
}

test.describe("language switcher", () => {
  test("offers all three languages, each named in its own language", async ({ page }) => {
    await page.goto("/en");

    const switcher = await openSwitcher(page);

    // A Japanese reader scans for 日本語, not for "Japanese". Naming the
    // options in English defeats the switcher for the people who need it.
    for (const label of ["English", "Bahasa Indonesia", "日本語"]) {
      await expect(switcher.getByRole("link", { name: new RegExp(label) })).toHaveCount(
        1,
      );
    }
  });

  test("switching language keeps you on the same page", async ({ page }) => {
    // The failure this guards against: a switcher that sends every reader back
    // to the home page, so finding the page again is their problem.
    await page.goto("/en/projects/frescis");

    const link = (await openSwitcher(page)).getByRole("link", { name: /日本語/ });
    await expect(link).toHaveAttribute("href", "/ja/projects/frescis");

    await link.click();
    await expect(page).toHaveURL(/\/ja\/projects\/frescis$/);
  });

  test("opens and works with JavaScript disabled", async ({ browser }) => {
    // It is a native <details> for exactly this reason: with scripting off the
    // disclosure still opens and the links still navigate.
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/en");

    const summary = page.locator("details.language-switcher > summary");
    await summary.click();

    const link = page
      .locator("details.language-switcher")
      .getByRole("link", { name: /Bahasa Indonesia/ });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/id$/);

    await context.close();
  });

  test("marks the active language for assistive technology", async ({ page }) => {
    await page.goto("/id");
    const active = (await openSwitcher(page)).getByRole("link", {
      name: /Bahasa Indonesia/,
    });
    await expect(active).toHaveAttribute("aria-current", "page");
  });
});

test.describe("locale correctness", () => {
  test("html lang matches the route on every locale", async ({ page }) => {
    for (const locale of LOCALES) {
      await page.goto(`/${locale}`);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
    }
  });

  test("every page declares its translations with hreflang", async ({ page }) => {
    // Without these, three translations of one page look like three unrelated
    // pages to a crawler and compete with each other in search results.
    for (const route of ALL_LOCALE_ROUTES) {
      await page.goto(route);

      const hreflangs = await page.evaluate(() =>
        [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) =>
          l.getAttribute("hreflang"),
        ),
      );

      for (const expected of [...LOCALES, "x-default"]) {
        expect(hreflangs, `hreflang ${expected} missing on ${route}`).toContain(expected);
      }
    }
  });

  test("the UI is actually translated, not just the URL", async ({ page }) => {
    // Guards the failure where a locale route exists but renders English —
    // which looks fine in a build log and is useless to a reader.
    await page.goto("/id");
    await expect(page.getByRole("link", { name: "Proyek" }).first()).toBeVisible();

    await page.goto("/ja");
    await expect(page.getByRole("link", { name: "プロジェクト" }).first()).toBeVisible();
  });

  test("Japanese text is set in a font that has the glyphs", async ({ page }) => {
    // Neither Latin family contains a CJK glyph. If the subset fails to load,
    // Japanese silently falls back to a system face — legible, but not the
    // site's typography, and nobody notices in review.
    await page.goto("/ja");
    const family = await page
      .locator("h1")
      .evaluate((el) => getComputedStyle(el).fontFamily);
    expect(family).toContain("Noto Sans JP");
  });

  test("the root path redirects to the default locale", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
  });

  test("English pages never download the Japanese font", async ({ page }) => {
    // The unicode-range is what makes a 144 KB CJK subset acceptable: it must
    // not be fetched by a reader who will never see a Japanese character.
    const requested: string[] = [];
    page.on("request", (r) => {
      if (r.url().includes("noto-sans-jp")) requested.push(r.url());
    });

    for (const route of STATIC_ROUTES) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
    }

    expect(requested).toEqual([]);
  });
});

test.describe("language of parts (WCAG 2.2 SC 3.1.2)", () => {
  // Case-study bodies, role summaries, course takeaways and skill notes are
  // written once, in English, and shown on all three locales. A screen reader
  // on a Japanese page reads them with Japanese phonemes unless the markup
  // says otherwise, so every English sentence must sit inside lang="en".
  //
  // Japanese only. On /id both languages are Latin script, so nothing in the
  // DOM distinguishes an untranslated English sentence from a translated
  // Indonesian one — the check would have to guess. The same components render
  // all three locales, so a missing mark shows up here regardless.
  const ROUTES = [
    "/ja",
    "/ja/about",
    "/ja/experience",
    "/ja/projects",
    "/ja/projects/frescis",
  ];

  test("English sentences sit inside a lang=en subtree", async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route);

      const unmarked = await page.evaluate(() => {
        const bad: string[] = [];
        // CJK ideographs, kana and fullwidth forms.
        const japanese = new RegExp("[\u3000-\u9FFF\uFF00-\uFFEF]");

        for (const el of document.querySelectorAll("main p, main li, main dd")) {
          // Leaf text only — a wrapper's textContent would double-count.
          if (el.querySelector("p, li, dd")) continue;

          const text = (el.textContent ?? "").trim();

          // "An English sentence" here means: ends in a full stop, runs to at
          // least eight words, and contains no Japanese. A stack line
          // ("React · Python · MongoDB") has no full stop, and a technical
          // term is exempt from SC 3.1.2 in any case. Japanese prose ends in
          // 。, not ".", so translated text never reaches the check.
          if (!text.endsWith(".") || text.split(/\s+/).length < 8) continue;
          if (japanese.test(text)) continue;

          const marked = el.closest("[lang]")?.getAttribute("lang");
          if (marked !== "en") {
            bad.push(`${marked ?? "(inherited)"}: ${text.slice(0, 70)}`);
          }
        }

        return bad;
      });

      expect(unmarked, `unmarked English prose on ${route}`).toEqual([]);
    }
  });
});
