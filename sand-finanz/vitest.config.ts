import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
  // Prevent Vitest/Vite from loading the app's Tailwind PostCSS config,
  // which is not a valid plugin object for Vite's CSS pipeline.
  css: { postcss: { plugins: [] } },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
  },
});
