---
title: "Jour J : déroulé de l'examen"
lead: "Le plan complet, dans l'ordre, avec les commandes exactes. Coche au fur et à mesure (les cases restent cochées dans ton navigateur)."
---

<div class="progress"><span></span></div>
<p class="small muted">Progression : <span id="progress-label"></span> · <a href="#" id="reset-checks">tout décocher</a></p>

## Autorisé

- Tes notes personnelles (ce site en fait partie)
- Tes anciens exercices
- Les corrigés distribués (ils sont dans [Projets du cours](projets.html))
- Les documentations présentes sur l'ordinateur de l'école (hors ligne)

## Phase 1 : AVEC réseau (ne rien oublier !)

::: danger Tout ce qui demande internet doit être fait ici
`npm create vite`, `npm install`, `npm init @eslint/config` et même le premier lancement de la couverture (Vitest propose d'installer `@vitest/coverage-v8` s'il manque) ont besoin du réseau. Hors-ligne, ils échoueront.
:::

### 1. Créer le projet Vite

- [ ] Créer le projet

```bash
npm create vite@latest mon-projet -- --template vanilla
cd mon-projet
npm install
```

Si l'assistant pose des questions : *Framework* → **Vanilla**, *Variant* → **JavaScript**. Détails : [1. Vite](vite.html).

### 2. Installer TOUS les outils d'un coup

- [ ] Installer les dépendances de développement

```bash
npm install -D eslint @eslint/js globals vitest @vitest/coverage-v8 jsdoc
```

- [ ] (Optionnel mais conseillé) les extras que le prof utilise dans ses corrigés

```bash
# règle sur les noms de fichiers (exercice ESLint 2)
npm install -D @maintained/eslint-plugin-filename-rules
# interface web des tests, lecture du .env pour le script FTP
npm install -D @vitest/ui dotenv-cli
```

- [ ] Vérifier que tout répond

```bash
npx vite --version
npx eslint --version
npx vitest --version
npx jsdoc --version
```

- [ ] Lancer une fois chaque outil pendant que le réseau est là

```bash
npx vitest run --coverage   # vérifie que le provider de couverture est bien installé
npx jsdoc --help
```

::: tip Filet de sécurité : le cache npm
Tout ce que tu as installé avec le réseau est gardé dans le cache npm. Hors-ligne, si tu dois réinstaller (par ex. après avoir supprimé `node_modules`), essaie :

```bash
npm install --offline
```
:::

### 3. Documentations

- [ ] Vérifier que les docs sont accessibles hors-ligne (ce site : dossier `docs/`, ou celles de l'école). Voir [Préparer les docs hors-ligne](docs-hors-ligne.html).
- [ ] Les README des paquets sont aussi dans `node_modules/` : `node_modules/eslint/README.md`, `node_modules/vitest/README.md`, `node_modules/jsdoc/README.md`.

## Phase 2 : SANS réseau

### 4. Linter (ESLint)

- [ ] Créer `eslint.config.js` à la racine (copie la base depuis l'[antisèche](antiseche.html#eslint-config-js))
- [ ] Ajouter `globalIgnores([ "dist/", "docs/", "coverage/" ])` (sinon ESLint analyse la doc et le build générés : des centaines d'erreurs)
- [ ] Traduire chaque consigne en règle (voir [2b. Règles](eslint-regles.html), la doc hors-ligne est dans [docs/eslint/rules](../docs/eslint/rules/index.html))
- [ ] Ajouter le script `"lint": "eslint ."` dans `package.json`
- [ ] `npm run lint` puis corriger (`npm run lint -- --fix` corrige automatiquement la mise en forme)

### 5. Tests (Vitest)

- [ ] Mettre le code à tester dans un module qui **exporte** ses fonctions (ex : `src/math.js`)
- [ ] Créer `src/math.test.js` (le nom doit finir par `.test.js` ou `.spec.js`)
- [ ] Scripts : `"test": "vitest"`, `"test:run": "vitest run"`, `"coverage": "vitest run --coverage"`
- [ ] `npm run test:run` → tout vert
- [ ] Tester les cas normaux, les cas limites (0, tableau vide, négatifs) et les erreurs (mauvais type)
- [ ] Pas de test qui dépend d'internet (on est hors-ligne !) : mocker `fetch` avec `vi.stubGlobal` si besoin ([Vitest › mocks](vitest.html#mocks-simuler-fetch-console))

### 6. Documentation (JSDoc + README)

- [ ] Commentaires `/** ... */` avec `@param`, `@returns`, `@module`, `@file`, `@example`…
- [ ] `jsdoc-conf.json` (voir [4. JSDoc](jsdoc.html#le-fichier-de-configuration))
- [ ] `README.md` avec titre, description, installation, utilisation, **image** (`![texte](./img/capture.png)`)
- [ ] Générer : `npx jsdoc -c jsdoc-conf.json -R README.md`
- [ ] **Copier le dossier `img/` dans `docs/img/`** (JSDoc ne copie pas les images du README)
- [ ] Ouvrir `docs/index.html` et vérifier que l'image s'affiche

### 7. Publication FTP (à l'aveugle)

- [ ] Dans `vite.config.js` : `base: "/nom_du_dossier/"` (avec les deux `/`)
- [ ] Favicon et images « fixes » dans `public/`, référencés avec un chemin qui commence par `/`
- [ ] Dans le JS, les fichiers de `public/` : `` `${import.meta.env.BASE_URL}images/logo.png` ``
- [ ] Noms de fichiers en **minuscules**, sans espace ni accent (le serveur Linux distingue `Logo.png` et `logo.png`)
- [ ] `npm run build` sans erreur ni avertissement
- [ ] `npm run preview` → ouvrir l'URL affichée (`http://localhost:4173/nom_du_dossier/`) et vérifier dans les DevTools (onglet Réseau / Network) : **aucune 404**, favicon visible
- [ ] (Bonus) `node scripts/check-dist.js` : le vérificateur du [projet modèle](modele.html#verifier-dist-sans-serveur)
- [ ] Script d'envoi prêt (`scripts/publish.sh` + `.env`), voir [6. Build & FTP](build-ftp.html#envoyer-sur-le-serveur-ftp)

### 8. Vérification finale

- [ ] `npm run lint` → 0 erreur
- [ ] `npm run test:run` → tout vert
- [ ] `docs/index.html` s'ouvre avec le README et les images
- [ ] `npm run build` puis `npm run preview` OK
- [ ] `package.json` propre (nom, description, auteur, scripts)
- [ ] `.gitignore` contient `node_modules`, `dist`, `.env`

## Ordre conseillé et gestion du temps

1. **Vite + installation complète** tant que le réseau est là (10 min, crucial).
2. **Linter** : le plus « doc » (il faut trouver les règles). Utilise la recherche <kbd>Ctrl</kbd> <kbd>K</kbd> avec des mots anglais : *quote*, *semicolon*, *indent*, *brace*, *camel*, *length*, *space*.
3. **Tests** : rapides si le module est simple. Lance `npm test` en mode watch pendant que tu écris.
4. **Doc** : commentaires JSDoc au fil de l'eau, génération à la fin.
5. **Config FTP** : 5 minutes si tu suis la checklist, mais vérifie avec `preview`.

::: exam Si tu bloques sur une règle
1. Cherche dans [2b. Règles](eslint-regles.html) (consigne en français → règle).
2. Sinon filtre la [liste des 300+ règles](../docs/eslint/rules/index.html) par mot-clé anglais.
3. Lis la section **Options** de la règle : la valeur à mettre dans la config est toujours `[ "error", ...options ]`.
:::
