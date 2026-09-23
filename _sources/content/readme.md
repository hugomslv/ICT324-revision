---
title: "5. README.md et Markdown"
lead: "Le README est la carte d'identité du projet : il s'affiche sur GitLab/GitHub et devient la page d'accueil de la doc JSDoc (option -R)."
---

## Modèle de README à recopier

````markdown [README.md]
# Nom du projet

Courte description : ce que fait le projet, en une ou deux phrases.

![Capture d'écran](./img/capture.png)

## Prérequis

- Node.js 20 ou plus
- npm

## Installation

```bash
npm install
```

## Utilisation

```bash
npm run dev      # serveur de développement
npm run build    # build de production dans dist/
```

```javascript
import { add } from "./src/math.js"

console.log(add(1, 2)) // 3
```

## Scripts

| Commande | Rôle |
|---|---|
| `npm run lint` | vérifie le code avec ESLint |
| `npm test` | lance les tests Vitest |
| `npm run coverage` | couverture de code |
| `npm run doc` | génère la documentation dans `docs/` |

## Fonctions

### `add(a, b)`
Retourne la somme de `a` et `b`, ou `"error"` si un paramètre n'est pas un nombre.

## Auteur

Prénom Nom

## Licence

MIT
````

## Syntaxe Markdown

### Titres et texte

```markdown
# Titre 1
## Titre 2
### Titre 3

**gras**   *italique*   ***gras italique***   ~~barré~~   `code en ligne`

Un paragraphe. Une ligne vide sépare les paragraphes.
Pour un simple retour à la ligne : deux espaces en fin de ligne, ou <br>.

> Citation

---   (ligne horizontale)
```

### Listes

```markdown
- élément
- élément
  - sous-élément (2 espaces)

1. premier
1. deuxième (la numérotation se fait toute seule)

- [x] tâche faite
- [ ] tâche à faire
```

### Liens et images

```markdown
[texte du lien](https://git.s2.rpn.ch)
[lien vers un autre fichier](./docs/index.html)
[lien vers un titre](#installation)

![texte alternatif](./img/capture.png)
![image avec titre](./img/capture.png "Titre au survol")

<img src="img/capture.png" width="50%" alt="Capture">   ← taille réglable (HTML)
```

::: warning Images : les règles pour que ça marche partout
- Chemin **relatif** (`./img/...`), jamais `C:\Users\...` ni `/home/...`.
- Nom en **minuscules**, sans espace ni accent (`capture_accueil.png`).
- Le dossier `img/` doit être **copié dans `docs/`** pour la doc JSDoc (voir [JSDoc › README + images](jsdoc.html#readme-en-page-d-accueil-images)).
:::

### Blocs de code

````markdown
```javascript
const x = 1
```

```bash
npm install
```

```json
{ "name": "projet" }
```
````

### Tableaux

```markdown
| Colonne A | Colonne B | Nombre |
|-----------|:---------:|-------:|
| gauche    |  centré   |  droite|
```

`:---` aligné à gauche, `:---:` centré, `---:` à droite.

### Échapper un caractère

`\*pas en italique\*`, `\#`, `\|` dans un tableau.

## Voir le rendu hors-ligne

- **VS Code** : ouvrir le `.md` puis <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>V</kbd> (aperçu), ou <kbd>Ctrl</kbd> <kbd>K</kbd> puis <kbd>V</kbd> (à côté).
- Ou générer la doc JSDoc avec `-R README.md` et ouvrir `docs/index.html`.

## Les README des projets du cours

::: details README de l'exercice ESLint (image avec width="50%")
@@include projets/cours/1-lint/README.md md@@
:::

::: details README du projet vitest (doc de module)
@@include projets/cours/2-vitest/README.md md@@
:::

::: details README du projet vite_lint_test_doc (image Markdown)
@@include projets/cours/3-vite_lint_test_doc/README.md md@@
:::
