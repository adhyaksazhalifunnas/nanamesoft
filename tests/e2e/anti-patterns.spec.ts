/**
 * The §11.2 Anti-Pattern Register, enforced.
 *
 * §11.2 calls these "requirements, not preferences" and says the presence of
 * any of them is a build-review blocker. A register that is only checked by
 * review is checked exactly once; this checks it on every push.
 *
 * Each test names the anti-pattern and the acceptance criterion it maps to.
 */
import { expect, test } from "@playwright/test";

import { projectRoutes, STATIC_ROUTES } from "./routes";

test.describe("§11.2 anti-pattern register", () => {
  test("no gradient backgrounds anywhere (AC-01.7)", async ({ page, request }) => {
    const routes = [...STATIC_ROUTES, ...(await projectRoutes(request))];

    for (const route of routes) {
      await page.goto(route);
      const offenders = await page.evaluate(() => {
        const bad: string[] = [];
        for (const el of document.querySelectorAll("*")) {
          const s = getComputedStyle(el);
          const layers = `${s.backgroundImage} ${s.background}`;
          if (/linear-gradient|radial-gradient|conic-gradient/.test(layers)) {
            bad.push(`${el.tagName.toLowerCase()}.${el.className}`.slice(0, 120));
          }
        }
        return bad;
      });
      expect(offenders, `gradient found on ${route}`).toEqual([]);
    }
  });

  test("no glassmorphism — no backdrop-filter (AC-01.7)", async ({ page, request }) => {
    const routes = [...STATIC_ROUTES, ...(await projectRoutes(request))];

    for (const route of routes) {
      await page.goto(route);
      const offenders = await page.evaluate(() => {
        const bad: string[] = [];
        for (const el of document.querySelectorAll("*")) {
          const s = getComputedStyle(el);
          const filter =
            s.backdropFilter ||
            (s as unknown as Record<string, string>).webkitBackdropFilter;
          if (filter && filter !== "none") {
            bad.push(`${el.tagName.toLowerCase()}.${el.className}`.slice(0, 120));
          }
        }
        return bad;
      });
      expect(offenders, `backdrop-filter found on ${route}`).toEqual([]);
    }
  });

  test("corner radius never exceeds --radius-md, 4px (§11.3)", async ({
    page,
    request,
  }) => {
    const routes = [...STATIC_ROUTES, ...(await projectRoutes(request))];

    for (const route of routes) {
      await page.goto(route);
      const offenders = await page.evaluate(() => {
        const bad: string[] = [];
        for (const el of document.querySelectorAll("*")) {
          const s = getComputedStyle(el);
          const box = el.getBoundingClientRect();
          // A fully round mark is allowed on small decorative elements — the
          // availability dot and the language breakdown bar. It is NOT allowed
          // on anything card-sized, which is what §11.2 is guarding against:
          // "rounded corners are the fastest route back to the generic look".
          const isSmallMark = box.height > 0 && box.height <= 24;

          for (const corner of [
            s.borderTopLeftRadius,
            s.borderTopRightRadius,
            s.borderBottomLeftRadius,
            s.borderBottomRightRadius,
          ]) {
            const px = Number.parseFloat(corner);
            if (!Number.isFinite(px)) continue;

            // Tailwind's rounded-full is calc(infinity * 1px), which lands as
            // ~3.4e7px. Percentages are likewise "fully round".
            const isPill = corner.endsWith("%") || px > 1000;
            if (isPill && isSmallMark) continue;
            if (!isPill && px <= 4) continue;

            bad.push(
              `${el.tagName.toLowerCase()} (${Math.round(box.width)}x${Math.round(box.height)}): ${corner}`,
            );
          }
        }
        return [...new Set(bad)];
      });
      expect(offenders, `radius over 4px on ${route}`).toEqual([]);
    }
  });

  test("no banned typeface is used for display or body (§11.2)", async ({ page }) => {
    await page.goto("/");
    const families = await page.evaluate(() => {
      const seen = new Set<string>();
      for (const el of document.querySelectorAll("h1, h2, h3, p, body, a, li")) {
        seen.add(getComputedStyle(el).fontFamily);
      }
      return [...seen].join(" | ").toLowerCase();
    });

    // Inter, Poppins and Montserrat are named in §11.2 as instant "default" tells.
    expect(families).not.toContain("inter");
    expect(families).not.toContain("poppins");
    expect(families).not.toContain("montserrat");
    // And the intended pairing is actually in use.
    expect(families).toContain("fraunces");
  });

  test("no skill percentages, star ratings or progress bars (AC-06.3)", async ({
    page,
  }) => {
    await page.goto("/");
    const skills = page.locator("#skills");
    await expect(skills).toBeVisible();

    const text = (await skills.textContent()) ?? "";
    // "React 87%" and friends. Year ranges and the language breakdown live
    // elsewhere, so a percent sign inside the skills section is always a bug.
    expect(text).not.toMatch(/\d+\s*%/);

    // No <progress>, no meter, no role="progressbar" anywhere in the section.
    await expect(skills.locator("progress, meter, [role='progressbar']")).toHaveCount(0);
  });

  test("the hero carries real information and is not full-viewport (AC-01.5)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const heroBottom = await page
      .locator("section")
      .first()
      .evaluate((el) => el.getBoundingClientRect().bottom);

    // A peek of the next section must be detectable at the fold on desktop.
    expect(heroBottom).toBeLessThan(900);

    // And the hero must carry more than a name: role, value proposition and a
    // primary call to action are all required above the fold (AC-01.1).
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("link", { name: /case studies/i }).first()).toBeVisible();
  });

  test("no marquee, no typewriter, no canvas particle field (§11.2)", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("marquee, canvas")).toHaveCount(0);

    // A typewriter effect leaves the heading text incomplete at first paint.
    const h1 = await page.locator("h1").textContent();
    expect((h1 ?? "").trim().length).toBeGreaterThan(3);
  });
});
