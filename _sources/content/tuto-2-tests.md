---
title: "Tuto 2 : mettre en place des tests unitaires"
lead: "Consigne : « Mettre en place des tests unitaires simples ». Résultat attendu : npm run test:run affiche tous les tests en vert. Ce tuto donne 11 exemples très simples (testés : 25 tests, tous verts, 100 % de couverture)."
---

<div class="progress"><span></span></div>
<p class="small muted">Progression : <span id="progress-label"></span> · <a href="#" id="reset-checks">tout décocher</a></p>

## Le principe en 30 secondes

- Tu as un fichier avec des **fonctions exportées** : `src/exemples.js`.
- Tu crées **à côté** un fichier qui porte le **même nom + `.test.js`** : `src/exemples.test.js`.
- Dans ce fichier, tu appelles tes fonctions et tu dis ce que tu attends : `expect(double(4)).toBe(8)`.
- Vitest lance tous les fichiers `*.test.js` et te dit ce qui passe (✓) ou non (×).

## Étape 1 : installer Vitest (avec réseau)

- [ ] Installer :

```bash
npm install -D vitest @vitest/coverage-v8
```

`@vitest/coverage-v8` sert à la couverture de code : installe-le maintenant, hors-ligne ce sera impossible.

## Étape 2 : ajouter les commandes dans package.json

- [ ] Dans `"scripts"` :

```json
"test": "vitest",
"test:run": "vitest run",
"coverage": "vitest run --coverage"
```

| Commande | Effet |
|---|---|
| `npm test` | lance les tests et **reste ouvert** : relance à chaque sauvegarde (`q` pour quitter) |
| `npm run test:run` | lance les tests **une fois** |
| `npm run coverage` | + le pourcentage de code testé |

## Étape 3 : créer le fichier de code

- [ ] Créer **`src/exemples.js`**. Chaque fonction doit avoir **`export`** devant, sinon le test ne peut pas l'utiliser.

```text
mon-projet/
└── src/
    ├── exemples.js        ← ICI
    └── exemples.test.js   ← et ça à l'étape 4
```

Le fichier complet est en bas de page ([code complet](#les-fichiers-complets)). On le voit fonction par fonction ci-dessous.

## Étape 4 : créer le fichier de test

- [ ] Créer **`src/exemples.test.js`** et commencer par les imports :

```js [src/exemples.test.js]
import { describe, test, expect, vi, afterEach } from "vitest"
import {
  double, est_pair, dire_bonjour, somme, maximum, garder_pairs,
  creer_personne, diviser, attendre, temperature,
} from "./exemples.js"
```

- La 1re ligne importe les outils de Vitest.
- La 2e importe **tes** fonctions. Le chemin `"./exemples.js"` est relatif au fichier de test (même dossier = `./`).

Ensuite, ajoute les exemples ci-dessous, les uns après les autres.

## Les 11 exemples

### Exemple 1 : le plus simple (un nombre)

```js [src/exemples.js]
export function double(n) {
  return n * 2
}
```

```js [src/exemples.test.js]
test("double(4) vaut 8", () => {
  expect(double(4)).toBe(8)
})
```

Lecture : « je teste que `double(4)` **vaut** 8 ». `test("nom", () => { ... })` : le nom décrit ce qu'on vérifie.

### Exemple 2 : plusieurs cas regroupés (describe)

```js [src/exemples.test.js]
describe("double", () => {
  test("nombre négatif", () => {
    expect(double(-3)).toBe(-6)
  })
  test("zéro", () => {
    expect(double(0)).toBe(0)
  })
  test("nombre à virgule", () => {
    expect(double(0.1)).toBeCloseTo(0.2)
  })
})
```

`describe` range les tests d'une même fonction ensemble. Pour les nombres à virgule, `toBeCloseTo` (à cause des arrondis : `0.1 + 0.2` ne vaut pas exactement `0.3` en JavaScript).

### Exemple 3 : un vrai / faux (booléen)

```js [src/exemples.js]
export function est_pair(n) {
  return n % 2 === 0
}
```

```js [src/exemples.test.js]
describe("est_pair", () => {
  test("4 est pair", () => {
    expect(est_pair(4)).toBe(true)
  })
  test("7 n'est pas pair", () => {
    expect(est_pair(7)).toBe(false)
  })
  test("0 est pair", () => {
    expect(est_pair(0)).toBeTruthy()
  })
})
```

### Exemple 4 : du texte (chaîne)

```js [src/exemples.js]
export function dire_bonjour(prenom) {
  return `Bonjour ${prenom} !`
}
```

```js [src/exemples.test.js]
describe("dire_bonjour", () => {
  test("texte exact", () => {
    expect(dire_bonjour("Léa")).toBe("Bonjour Léa !")
  })
  test("contient le prénom", () => {
    expect(dire_bonjour("Tom")).toContain("Tom")
  })
  test("commence par Bonjour", () => {
    expect(dire_bonjour("Max")).toMatch(/^Bonjour/)
  })
})
```

### Exemple 5 : le même test avec plusieurs données (test.each)

```js [src/exemples.js]
export function somme(nombres) {
  let total = 0
  for (const n of nombres) {
    total = total + n
  }
  return total
}
```

```js [src/exemples.test.js]
test.each([
  [[ 1, 2, 3 ], 6 ],
  [[ 10, -5 ], 5 ],
  [[], 0 ],
])("somme(%j) = %i", (tableau, attendu) => {
  expect(somme(tableau)).toBe(attendu)
})
```

Chaque ligne `[ entrée, résultat attendu ]` devient un test. `%j` et `%i` sont remplacés dans le nom : `somme([1,2,3]) = 6`.

### Exemple 6 : un résultat « vide » (null)

```js [src/exemples.js]
export function maximum(nombres) {
  if (nombres.length === 0) {
    return null
  }
  return Math.max(...nombres)
}
```

```js [src/exemples.test.js]
describe("maximum", () => {
  test("renvoie le plus grand", () => {
    expect(maximum([ 3, 9, 2 ])).toBe(9)
  })
  test("tableau vide -> null", () => {
    expect(maximum([])).toBeNull()
  })
})
```

Pense toujours au **cas limite** : tableau vide, zéro, texte vide…

### Exemple 7 : un tableau (toEqual, PAS toBe)

```js [src/exemples.js]
export function garder_pairs(nombres) {
  return nombres.filter((n) => est_pair(n))
}
```

```js [src/exemples.test.js]
describe("garder_pairs", () => {
  test("garde 2 et 4", () => {
    expect(garder_pairs([ 1, 2, 3, 4 ])).toEqual([ 2, 4 ])
  })
  test("longueur du résultat", () => {
    expect(garder_pairs([ 2, 4, 6 ])).toHaveLength(3)
  })
  test("ne modifie pas le tableau d'origine", () => {
    const origine = [ 1, 2 ]
    garder_pairs(origine)
    expect(origine).toEqual([ 1, 2 ])
  })
})
```

::: danger Le piège n°1
`expect([ 2, 4 ]).toBe([ 2, 4 ])` **échoue** (testé : *expected [ 2, 4 ] to be [ 2, 4 ] // Object.is equality*), car ce sont deux tableaux différents en mémoire. Tableaux et objets → **`toEqual`**.
:::

### Exemple 8 : un objet

```js [src/exemples.js]
export function creer_personne(nom, age) {
  return { nom, age, majeur: age >= 18 }
}
```

```js [src/exemples.test.js]
describe("creer_personne", () => {
  test("objet complet", () => {
    expect(creer_personne("Ana", 20))
      .toEqual({ nom: "Ana", age: 20, majeur: true })
  })
  test("mineur", () => {
    expect(creer_personne("Léo", 12)).toHaveProperty("majeur", false)
  })
})
```

### Exemple 9 : une erreur (toThrow)

```js [src/exemples.js]
export function diviser(a, b) {
  if (b === 0) {
    throw new Error("Division par zéro")
  }
  return a / b
}
```

```js [src/exemples.test.js]
describe("diviser", () => {
  test("10 / 2 = 5", () => {
    expect(diviser(10, 2)).toBe(5)
  })
  test("division par zéro -> erreur", () => {
    expect(() => diviser(1, 0)).toThrow("Division par zéro")
  })
})
```

::: warning Le piège n°2
Pour `toThrow`, il faut une **flèche** : `expect(() => diviser(1, 0))`. Sans la flèche, l'erreur arrive avant `expect` et le test plante.
:::

### Exemple 10 : une fonction asynchrone (async / await)

```js [src/exemples.js]
export async function attendre(valeur) {
  await new Promise((resolve) => setTimeout(resolve, 10))
  return valeur
}
```

```js [src/exemples.test.js]
test("attendre renvoie la valeur", async () => {
  const resultat = await attendre(42)
  expect(resultat).toBe(42)
})
```

Si la fonction est `async`, le test aussi (`async () =>`) et on met `await` devant l'appel.

### Exemple 11 : simuler internet (mock de fetch)

À l'examen tu es **hors-ligne** : un test qui appelle une vraie API échoue. On remplace `fetch` par une fausse version.

```js [src/exemples.js]
export async function temperature(ville) {
  try {
    const reponse = await fetch(`https://api.meteo.test/${ville}`)
    if (!reponse.ok) {
      throw new Error("Erreur HTTP")
    }
    const data = await reponse.json()
    return data.temperature
  } catch (erreur) {
    console.error(erreur)
    return null
  }
}
```

```js [src/exemples.test.js]
describe("temperature (fetch simulé)", () => {
  afterEach(() => {
    vi.unstubAllGlobals()   // remet le vrai fetch
    vi.restoreAllMocks()    // remet le vrai console.error
  })

  test("renvoie la température", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ temperature: 21 }),
    }))
    expect(await temperature("neuchatel")).toBe(21)
  })

  test("renvoie null si l'API répond une erreur", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }))
    vi.spyOn(console, "error").mockImplementation(() => {})
    expect(await temperature("neuchatel")).toBeNull()
    expect(console.error).toHaveBeenCalledOnce()
  })
})
```

- `vi.fn().mockResolvedValue({...})` : une fausse fonction qui renvoie ce qu'on veut.
- `vi.stubGlobal("fetch", ...)` : remplace le `fetch` du navigateur par la fausse version.
- `vi.spyOn(console, "error")` : surveille `console.error` (et l'empêche d'afficher).

## Étape 5 : lancer les tests

- [ ] Lancer :

```bash
npm run test:run
```

Ce que tu dois voir (testé) :

```text
 Test Files  1 passed (1)
      Tests  25 passed (25)
```

Pour voir chaque test un par un :

```bash
npx vitest run --reporter=verbose
```

Si un test échoue, Vitest affiche `×`, le nom du test, et la différence (testé en changeant volontairement `toBe(0)` en `toBe(1)`) :

```text
     × zéro 2ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
AssertionError: expected +0 to be 1 // Object.is equality
- Expected
+ Received
      Tests  1 failed | 24 passed (25)
```

## Étape 6 : la couverture de code

- [ ] Dans `vite.config.js` (à créer à la racine s'il n'existe pas), exclure `main.js` qui n'est pas testable :

```js [vite.config.js]
import { defineConfig, coverageConfigDefaults } from "vitest/config"

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      include: [ "src/**/*.js" ],
      exclude: [ "src/main.js", ...coverageConfigDefaults.exclude ],
    },
  },
})
```

- [ ] Lancer :

```bash
npm run coverage
```

Tu vois un tableau avec le pourcentage de lignes testées par fichier (les fichiers à 100 % peuvent être masqués du tableau texte). Le rapport détaillé s'ouvre dans le navigateur : **`coverage/index.html`** (lignes rouges = jamais exécutées par un test).

- [ ] Supprimer `src/counter.js` s'il n'est plus utilisé, sinon il apparaît à 0 %.
- [ ] Ajouter `coverage/` au `.gitignore`.

## Aide-mémoire des vérifications

| Je veux vérifier… | J'écris |
|---|---|
| un nombre, un texte, un booléen exact | `expect(x).toBe(valeur)` |
| un tableau ou un objet | `expect(x).toEqual(valeur)` |
| un nombre à virgule | `expect(x).toBeCloseTo(0.3)` |
| vrai / faux « au sens large » | `toBeTruthy()` / `toBeFalsy()` |
| `null` / `undefined` | `toBeNull()` / `toBeUndefined()` |
| plus grand / plus petit | `toBeGreaterThan(5)` / `toBeLessThan(5)` |
| contient un élément / un mot | `toContain(x)` |
| longueur | `toHaveLength(3)` |
| une propriété d'objet | `toHaveProperty("nom", "Ana")` |
| un motif de texte | `toMatch(/regex/)` |
| le type | `toBeTypeOf("number")` |
| une erreur | `expect(() => f()).toThrow("message")` |
| le contraire | `.not.` : `expect(x).not.toBe(0)` |

Plus de détails : [3. Vitest](vitest.html).

## Idées de tests « simples » pour l'examen

Pour chaque fonction, teste au moins :

- [ ] un cas normal
- [ ] zéro / tableau vide / texte vide
- [ ] un nombre négatif
- [ ] un mauvais type (`"a"` au lieu d'un nombre) si la fonction le gère
- [ ] l'erreur si la fonction peut en lever une

## Les fichiers complets

@@include projets/tuto/src/exemples.js@@

@@include projets/tuto/src/exemples.test.js@@

Suite : [Tuto 3 : la documentation →](tuto-3-doc.html)
