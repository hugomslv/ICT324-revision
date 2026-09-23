---
title: "Antisèche"
lead: "Toutes les commandes et tous les fichiers de config sur une seule page. Chaque bloc a un bouton Copier (survole-le)."
---

## Installation complète (AVEC réseau)

```bash
npm create vite@latest mon-projet -- --template vanilla
cd mon-projet
npm install
npm install -D eslint @eslint/js globals vitest @vitest/coverage-v8 jsdoc
# extras
npm install -D @maintained/eslint-plugin-filename-rules dotenv-cli @vitest/ui jsdom
```

## Commandes

| Outil | Commande | Effet |
|---|---|---|
| Vite | `npm run dev` | serveur de dev (http://localhost:5173) |
| | `npm run build` | build dans `dist/` |
| | `npm run preview` | sert `dist/` (avec `base`) sur http://localhost:4173 |
| ESLint | `npx eslint .` | analyse tout |
| | `npx eslint . --fix` | corrige automatiquement |
| | `npx eslint fichier.js` | un fichier |
| | `npx eslint --print-config fichier.js` | config appliquée |
| Vitest | `npx vitest` | mode watch |
| | `npx vitest run` | une fois |
| | `npx vitest run --coverage` | + couverture |
| | `npx vitest run -t "nom"` | filtre par nom de test |
| | `npx vitest run --reporter=verbose` | détail |
| | `npx vitest run --reporter=json --outputFile=test-results.json` | résultats JSON |
| JSDoc | `npx jsdoc -c jsdoc-conf.json -R README.md` | génère `docs/` |
| | `npx jsdoc src -r -d docs -R README.md` | sans fichier de config |
| npm | `npm run <script>` | lance un script |
| | `npm run lint -- --fix` | passe une option au script |
| | `npm ci` | réinstalle exactement le lock |
| | `npm install --offline` | réinstalle depuis le cache |
| Vérif | `node scripts/check-dist.js` | liens de `dist/` ([script](modele.html#verifier-dist-sans-serveur)) |

## package.json (scripts)

```json [package.json]
{
  "name": "mon-projet",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "test": "vitest",
    "test:run": "vitest run",
    "coverage": "vitest run --coverage",
    "doc": "jsdoc -c jsdoc-conf.json && node -e \"require('fs').cpSync('img', 'docs/img', { recursive: true })\"",
    "check": "node scripts/check-dist.js",
    "publish": "dotenv -e .env -- bash scripts/publish.sh"
  }
}
```

## eslint.config.js

```js [eslint.config.js]
import js from "@eslint/js"
import globals from "globals"
import { defineConfig, globalIgnores } from "eslint/config"
// import { plugin as filenameRules } from "@maintained/eslint-plugin-filename-rules"

export default defineConfig([
  globalIgnores([ "dist/", "docs/", "coverage/" ]),
  {
    files: [ "**/*.{js,mjs,cjs}" ],
    plugins: { js /* , "filename-rules": filenameRules */ },
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
      "array-bracket-spacing": [ "error", "always", { arraysInArrays: false } ],
      "object-curly-spacing": [ "error", "always" ],
      eqeqeq: "error",
      semi: [ "error", "never" ],
      indent: [ "error", 2 ],
      "brace-style": [ "error", "1tbs" ],
      "linebreak-style": [ "error", "unix" ],
      "max-len": [ "error", { code: 80 } ],
      // "id-match": [ "error", "^[a-z_]+$", { properties: true, onlyDeclarations: true } ],
      // "filename-rules/match": [ "error", "snake_case" ],
    },
  },
  {
    files: [ "scripts/**/*.js", "*.config.js" ],
    languageOptions: { globals: globals.node },
  },
])
```

## vite.config.js (avec Vitest)

```js [vite.config.js]
import { defineConfig, coverageConfigDefaults } from "vitest/config"

export default defineConfig({
  base: "/mon_dossier/",
  build: { outDir: "dist", target: "esnext" },
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
```

## jsdoc-conf.json

```json [jsdoc-conf.json]
{
  "plugins": ["plugins/markdown"],
  "recurseDepth": 10,
  "source": {
    "include": ["src"],
    "includePattern": ".+\\.js(doc|x)?$",
    "excludePattern": "(^|\\/|\\\\)_|\\.test\\.js$"
  },
  "sourceType": "module",
  "tags": { "allowUnknownTags": true, "dictionaries": ["jsdoc", "closure"] },
  "templates": { "cleverLinks": false, "monospaceLinks": false },
  "opts": {
    "template": "templates/default",
    "encoding": "utf8",
    "destination": "./docs/",
    "readme": "./README.md",
    "recurse": true
  }
}
```

## Test type

```js [src/math.test.js]
import { describe, test, expect, vi, afterEach } from "vitest"
import { add, add_strict } from "./math.js" // add_strict lève une erreur

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("add", () => {
  test("1 + 2 = 3", () => {
    expect(add(1, 2)).toBe(3)
  })
  test("tableau : toEqual", () => {
    expect([ 1, 2 ]).toEqual([ 1, 2 ])
  })
  test("erreur : fonction dans expect", () => {
    expect(() => add_strict(1, "a")).toThrow("nombre attendu")
  })
  test.each([[ 1, 1, 2 ], [ 2, 3, 5 ]])("add(%i, %i) = %i", (a, b, r) => {
    expect(add(a, b)).toBe(r)
  })
  test("fetch simulé", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ eur: { chf: 0.94 } }),
    }))
    const res = await fetch("x")
    expect(await res.json()).toEqual({ eur: { chf: 0.94 } })
  })
})
```

## JSDoc type

```js
/**
 * @file Description du fichier.
 * @module math
 * @author Prénom Nom
 * @version 1.0.0
 */

/**
 * Description de la fonction.
 * @param {number} a - Premier nombre.
 * @param {number} [b=0] - Second nombre (optionnel).
 * @returns {number|string} Le résultat ou "error".
 * @throws {TypeError} Si ...
 * @example
 * add(1, 2) // 3
 */
```

## FTP

```bash [scripts/publish.sh]
#!/usr/bin/env bash
set -euo pipefail
lftp -u "$FTP_USER,$FTP_PASS" "$FTP_HOST" \
  -e "mirror -R dist $FTP_DEST; bye"
```

```ini [.env]  (dans .gitignore !)
FTP_HOST=ftp.serveur.ch
FTP_USER=login
FTP_PASS=motdepasse
FTP_DEST=/mon_dossier
```

| Fichier | Règle |
|---|---|
| favicon | `public/favicon.png` + `<link rel="icon" href="/favicon.png">` |
| image HTML fixe | `public/images/x.png` + `src="/images/x.png"` |
| image dans le JS | `import x from "./assets/x.png"` ou `` `${import.meta.env.BASE_URL}images/x.png` `` |
| noms | minuscules, sans espace, sans accent |

## Mots-clés anglais pour chercher une règle ESLint

| Français | Anglais |
|---|---|
| guillemets / apostrophes | quotes, double, single |
| point-virgule | semi, semicolon |
| indentation, tabulation | indent, tab |
| accolades | brace, curly |
| crochets (tableaux) | array-bracket |
| espaces | spacing, space |
| virgule | comma |
| longueur de ligne | max-len |
| nommage | camelcase, id-match, id-length |
| égalité | eqeqeq |
| variable non utilisée / non définie | no-unused-vars, no-undef |
| globale | global, implicit |
| fin de ligne | linebreak, eol |
| ligne vide | empty-lines, padded |
| console, alert, debugger | no-console, no-alert, no-debugger |
