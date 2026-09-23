---
title: "Tuto 3 : mettre en place la documentation"
lead: "Consigne : « Mettre en place une documentation avec quelques particularités (images, README.md, etc.) ». Résultat attendu : un dossier docs/ dont la page d'accueil est ton README, avec l'image qui s'affiche, et la page de chaque fonction."
---

<div class="progress"><span></span></div>
<p class="small muted">Progression : <span id="progress-label"></span> · <a href="#" id="reset-checks">tout décocher</a></p>

## Ce qu'on va obtenir

```text
mon-projet/
├── README.md          ← page d'accueil de la doc
├── img/
│   └── capture.png    ← image affichée dans le README
├── jsdoc-conf.json    ← réglages de JSDoc
├── src/exemples.js    ← code avec des commentaires /** ... */
└── docs/              ← GÉNÉRÉ par JSDoc
    ├── index.html     ← le README mis en page
    ├── img/capture.png← COPIÉ (sinon image cassée)
    ├── module-exemples.html
    └── ...
```

## Étape 1 : installer JSDoc (avec réseau)

- [ ] Installer :

```bash
npm install -D jsdoc
```

Vérification : `npx jsdoc --version` → `JSDoc 4.0.5 …`

## Étape 2 : écrire les commentaires dans le code

- [ ] Dans `src/exemples.js`, **tout en haut du fichier**, l'en-tête :

```js [src/exemples.js]
/**
 * @file Petites fonctions très simples pour s'entraîner aux tests.
 * @module exemples
 * @author Hugo
 * @version 1.0.0
 */
```

`@module exemples` crée une page « exemples » qui regroupe toutes les fonctions du fichier.

- [ ] **Au-dessus de chaque fonction**, un commentaire qui commence par **`/**`** (deux étoiles) :

```js [src/exemples.js]
/**
 * Multiplie un nombre par 2.
 * @param {number} n - Le nombre.
 * @returns {number} Le double de n.
 * @example
 * double(4) // 8
 */
export function double(n) {
  return n * 2
}
```

Les tags les plus utiles :

| Tag | À quoi il sert | Exemple |
|---|---|---|
| (texte au début) | description | `Multiplie un nombre par 2.` |
| `@param` | un paramètre : `{type} nom - description` | `@param {number} n - Le nombre.` |
| `@param` optionnel | entre crochets, avec valeur par défaut | `@param {number} [n=1] - ...` |
| `@returns` | ce que la fonction renvoie | `@returns {number} Le double.` |
| `@throws` | l'erreur qu'elle peut lever | `@throws {Error} Si b vaut 0.` |
| `@example` | un exemple d'utilisation (lignes suivantes) | `double(4) // 8` |
| `@async` | fonction asynchrone | |
| `@see` | lien | `@see {@link https://jsdoc.app}` |

Types : `{number}`, `{string}`, `{boolean}`, `{number[]}` (tableau de nombres), `{Object}`, `{number|null}` (l'un ou l'autre), `{Promise<number>}`, `{*}` (n'importe quoi). Liste complète : [4. JSDoc](jsdoc.html#les-tags-a-connaitre).

Le fichier complet commenté : [en bas de page](#les-fichiers-complets).

## Étape 3 : écrire le README avec une image

- [ ] Créer un dossier **`img/`** à la racine et y mettre une image, par exemple une capture d'écran du projet : **`img/capture.png`**.

::: warning Nom de l'image
En **minuscules**, sans espace, sans accent : `capture.png`, `ecran_accueil.png`. Pas `Capture d'écran 2026.png`.
:::

- [ ] Créer **`README.md`** à la racine :

````markdown [README.md]
# Mon projet ICT-324

Projet Vite avec linter, tests unitaires et documentation.

![Capture du projet](./img/capture.png)

## Installation

```bash
npm install
```

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | lance le site en local |
| `npm run lint` | vérifie le code |
| `npm test` | lance les tests |
| `npm run doc` | génère la documentation |
| `npm run build` | prépare la version à publier |

## Auteur

Hugo
````

- L'image s'écrit `![texte alternatif](./img/capture.png)`, avec un chemin **relatif** qui commence par `./`.
- Pour régler la taille, du HTML fonctionne aussi : `<img src="img/capture.png" width="50%">`.
- Aperçu dans VS Code : <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>V</kbd>.

Toute la syntaxe Markdown : [5. README & Markdown](readme.html).

## Étape 4 : le fichier de configuration JSDoc

- [ ] Créer **`jsdoc-conf.json`** à la racine :

```json [jsdoc-conf.json]
{
  "plugins": ["plugins/markdown"],
  "source": {
    "include": ["src"],
    "includePattern": ".+\\.js$",
    "excludePattern": "\\.test\\.js$"
  },
  "sourceType": "module",
  "opts": {
    "destination": "./docs/",
    "readme": "./README.md",
    "recurse": true
  }
}
```

| Ligne | Sens |
|---|---|
| `"plugins": ["plugins/markdown"]` | autorise le Markdown dans les commentaires |
| `"include": ["src"]` | documente le dossier `src/` |
| `"includePattern"` | seulement les fichiers `.js` |
| `"excludePattern"` | **sans** les fichiers de test |
| `"sourceType": "module"` | le code utilise `import` / `export` |
| `"destination"` | la doc est générée dans `docs/` |
| `"readme"` | le README devient la page d'accueil |
| `"recurse"` | aussi les sous-dossiers de `src/` |

La version du prof (plus longue, même effet) est dans [4. JSDoc](jsdoc.html#le-fichier-de-configuration).

## Étape 5 : la commande de génération

- [ ] Dans `package.json`, partie `"scripts"` :

```json
"doc": "jsdoc -c jsdoc-conf.json && node -e \"require('fs').cpSync('img', 'docs/img', { recursive: true })\""
```

Elle fait deux choses :

1. `jsdoc -c jsdoc-conf.json` : génère `docs/`.
2. `node -e "...cpSync('img', 'docs/img'...)"` : **copie le dossier `img/` dans `docs/img/`**.

::: danger La particularité à ne pas oublier
JSDoc recopie le **texte** du README dans `docs/index.html`, mais **pas les images**. Sans la copie, l'image est cassée dans la doc. La commande `node -e ...` marche sous Windows, macOS et Linux (contrairement à `cp -r` du corrigé du prof, qui ne marche pas sous Windows).
:::

## Étape 6 : générer et vérifier

- [ ] Lancer :

```bash
npm run doc
```

- [ ] Vérifier que ces fichiers existent (testé) :

```text
docs/
├── exemples.js.html       ← le code source
├── fonts/
├── img/capture.png        ← l'image copiée
├── index.html             ← le README
├── module-exemples.html   ← toutes les fonctions
├── scripts/
└── styles/
```

- [ ] Ouvrir **`docs/index.html`** dans le navigateur (double-clic) :
  - le README s'affiche, **avec l'image** ;
  - à droite, le menu « Modules » → `exemples` ;
  - chaque fonction montre ses paramètres, son retour et son exemple.
- [ ] Aucun fichier `*.test.js` dans la doc.

## Étape 7 : finitions

- [ ] Ajouter `docs/` au `.gitignore` (c'est un dossier généré) : ajoute la ligne `docs/`.
- [ ] Vérifier que `docs/` est bien dans les `globalIgnores` d'ESLint (sinon `npm run lint` analyse la doc générée : des centaines d'erreurs).

## Bonus : autres « particularités » possibles

| Particularité | Comment |
|---|---|
| nom et version du projet sur la page d'accueil | option `-P package.json` : ⚠️ la doc va alors dans `docs/<nom>/<version>/` (testé), il faut copier les images là |
| pages de tutoriel | dossier `tutorials/` avec des `.md`, option `-u tutorials`, lien `{@tutorial nom}` |
| un lien vers une autre fonction | `{@link double}` |
| un type objet réutilisable | `@typedef` + `@property` ([exemple](jsdoc.html#exemple-complet-teste)) |
| inclure les éléments privés | option `-p` |

## Les fichiers complets

@@include projets/tuto/README.md md@@

@@include projets/tuto/jsdoc-conf.json@@

@@include projets/tuto/src/exemples.js@@

Voir le résultat : [docs/index.html du projet tuto](../projets/tuto/docs/index.html)

Suite : [Tuto 4 : la config FTP →](tuto-4-ftp.html)
