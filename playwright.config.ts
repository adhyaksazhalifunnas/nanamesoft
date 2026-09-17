import { defineConfig, devices } from "@playwright/test";

/**
 * E2E, accessibility and anti-pattern tests (PRD D13, §9.5).
 *
 * These run against a PRODUCTION build, not the dev server. Dev injects the
 * React error overlay and unminified styles, both of which change what axe
 * sees and what the anti-pattern scan finds — testing dev would test something
 * no visitor ever loads.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",

  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "on-first-retry",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-safari", use: { ...devices["iPhone 13"] } },
  ],

  webServer: {
    // CSP_NO_HTTPS_UPGRADE drops `upgrade-insecure-requests` from the CSP.
    // WebKit honours that directive on localhost and then cannot load a single
    // subresource over the plain-HTTP test server, so the page renders with no
    // CSS at all. Production keeps the directive; see next.config.ts.
    command: "pnpm exec next build && pnpm exec next start --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    env: { CSP_NO_HTTPS_UPGRADE: "1" },
  },
});
