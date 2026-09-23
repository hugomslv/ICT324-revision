import js from "@eslint/js";
import { plugin as filenameRules } from '@maintained/eslint-plugin-filename-rules'
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs}"], 
    plugins: { js, 'filename-rules': filenameRules }, 
    extends: ["js/recommended"], 
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
        "error", "always", { "arraysInArrays": false } 
      ],
      eqeqeq: "error",
      semi: [ "error", "never" ],
      indent: [ "error", 2 ],
      "brace-style": [ "error", "1tbs" ],
      "linebreak-style": [ "error", "unix" ],
      "max-len": [ "error", {"code":80} ],
      "id-match": [
        "error",
        "^[a-z_]+$",
        {
          "properties": true,
          "onlyDeclarations": true
        }
      ],
      'filename-rules/match': [2, 'snake_case'],
    }
  }
]);
