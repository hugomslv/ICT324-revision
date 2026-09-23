---
title: "Exercices corrigés"
lead: "Les exercices du cours corrigés et vérifiés, plus des entraînements pour chaque partie de l'évaluation. Les corrections sont dans des blocs repliés : essaie d'abord !"
---

## Exercice ESLint 1

Énoncé (README de `1-lint`) : **uniquement à l'aide de la documentation officielle**, ajouter les règles :

- Forcer les guillemets à la place des apostrophes
- Interdire les déclarations de variables ou de fonction dans le scope global
- Interdire la redéfinition de variables constantes
- Interdire le mot clé `var`
- Forcer `const` si jamais redéfinie
- Forcer les espaces dans les tableaux `const arr = [ 'foo', 'bar' ]`, mais pas s'il y a des tableaux dans des tableaux `let arr = [[1, 2], [3, 4]]`
- Forcer `===`, `!==`
- Interdire le `;` en fin de ligne
- Forcer l'indentation à 2 espaces

TIPS : `array-bracket-spacing`, `semi`, `no-undef`, `no-unused-vars`, `no-const-assign`, `no-var`, `no-implicit-globals`, `eqeqeq`, `indent`, `prefer-const`

::: details Correction
```js
rules: {
  quotes: [ "error", "double" ],
  "no-unused-vars": "error",
  "no-undef": "error",
  "no-implicit-globals": "error",
  "no-const-assign": "error",
  "no-var": "error",
  "prefer-const": "error",
  "array-bracket-spacing": [ "error", "always", { arraysInArrays: false } ],
  eqeqeq: "error",
  semi: [ "error", "never" ],
  indent: [ "error", 2 ],
}
```
Rappel : `no-implicit-globals` ne signale rien dans un module ES ([pourquoi](eslint-regles.html#no-implicit-globals-pas-de-globales)).
:::

## Exercice ESLint 2

Trouver les règles pour :

- Lignes de 80 caractères maximum
- Blocs indentés avec une **tabulation**
- Variables en `snake_case`
- Fichiers en minuscules (`snake_case`)
- Dossiers en minuscules (`snake_case`)
- *One true brace style*

::: details Correction
```js
rules: {
  "max-len": [ "error", { code: 80 } ],
  indent: [ "error", "tab" ],            // le corrigé du prof garde 2 espaces : [ "error", 2 ]
  "id-match": [ "error", "^[a-z_]+$", { properties: true, onlyDeclarations: true } ],
  "brace-style": [ "error", "1tbs" ],
  "filename-rules/match": [ "error", "snake_case" ],   // plugin @maintained/...
}
```
Dossiers : option `includePath: true` du plugin, voir [ESLint › plugins](eslint.html#plugins-exemple-filename-rules).
Le corrigé ajoute aussi `"linebreak-style": [ "error", "unix" ]`.
:::

### Les 27 erreurs attendues, expliquées

Avec la config du corrigé sur `inDex.js` (**testé** : sortie identique à l'énoncé) :

@@include projets/cours/1-lint/inDex.js@@

| Ligne:col | Règle | Pourquoi | Correction |
|---|---|---|---|
| 1:1 | `filename-rules/match` | `inDex.js` a une majuscule | renommer en `index.js` |
| 1:1 | `no-var` | `var` | `const` |
| 1:10 | `semi` | `;` | le supprimer |
| 2:1 | `max-len` | 97 caractères | couper la ligne |
| 2:5 | `prefer-const` | `arr` jamais réassigné | `const arr` |
| 2:31, 2:35, 2:47, 2:52, 2:97 | `array-bracket-spacing` | espaces manquants / en trop | `[[ 1, 2 ], 2, [ 3, 4 ], ... ]` |
| 3:13, 12:15, 16:15 | `quotes` | apostrophes | `"..."` |
| 5:5, 5:12, 5:20, 7:19 | `no-undef` | `y` jamais déclaré | `for (let y = 0; ...)` |
| 6:1 | `indent` | `{` indenté de 2 | voir brace-style |
| 6:3, 11:1, 15:1 | `brace-style` | `{` sur la ligne suivante | `{` en fin de ligne |
| 13:1 | `brace-style` | `}` puis `else` à la ligne | `} else {` |
| 7:22 | `semi` | `;` | le supprimer |
| 10:7 | `eqeqeq` | `==` | `===` |
| 19:7 | `id-match` | `myVariable` pas en snake_case | `my_variable` |
| 20:1 | `no-const-assign` | réassigne une `const` | `let` |
| 20:1 | `no-unused-vars` | valeur jamais lue | l'utiliser (`console.log`) |

::: details Code corrigé (0 erreur, testé, fichier projets/cours/1-lint/corrige/index.js)
@@include projets/cours/1-lint/corrige/index.js@@
:::

## Entraînement Vitest : clean_username

Le projet `vite_lint_test_doc` teste une fonction `cleanUsername` sur ces entrées : `"username"`, `"USERNAME"`, `"username@domain.tld"`, `"user.name@domain.tld"`, `"user_name"`, `"user123"`, `"user.name.extra@domain.tld"`.

**À faire** : écris `clean_username(username)` qui met en minuscules et retire la partie `@domaine`, renvoie `"error"` si l'entrée n'est pas une chaîne non vide. Puis écris les tests (cas normaux + invalides), avec `test.each`.

::: details Correction (14 tests, tous verts, lint OK)
@@include projets/exemples/exercice-username/utils.js@@
@@include projets/exemples/exercice-username/utils.test.js@@
:::

## Entraînement Vitest : rotate

Sans regarder le corrigé du prof, écris les tests de `rotate(arr, n)` (décale le tableau de `n` vers la gauche, `"error"` si ce n'est pas un tableau de nombres).

::: details Idées de cas
- `rotate([ 1, 2, 3, 4 ], 1)` → `[ 2, 3, 4, 1 ]` (avec `toEqual` !)
- `rotate([ 1, 2, 3, 4, 5 ], 1)` → `[ 2, 3, 4, 5, 1 ]`
- `rotate([ 1 ], 1)` → `[ 1 ]`
- `rotate([], 1)` → `[]`
- `rotate([ "a", 2 ], 1)` → `"error"`
- `rotate([[ 1 ], 2 ], 1)` → `"error"`
- `rotate("abc")` → `"error"`
- `rotate([ 1, 2, 3 ])` (sans `n`) → `[ 2, 3, 1 ]`

Le corrigé complet (16 tests) : [projets du cours › vitest](projets.html#2-vitest-tests-jsdoc).
:::

## Entraînement JSDoc

Documente cette fonction puis génère la doc avec le README en page d'accueil et une image :

```js
export function moyenne(notes) {
  if (!Array.isArray(notes) || notes.length === 0) return "error"
  return notes.reduce((a, b) => a + b, 0) / notes.length
}
```

::: details Correction
```js
/**
 * Calcule la moyenne d'une liste de notes.
 * @param {number[]} notes - Les notes (au moins une).
 * @returns {number|string} La moyenne, ou "error" si la liste est vide ou invalide.
 * @example
 * moyenne([ 4, 5, 6 ]) // 5
 * moyenne([]) // "error"
 */
export function moyenne(notes) { ... }
```

```bash
npx jsdoc -c jsdoc-conf.json -R README.md
node -e "require('fs').cpSync('img', 'docs/img', { recursive: true })"
```

Vérifie dans `docs/index.html` que l'image s'affiche, et que `moyenne` apparaît dans la page du module (ajoute `@module` en haut du fichier).
:::

## Entraînement FTP : trouve les erreurs

Le site doit être publié dans `https://serveur.ch/eleve42/`. Trouve les 6 problèmes :

```js [vite.config.js]
export default defineConfig({
  base: "eleve42",
})
```

```html [index.html]
<link rel="icon" href="C:\projet\public\Favicon.ico">
<img src="/images/Mon Logo.png">
<script type="module" src="/src/main.js"></script>
```

```js [src/main.js]
document.querySelector("#photo").src = "/images/photo.jpg"
```

Et l'élève envoie le dossier `dist` dans `/eleve42/` avec FileZilla.

::: details Correction
1. `base: "eleve42"` → **`base: "/eleve42/"`** (slash au début et à la fin).
2. `C:\projet\public\Favicon.ico` : chemin Windows absolu → **`/favicon.ico`**, fichier dans `public/`.
3. `Favicon.ico` avec majuscule : renommer en `favicon.ico` (serveur Linux sensible à la casse).
4. `Mon Logo.png` : espace et majuscules → `mon_logo.png`.
5. `"/images/photo.jpg"` dans le JS n'est **pas** réécrit par Vite → `` `${import.meta.env.BASE_URL}images/photo.jpg` `` ou `import photo from "./assets/photo.jpg"`.
6. Envoyer le **contenu** de `dist/` dans `/eleve42/`, pas le dossier `dist` (sinon tout est dans `/eleve42/dist/`).

Vérification : `npm run build && npm run preview` puis `node scripts/check-dist.js`.
:::

## Quiz rapide

::: details 1. Quelle différence entre `toBe` et `toEqual` ?
`toBe` compare avec `===` (même valeur primitive ou même référence). `toEqual` compare le contenu (tableaux, objets). `expect([ 1 ]).toBe([ 1 ])` échoue, `toEqual` passe.
:::

::: details 2. Pourquoi `npx eslint .` affiche des centaines d'erreurs dans docs/ ?
Parce que `docs/` (JSDoc) et `coverage/` contiennent du JS généré. Ajouter `globalIgnores([ "docs/", "coverage/", "dist/" ])`.
:::

::: details 3. Que fait `npm run build` ? Où va le résultat ?
Vite regroupe et optimise HTML/CSS/JS, copie `public/`, et écrit tout dans `dist/`. C'est ce dossier (son contenu) qu'on publie.
:::

::: details 4. Comment tester une fonction qui appelle fetch sans réseau ?
`vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ... }) }))`, puis `vi.unstubAllGlobals()` dans `afterEach`.
:::

::: details 5. L'image du README ne s'affiche pas dans la doc JSDoc. Pourquoi ?
JSDoc copie le texte du README mais pas les images : il faut copier `img/` dans `docs/img/` (et le chemin dans le README doit être relatif : `./img/x.png`).
:::

::: details 6. Quelle est la sévérité d'une règle réglée à 1 ?
`1` = `"warn"` (avertissement). `0` = `"off"`, `2` = `"error"`.
:::

::: details 7. Comment exécuter un seul test ?
`test.only(...)` dans le fichier, ou `npx vitest run -t "nom du test"`.
:::

::: details 8. Qu'est-ce que `import.meta.env.BASE_URL` ?
La valeur de `base` de `vite.config.js` (ex : `/mon_dossier/`), utilisable dans le JS pour construire les chemins vers `public/`.
:::
