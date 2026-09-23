---
title: "2b. ESLint : les règles"
lead: "Chaque consigne en français → la règle à mettre dans eslint.config.js, ses options, et des exemples OK / KO. Toutes les options de cette page ont été validées avec ESLint 10.11."
---

::: exam Méthode pour « trouver la règle dans la documentation »
1. Traduis la consigne en mots-clés **anglais** : guillemets = *quotes*, point-virgule = *semi*, indentation = *indent*, accolades = *brace*, espaces = *spacing*, longueur = *max-len*, nommage = *camelcase* / *id-match*, égalité = *eqeqeq*.
2. Filtre la [liste de toutes les règles](../docs/eslint/rules/index.html) avec ce mot.
3. Dans la page de la règle, lis **Options** : la config est `"nom-regle": [ "error", option, { objet } ]`.
4. Les exemples ✅ *correct* / ❌ *incorrect* montrent ce qui passe ou non.
5. Teste : `npx eslint fichier.js`. Une option mal écrite provoque une erreur claire (*« Key "rules": Key "quotes": Value ... should be equal to one of the allowed values »*).
:::

## Tableau récapitulatif (exercices 1 et 2)

| Consigne | Règle et config |
|---|---|
| Guillemets doubles au lieu des apostrophes | `quotes: [ "error", "double" ]` |
| Pas de déclaration dans le scope global | `"no-implicit-globals": "error"` (⚠️ seulement en mode *script*, voir plus bas) |
| Interdire de redéfinir une constante | `"no-const-assign": "error"` |
| Interdire `var` | `"no-var": "error"` |
| `const` si jamais réassignée | `"prefer-const": "error"` |
| Espaces dans les tableaux `[ 'foo', 'bar' ]`, mais pas pour les tableaux dans les tableaux `[[1, 2], [3, 4]]` | `"array-bracket-spacing": [ "error", "always", { arraysInArrays: false } ]` |
| Comparaisons triples `===`, `!==` | `eqeqeq: "error"` |
| Pas de `;` en fin de ligne | `semi: [ "error", "never" ]` |
| Indentation 2 espaces | `indent: [ "error", 2 ]` |
| Indentation avec **tabulation** | `indent: [ "error", "tab" ]` |
| Lignes de 80 caractères max | `"max-len": [ "error", { code: 80 } ]` |
| Variables en `snake_case` | `"id-match": [ "error", "^[a-z_]+$", { properties: true, onlyDeclarations: true } ]` |
| Fichiers en `snake_case` | plugin : `"filename-rules/match": [ "error", "snake_case" ]` |
| Dossiers en `snake_case` | plugin avec `includePath: true` (voir [ESLint › plugins](eslint.html#plugins-exemple-filename-rules)) |
| Accolades *one true brace style* | `"brace-style": [ "error", "1tbs" ]` |
| Fins de ligne Unix (LF) | `"linebreak-style": [ "error", "unix" ]` |
| Variables inutilisées | `"no-unused-vars": "error"` |
| Variables non déclarées | `"no-undef": "error"` |
| Espaces dans les accolades `{ a: 1 }` | `"object-curly-spacing": [ "error", "always" ]` |

La config complète du corrigé :

@@include projets/cours/1-lint/eslint.config.mjs@@

## Les règles du cours en détail

### quotes : guillemets

[Doc](../docs/eslint/rules/quotes.html) · options : `"double"` (défaut), `"single"`, `"backtick"` + objet `{ avoidEscape: true, allowTemplateLiterals: true }`

```js
quotes: [ "error", "double" ]
quotes: [ "error", "double", { avoidEscape: true } ] // autorise 'il a dit "oui"'
```

::: ko
```js
console.log('Demo ESLint')   // Strings must use doublequote
```
:::
::: ok
```js
console.log("Demo ESLint")
console.log(`Bonjour ${nom}`) // les template literals avec ${} sont toujours acceptés
```
:::

### semi : point-virgule

[Doc](../docs/eslint/rules/semi.html) · `"always"` (défaut) ou `"never"`

::: ko
```js
var i = 0;           // Extra semicolon
```
:::
::: ok
```js
const i = 0
```
:::

### indent : indentation

[Doc](../docs/eslint/rules/indent.html) · nombre d'espaces (défaut 4) ou `"tab"` · options : `{ SwitchCase: 1 }` pour indenter les `case` dans un `switch`

```js
indent: [ "error", 2 ]
indent: [ "error", "tab" ]
indent: [ "error", 2, { SwitchCase: 1 } ]
```

::: ko
```js
for (let y = 0; y < 10; y++) {
    console.log(y)     // Expected indentation of 2 spaces but found 4
}
```
:::

::: tip
`--fix` corrige l'indentation automatiquement. Dans VS Code, en bas à droite : « Espaces : 2 » → cliquer pour changer (ou convertir en tabulations).
:::

### eqeqeq : égalité stricte

[Doc](../docs/eslint/rules/eqeqeq.html) · `"always"` (défaut) ou `"smart"` · `[ "error", "always", { null: "ignore" } ]` autorise `== null`

::: ko
```js
if (i == 10) {}     // Expected '===' and instead saw '=='
if (i != 10) {}
```
:::
::: ok
```js
if (i === 10) {}
if (i !== 10) {}
```
:::

### no-var, prefer-const, no-const-assign

[no-var](../docs/eslint/rules/no-var.html) · [prefer-const](../docs/eslint/rules/prefer-const.html) · [no-const-assign](../docs/eslint/rules/no-const-assign.html)

::: ko
```js
var i = 0                 // no-var : Unexpected var, use let or const instead
let arr = [ 1, 2 ]        // prefer-const : 'arr' is never reassigned. Use 'const' instead
const x = 12
x = 13                    // no-const-assign : 'x' is constant
```
:::
::: ok
```js
const arr = [ 1, 2 ]
let compteur = 0
compteur = compteur + 1
```
:::

### no-unused-vars, no-undef

[no-unused-vars](../docs/eslint/rules/no-unused-vars.html) · [no-undef](../docs/eslint/rules/no-undef.html) · les deux sont déjà dans `js/recommended`

```js
"no-unused-vars": [ "error", { args: "none" } ]         // ignore les paramètres
"no-unused-vars": [ "error", { argsIgnorePattern: "^_" } ] // ignore _param
```

::: ko
```js
const i = 0               // 'i' is assigned a value but never used
for (y = 0; y < 10; y++)  // 'y' is not defined
```
:::

::: warning no-undef et les globales
`document`, `window`, `console`, `fetch` : il faut `languageOptions: { globals: globals.browser }`. `process`, `__dirname` : `globals.node`. `describe`, `test`, `expect` sans import (Vitest `globals: true`) : `globals.vitest`.
:::

### no-implicit-globals : pas de globales

[Doc](../docs/eslint/rules/no-implicit-globals.html)

::: warning Testé : sans effet dans un module ES
La doc le dit : *« Top-level declarations in ES modules and CommonJS modules create module-scoped variables »*. Avec la config par défaut (`sourceType: "module"`), `var a = 1` en haut du fichier **n'est pas signalé** (c'est pour ça qu'il n'apparaît pas dans les 27 erreurs du corrigé). Pour qu'elle agisse, le fichier doit être analysé comme un script :

```js
{
  files: [ "**/*.js" ],
  languageOptions: { sourceType: "script" },
  rules: { "no-implicit-globals": "error" },
}
```

Résultat : `Unexpected 'var' declaration in the global scope, wrap in an IIFE for a local variable, assign as global property for a global variable`. Par défaut elle ne vérifie que `var` et `function` (option `{ lexicalBindings: true }` pour aussi `let`, `const`, `class`).
:::

### array-bracket-spacing : espaces dans les crochets

[Doc](../docs/eslint/rules/array-bracket-spacing.html) · `"never"` (défaut) ou `"always"` + exceptions `{ singleValue, objectsInArrays, arraysInArrays }`

```js
"array-bracket-spacing": [ "error", "always", { arraysInArrays: false } ]
```

| Code | Résultat |
|---|---|
| `let tab = [ 1, 2, 3 ]` | ✅ OK |
| `let tab = [1, 2, 3]` | ❌ KO |
| `let arr = [[ 1 ], [ 2 ]]` | ✅ OK |
| `let arr = [ [ 1 ], [ 2 ] ]` | ❌ KO |
| `let arr = [[ 1, 2 ], 2, [ 3, 4 ], 4 ]` | ✅ OK (le dernier élément n'est pas un tableau → espace avant `]`) |
| `let vide = []` | ✅ OK (tableau vide) |

### object-curly-spacing : espaces dans les accolades

[Doc](../docs/eslint/rules/object-curly-spacing.html) · `"never"` (défaut) ou `"always"`, exceptions `{ arraysInObjects, objectsInObjects }`

::: ok
```js
const obj = { a: 1, b: 2 }
import { add, sub } from "./math.js"
```
:::

### brace-style : position des accolades

[Doc](../docs/eslint/rules/brace-style.html) · `"1tbs"` (défaut), `"stroustrup"`, `"allman"` · `{ allowSingleLine: true }`

::: ko
```js
if (i === 10)
{                        // Opening curly brace does not appear on the same line as controlling statement
  console.log("oui")
}
else                     // Closing curly brace does not appear on the same line as the subsequent block
{
  console.log("non")
}
```
:::
::: ok
```js
if (i === 10) {
  console.log("oui")
} else {
  console.log("non")
}
```
:::

::: warning Testé : les blocs sur une ligne
Avec `"1tbs"`, `function f() { return 1 }` donne 2 erreurs (*Statement inside of curly braces should be on next line*). Pour l'autoriser : `"brace-style": [ "error", "1tbs", { allowSingleLine: true } ]`.
:::

| Style | Forme |
|---|---|
| `1tbs` | `} else {` sur la même ligne |
| `stroustrup` | `}` puis `else {` à la ligne |
| `allman` | chaque accolade sur sa propre ligne |

### max-len : longueur de ligne

[Doc](../docs/eslint/rules/max-len.html) · `code` (défaut 80), `tabWidth` (défaut 4), `ignoreUrls`, `ignoreStrings`, `ignoreTemplateLiterals`, `ignoreComments`, `ignoreRegExpLiterals`, `ignorePattern`

```js
"max-len": [ "error", { code: 80 } ]
"max-len": [ "error", { code: 100, ignoreUrls: true, ignoreStrings: true } ]
```

Message : `This line has a length of 97. Maximum allowed is 80`. Pas corrigeable par `--fix` : il faut couper la ligne soi-même.

### linebreak-style : fins de ligne

[Doc](../docs/eslint/rules/linebreak-style.html) · `"unix"` (LF, défaut) ou `"windows"` (CRLF)

::: danger Piège Windows (vu dans le projet currency-converter : 353 erreurs)
Les fichiers créés sous Windows sont souvent en CRLF → `Expected linebreaks to be 'LF' but found 'CRLF'` sur **chaque ligne**. Solutions : `npx eslint . --fix` (testé : ça convertit), ou dans VS Code cliquer sur **CRLF** en bas à droite → **LF**, ou réglage `"files.eol": "\n"`.
:::

### id-match : nom des variables en snake_case

[Doc](../docs/eslint/rules/id-match.html) · `[ "error", "regex", { properties, classFields, onlyDeclarations, ignoreDestructuring } ]`

```js
"id-match": [ "error", "^[a-z_]+$", { properties: true, onlyDeclarations: true } ]
// autoriser aussi les chiffres :
"id-match": [ "error", "^[a-z][a-z0-9_]*$", { properties: true, onlyDeclarations: true } ]
```

::: ko
```js
const myVariable = 12    // Identifier 'myVariable' does not match the pattern '^[a-z_]+$'
```
:::
::: ok
```js
const my_variable = 12
```
:::

::: warning Conséquences
- `onlyDeclarations: true` : on ne vérifie que les déclarations, pas les usages (sinon `console.log` et `getElementById` seraient signalés).
- `^[a-z_]+$` refuse les chiffres (`user123`) et les MAJUSCULES (`MAX_SIZE`) : adapte la regex si besoin.
- Les noms de fonctions sont des déclarations : `function getRates()` est signalé.
:::

### camelcase : l'inverse (camelCase)

[Doc](../docs/eslint/rules/camelcase.html) · `{ properties: "always" | "never", ignoreDestructuring, ignoreImports, ignoreGlobals, allow: [] }`

```js
camelcase: [ "error", { properties: "always" } ]  // my_variable ❌, myVariable ✅
```

### Noms de fichiers : filename-rules/match

Pas une règle d'ESLint : plugin `@maintained/eslint-plugin-filename-rules` (voir [installation](eslint.html#plugins-exemple-filename-rules)).

```js
"filename-rules/match": [ "error", "snake_case" ]   // inDex.js ❌  index.js ✅  mon_fichier.js ✅
```

Message : `Filename 'inDex.js' does not match snake_case`.

## Autres règles utiles (au cas où)

Toutes validées avec ESLint 10.11. Clique sur le nom pour la doc hors-ligne.

### Espaces et mise en forme

| Consigne | Config |
|---|---|
| Virgule finale sur les listes multi-lignes | [`"comma-dangle"`](../docs/eslint/rules/comma-dangle.html)`: [ "error", "always-multiline" ]` (ou `"never"`) |
| Espace après la virgule, pas avant | [`"comma-spacing"`](../docs/eslint/rules/comma-spacing.html)`: [ "error", { before: false, after: true } ]` |
| Espace après `:` dans les objets | [`"key-spacing"`](../docs/eslint/rules/key-spacing.html)`: [ "error", { beforeColon: false, afterColon: true } ]` |
| Espaces autour de `if`, `else`, `return`… | [`"keyword-spacing"`](../docs/eslint/rules/keyword-spacing.html)`: [ "error", { before: true, after: true } ]` |
| Espace avant `{` d'un bloc | [`"space-before-blocks"`](../docs/eslint/rules/space-before-blocks.html)`: [ "error", "always" ]` |
| Espace avant `(` de fonction | [`"space-before-function-paren"`](../docs/eslint/rules/space-before-function-paren.html)`: [ "error", "never" ]` (ou `"always"`) |
| Espaces autour des opérateurs `a + b` | [`"space-infix-ops"`](../docs/eslint/rules/space-infix-ops.html)`: "error"` |
| Pas d'espace dans les parenthèses | [`"space-in-parens"`](../docs/eslint/rules/space-in-parens.html)`: [ "error", "never" ]` |
| Pas d'espace en fin de ligne | [`"no-trailing-spaces"`](../docs/eslint/rules/no-trailing-spaces.html)`: "error"` |
| Ligne vide à la fin du fichier | [`"eol-last"`](../docs/eslint/rules/eol-last.html)`: [ "error", "always" ]` |
| Max 1 ligne vide consécutive | [`"no-multiple-empty-lines"`](../docs/eslint/rules/no-multiple-empty-lines.html)`: [ "error", { max: 1 } ]` |
| Pas d'espaces multiples | [`"no-multi-spaces"`](../docs/eslint/rules/no-multi-spaces.html)`: "error"` |
| Interdire les tabulations | [`"no-tabs"`](../docs/eslint/rules/no-tabs.html)`: "error"` |
| Pas de mélange espaces/tabulations | [`"no-mixed-spaces-and-tabs"`](../docs/eslint/rules/no-mixed-spaces-and-tabs.html)`: "error"` |
| Parenthèses autour des paramètres de flèche `(x) => x` | [`"arrow-parens"`](../docs/eslint/rules/arrow-parens.html)`: [ "error", "always" ]` (ou `"as-needed"`) |
| Espaces autour de `=>` | [`"arrow-spacing"`](../docs/eslint/rules/arrow-spacing.html)`: "error"` |
| Espace après `//` | [`"spaced-comment"`](../docs/eslint/rules/spaced-comment.html)`: [ "error", "always" ]` |
| Guillemets sur les clés d'objet seulement si nécessaire | [`"quote-props"`](../docs/eslint/rules/quote-props.html)`: [ "error", "as-needed" ]` |
| Pas de lignes vides au début/fin des blocs | [`"padded-blocks"`](../docs/eslint/rules/padded-blocks.html)`: [ "error", "never" ]` |
| Opérateur en début de ligne quand on coupe | [`"operator-linebreak"`](../docs/eslint/rules/operator-linebreak.html)`: [ "error", "before" ]` |
| Pas d'espace dans `${ }` | [`"template-curly-spacing"`](../docs/eslint/rules/template-curly-spacing.html)`: [ "error", "never" ]` |

### Bonnes pratiques

| Consigne | Config |
|---|---|
| Accolades obligatoires pour `if`/`for` | [`curly`](../docs/eslint/rules/curly.html)`: [ "error", "all" ]` |
| Interdire `console.log` | [`"no-console"`](../docs/eslint/rules/no-console.html)`: "warn"` (option `{ allow: [ "warn", "error" ] }`) |
| Interdire `alert`, `confirm`, `prompt` | [`"no-alert"`](../docs/eslint/rules/no-alert.html)`: "error"` |
| Interdire `debugger` | [`"no-debugger"`](../docs/eslint/rules/no-debugger.html)`: "error"` |
| Interdire `eval` | [`"no-eval"`](../docs/eslint/rules/no-eval.html)`: "error"` |
| Template literal au lieu de `"a" + b` | [`"prefer-template"`](../docs/eslint/rules/prefer-template.html)`: "error"` |
| Fonctions fléchées en callback | [`"prefer-arrow-callback"`](../docs/eslint/rules/prefer-arrow-callback.html)`: "error"` |
| `function f() {}` plutôt que `const f = function` | [`"func-style"`](../docs/eslint/rules/func-style.html)`: [ "error", "declaration" ]` (ou `"expression"`) |
| Pas de `else` après un `return` | [`"no-else-return"`](../docs/eslint/rules/no-else-return.html)`: "error"` |
| Interdire `if (10 === x)` | [`yoda`](../docs/eslint/rules/yoda.html)`: "error"` |
| `default` obligatoire dans un `switch` | [`"default-case"`](../docs/eslint/rules/default-case.html)`: "error"` |
| Pas de variable qui en masque une autre | [`"no-shadow"`](../docs/eslint/rules/no-shadow.html)`: "error"` |
| Pas d'utilisation avant déclaration | [`"no-use-before-define"`](../docs/eslint/rules/no-use-before-define.html)`: "error"` |
| Pas de nombres magiques | [`"no-magic-numbers"`](../docs/eslint/rules/no-magic-numbers.html)`: [ "error", { ignore: [ 0, 1 ] } ]` |
| `obj.cle` plutôt que `obj["cle"]` | [`"dot-notation"`](../docs/eslint/rules/dot-notation.html)`: "error"` |
| Raccourcis `{ a }` au lieu de `{ a: a }` | [`"object-shorthand"`](../docs/eslint/rules/object-shorthand.html)`: "error"` |
| Interdire `i++` | [`"no-plusplus"`](../docs/eslint/rules/no-plusplus.html)`: "error"` |
| Une déclaration par `const`/`let` | [`"one-var"`](../docs/eslint/rules/one-var.html)`: [ "error", "never" ]` |
| Pas de ternaire imbriqué | [`"no-nested-ternary"`](../docs/eslint/rules/no-nested-ternary.html)`: "error"` |
| Pas de fonction vide | [`"no-empty-function"`](../docs/eslint/rules/no-empty-function.html)`: "error"` |
| Pas de modification des paramètres | [`"no-param-reassign"`](../docs/eslint/rules/no-param-reassign.html)`: "error"` |
| `return` cohérent | [`"consistent-return"`](../docs/eslint/rules/consistent-return.html)`: "error"` |
| `async` doit contenir `await` | [`"require-await"`](../docs/eslint/rules/require-await.html)`: "error"` |
| Un seul import par module | [`"no-duplicate-imports"`](../docs/eslint/rules/no-duplicate-imports.html)`: "error"` |
| Constructeur avec majuscule `new Date()` | [`"new-cap"`](../docs/eslint/rules/new-cap.html)`: "error"` |
| `parseInt(x, 10)` avec la base | [`radix`](../docs/eslint/rules/radix.html)`: "error"` |

### Limites de taille / complexité

| Consigne | Config |
|---|---|
| Max N paramètres | [`"max-params"`](../docs/eslint/rules/max-params.html)`: [ "error", 3 ]` |
| Max N niveaux d'imbrication | [`"max-depth"`](../docs/eslint/rules/max-depth.html)`: [ "error", 3 ]` |
| Max N lignes par fichier | [`"max-lines"`](../docs/eslint/rules/max-lines.html)`: [ "error", 300 ]` |
| Max N lignes par fonction | [`"max-lines-per-function"`](../docs/eslint/rules/max-lines-per-function.html)`: [ "error", 50 ]` |
| Max N instructions par fonction | [`"max-statements"`](../docs/eslint/rules/max-statements.html)`: [ "error", 15 ]` |
| Complexité cyclomatique | [`complexity`](../docs/eslint/rules/complexity.html)`: [ "error", 10 ]` |
| Longueur minimum des noms | [`"id-length"`](../docs/eslint/rules/id-length.html)`: [ "error", { min: 2, exceptions: [ "i" ] } ]` |
| Max callbacks imbriqués | [`"max-nested-callbacks"`](../docs/eslint/rules/max-nested-callbacks.html)`: [ "error", 3 ]` |
| Une classe par fichier | [`"max-classes-per-file"`](../docs/eslint/rules/max-classes-per-file.html)`: [ "error", 1 ]` |
