---
title: "3. Vitest : tests unitaires"
lead: "Vitest exécute des fonctions de test qui vérifient que ton code renvoie ce qui est attendu. Il utilise la config de Vite, et son API est la même que Jest."
---

Versions : Vitest **2.1** (projet `vitest`), **3.2** (`currency-converter`), **4.1** (`vite_lint_test_doc`), **5.0** (actuelle, utilisée ici). L'API de base est identique. Doc hors-ligne : [Vitest](../docs/vitest/index.html), [expect](../docs/vitest/api/expect.html), [vi](../docs/vitest/api/vi.html).

## Installer et lancer

```bash
npm install -D vitest @vitest/coverage-v8
```

```json [package.json]
"scripts": {
  "test": "vitest",
  "test:run": "vitest run",
  "coverage": "vitest run --coverage"
}
```

| Commande | Effet |
|---|---|
| `npx vitest` | mode **watch** : relance à chaque sauvegarde (`q` pour quitter) |
| `npx vitest run` | une seule exécution puis sortie (code 1 si échec) |
| `npx vitest run math` | seulement les fichiers dont le nom contient `math` |
| `npx vitest run -t "add"` | seulement les tests dont le **nom** contient `add` |
| `npx vitest run --coverage` | + rapport de couverture |
| `npx vitest run --reporter=verbose` | affiche chaque test |
| `npx vitest run --reporter=json --outputFile=test-results.json` | résultats dans un fichier (comme `test-results.json` du prof) |
| `npx vitest --ui` | interface web (paquet `@vitest/ui`) |

::: warning Noms de fichiers
Vitest trouve seul les fichiers `*.test.js` et `*.spec.js` (aussi `.mjs`, `.ts`…). Un fichier `math_test.js` ou `tests.js` est **ignoré** → *No test files found*.
:::

## Premier test

```js [src/math.js]
export function add(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    return "error"
  }
  return a + b
}
```

```js [src/math.test.js]
import { test, expect } from "vitest"
import { add } from "./math.js"

test("1 + 2 = 3", () => {
  expect(add(1, 2)).toBe(3)
})

test("paramètre invalide → 'error'", () => {
  expect(add(1, "a")).toBe("error")
})
```

Sortie :

```text
 ✓ src/math.test.js (2 tests) 1ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
```

::: tip Structure d'un test : AAA
**Arrange** (préparer les données) → **Act** (appeler la fonction) → **Assert** (`expect`). Un test = un comportement. Le nom décrit le comportement attendu.
:::

## Organiser : describe, it, each, skip, only

```js
import { describe, test, it, expect } from "vitest"
import { add, sub } from "./math.js"

describe("add", () => {                 // groupe
  test("nombres positifs", () => {
    expect(add(1, 2)).toBe(3)
  })
  it("nombres négatifs", () => {        // it = alias de test
    expect(add(-1, -2)).toBe(-3)
  })
})

// même test avec plusieurs jeux de données
test.each([
  [ 5, 3, 2 ],
  [ 0, 0, 0 ],
  [ -1, -1, 0 ],
])("sub(%i, %i) = %i", (a, b, expected) => {
  expect(sub(a, b)).toBe(expected)
})

test.skip("pas encore prêt", () => {})  // ignoré
test.todo("tester la division")         // à faire
// test.only(...)  → n'exécute QUE ce test dans le fichier
```

## Les matchers (expect)

| Matcher | Vérifie | Exemple |
|---|---|---|
| `toBe(v)` | égalité stricte `===` (nombres, chaînes, booléens) | `expect(add(1, 2)).toBe(3)` |
| `toEqual(v)` | même **contenu** (tableaux, objets) | `expect(rotate([ 1, 2 ])).toEqual([ 2, 1 ])` |
| `toStrictEqual(v)` | comme `toEqual` + types et `undefined` stricts | |
| `toBeCloseTo(n, d)` | flottants (`0.1 + 0.2`) | `expect(0.1 + 0.2).toBeCloseTo(0.3)` |
| `toBeTruthy()` / `toBeFalsy()` | valeur vraie / fausse | |
| `toBeNull()` / `toBeUndefined()` / `toBeDefined()` | | |
| `toBeNaN()` | | |
| `toBeGreaterThan(n)` / `toBeLessThanOrEqual(n)` … | comparaisons | `expect(x).toBeGreaterThan(5)` |
| `toBeTypeOf("number")` | `typeof` | `expect(rates).toBeTypeOf("object")` |
| `toBeInstanceOf(Classe)` | `instanceof` | |
| `toContain(x)` | élément dans un tableau / sous-chaîne | `expect([ 1, 2 ]).toContain(2)` |
| `toHaveLength(n)` | `.length` | |
| `toHaveProperty("a.b", v?)` | propriété (chemin avec des points) | `expect(rates).toHaveProperty("eur")` |
| `toMatch(/regex/)` | chaîne correspond | |
| `toThrow("msg")` | lève une erreur | voir plus bas |
| `.not.xxx` | négation | `expect(x).not.toBe(0)` |
| `.resolves` / `.rejects` | promesses | `await expect(p).resolves.toBe(1)` |
| `toHaveBeenCalled()` / `toHaveBeenCalledOnce()` | un mock a été appelé | |
| `toHaveBeenCalledTimes(n)` / `toHaveBeenCalledWith(...)` | | |

::: danger toBe vs toEqual
`expect([ 1, 2 ]).toBe([ 1, 2 ])` **échoue** : deux tableaux différents en mémoire. Pour tableaux et objets → `toEqual`.
:::

### Tester une erreur (toThrow)

```js
export function divide(a, b) {
  if (b === 0) throw new Error("Division par zéro")
  return a / b
}

test("division par zéro", () => {
  // ⚠️ il faut passer une FONCTION, pas le résultat
  expect(() => divide(1, 0)).toThrow("Division par zéro")
  expect(() => divide(1, 0)).toThrowError(/zéro/)
})
```

### Tester du code asynchrone

```js
test("async", async () => {
  const rates = await getLatestRates("eur")
  expect(rates).toHaveProperty("eur")
})

test("promesse rejetée", async () => {
  await expect(fonctionQuiEchoue()).rejects.toThrow("HTTP 404")
})
```

## Hooks : avant / après

```js
import { beforeAll, beforeEach, afterEach, afterAll } from "vitest"

beforeAll(() => { /* une fois avant tous les tests du fichier */ })
beforeEach(() => { /* avant CHAQUE test */ })
afterEach(() => { /* après chaque test : nettoyer les mocks */ })
afterAll(() => { /* une fois à la fin */ })
```

## Mocks : simuler fetch, console…

Indispensable **hors-ligne** : un test qui appelle vraiment une API échoue sans réseau. Exemple testé :

@@include projets/exemples/vitest-avance/src/api.test.js@@

| Outil | Rôle |
|---|---|
| `vi.fn()` | fausse fonction qui enregistre ses appels |
| `.mockReturnValue(v)` | elle renvoie `v` |
| `.mockResolvedValue(v)` | elle renvoie une promesse résolue avec `v` (parfait pour `fetch`) |
| `.mockRejectedValue(err)` | promesse rejetée |
| `.mockImplementation(fn)` | code personnalisé |
| `vi.spyOn(obj, "methode")` | espionne une vraie méthode (ex : `console.error`) |
| `vi.stubGlobal("fetch", mock)` | remplace une globale |
| `vi.unstubAllGlobals()` | remet les globales d'origine |
| `vi.restoreAllMocks()` | restaure les méthodes espionnées |

Le prof, dans `currency-converter` :

```js
vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }))
vi.spyOn(console, "error").mockImplementation(() => {}) // silence la console
const rates = await getLatestRates("eur")
expect(rates).toBeNull()
expect(console.error).toHaveBeenCalledOnce()
```

## Tester le DOM (jsdom)

Par défaut les tests tournent dans Node (pas de `document`). Pour du code qui manipule la page :

```bash
npm install -D jsdom     # avec réseau !
```

@@include projets/exemples/vitest-avance/src/dom.test.js@@

Ou pour tous les tests : `test: { environment: "jsdom" }` dans la config.

## Configuration

Dans `vitest.config.js` **ou** dans le bloc `test` de `vite.config.js` :

```js [vitest.config.js]
import { defineConfig, coverageConfigDefaults } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,           // describe/test/expect sans import
    environment: "node",     // ou "jsdom"
    include: [ "src/**/*.test.js" ],
    coverage: {
      provider: "v8",
      include: [ "src/**/*.js" ],
      exclude: [ "src/main.js", ...coverageConfigDefaults.exclude ],
      reporter: [ "text", "html", "json" ],
      reportsDirectory: "./coverage",
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
})
```

::: warning globals: true et ESLint
Si tu utilises `globals: true` sans importer `test`/`expect`, ESLint dira `'test' is not defined`. Ajoute dans `eslint.config.js` : `{ files: [ "**/*.test.js" ], languageOptions: { globals: globals.vitest } }`. Le plus simple reste d'importer depuis `"vitest"`.
:::

## Couverture de code (coverage)

```bash
npx vitest run --coverage
```

```text
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
math.js   |   91.66 |     92.3 |     100 |    90.9 | 33
```

- **Stmts** : instructions exécutées · **Branch** : chaque `if`/`else` pris dans les deux sens · **Funcs** : fonctions appelées · **Lines** : lignes exécutées.
- *Uncovered Line #s* : les lignes jamais exécutées → écris un test qui y passe.
- Le rapport HTML est dans `coverage/index.html` (exemples réels : [projet modèle](../projets/modele/coverage/index.html), [projet vitest du cours](../projets/cours/2-vitest/coverage/index.html)).
- `coverage.include` compte aussi les fichiers qu'aucun test n'importe (à 0 %).
- Ajoute `coverage/` au `.gitignore` et aux `globalIgnores` d'ESLint.

::: danger Hors-ligne
Si `@vitest/coverage-v8` n'est pas installé, Vitest propose de l'installer : impossible sans réseau. Installe-le pendant la phase connectée, **même version** que `vitest`.
:::

## Que tester ? (idées pour l'examen)

- Le cas normal (`add(1, 2)`)
- Les zéros et négatifs (`add(-1, -0)`, `add(-1.0, 1.0)`)
- Les flottants (`toBeCloseTo`)
- Les mauvais types (`add(1, "a")`, `add("a", [ 1 ])`) → `"error"`
- Tableau vide, un seul élément, tableau imbriqué (`rotate([])`, `rotate([ 1 ])`, `rotate([[ 1 ], 2 ])`)
- Les chaînes : majuscules / minuscules, espaces, caractères spéciaux (`"user.name@domain.tld"`)
- Les erreurs levées (`toThrow`)
- Les appels réseau → mocker `fetch`
