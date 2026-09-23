import { defineConfig, coverageConfigDefaults } from "vitest/config"

export default defineConfig({
  // Dossier de publication sur le serveur FTP : https://serveur/mon_dossier/
  // (commence ET finit par "/"). Pour un chemin relatif universel : "./"
  base: "/mon_dossier/",
  build: {
    outDir: "dist",
    // Nécessaire si le code utilise un "await" au niveau racine (top-level)
    target: "esnext",
  },
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      include: [ "src/**/*.js" ],
      exclude: [ "src/main.js", ...coverageConfigDefaults.exclude ],
      reporter: [ "text", "html", "json" ],
      reportsDirectory: "./coverage",
    },
  },
})
