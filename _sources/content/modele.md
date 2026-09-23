---
title: "Projet modèle complet"
lead: "Un projet Vite qui coche toutes les cases de l'évaluation, vérifié de A à Z : 0 erreur de lint, 11 tests verts, doc JSDoc avec image, build pour un sous-dossier, envoi FTP testé sur un serveur local, 0 lien cassé."
---

Dossier : `projets/modele/` (sans `node_modules`). Versions : Vite 8.3, ESLint 10.11, Vitest 5.0, JSDoc 4.0.5.

## Réutiliser le modèle

```bash
# avec réseau
cp -r projets/modele mon-projet      # Windows : copier le dossier dans l'explorateur
cd mon-projet
npm install
```

Puis :

1. `package.json` → changer `"name"`.
2. `vite.config.js` → mettre le bon dossier dans `base`.
3. Remplacer `src/math.js` et `src/math.test.js` par ton code.
4. Adapter les règles de `eslint.config.js` à la consigne.
5. `npm run all` : lint + tests + doc + build + vérification.

::: tip Ou partir d'un projet Vite neuf
Crée le projet avec `npm create vite@latest`, installe les dépendances, puis recopie seulement les fichiers de config de cette page.
:::

## Arborescence

```text
modele/
├── index.html              ← favicon + image de public/ en chemin absolu
├── package.json            ← tous les scripts
├── vite.config.js          ← base + build + config Vitest (coverage)
├── eslint.config.js        ← règles du cours + ignores + globals Node pour scripts/
├── jsdoc-conf.json         ← src/ uniquement, tests exclus, README en accueil
├── README.md               ← avec image ./img/capture.png
├── .gitignore              ← node_modules, dist, docs, coverage, .env
├── .env.example            ← modèle des identifiants FTP (sans le vrai mot de passe)
├── img/capture.png         ← image du README (copiée dans docs/img/ par npm run doc)
├── public/
│   ├── favicon.svg
│   └── images/logo.png     ← fichier « fixe » (nom non modifié au build)
├── scripts/
│   ├── publish.sh          ← envoi FTP (lftp)
│   └── check-dist.js       ← vérifie dist/ avant l'envoi
├── src/
│   ├── main.js             ← les 3 bonnes façons de référencer une image
│   ├── style.css           ← url("/images/logo.png")
│   ├── math.js             ← module documenté en JSDoc
│   ├── math.test.js        ← 11 tests
│   └── assets/vite.svg     ← image importée par le JS
├── docs/                   ← généré : npm run doc
├── coverage/               ← généré : npm run coverage
└── dist/                   ← généré : npm run build
```

Résultats générés à ouvrir : [docs/index.html](../projets/modele/docs/index.html) · [coverage/index.html](../projets/modele/coverage/index.html)

## Les scripts

@@include projets/modele/package.json@@

| Script | Commande |
|---|---|
| `npm run dev` | serveur de dev |
| `npm run lint` / `lint:fix` | ESLint / avec correction auto |
| `npm test` | Vitest en mode watch |
| `npm run test:run` | Vitest une fois |
| `npm run coverage` | couverture |
| `npm run doc` | JSDoc + copie de `img/` dans `docs/img/` (compatible Windows) |
| `npm run build` | build dans `dist/` |
| `npm run preview` | sert `dist/` sur `http://localhost:4173/mon_dossier/` |
| `npm run check` | vérifie `dist/` (liens, casse, favicon) |
| `npm run publish` | envoi FTP (lit `.env`) |
| `npm run all` | lint → tests → doc → build → check (s'arrête à la 1re erreur) |

Sortie réelle de `npm run all` (fin) :

```text
 Test Files  1 passed (1)
      Tests  11 passed (11)
vite v8.3.0 building client environment for production...
✓ 7 modules transformed.
dist/index.html                 0.80 kB │ gzip: 0.47 kB
dist/assets/vite-BF8QNONU.svg   8.70 kB │ gzip: 1.60 kB
dist/assets/index-Dj4gvqNB.css  0.14 kB │ gzip: 0.14 kB
dist/assets/index-_2MRZmio.js   1.23 kB │ gzip: 0.65 kB
✓ built in 23ms
base = "/mon_dossier/"
6 fichiers analysés dans dist/
✅ Aucun lien cassé détecté : dist/ est prêt pour le FTP.
```

## Configuration

@@include projets/modele/vite.config.js@@

@@include projets/modele/eslint.config.js@@

@@include projets/modele/jsdoc-conf.json@@

## Code source

@@include projets/modele/index.html@@

@@include projets/modele/src/main.js@@

@@include projets/modele/src/style.css@@

@@include projets/modele/src/math.js@@

@@include projets/modele/src/math.test.js@@

## Documentation

@@include projets/modele/README.md md@@

## Vérifier dist sans serveur

`scripts/check-dist.js` : aucune dépendance, marche sous Windows, macOS et Linux. Explications et sorties d'exemple dans [Build & FTP](build-ftp.html#verifier-dist-sans-serveur).

@@include projets/modele/scripts/check-dist.js@@

## Publication

@@include projets/modele/scripts/publish.sh bash@@

@@include projets/modele/.env.example ini@@

@@include projets/modele/.gitignore txt@@
