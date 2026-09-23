---
title: Accueil
---

<div class="hero">
<h1>ICT-324 : révision hors-ligne</h1>
<p><strong>Première évaluation : jeudi 24 septembre</strong> (<span id="countdown" class="countdown"></span>).</p>
<p>Tout ce site marche <strong>sans internet</strong> : cours, exemples testés, projets du cours triés, et les documentations officielles d'ESLint, Vitest, Vite et JSDoc. Appuie sur <kbd>Ctrl</kbd> <kbd>K</kbd> (ou <kbd>/</kbd>) pour tout rechercher.</p>
</div>

## Ce qui est demandé

| Étape | Réseau | Où réviser |
|---|---|---|
| Créer un projet **Vite** | ✅ branché | [1. Vite](pages/vite.html) |
| Mettre en place les **docs** ESLint / Vitest / JSDoc sur le poste | ❌ hors-ligne | [Docs hors-ligne](pages/docs-hors-ligne.html), [Docs officielles](docs/index.html) |
| Configurer un **linter** avec des règles à trouver dans la doc | ❌ | [2. ESLint](pages/eslint.html), [2b. Règles](pages/eslint-regles.html) |
| Écrire des **tests unitaires** simples | ❌ | [3. Vitest](pages/vitest.html) |
| Générer une **documentation** (images, README.md…) | ❌ | [4. JSDoc](pages/jsdoc.html), [5. README](pages/readme.html) |
| Configurer le projet pour une **publication FTP** dans un dossier précis, sans erreurs (favicon, images…) « à l'aveugle » | ❌ | [6. Build & FTP](pages/build-ftp.html) |

::: danger La règle d'or
Pendant la phase **avec réseau**, installe **toutes** les dépendances dont tu auras besoin ensuite (`eslint`, `@eslint/js`, `globals`, `vitest`, `@vitest/coverage-v8`, `jsdoc`…). Une fois hors-ligne, `npm install` ne marchera plus. Tout est détaillé dans [Jour J](pages/examen.html).
:::

## Par où commencer

<div class="cards">
<a class="card" href="pages/examen.html"><div class="card-icon">🎯</div><h3>Jour J</h3><p>Le déroulé complet de l'examen, étape par étape, avec checklist à cocher.</p></a>
<a class="card" href="pages/antiseche.html"><div class="card-icon">⌨️</div><h3>Antisèche</h3><p>Toutes les commandes et tous les fichiers de config sur une page.</p></a>
<a class="card" href="pages/modele.html"><div class="card-icon">📦</div><h3>Projet modèle</h3><p>Un projet complet, testé : lint + tests + doc + build FTP. À recopier.</p></a>
<a class="card" href="pages/pieges.html"><div class="card-icon">🧯</div><h3>Erreurs & pièges</h3><p>Message d'erreur → cause → solution. Les pièges du FTP.</p></a>
</div>

## Le cours

<div class="cards">
<a class="card" href="pages/vite.html"><div class="card-icon">⚡</div><h3>1. Vite</h3><p>Créer, structure, <code>public/</code> vs <code>src/</code>, config, scripts.</p></a>
<a class="card" href="pages/eslint.html"><div class="card-icon">📏</div><h3>2. ESLint</h3><p>Installation, <code>eslint.config.js</code>, commandes, <code>--fix</code>, plugins.</p></a>
<a class="card" href="pages/eslint-regles.html"><div class="card-icon">📋</div><h3>2b. Les règles</h3><p>Chaque consigne du prof → la règle et ses options, avec exemples OK / KO.</p></a>
<a class="card" href="pages/vitest.html"><div class="card-icon">🧪</div><h3>3. Vitest</h3><p><code>test</code>, <code>expect</code>, matchers, mocks, coverage.</p></a>
<a class="card" href="pages/jsdoc.html"><div class="card-icon">📚</div><h3>4. JSDoc</h3><p>Tags, config, README en page d'accueil, images dans la doc.</p></a>
<a class="card" href="pages/readme.html"><div class="card-icon">📝</div><h3>5. README</h3><p>Markdown : titres, tableaux, images, code, liens.</p></a>
<a class="card" href="pages/build-ftp.html"><div class="card-icon">🚀</div><h3>6. Build & FTP</h3><p><code>base</code>, favicon, images, vérifier <code>dist/</code> sans serveur, envoi FTP.</p></a>
<a class="card" href="pages/projets.html"><div class="card-icon">🗂️</div><h3>Projets du cours</h3><p>Les 4 projets du prof, expliqués fichier par fichier.</p></a>
<a class="card" href="pages/exercices.html"><div class="card-icon">✍️</div><h3>Exercices corrigés</h3><p>Exercices ESLint 1 et 2 corrigés, entraînements tests et doc.</p></a>
</div>

## Organisation des fichiers de ce site

```text
ICT324-revision/
├── index.html                ← cette page (ouvre-la dans le navigateur)
├── pages/                    ← les fiches de cours
├── docs/                     ← documentations officielles hors-ligne
│   ├── eslint/  (rules/ + use/)
│   ├── vitest/
│   ├── vite/
│   └── jsdoc/
├── projets/
│   ├── cours/
│   │   ├── 1-lint/                   ← exercice ESLint (+ corrige/)
│   │   ├── 2-vitest/                 ← exercice Vitest + JSDoc
│   │   ├── 3-vite_lint_test_doc/     ← Vite + lint + test + doc
│   │   └── 4-currency-converter/     ← projet complet + publication FTP
│   └── modele/               ← projet modèle vérifié, prêt à copier
└── assets/                   ← style, script, index de recherche
```

::: tip Astuce
Tu peux imprimer n'importe quelle page (<kbd>Ctrl</kbd> <kbd>P</kbd>) : le menu disparaît et le code passe à la ligne. Le bouton ◐ en haut à droite change le thème clair / sombre.
:::
