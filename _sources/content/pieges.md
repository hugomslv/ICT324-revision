---
title: "Erreurs et pièges"
lead: "Message d'erreur → cause → solution. La plupart des messages ont été reproduits réellement (ESLint 10, Vitest 5, JSDoc 4, Vite 8). Astuce : cherche un morceau du message avec Ctrl+K."
---

## npm / réseau

| Message | Cause | Solution |
|---|---|---|
| `npm ERR! code ENOTFOUND` / `EAI_AGAIN` / `ETIMEDOUT` | pas de réseau | installer pendant la phase connectée ; sinon essayer `npm install --offline` (cache) |
| `npm error Missing script: "lint"` | script absent de `package.json` | ajouter `"lint": "eslint ."` dans `"scripts"` |
| `'vite' n'est pas reconnu…` / `vite: command not found` | `node_modules` absent | `npm install` ; lancer via `npm run dev` ou `npx vite` |
| `npm.ps1 cannot be loaded because running scripts is disabled` (PowerShell) | politique d'exécution Windows | utiliser **cmd** au lieu de PowerShell, ou `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| `npm publish` envoie (ou refuse d'envoyer) sur npmjs | confusion avec le script | taper **`npm run publish`** |

## ESLint

| Message | Cause | Solution |
|---|---|---|
| `ESLint couldn't find an eslint.config.* file.` | pas de fichier de config (ou mauvais dossier) | créer `eslint.config.js` à la racine ; lancer depuis la racine du projet |
| `'document' is not defined` / `'console' is not defined` (no-undef) | globales du navigateur inconnues | `languageOptions: { globals: globals.browser }` |
| `'process' is not defined` | script Node | bloc avec `files: [ "scripts/**" ]` et `globals.node` |
| `'test' is not defined` / `'expect'…` | Vitest `globals: true` sans import | importer depuis `"vitest"` ou `globals.vitest` |
| `Expected linebreaks to be 'LF' but found 'CRLF'` sur chaque ligne | fichiers Windows | `npx eslint . --fix`, ou VS Code : cliquer **CRLF** → **LF** |
| des centaines d'erreurs dans `docs/`, `coverage/`, `dist/` | fichiers générés analysés | `globalIgnores([ "dist/", "docs/", "coverage/" ])` |
| `A configuration object specifies rule "filename-rules/match", but could not find plugin "filename-rules".` | plugin non déclaré | `plugins: { "filename-rules": filenameRules }` dans le **même** objet (ou un objet précédent) |
| `A config object has a "plugins" key defined as an array of strings.` | ancien format `.eslintrc` | `plugins: { nom: objetImporte }` |
| `Key "rules": Key "quotes": Value … should be equal to one of the allowed values.` | option invalide | relire la section **Options** de la règle dans la doc |
| `Warning: Module type of file:///…/eslint.config.js is not specified` | `import` sans `"type": "module"` | ajouter `"type": "module"` ou renommer en `eslint.config.mjs` |
| `Cannot find package '@eslint/js'` / `'globals'` | paquet pas installé | `npm i -D @eslint/js globals` (avec réseau) |
| `Parsing error: 'import' and 'export' may appear only with 'sourceType: module'` | `sourceType: "script"` sur un fichier module | limiter ce réglage avec `files` |
| `no-implicit-globals` ne signale rien | normal dans un module ES | voir [la règle](eslint-regles.html#no-implicit-globals-pas-de-globales) |
| l'extension VS Code ne souligne rien | ESLint pas installé localement / config en erreur | `npm i -D eslint`, regarder **Sortie → ESLint** dans VS Code, redémarrer VS Code |

## Vitest

| Message | Cause | Solution |
|---|---|---|
| `No test files found, exiting with code 1` | aucun fichier `*.test.js` / `*.spec.js` | renommer le fichier de test |
| `Error: Cannot find module './math.js' imported from …/src/x.test.js` | mauvais chemin d'import | chemin **relatif au fichier de test** (`./math.js` si dans le même dossier) |
| `TypeError: add is not a function` | la fonction n'est pas exportée (ou mauvais nom) | `export function add…` et `import { add }` |
| `AssertionError: expected [ 1, 2 ] to be [ 1, 2 ] // Object.is equality` + *serializes to the same string* | `toBe` sur un tableau / objet | **`toEqual`** |
| `ReferenceError: document is not defined` | environnement Node | `// @vitest-environment jsdom` en haut du fichier (+ `npm i -D jsdom`) |
| `ReferenceError: test is not defined` | pas d'import | `import { test, expect } from "vitest"` |
| le test « plante » au lieu de vérifier `toThrow` | `expect(f())` au lieu de `expect(() => f())` | passer une **fonction** |
| `MISSING DEPENDENCY Cannot find dependency '@vitest/coverage-v8'` | provider de couverture absent | `npm i -D @vitest/coverage-v8` avec réseau, même version que vitest |
| tests qui appellent une API échouent hors-ligne (`fetch failed`) | vrai appel réseau | mocker `fetch` avec `vi.stubGlobal` ([exemple](vitest.html#mocks-simuler-fetch-console)) |
| `0.1 + 0.2` ne vaut pas `0.3` | flottants | `toBeCloseTo(0.3)` |
| Vitest ne rend pas la main | mode watch | `npx vitest run`, ou `q` pour quitter |
| `The CJS build of Vite's Node API is deprecated` | pas de `"type": "module"` | l'ajouter dans `package.json` (avertissement sans gravité) |

## JSDoc

| Symptôme | Cause | Solution |
|---|---|---|
| `There are no input files to process.` | aucun fichier donné | `npx jsdoc src -r` ou `source.include` dans la config |
| `Error: ENOENT: no such file or directory, open './README.md'` | `-R README.md` mais pas de README | créer le README |
| la doc est vide (juste « Home ») | commentaires en `/* */` au lieu de `/** */` | **deux étoiles** |
| les fonctions sont dans « Global » | pas de `@module` | `@module nom` dans l'en-tête du fichier |
| image du README cassée dans `docs/index.html` | `img/` non copié | copier `img/` → `docs/img/` |
| doc générée dans `docs/nom/1.0.0/` | option `-P package.json` | enlever `-P` ou adapter les chemins |
| les tests apparaissent dans la doc | `.test.js` inclus | `"excludePattern": "\\.test\\.js$"` dans `source` |
| `'.' n'est pas reconnu` en lançant `./node_modules/jsdoc/jsdoc.js` (Windows) | chemin Unix | écrire `jsdoc …` dans le script npm |

## Vite / build / FTP

| Symptôme | Cause | Solution |
|---|---|---|
| **page blanche** en ligne, 404 sur `/assets/index-xxx.js` | `base` absent ou faux | `base: "/nom_du_dossier/"` |
| favicon absent en ligne | pas dans `public/`, ou chemin faux | `public/favicon.png` + `href="/favicon.png"` |
| image OK en local, 404 en ligne | chemin en dur dans le JS, ou casse différente | `import` / `import.meta.env.BASE_URL` ; noms en minuscules ; `check-dist.js` |
| `dist/index.html` ouvert par double-clic → page blanche | `type="module"` et chemins absolus ne marchent pas en `file://` | **normal** : utiliser `npm run preview` |
| `Top-level await is not available in the configured target environment` | `await` hors fonction | `build: { target: "esnext" }` |
| `[vite]: Rollup failed to resolve import` / `Failed to resolve import` | fichier importé introuvable | vérifier le chemin et la casse |
| `Port 5173 is in use, trying another one…` | un autre serveur tourne | normal, Vite prend le port suivant |
| une page `contact.html` absente de `dist/` | pas déclarée comme entrée | `input: { … }` dans la config ([multi-pages](vite.html#site-a-plusieurs-pages)) |
| tout est dans `/mon_dossier/dist/` sur le serveur | envoi du dossier au lieu du contenu | envoyer le **contenu** de `dist/` |
| `lftp: command not found` | lftp pas installé | FileZilla / WinSCP, ou `curl -T` |

## Réflexes de débogage

1. **Lis le message en entier** : le nom de la règle / le fichier / la ligne sont indiqués.
2. **Cherche le message** ici (<kbd>Ctrl</kbd> <kbd>K</kbd>) ou dans la doc.
3. **Isole** : `npx eslint un_fichier.js`, `npx vitest run -t "nom"`.
4. **Config finale** : `npx eslint --print-config src/main.js`.
5. **Repars d'un état qui marche** : le [projet modèle](modele.html).
