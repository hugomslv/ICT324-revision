import { defineConfig, coverageConfigDefaults } from "vitest/config"

export default defineConfig({
  base: "/mon_dossier/",
  test: {
    coverage: {
      provider: "v8",
      include: [ "src/**/*.js" ],
      exclude: [ "src/main.js", ...coverageConfigDefaults.exclude ],
    },
  },
})
