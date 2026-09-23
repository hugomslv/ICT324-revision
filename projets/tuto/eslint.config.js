import js from "@eslint/js"
import globals from "globals"
import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([
  globalIgnores([ "dist/", "docs/", "coverage/" ]),
  {
    files: [ "**/*.{js,mjs,cjs}" ],
    plugins: { js },
    extends: [ "js/recommended" ],
    languageOptions: { globals: globals.browser },
    rules: {
      quotes: [ "error", "double" ],
      semi: [ "error", "never" ],
      indent: [ "error", 2 ],
      eqeqeq: "error",
      "no-var": "error",
      "prefer-const": "error",
      "no-unused-vars": "error",
      "no-undef": "error",
      "array-bracket-spacing": [ "error", "always", { arraysInArrays: false } ],
      "object-curly-spacing": [ "error", "always" ],
      "brace-style": [ "error", "1tbs" ],
      "linebreak-style": [ "error", "unix" ],
      "max-len": [ "error", { code: 80 } ],
    },
  },
  {
    files: [ "*.config.js", "scripts/**/*.js" ],
    languageOptions: { globals: globals.node },
  },
])
