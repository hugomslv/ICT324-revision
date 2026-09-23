---
title: "Tuto 1 : mettre en place le linter"
lead: "Consigne : « Mettre en place un linter selon des règles à trouver dans la documentation ». Résultat attendu : npm run lint affiche 0 erreur avec les règles demandées."
---

<div class="progress"><span></span></div>
<p class="small muted">Progression : <span id="progress-label"></span> · <a href="#" id="reset-checks">tout décocher</a></p>

## Étape 1 : installer ESLint (avec réseau)

- [ ] Dans le terminal, à la racine du projet :

```bash
npm install -D eslint @eslint/js globals
```

| Paquet | Rôle |
|---|---|
| `eslint` | le linter |
| `@eslint/js` | les règles recommandées (`js/recommended`) |
| `globals` | la liste des variables du navigateur (`document`, `window`…) |

Vérification :

```bash
npx eslint --version
```

Tu dois voir un numéro, par exemple `v10.11.0`.

## Étape 2 : créer le fichier de configuration

- [ ] Créer le fichier **`eslint.config.js`** à la **racine** du projet (à côté de `package.json`, pas dans `src/`).

```text
mon-projet/
├── eslint.config.js   ← ICI
├── package.json
└── src/
```

- [ ] Coller ce contenu :

```js [eslint.config.js]
import js from "@eslint/js"
import globals from "globals"
import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([
  // dossiers générés : on ne les vérifie pas
  globalIgnores([ "dist/", "docs/", "coverage/" ]),

  {
    files: [ "**/*.{js,mjs,cjs}" ],
    plugins: { js },
    extends: [ "js/recommended" ],
    languageOptions: { globals: globals.browser },
    rules: {
      // ↓↓↓ ICI tu mets les règles demandées dans la consigne ↓↓↓
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

  // fichiers exécutés par Node (config, scripts) : process, __dirname…
  {
    files: [ "*.config.js", "scripts/**/*.js" ],
    languageOptions: { globals: globals.node },
  },
])
```

::: info Si le package.json n'a pas "type": "module"
Un projet créé avec `npm create vite` l'a déjà. Sinon, nomme le fichier **`eslint.config.mjs`** (même contenu).
:::

## Étape 3 : ajouter les commandes dans package.json

- [ ] Dans `package.json`, partie `"scripts"`, ajouter :

```json
"lint": "eslint .",
"lint:fix": "eslint . --fix"
```

Ce qui donne par exemple :

```json [package.json]
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix"
}
```

## Étape 4 : lancer le linter

- [ ] Lancer :

```bash
npm run lint
```

Sur un projet Vite neuf, avec la config ci-dessus, tu obtiens ceci (testé) :

```text
src/counter.js
  7:28  error  Strings must use doublequote  quotes

src/main.js
   1:8   error  Strings must use doublequote                          quotes
   2:21  error  Strings must use doublequote                          quotes
  ...
  25:1   error  This line has a length of 115. Maximum allowed is 80  max-len
  48:1   error  This line has a length of 193. Maximum allowed is 80  max-len
  ...
✖ 15 problems (15 errors, 0 warnings)
  8 errors and 0 warnings potentially fixable with the `--fix` option.
```

Comment lire une ligne : `7:28` = ligne 7, colonne 28 · `Strings must use doublequote` = le problème · `quotes` = **le nom de la règle** (celle que tu cherches dans la doc).

## Étape 5 : corriger

- [ ] Correction automatique de tout ce qui peut l'être (guillemets, points-virgules, indentation, espaces) :

```bash
npm run lint:fix
```

Testé : il reste **7 erreurs `max-len`**, les lignes trop longues du HTML de démo de Vite dans `src/main.js`. `--fix` ne sait pas couper une ligne. Trois solutions :

1. **Remplacer le code de démo** (de toute façon tu vas écrire ton propre `main.js`, voir [tuto 4](tuto-4-ftp.html#etape-4-ecrire-un-main-js-propre)).
2. Couper les lignes toi-même.
3. Si la consigne le permet, ignorer les chaînes de template (testé, 0 erreur ensuite) :

```js
"max-len": [ "error", { code: 80, ignoreTemplateLiterals: true } ],
```

- [ ] Relancer jusqu'à obtenir **aucune sortie** (= 0 erreur) :

```bash
npm run lint
```

## Étape 6 : trouver les règles de la consigne dans la doc

C'est le cœur de l'exercice : la consigne donne des phrases en français, tu dois trouver la règle.

- [ ] Pour **chaque phrase** de la consigne :

1. Traduis en mots-clés anglais (voir tableau).
2. Ouvre la [liste de toutes les règles](../docs/eslint/rules/index.html) et tape le mot-clé dans le filtre.
3. Ouvre la règle, lis **Rule Details** (ce qu'elle fait) et **Options** (quoi écrire).
4. Écris-la dans `rules: { }` : `"nom-de-la-regle": [ "error", option ]`.
5. Teste avec un petit bout de code qui doit être refusé.

| La consigne parle de… | Cherche |
|---|---|
| guillemets, apostrophes | `quotes` |
| point-virgule | `semi` |
| indentation, tabulation | `indent` |
| accolades, if / else | `brace-style`, `curly` |
| espaces dans les tableaux `[ ]` | `array-bracket-spacing` |
| espaces dans les objets `{ }` | `object-curly-spacing` |
| `==` / `===` | `eqeqeq` |
| `var`, `let`, `const` | `no-var`, `prefer-const`, `no-const-assign` |
| longueur des lignes | `max-len` |
| nom des variables (camelCase, snake_case) | `camelcase`, `id-match` |
| variables globales | `no-implicit-globals`, `no-undef` |
| variables inutilisées | `no-unused-vars` |
| `console.log` | `no-console` |
| virgule finale | `comma-dangle` |
| espaces en fin de ligne | `no-trailing-spaces` |

Toutes les consignes du cours, déjà traduites : [2b. ESLint : les règles](eslint-regles.html).

::: example "Exemple complet : « Interdire les console.log »"
1. Mot-clé : *console* → règle [`no-console`](../docs/eslint/rules/no-console.html).
2. Dans la config : `"no-console": "error",`
3. Test : ajoute `console.log("test")` dans `src/main.js`, lance `npm run lint` → `Unexpected console statement  no-console`. ✅
4. Enlève la ligne de test.
:::

## Étape 7 (si demandé) : noms de fichiers en snake_case

ESLint ne vérifie pas les noms de fichiers : il faut un plugin (**à installer avec le réseau**).

- [ ] Installer :

```bash
npm install -D @maintained/eslint-plugin-filename-rules
```

- [ ] Dans `eslint.config.js`, ajouter l'import en haut, le plugin et la règle :

```js [eslint.config.js]
import { plugin as filenameRules } from "@maintained/eslint-plugin-filename-rules"

// ... dans le bloc principal :
    plugins: { js, "filename-rules": filenameRules },
    // ...
    rules: {
      "filename-rules/match": [ "error", "snake_case" ],
      // ...
    },
```

Un fichier `monFichier.js` donne alors : `Filename 'monFichier.js' does not match snake_case`.

## Vérification finale

- [ ] `npm run lint` n'affiche **aucune erreur**
- [ ] chaque phrase de la consigne a sa règle dans `eslint.config.js`
- [ ] j'ai testé au moins une règle avec du code volontairement faux
- [ ] `dist/`, `docs/`, `coverage/` sont dans `globalIgnores`

::: tip Si l'extension VS Code ESLint est installée
Les erreurs sont soulignées en rouge directement dans l'éditeur, avec le nom de la règle au survol. Pratique pour corriger au fil de l'eau.
:::

Suite : [Tuto 2 : les tests →](tuto-2-tests.html)
