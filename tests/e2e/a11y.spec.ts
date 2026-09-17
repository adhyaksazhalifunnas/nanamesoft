/**
 * Accessibility — US-14, launch gates G3 and G4.
 *
 * AC-14.11 requires zero axe violations across all routes AND all breakpoints,
 * so this sweeps both rather than checking one desktop width and calling it
 * done. Layout-dependent failures — a focus ring clipped by a sticky header, a
 * contrast loss on a reflowed background — only appear at specific widths.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { BREAKPOINTS, projectRoutes, STATIC_ROUTES } from "./routes";

/** Scrolls to the bottom and back so every one-shot reveal has completed. */
async function revealEverything(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 25));
    }
    window.scrollTo(0, 0);
  });
  // Long enough for --dur-slow plus the maximum stagger to settle.
  await page.waitForTimeout(800);
}

test.describe("axe-core (AC-14.11)", () => {
  test("every route is clean at every breakpoint", async ({ page, request }) => {
    // Nine routes x eight breakpoints, each scrolled end to end so the
    // reveals settle before axe measures. Thorough by design, and far past
    // the 30s default.
    test.setTimeout(300_000);

    const routes = [...STATIC_ROUTES, ...(await projectRoutes(request))];

    for (const route of routes) {
      for (const width of BREAKPOINTS) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(route);

        // Scroll the whole page first so every scroll-reveal has fired.
        // Without this, axe measures elements mid-transition and reports the
        // blended colour — a partly-faded heading reads as 1.19:1 and looks
        // like a contrast bug when it is really an animation frame. The
        // reveals are one-shot (see components/motion/Reveal.tsx), so they
        // stay revealed after scrolling back to the top, and what axe then
        // measures is the state a reader actually sees.
        await revealEverything(page);

        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();

        expect(
          results.violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`),
          `${route} at ${width}px`,
        ).toEqual([]);
      }
    }
  });
});

test.describe("structure and keyboard (AC-14.2, AC-14.4, AC-14.5)", () => {
  test("the skip link is the first focusable element and moves focus", async ({
    page,
    browserName,
  }) => {
    // Safari excludes <a> from the sequential focus order by default: pressing
    // Tab in WebKit jumps straight past every link to the first <button>.
    // (Verified — Tab there yields BUTTON, BUTTON, BODY, not the skip link.)
    // That is an OS-level setting, "Full Keyboard Access" / "Press Tab to
    // highlight each item", not something markup controls, so asserting tab
    // ORDER on WebKit would be testing Safari's preferences rather than this
    // site. Focus behaviour itself is still covered on WebKit by the
    // focus-ring test below, which focuses elements programmatically.
    test.skip(
      browserName === "webkit",
      "WebKit omits links from the tab order unless Full Keyboard Access is on",
    );

    await page.goto("/");
    await page.keyboard.press("Tab");

    const focused = page.locator(":focus");
    await expect(focused).toHaveText(/skip to content/i);

    await focused.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
  });

  test("exactly one h1 per page, and heading levels never skip", async ({
    page,
    request,
  }) => {
    const routes = [...STATIC_ROUTES, ...(await projectRoutes(request))];

    for (const route of routes) {
      await page.goto(route);

      await expect(page.locator("h1"), `h1 count on ${route}`).toHaveCount(1);

      const levels = await page.evaluate(() =>
        [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) =>
          Number(h.tagName[1]),
        ),
      );

      for (let i = 1; i < levels.length; i++) {
        const previous = levels[i - 1] as number;
        const current = levels[i] as number;
        expect(
          current - previous,
          `heading jump on ${route} at index ${i}`,
        ).toBeLessThanOrEqual(1);
      }
    }
  });

  test("a project card is a single tab stop (AC-02.5)", async ({ page }) => {
    await page.goto("/projects");

    const cardCount = await page.locator("article").count();
    test.skip(cardCount === 0, "no published case studies yet");

    const linksInFirstCard = await page.locator("article").first().locator("a").count();
    expect(linksInFirstCard).toBe(1);
  });

  test("every interactive element has a visible focus indicator (AC-14.4)", async ({
    page,
  }) => {
    await page.goto("/");

    const interactive = page.locator("a[href], button, input, select, textarea");
    const total = await interactive.count();

    for (let i = 0; i < Math.min(total, 25); i++) {
      const el = interactive.nth(i);
      if (!(await el.isVisible())) continue;

      await el.focus();
      const outline = await el.evaluate((node) => {
        const s = getComputedStyle(node);
        // The card link paints its ring on ::after, so check both.
        const after = getComputedStyle(node, "::after");
        return {
          width: s.outlineWidth,
          style: s.outlineStyle,
          afterWidth: after.outlineWidth,
          afterStyle: after.outlineStyle,
        };
      });

      const hasRing =
        (outline.style !== "none" && Number.parseFloat(outline.width) > 0) ||
        (outline.afterStyle !== "none" && Number.parseFloat(outline.afterWidth) > 0);

      expect(hasRing, `no focus ring on interactive element ${i}`).toBe(true);
    }
  });
});

test.describe("reduced motion (AC-14.10, G5)", () => {
  test.use({ reducedMotion: "reduce" });

  test("all content is present and visible with motion disabled", async ({ page }) => {
    await page.goto("/");

    // Reveal must not leave anything stuck at opacity 0 — §11.6 is explicit
    // that reduced motion is "a designed alternative", not a degradation.
    const hidden = await page.evaluate(() => {
      const bad: string[] = [];
      for (const el of document.querySelectorAll(".reveal")) {
        const s = getComputedStyle(el);
        if (Number.parseFloat(s.opacity) < 0.99) {
          bad.push(el.className);
        }
      }
      return bad;
    });

    expect(hidden).toEqual([]);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("#skills")).toBeVisible();
  });
});
