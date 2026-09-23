---
title: "1. Vite"
lead: "Vite est un outil de build pour le front-end : serveur de développement ultra rapide (npm run dev) et build optimisé pour la production (npm run build → dossier dist/)."
---

Versions vérifiées pour ce site : **Vite 8.3**, create-vite 9.2, Node 24. Doc officielle hors-ligne : [docs/vite](../docs/vite/index.html).

## Créer un projet (avec réseau)

```bash
npm create vite@latest mon-projet -- --template vanilla
cd mon-projet
npm install
npm run dev
```

- `--template vanilla` = JavaScript pur, sans framework (c'est ce qu'on utilise en cours). Autres : `vanilla-ts`, `react`, `vue`, `svelte`…
- Le `--` est obligatoire avec npm pour passer l'option au script de création.
- Sans `--template`, un assistant interactif demande : nom du projet, *Framework* (**Vanilla**), *Variant* (**JavaScript**). Il peut aussi proposer d'installer et de lancer tout de suite.
- Dans le dossier courant : `npm create vite@latest . -- --template vanilla`

::: warning Nom du projet
Pas d'espace, pas de majuscule, pas d'accent : `mon-projet` ou `mon_projet`. Le nom devient le champ `"name"` du `package.json`.
:::

## Structure générée

```text
mon-projet/
├── index.html          ← point d'entrée (à la RACINE, pas dans public/)
├── package.json
├── .gitignore
├── public/             ← fichiers copiés TELS QUELS dans dist/ (favicon, robots.txt…)
│   └── favicon.svg
└── src/
    ├── main.js         ← chargé par index.html : <script type="module" src="/src/main.js">
    ├── style.css       ← importé depuis main.js : import "./style.css"
    ├── counter.js
    └── assets/         ← images importées par le JS (renommées avec un hash au build)
        └── vite.svg
```

Le `package.json` créé :

```json [package.json]
{
  "name": "mon-projet",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^8.3.0"
  }
}
```

::: tip "type": "module"
Permet d'utiliser `import` / `export` dans tous les `.js` du projet, y compris `eslint.config.js` et `vite.config.js`. Sans lui, il faut nommer les fichiers de config en `.mjs` (c'est pour ça que le prof a parfois `eslint.config.mjs`).
:::

## Les commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur de dev sur `http://localhost:5173/` avec rechargement à chaud (HMR) |
| `npm run build` | build de production dans `dist/` |
| `npm run preview` | sert `dist/` sur `http://localhost:4173/` (**respecte `base`** : idéal pour tester avant le FTP) |
| `npx vite --host` | rend le serveur accessible depuis le réseau local |
| `npx vite --port 3000` | change le port |
| `npx vite build --base=/dossier/` | surcharge `base` pour ce build |

## Où mettre les fichiers : `public/` ou `src/assets/` ?

| | `public/` | `src/assets/` (ou n'importe où dans `src/`) |
|---|---|---|
| Au build | copié tel quel à la racine de `dist/` | optimisé, renommé avec un hash (`logo-BF8QNONU.png`) |
| Comment l'utiliser | chemin **absolu** : `/favicon.svg`, `/images/logo.png` | `import logo from "./assets/logo.png"` puis `img.src = logo` |
| Usage typique | favicon, `robots.txt`, fichiers dont le nom doit rester fixe | images du contenu, icônes utilisées dans le JS |
| Fichier introuvable | 404 silencieuse | **erreur au build** (plus sûr) |

::: warning Piège n°1 du FTP
Dans le **HTML** et le **CSS**, Vite ajoute automatiquement `base` devant `/favicon.svg`. Dans une **chaîne JavaScript**, NON : `img.src = "/images/logo.png"` donnera une 404 une fois dans un sous-dossier. Utilise `` `${import.meta.env.BASE_URL}images/logo.png` `` ou un `import`. Détails et tests : [6. Build & FTP](build-ftp.html).
:::

## `index.html`

```html [index.html]
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mon projet</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

- `type="module"` est obligatoire (Vite travaille en modules ES).
- Le CSS peut être importé dans le JS (`import "./style.css"`) ou lié dans le HTML (`<link rel="stylesheet" href="/src/style.css">`).

## `vite.config.js`

Facultatif. À créer à la racine. On peut y mettre aussi la config de Vitest (bloc `test`), c'est ce que fait le prof dans `currency-converter`.

```js [vite.config.js]
import { defineConfig } from "vitest/config" // "vite" suffit si pas de bloc test

export default defineConfig({
  base: "/mon_dossier/",     // sous-dossier sur le serveur (défaut "/")
  publicDir: "public",       // défaut
  build: {
    outDir: "dist",          // défaut
    assetsDir: "assets",     // défaut
    target: "esnext",        // nécessaire si "await" au niveau racine du module
    emptyOutDir: true,       // vide dist/ avant chaque build (défaut si dans le projet)
  },
  server: {
    port: 5173,
    open: true,              // ouvre le navigateur au lancement de npm run dev
  },
  test: {
    // config Vitest (voir la page Vitest)
  },
})
```

Doc : [options partagées (base, publicDir…)](../docs/vite/config/shared-options.html), [options de build](../docs/vite/config/build-options.html), [serveur](../docs/vite/config/server-options.html).

::: info Top-level await
`currency-converter/main.js` commence par `const x = await getSupportedCurrencies()` (un `await` hors fonction). Avec la cible par défaut, Vite 8 affiche *« Top-level await is not available in the configured target environment »*. D'où le `build: { target: "esnext" }` du prof.
:::

## Variables d'environnement

| Variable | Valeur |
|---|---|
| `import.meta.env.BASE_URL` | la valeur de `base` (ex : `/mon_dossier/`) |
| `import.meta.env.MODE` | `development` ou `production` |
| `import.meta.env.DEV` / `.PROD` | booléens |
| `import.meta.env.VITE_XXX` | variables définies dans `.env` et **préfixées `VITE_`** |

```ini [.env]
VITE_API_URL=https://api.exemple.ch
FTP_PASS=secret        # PAS exposé au navigateur (pas de préfixe VITE_)
```

Doc : [Env Variables and Modes](../docs/vite/guide/env-and-mode.html).

## Site à plusieurs pages

Chaque page HTML doit être déclarée comme entrée, sinon elle n'est pas dans `dist/`. Avec Vite 8 :

```js [vite.config.js]
import { resolve } from "node:path"
import { defineConfig } from "vite"

export default defineConfig({
  input: {
    main: resolve(import.meta.dirname, "index.html"),
    contact: resolve(import.meta.dirname, "contact.html"),
  },
})
```

(Avant Vite 8 : `build: { rollupOptions: { input: {...} } }`, encore accepté comme alias.) Doc : [Multi-Page App](../docs/vite/guide/build.html#multi-page-app).

## Ajouter un projet existant à Vite

Si on te donne juste un `index.html` et des `.js` :

```bash
npm init -y
npm install -D vite
```

puis ajouter les scripts `dev`, `build`, `preview` et `"type": "module"` dans `package.json`, et `type="module"` sur la balise `<script>`.
