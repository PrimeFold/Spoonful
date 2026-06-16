import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["src/tests/**/*.test.ts"],
    exclude: [
      "dist/**",
      "node_modules/**",
    ],
    env: {
      BASE_URL: "http://localhost:3000",
    },
  },
});