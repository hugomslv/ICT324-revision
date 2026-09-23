import js from "@eslint/js"
import globals from "globals"
import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([
  globalIgnores([ "dist/", "docs/", "coverage/", "node_modules/" ]),
  {
    files: [ "**/*.{js,mjs,cjs}" ],
    plugins: { js },
    extends: [ "js/recommended" ],
    languageOptions: { globals: globals.browser },
    rules: {
      quotes: [ "error", "double" ],
      "no-unused-vars": "error",
      "no-undef": "error",
      "no-implicit-globals": "error",
      "no-const-assign": "error",
      "no-var": "error",
      "prefer-const": "error",
      "array-bracket-spacing": [
        "error", "always", { arraysInArrays: false },
      ],
      "object-curly-spacing": [ "error", "always" ],
      eqeqeq: "error",
      semi: [ "error", "never" ],
      indent: [ "error", 2 ],
      "brace-style": [ "error", "1tbs" ],
      "linebreak-style": [ "error", "unix" ],
      "max-len": [ "error", { code: 80 } ],
    },
  },
  {
    // scripts exécutés par Node (process, __dirname...) et fichiers de config
    files: [ "scripts/**/*.js", "*.config.js" ],
    languageOptions: { globals: globals.node },
  },
])
