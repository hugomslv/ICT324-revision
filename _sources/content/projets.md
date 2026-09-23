---
title: "Projets du cours"
lead: "Les 4 projets téléchargés, rangés dans projets/cours/, expliqués fichier par fichier. J'ai installé et lancé chacun : les remarques « testé » viennent de ces essais."
---

| # | Dossier | Contenu | Versions |
|---|---|---|---|
| 1 | [`1-lint`](#1-lint-exercice-eslint) | Exercice ESLint (règles, plugin noms de fichiers) | ESLint 9 |
| 2 | [`2-vitest`](#2-vitest-tests-jsdoc) | Tests Vitest + JSDoc sur `math.js` | Vitest 2, JSDoc 4 |
| 3 | [`3-vite_lint_test_doc`](#3-vite-lint-test-doc-tout-ensemble) | Vite + lint + tests + doc avec image | ESLint 10, Vitest 4 |
| 4 | [`4-currency-converter`](#4-currency-converter-projet-complet-ftp) | Application complète + publication FTP | Vite 8, Vitest 3, ESLint 9 |

Pour relancer un projet : copie le dossier, puis `npm install` (avec réseau) ou `npm ci` (installe exactement le `package-lock.json`).

## 1. lint : exercice ESLint

```text
1-lint/
├── README.md            ← l'énoncé (exercices 1 et 2)
├── img/ict-324_node_install.png
├── inDex.js             ← code volontairement mauvais (et nom pas en snake_case)
├── corrige/index.js     ← ma correction (0 erreur, testée)
├── eslint.config.mjs    ← la config solution
├── package.json
└── package-lock.json
```

- **Énoncé** : [README](../projets/cours/1-lint/README.md) et corrigé détaillé dans [Exercices corrigés](exercices.html#exercice-eslint-1).
- **Testé** : `npm run lint` sur `inDex.js` donne exactement les **27 erreurs** annoncées dans l'énoncé.
- Pas de `"type": "module"` dans `package.json` → la config est en **`.mjs`**.
- Le `package.json` contient deux plugins de noms de fichiers (`eslint-plugin-filename-rules` et `@maintained/...`) : seul `@maintained/eslint-plugin-filename-rules` est utilisé.

@@include projets/cours/1-lint/eslint.config.mjs@@

@@include projets/cours/1-lint/package.json@@

## 2. vitest : tests + JSDoc

```text
2-vitest/
├── src/math.js          ← add, sub, rotate (avec JSDoc complet)
├── src/math.test.js     ← 16 tests
├── vitest.config.js     ← config de la couverture
├── jsdoc-conf.json
├── README.md            ← doc du module (devient la page d'accueil JSDoc)
├── test-results.json    ← sortie du reporter JSON
├── docs/                ← doc JSDoc générée
└── coverage/            ← rapport de couverture HTML
```

- **Testé** : 16 tests passent.
- Ouvrir : [la doc générée](../projets/cours/2-vitest/docs/index.html) · [le rapport de couverture](../projets/cours/2-vitest/coverage/index.html)
- Pas de `"type": "module"` → avertissement *« The CJS build of Vite's Node API is deprecated »* (sans gravité). Ajoute `"type": "module"` pour l'enlever.
- Le test importe `"./src/math.js"` alors qu'il est déjà dans `src/`. Ça passe avec Vitest (testé), mais l'écriture normale est **`"./math.js"`**.
- Le bloc `"dependencies"` liste toute l'arborescence interne de Vitest : inutile, seuls les `devDependencies` comptent.
- `test-results.json` s'obtient avec `npx vitest run --reporter=json --outputFile=test-results.json`.

@@include projets/cours/2-vitest/src/math.js@@

@@include projets/cours/2-vitest/src/math.test.js@@

@@include projets/cours/2-vitest/vitest.config.js@@

## 3. vite_lint_test_doc : tout ensemble

```text
3-vite_lint_test_doc/
├── index.js             ← importe ./Utils.js (fichier absent de l'archive)
├── src/math.js, src/math.test.js
├── eslint.config.js     ← même règles que l'exercice lint (sans les règles de nommage)
├── vite.config.js       ← bloc test: { globals, environment }
├── jsdoc-conf.json
├── README.md            ← contient une image ./img/jsdoc.png
├── img/jsdoc.png
├── docs/                ← doc générée, avec docs/img/ copié
└── coverage/
```

- **Le point clé** : le script `jsdoc` copie `img/` dans `docs/img/` pour que l'image du README s'affiche. [Voir la doc générée](../projets/cours/3-vite_lint_test_doc/docs/index.html).
- **Testé** : 16 tests passent (Vitest 4.1).
- **Testé** : `npx eslint .` donne **444 erreurs** : ESLint analyse aussi `docs/` et `coverage/` (fichiers générés). Il manque `globalIgnores([ "docs/", "coverage/", "dist/" ])`.
- `vite` n'est pas dans les dépendances : il est installé indirectement par `vitest`, donc `npm run dev` marche quand même. Mieux vaut l'ajouter (`npm i -D vite`).
- `index.js` importe `cleanUsername` depuis `./Utils.js` qui n'est pas dans l'archive (la couverture montre qu'il existait).

@@include projets/cours/3-vite_lint_test_doc/package.json@@

@@include projets/cours/3-vite_lint_test_doc/eslint.config.js@@

@@include projets/cours/3-vite_lint_test_doc/vite.config.js@@

## 4. currency-converter : projet complet + FTP

```text
4-currency-converter/
├── index.html           ← favicon, Google Fonts, <script type="module" src="/main.js">
├── main.js              ← interface (top-level await)
├── css/style.css
├── public/favicon.png   ← copié dans dist/
├── src/api.js           ← appels à l'API de taux de change + drapeaux
├── src/api.test.js      ← 10 tests, dont des mocks de fetch
├── vite.config.js       ← base: '/ferrarip/', target: 'esnext', config coverage
├── eslint.config.mjs
├── jsdoc-conf.json
├── scripts/publish.sh   ← envoi FTP avec lftp
├── .gitignore           ← node_modules, dist, .env, docs, coverage…
└── package.json         ← script "publish": "dotenv -e .env -- bash scripts/publish.sh"
```

- **C'est le modèle pour la partie FTP** : `base`, favicon dans `public/`, script `publish`.
- **Testé** : `npm run build` → `dist/index.html` contient `/ferrarip/assets/...` et `dist/favicon.png`.
- **Testé** : sans `target: 'esnext'`, Vite avertit *« Top-level await is not available in the configured target environment »* (à cause du `await` en haut de `main.js`).
- **Testé** : `npx eslint .` donne **353 erreurs `linebreak-style`** : les fichiers sont en fins de ligne Windows (CRLF). `npx eslint . --fix` les convertit.
- **Testé hors-ligne (fetch coupé)** : **4 tests sur 10 échouent**, ceux qui appellent la vraie API. Les tests avec `vi.stubGlobal("fetch", ...)` passent. Leçon pour l'examen : mocke le réseau.
- **Testé** : `npm run jsdoc` plante (*ENOENT: no such file or directory, open './README.md'*) car il n'y a pas de README dans l'archive.
- `favicon.png` est lié en relatif (`href="favicon.png"`), laissé tel quel par Vite : ça marche car `index.html` est à la racine du dossier. `href="/favicon.png"` serait plus sûr (réécrit en `/ferrarip/favicon.png`).
- `globals` et `@eslint/js` ne sont pas dans le `package.json` : ils sont présents seulement comme dépendances internes d'ESLint 9. Installe-les explicitement.
- `prettier`, `eslint-plugin-prettier` sont installés mais pas utilisés dans la config.

@@include projets/cours/4-currency-converter/vite.config.js@@

@@include projets/cours/4-currency-converter/package.json@@

@@include projets/cours/4-currency-converter/scripts/publish.sh bash@@

@@include projets/cours/4-currency-converter/index.html@@

@@include projets/cours/4-currency-converter/main.js@@

@@include projets/cours/4-currency-converter/src/api.test.js@@

::: details src/api.js (long : liste des drapeaux)
@@include projets/cours/4-currency-converter/src/api.js@@
:::

## Exemples supplémentaires (faits et testés pour toi)

| Dossier | Contenu |
|---|---|
| [`projets/modele/`](modele.html) | projet complet de référence : Vite + ESLint + Vitest + JSDoc + FTP + vérificateur |
| `projets/exemples/vitest-avance/` | mocks de `fetch`, `toThrow`, test DOM avec jsdom, seuils de couverture ([voir](vitest.html#mocks-simuler-fetch-console)) |
| `projets/exemples/jsdoc-complet/` | tous les tags JSDoc, `@typedef`, classe, tutoriel, `-P package.json` ([doc générée](../projets/exemples/jsdoc-complet/docs/demo-jsdoc/1.2.0/index.html)) |
