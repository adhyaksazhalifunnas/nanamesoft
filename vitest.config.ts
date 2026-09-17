import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@content": path.resolve(import.meta.dirname, "./content"),
      "@data": path.resolve(import.meta.dirname, "./data"),
    },
  },
  test: {
    // Playwright owns tests/e2e; vitest must not try to run those specs.
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
  },
});
