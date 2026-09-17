/**
 * Responsive integrity — US-11, launch gate G6.
 *
 * AC-11.1 lists eight widths and forbids horizontal overflow, overlap and
 * clipped text at any of them. Overflow is the one that regresses silently:
 * a single long unbroken string in a grid cell is enough, and it never shows
 * up in the width you happen to be developing at.
 */
import { expect, test } from "@playwright/test";

import { BREAKPOINTS, projectRoutes, STATIC_ROUTES } from "./routes";

test.describe("AC-11.1 — no horizontal overflow", () => {
  test("at every width, on every route", async ({ page, request }) => {
    const routes = [...STATIC_ROUTES, ...(await projectRoutes(request))];

    for (const route of routes) {
      for (const width of BREAKPOINTS) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(route);

        const overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          const offenders: string[] = [];

          if (doc.scrollWidth > doc.clientWidth) {
            // Name the widest element so the failure is actionable rather
            // than just "something overflows".
            for (const el of document.querySelectorAll("*")) {
              const rect = el.getBoundingClientRect();
              if (rect.right > doc.clientWidth + 1 && rect.width > 0) {
                offenders.push(
                  `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} right=${Math.round(rect.right)}`,
                );
              }
            }
          }

          return {
            scrollWidth: doc.scrollWidth,
            clientWidth: doc.clientWidth,
            offenders: offenders.slice(0, 5),
          };
        });

        expect(
          overflow.scrollWidth,
          `${route} at ${width}px overflows: ${overflow.offenders.join("; ")}`,
        ).toBeLessThanOrEqual(overflow.clientWidth + 1);
      }
    }
  });
});

test.describe("AC-11.2 — touch targets", () => {
  test("interactive elements are at least 44px tall on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    for (const route of STATIC_ROUTES) {
      await page.goto(route);

      const small = await page.evaluate(() => {
        const bad: string[] = [];
        const selector = "a[href], button, input:not([type=hidden]), select, textarea";

        for (const el of document.querySelectorAll(selector)) {
          const rect = el.getBoundingClientRect();
          // Skip anything not rendered, and inline links inside running prose:
          // SC 2.5.8 explicitly excepts targets in a sentence of text.
          if (rect.width === 0 || rect.height === 0) continue;
          const inProse = el.closest("p, li, figcaption, dd");
          if (inProse) continue;
          // The contact honeypot is deliberately unreachable: off-screen,
          // aria-hidden, and out of the tab order. A target nobody can reach
          // has no target size (SC 2.5.8 applies to what a pointer can hit).
          if (el.closest("[aria-hidden='true']")) continue;
          if (el.getAttribute("tabindex") === "-1") continue;

          if (rect.height < 44) {
            bad.push(
              `${el.tagName.toLowerCase()} "${(el.textContent ?? "").trim().slice(0, 30)}" = ${Math.round(rect.height)}px`,
            );
          }
        }
        return bad;
      });

      expect(small, `undersized touch targets on ${route}`).toEqual([]);
    }
  });
});

test.describe("AC-11.3 — readable measure", () => {
  test("body text is at least 16px and prose stays within 75 characters", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/about");

    const bodySize = await page.evaluate(() =>
      Number.parseFloat(getComputedStyle(document.body).fontSize),
    );
    expect(bodySize).toBeGreaterThanOrEqual(16);

    // The measure has to be checked in CHARACTERS, not pixels. --measure is
    // 66ch, so its pixel width scales with the element's own font size: an
    // 872px paragraph set at 21.6px is exactly 66ch and entirely correct,
    // while a 1200px line of 14px text is 167ch and unreadable. Measuring px
    // would fail the first and pass the second.
    for (const width of [1280, 1920]) {
      await page.setViewportSize({ width, height: 1080 });
      await page.goto("/about");

      const tooWide = await page.evaluate(() => {
        // Width of one "0" at each element's computed font, which is what the
        // CSS `ch` unit is defined against.
        const probe = document.createElement("span");
        probe.textContent = "0";
        probe.style.position = "absolute";
        probe.style.visibility = "hidden";
        probe.style.whiteSpace = "pre";

        const bad: string[] = [];

        for (const p of document.querySelectorAll("p, li, dd")) {
          const text = (p.textContent ?? "").trim();
          if (text.length < 90) continue; // labels and meta lines are not prose
          // Containers are not text blocks. An <li> wrapping two capped <p>s
          // is as wide as its grid column by design; the prose inside it is
          // what has to respect the measure.
          if (p.querySelector("p, li, dd, table, ul, ol, dl")) continue;

          const style = getComputedStyle(p);
          probe.style.font = style.font || `${style.fontSize} ${style.fontFamily}`;
          p.appendChild(probe);
          const chWidth = probe.getBoundingClientRect().width;
          probe.remove();
          if (chWidth === 0) continue;

          const chars = p.getBoundingClientRect().width / chWidth;
          if (chars > 75) {
            bad.push(`${Math.round(chars)}ch — "${text.slice(0, 40)}…"`);
          }
        }
        return bad;
      });

      expect(tooWide, `prose exceeds 75 characters at ${width}px`).toEqual([]);
    }
  });
});

test.describe("AC-10.5 / AC-15.6 — usable without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("content is readable and navigation works with JS disabled", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("#skills")).toBeVisible();

    // The reveals are CSS scroll-driven animations, so they still run with
    // JavaScript disabled — that is the point of implementing them in CSS.
    // Below-fold elements start at opacity 0 by design; what must be true is
    // that scrolling brings every one of them to full opacity, so no content
    // is ever permanently unreachable.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const stillHidden = await page.evaluate(() => {
      const bad: string[] = [];
      for (const el of document.querySelectorAll(".reveal")) {
        const opacity = Number.parseFloat(getComputedStyle(el).opacity);
        if (opacity < 0.99) {
          bad.push(`${(el.textContent ?? "").trim().slice(0, 40)} @ ${opacity}`);
        }
      }
      return bad;
    });
    expect(stillHidden, "content never reaches full opacity without JS").toEqual([]);

    // AC-09.1: the second contact route must work without JavaScript.
    await page.goto("/contact");
    const mailto = page.locator('a[href^="mailto:"]').first();
    await expect(mailto).toBeVisible();
  });
});
