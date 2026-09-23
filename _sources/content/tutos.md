---
title: "Tutos pas à pas"
lead: "Les 4 étapes de l'évaluation, du début à la fin : quel fichier créer, où, avec quel contenu, quelle commande lancer, et ce que tu dois voir. J'ai suivi ces tutos moi-même sur un projet Vite neuf : tout marche tel quel."
---

## Les 4 tutos

<div class="cards">
<a class="card" href="tuto-1-linter.html"><div class="card-icon">📏</div><h3>Tuto 1 : le linter</h3><p>Installer ESLint, créer <code>eslint.config.js</code>, trouver les règles dans la doc, corriger.</p></a>
<a class="card" href="tuto-2-tests.html"><div class="card-icon">🧪</div><h3>Tuto 2 : les tests</h3><p>Créer le module et son fichier de test, 11 exemples très simples, la couverture.</p></a>
<a class="card" href="tuto-3-doc.html"><div class="card-icon">📚</div><h3>Tuto 3 : la documentation</h3><p>Commentaires JSDoc, README avec image, génération de <code>docs/</code>.</p></a>
<a class="card" href="tuto-4-ftp.html"><div class="card-icon">🚀</div><h3>Tuto 4 : la config FTP</h3><p><code>base</code>, favicon, images, build, vérification à l'aveugle, script d'envoi.</p></a>
</div>

## Avant tout : le projet de départ (avec réseau)

Tous les tutos partent de ce projet. Fais cette partie **tant que le réseau est branché**.

**1. Créer le projet Vite**

```bash
npm create vite@latest mon-projet -- --template vanilla
cd mon-projet
npm install
```

**2. Installer tous les outils des 4 tutos d'un coup**

```bash
npm install -D eslint @eslint/js globals vitest @vitest/coverage-v8 jsdoc dotenv-cli
```

**3. Vérifier que ça marche**

```bash
npm run dev
```

Ouvre l'adresse affichée (`http://localhost:5173/`), puis <kbd>Ctrl</kbd> <kbd>C</kbd> dans le terminal pour arrêter.

Ce que tu as à ce moment-là :

```text
mon-projet/
├── index.html
├── package.json
├── package-lock.json
├── node_modules/
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.js
    ├── counter.js
    ├── style.css
    └── assets/ (hero.png, javascript.svg, vite.svg)
```

## Ce que tu auras à la fin des 4 tutos

```text
mon-projet/
├── eslint.config.js        ← tuto 1
├── src/exemples.js         ← tuto 2 (le code)
├── src/exemples.test.js    ← tuto 2 (les tests)
├── jsdoc-conf.json         ← tuto 3
├── README.md               ← tuto 3
├── img/capture.png         ← tuto 3 (image du README)
├── vite.config.js          ← tuto 4
├── public/favicon.svg      ← tuto 4
├── public/images/logo.png  ← tuto 4
├── scripts/check-dist.js   ← tuto 4
├── scripts/publish.sh      ← tuto 4
├── .env.example            ← tuto 4
└── package.json            ← scripts ajoutés à chaque tuto
```

Le projet terminé est dans `projets/tuto/` : si tu es perdu, compare avec lui.

## Modifier package.json

Chaque tuto ajoute des lignes dans la partie `"scripts"` du `package.json`. Deux façons :

- **Ouvrir `package.json` dans VS Code** et ajouter les lignes à la main (le plus sûr, surtout sous Windows).
- **En commande**, par exemple :

```bash
npm pkg set scripts.lint="eslint ."
```

::: warning Virgules dans package.json
Chaque ligne de `"scripts"` finit par une virgule, **sauf la dernière**. Une virgule en trop ou en moins et npm affiche une erreur `JSON.parse`.
:::
