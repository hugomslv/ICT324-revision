---
title: "2. ESLint : installation et configuration"
lead: "ESLint analyse le code JavaScript sans l'exécuter et signale les problèmes (bugs probables) et les écarts de style, selon des règles qu'on choisit."
---

Versions : ESLint **9** (projets `lint` et `currency-converter`) et ESLint **10** (projet `vite_lint_test_doc`, et la version actuelle 10.11). La configuration est identique pour nous. Doc hors-ligne : [ESLint](../docs/eslint/index.html), [les règles](../docs/eslint/rules/index.html), [fichier de config](../docs/eslint/use/configure/configuration-files.html).

## Installer

### Option A : l'assistant (avec réseau uniquement)

```bash
npm init @eslint/config@latest
# ou : npx eslint --init
```

Réponses utilisées en cours :

```text
✔ What do you want to lint? · javascript
✔ How would you like to use ESLint? · problems
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · No
✔ Where does your code run? · browser
✔ Would you like to install them now? · Yes
✔ Which package manager do you want to use? · npm
```

Il installe `eslint`, `@eslint/js`, `globals` et crée `eslint.config.mjs` (ou `.js` si `"type": "module"`).

::: danger Hors-ligne, l'assistant ne marche pas
Il télécharge `@eslint/create-config`. Hors-ligne : installe les paquets pendant la phase réseau, puis écris le fichier de config à la main (modèle ci-dessous).
:::

### Option B : à la main

```bash
npm install -D eslint @eslint/js globals
```

Puis créer `eslint.config.js` à la racine du projet.

### Extension VS Code

Installe l'extension **ESLint** (Microsoft) : les erreurs sont soulignées en rouge dans l'éditeur, survol = message + nom de la règle. Elle utilise le `eslint` installé dans `node_modules`.

## Le fichier `eslint.config.js` (flat config)

C'est le format depuis ESLint 9 : un tableau d'objets de configuration. ESLint 10 ne lit **plus** les anciens `.eslintrc.*`.

```js [eslint.config.js]
import js from "@eslint/js"                       // règles de base d'ESLint
import globals from "globals"                     // listes de variables globales
import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([
  // 1. fichiers à ne JAMAIS analyser (générés)
  globalIgnores([ "dist/", "docs/", "coverage/" ]),

  // 2. config principale
  {
    files: [ "**/*.{js,mjs,cjs}" ],               // à quels fichiers ça s'applique
    plugins: { js },                              // on déclare le plugin "js"
    extends: [ "js/recommended" ],                // règles recommandées
    languageOptions: {
      globals: globals.browser,                   // window, document, fetch… connus
      // ecmaVersion: "latest", sourceType: "module"  (valeurs par défaut)
    },
    rules: {
      quotes: [ "error", "double" ],
      semi: [ "error", "never" ],
      indent: [ "error", 2 ],
      eqeqeq: "error",
    },
  },

  // 3. surcharge pour certains fichiers
  {
    files: [ "scripts/**/*.js", "*.config.js" ],
    languageOptions: { globals: globals.node },   // process, __dirname…
  },
])
```

### Ce qu'il faut comprendre

- **Ordre** : les objets sont fusionnés dans l'ordre, **le dernier gagne** pour une même règle.
- **`files`** : motifs glob. Sans `files`, l'objet s'applique à tous les fichiers analysés.
- **`ignores`** : dans un objet qui ne contient **que** `ignores` (ou `globalIgnores(...)`), c'est global. `node_modules/` et `.git/` sont ignorés par défaut.
- **`extends: [ "js/recommended" ]`** marche avec `defineConfig` + `plugins: { js }`. L'autre écriture (projet currency) : mettre `js.configs.recommended` directement dans le tableau.
- **`globals`** : sans `globals.browser`, `document` ou `console` sont signalés par `no-undef`. Code Node (scripts) : `globals.node`. Les deux : `{ ...globals.browser, ...globals.node }`. Tests Vitest avec `globals: true` : `globals.vitest` existe aussi dans le paquet `globals`.

### Sévérité et options

```js
rules: {
  "no-console": "off",                 // 0 : désactivée
  "no-alert": "warn",                  // 1 : avertissement (n'échoue pas)
  eqeqeq: "error",                     // 2 : erreur (code de sortie 1)
  quotes: [ "error", "double" ],       // [ sévérité, option ]
  "max-len": [ "error", { code: 80 } ],// [ sévérité, objet d'options ]
  "array-bracket-spacing": [ "error", "always", { arraysInArrays: false } ],
}
```

La section **Options** de chaque page de règle de la doc indique exactement quoi mettre.

## Les commandes

```bash
npx eslint .                    # tout le projet
npx eslint src/ index.js        # des dossiers / fichiers précis
npx eslint . --fix              # corrige automatiquement ce qui peut l'être
npx eslint . --max-warnings 0   # échoue aussi s'il y a des warnings
npx eslint . --quiet            # n'affiche que les erreurs
npx eslint --print-config src/main.js   # config finale appliquée à ce fichier
npx eslint . -f json -o rapport.json    # rapport dans un fichier
npx eslint -c autre.config.js .         # utiliser un autre fichier de config
npx eslint . --rule "no-console: error" # ajouter une règle en ligne de commande
```

Dans `package.json` :

```json
"scripts": {
  "lint": "eslint .",
  "lint:fix": "eslint . --fix"
}
```

Le corrigé du prof utilise `"lint": "eslint \"**/*.js\" --ignore-pattern node_modules/"` (ça marche aussi). Passer une option à un script npm : `npm run lint -- --fix`.

::: tip Lire la sortie
```text
/chemin/inDex.js
   1:10  error  Extra semicolon                 semi
   ^ ^                                          ^
   | colonne                                    nom de la règle → cherche-la dans la doc
   ligne

✖ 27 problems (27 errors, 0 warnings)
  17 errors and 0 warnings potentially fixable with the `--fix` option.
```
:::

## Désactiver localement (commentaires)

```js
/* eslint-disable */                       // tout le fichier (en haut)
/* eslint-disable no-console */            // une règle, jusqu'à la fin ou eslint-enable
console.log("debug") // eslint-disable-line no-console
// eslint-disable-next-line no-undef
maVariableGlobale = 3
/* global maVariableGlobale */             // déclare une globale connue
/* eslint quotes: ["error", "single"] */   // change une règle pour ce fichier
```

## Plugins : exemple `filename-rules`

Pour les noms de fichiers (exercice 2) il faut un plugin, car ESLint ne vérifie pas les noms de fichiers.

```bash
npm install -D @maintained/eslint-plugin-filename-rules
```

```js [eslint.config.js]
import js from "@eslint/js"
import globals from "globals"
import { defineConfig } from "eslint/config"
import { plugin as filenameRules } from "@maintained/eslint-plugin-filename-rules"

export default defineConfig([
  {
    files: [ "**/*.{js,mjs,cjs}" ],
    plugins: { js, "filename-rules": filenameRules },
    extends: [ "js/recommended" ],
    languageOptions: { globals: globals.browser },
    rules: {
      "filename-rules/match": [ "error", "snake_case" ],
    },
  },
])
```

Valeurs acceptées : `snake_case` / `snakecase`, `camelCase`, `PascalCase`, `kebab-case`, ou une **regex**. Le README complet est dans `node_modules/@maintained/eslint-plugin-filename-rules/README.md`.

::: tip Noms de DOSSIERS en snake_case (testé)
Le plugin a une option `includePath: true` qui teste le chemin complet. Ce motif refuse une majuscule dans un dossier ou un fichier sous `src/` (fonctionne sous Windows et Linux grâce à `[\\/]`) :

```js
"filename-rules/match": [ "error", {
  includePath: true,
  pattern: /[\\/]src([\\/][a-z0-9_]+)*[\\/][a-z0-9_]+(\.[a-z]+)+$/,
} ],
```

Résultat : `src/MonDossier/ok_file.js` ❌, `src/bon_dossier/Mauvais.js` ❌, `src/bon_dossier/sous_dossier/ok_file.js` ✅.
:::

## Les 3 styles de config que tu verras

::: details 1. defineConfig + extends (projets lint et vite_lint_test_doc)
@@include projets/cours/1-lint/eslint.config.mjs@@
:::

::: details 2. Tableau simple sans defineConfig (projet currency-converter)
@@include projets/cours/4-currency-converter/eslint.config.mjs@@
Ici `pluginJs.configs.recommended` est placé **en dernier** : il est appliqué après les règles perso, mais comme il ne contient aucune règle de mise en forme, il n'écrase rien d'important.
:::

::: details 3. Ancien format .eslintrc.json (à reconnaître, plus supporté en ESLint 10)
```json [.eslintrc.json]
{
  "env": { "browser": true, "es2021": true },
  "extends": "eslint:recommended",
  "parserOptions": { "ecmaVersion": "latest", "sourceType": "module" },
  "rules": { "semi": ["error", "never"] }
}
```
Équivalent flat config : `env.browser` → `languageOptions.globals: globals.browser`, `"eslint:recommended"` → `js.configs.recommended`.
:::

## Ce que contient `js/recommended`

64 règles (ESLint 10), toutes de type *problem* ou *suggestion* « sûres » : `no-unused-vars`, `no-undef`, `no-const-assign`, `no-dupe-keys`, `no-unreachable`, `no-empty`, `no-debugger`, `no-redeclare`, `no-self-assign`, `use-isnan`, `valid-typeof`… Aucune règle de mise en forme (guillemets, point-virgule, indentation) : celles-là, c'est toi qui les ajoutes. La liste : [règles](../docs/eslint/rules/index.html) (badge ✅ recommended dans la liste).
