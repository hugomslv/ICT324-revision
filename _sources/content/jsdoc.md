---
title: "4. JSDoc : documentation"
lead: "JSDoc lit les commentaires /** ... */ placés au-dessus du code et génère un site HTML de documentation (dossier docs/). Le README.md peut devenir la page d'accueil."
---

Version : **JSDoc 4.0.5**. Doc hors-ligne : [JSDoc](../docs/jsdoc/index.html) (tous les [tags](../docs/jsdoc/index.html#tags)), [config](../docs/jsdoc/about-configuring-jsdoc.html), [ligne de commande](../docs/jsdoc/about-commandline.html).

## Installer et générer

```bash
npm install -D jsdoc
```

```bash
npx jsdoc src/math.js                          # un fichier → dossier out/ par défaut
npx jsdoc src -r -d docs                       # tout src/ (récursif) → docs/
npx jsdoc src -r -d docs -R README.md          # + README en page d'accueil
npx jsdoc -c jsdoc-conf.json                   # tout est dans le fichier de config
npx jsdoc -c jsdoc-conf.json -R README.md src/math.js   # config + options
```

| Option | Rôle |
|---|---|
| `-c fichier.json` | fichier de configuration |
| `-d dossier` | destination (défaut : `./out/`) |
| `-r` | récursif dans les dossiers |
| `-R README.md` | page d'accueil depuis un Markdown |
| `-P package.json` | affiche nom + version du projet ⚠️ voir encadré |
| `-u dossier` | tutoriels (fichiers `.md` / `.html`) |
| `-t chemin` | autre template |
| `-p` / `--private` | inclut les éléments `@private` |
| `-a all` | inclut tout (même non documenté) |
| `-X` | affiche le JSON brut (debug) |

Dans `package.json` :

```json
"scripts": {
  "doc": "jsdoc -c jsdoc-conf.json -R README.md"
}
```

::: warning Testé : -P package.json change le dossier de sortie
Avec `-P package.json` (ou `"package"` dans la config), la doc est générée dans **`docs/<name>/<version>/`** (ex : `docs/demo-jsdoc/1.2.0/index.html`) et non dans `docs/`. Les images du README doivent alors être copiées dans ce sous-dossier. Sans `-P`, tout va dans `docs/`.
:::

::: info Le script du prof
`"jsdoc": "./node_modules/jsdoc/jsdoc.js -c ./jsdoc-conf.json --readme ./README.md src/math.js && ..."` : `./node_modules/jsdoc/jsdoc.js` marche sous Linux/macOS mais **pas sous Windows** (cmd.exe ne sait pas exécuter ce chemin). Dans un script npm, écris juste `jsdoc` : npm trouve le binaire dans `node_modules/.bin` sur tous les systèmes.
:::

## Le fichier de configuration

Celui du cours (identique dans les 4 projets) :

```json [jsdoc-conf.json]
{
  "plugins": ["plugins/markdown"],
  "recurseDepth": 10,
  "source": {
    "includePattern": ".+\\.js(doc|x)?$",
    "excludePattern": "(^|\\/|\\\\)_"
  },
  "sourceType": "module",
  "tags": {
    "allowUnknownTags": true,
    "dictionaries": ["jsdoc", "closure"]
  },
  "templates": {
    "cleverLinks": false,
    "monospaceLinks": false
  },
  "opts": {
    "template": "templates/default",
    "encoding": "utf8",
    "destination": "./docs/",
    "recurse": true
  }
}
```

| Clé | Sens |
|---|---|
| `plugins/markdown` | autorise le Markdown dans les commentaires (`**gras**`, listes, `code`) |
| `recurseDepth` | profondeur max avec `-r` |
| `source.include` | fichiers / dossiers à documenter (ex : `["src"]`) |
| `source.includePattern` | regex des fichiers pris : `.js`, `.jsdoc`, `.jsx` |
| `source.excludePattern` | regex exclue : ici les fichiers/dossiers qui commencent par `_` |
| `source.exclude` | liste de chemins exclus (ex : `["node_modules", "src/tests"]`) |
| `sourceType` | `"module"` pour `import` / `export` |
| `tags.dictionaries` | tags reconnus (JSDoc + Google Closure) |
| `opts.destination` | = option `-d` |
| `opts.recurse` | = option `-r` |
| `opts.readme` | = option `-R` |
| `opts.template` | = option `-t` |

Version améliorée (projet modèle) : les sources et le README dans la config, les tests exclus.

@@include projets/modele/jsdoc-conf.json@@

## Écrire les commentaires

Un commentaire JSDoc commence par **`/**`** (deux étoiles), juste au-dessus de l'élément. Un `/* */` simple est ignoré.

```js
/**
 * Additionne deux nombres.
 * @param {number} a - Le premier nombre.
 * @param {number} b - Le second nombre.
 * @returns {number|string} La somme, ou "error" si un paramètre est invalide.
 * @example
 * add(1, 2) // 3
 */
export function add(a, b) { ... }
```

### En-tête de fichier / module

```js
/**
 * @file math.js contient des fonctions mathématiques de base.
 * @module math
 * @author Pierre Ferrari <pierre.ferrari@rpn.ch>
 * @version 1.0.0
 * @see {@link https://git.s2.rpn.ch}
 * @license Apache-2.0
 */
```

`@module math` crée la page *module-math.html* : toutes les fonctions exportées du fichier y sont listées. Sans `@module`, les fonctions vont dans *Global*.

## Les tags à connaître

| Tag | Rôle | Exemple |
|---|---|---|
| [`@param`](../docs/jsdoc/tags-param.html) | paramètre | `@param {string} name - Le nom.` |
| `@param` optionnel | entre crochets | `@param {number} [n]` |
| `@param` par défaut | | `@param {number} [n=1] - Positions.` |
| `@param` objet | propriétés avec un point | `@param {Object} opts` puis `@param {boolean} opts.admin` |
| [`@returns`](../docs/jsdoc/tags-returns.html) / `@return` | valeur renvoyée | `@returns {number[]} Le tableau.` |
| [`@throws`](../docs/jsdoc/tags-throws.html) | erreur levée | `@throws {TypeError} Si ...` |
| [`@example`](../docs/jsdoc/tags-example.html) | exemple de code (lignes suivantes) | |
| [`@file`](../docs/jsdoc/tags-file.html) / `@fileoverview` | description du fichier | |
| [`@module`](../docs/jsdoc/tags-module.html) | nom du module | `@module math` |
| [`@author`](../docs/jsdoc/tags-author.html) | auteur | `@author Nom <mail>` |
| [`@version`](../docs/jsdoc/tags-version.html) | version | `@version 1.0.0` |
| [`@since`](../docs/jsdoc/tags-since.html) | depuis quelle version | `@since 1.2.0` |
| [`@license`](../docs/jsdoc/tags-license.html) | licence | `@license MIT` |
| [`@see`](../docs/jsdoc/tags-see.html) | voir aussi | `@see {@link add}` |
| [`{@link}`](../docs/jsdoc/tags-inline-link.html) | lien dans un texte | `{@link https://site.ch\|texte}` ou `{@link module:math.add}` |
| [`@deprecated`](../docs/jsdoc/tags-deprecated.html) | obsolète | `@deprecated Utiliser add2.` |
| [`@todo`](../docs/jsdoc/tags-todo.html) | à faire | |
| [`@typedef`](../docs/jsdoc/tags-typedef.html) + [`@property`](../docs/jsdoc/tags-property.html) | définir un type objet | voir exemple |
| [`@callback`](../docs/jsdoc/tags-callback.html) | type d'une fonction callback | |
| [`@type`](../docs/jsdoc/tags-type.html) | type d'une variable | `/** @type {string} */` |
| [`@constant`](../docs/jsdoc/tags-constant.html) / `@const` | constante | |
| [`@default`](../docs/jsdoc/tags-default.html) | valeur par défaut | |
| [`@async`](../docs/jsdoc/tags-async.html) | fonction asynchrone | |
| [`@class`](../docs/jsdoc/tags-class.html) / `@constructor` | classe | |
| [`@private`](../docs/jsdoc/tags-private.html) / `@public` / `@protected` | visibilité (`@private` caché par défaut) | |
| [`@description`](../docs/jsdoc/tags-description.html) / `@desc` | description (le texte avant les tags l'est déjà) | |
| [`@tutorial`](../docs/jsdoc/tags-tutorial.html) | lien vers un tutoriel (`-u`) | |

### Syntaxe des types

| Écriture | Sens |
|---|---|
| `{number}` `{string}` `{boolean}` `{Object}` `{Array}` `{Function}` | types de base |
| `{number\|string}` | l'un ou l'autre |
| `{number[]}` ou `{Array<number>}` | tableau de nombres |
| `{Object.<string, number>}` | objet clé → valeur (dictionnaire) |
| `{Promise<User>}` | promesse |
| `{*}` | n'importe quoi |
| `{?number}` | nombre ou `null` |
| `{!Object}` | jamais `null` |
| `{User}` | type défini avec `@typedef` |

### Exemple complet (testé)

Toutes ces balises ensemble, générées sans erreur : [voir la doc produite](../projets/exemples/jsdoc-complet/docs/demo-jsdoc/1.2.0/index.html).

@@include projets/exemples/jsdoc-complet/src/user.js@@

## README en page d'accueil + images

C'est la « particularité » demandée : le README (avec une image) doit apparaître dans la doc.

1. Mettre les images dans un dossier `img/` à la racine du projet.
2. Dans `README.md`, lien **relatif** : `![Capture](./img/capture.png)`.
3. Générer avec `-R README.md` (ou `"readme"` dans `opts`).
4. **Copier `img/` dans `docs/img/`** : JSDoc recopie le texte du README dans `docs/index.html` mais **pas** les images. Sans ça : image cassée.

Le prof le fait dans le script npm :

```json
"jsdoc": "jsdoc -c jsdoc-conf.json --readme README.md src/math.js && rm -rf ./docs/img/ && mkdir ./docs/img/ && cp -r ./img/* ./docs/img/"
```

::: warning rm, mkdir, cp : pas sous Windows
Ces commandes n'existent pas dans `cmd.exe`. Version qui marche partout (Node 16.7+), testée :

```json
"doc": "jsdoc -c jsdoc-conf.json && node -e \"require('fs').cpSync('img', 'docs/img', { recursive: true })\""
```
:::

Résultat dans `docs/index.html` : `<img src="./img/capture.png" alt="Capture">`, et l'image est bien dans `docs/img/`.

Pour régler la taille d'une image dans le README, utilise du HTML : `<img src="img/capture.png" width="50%">` (c'est ce que fait le README de l'exercice lint).

Autres possibilités :

- `templates.default.staticFiles` dans la config copie des dossiers dans la doc générée :

```json
"templates": {
  "default": {
    "staticFiles": { "include": ["./img"] }
  }
}
```

⚠️ Avec `staticFiles`, le **contenu** de `img/` est copié à la racine de `docs/` (pas dans `docs/img/`). Le plus simple reste la copie dans le script.

- Tutoriels : dossier `tutorials/` avec des `.md`, option `-u tutorials`, lien avec `{@tutorial nom}`.

## Ouvrir la doc

Double-clic sur `docs/index.html`, ou `npx vite docs` pour la servir. Exemples réels :

- [Doc du projet vite_lint_test_doc (avec image)](../projets/cours/3-vite_lint_test_doc/docs/index.html)
- [Doc du projet vitest](../projets/cours/2-vitest/docs/index.html)
- [Doc du projet modèle](../projets/modele/docs/index.html)
- [Doc de l'exemple complet](../projets/exemples/jsdoc-complet/docs/demo-jsdoc/1.2.0/index.html)
