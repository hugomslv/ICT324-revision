# ICT-324 : révision hors-ligne

Site de révision pour la première évaluation ICT-324 (Vite, ESLint, Vitest, JSDoc, publication FTP).
Il fonctionne **sans internet** : ouvre `index.html` dans un navigateur.

## Contenu

- `index.html` : accueil
- `pages/` : fiches de cours (Vite, ESLint, règles, Vitest, JSDoc, README, build & FTP, jour J, antisèche, pièges, exercices)
- `docs/` : documentations officielles d'ESLint, Vitest, Vite et JSDoc converties en HTML hors-ligne
- `projets/cours/` : projets et corrigés du cours
- `projets/modele/` : projet complet de référence, testé (lint, tests, doc, build pour sous-dossier, envoi FTP)
- `projets/exemples/` : exemples testés (mocks Vitest, JSDoc complet, exercice)
- `_sources/` : sources Markdown des fiches (`content/`) et générateur (`build.mjs`)

Recherche dans tout le site : `Ctrl` + `K`.

## Contribuer

Les corrections et ajouts sont bienvenus : fais un fork, modifie, puis ouvre une pull request.
Pour modifier une fiche, édite le fichier Markdown dans `_sources/content/`, puis régénère le HTML avec `_sources/build.mjs` (Node 20+, `npm install` dans `_sources/`). Les chemins en haut de `build.mjs` sont à adapter à ton dossier.

## Crédits

Documentations officielles : [ESLint](https://github.com/eslint/eslint) (MIT), [Vitest](https://github.com/vitest-dev/vitest) (MIT), [Vite](https://github.com/vitejs/vite) (MIT), [JSDoc](https://github.com/jsdoc/jsdoc.github.io) (CC BY-SA 3.0). Projets du cours : Pierre Ferrari.
