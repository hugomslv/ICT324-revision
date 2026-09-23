import { describe, test, expect, vi, afterEach } from "vitest"
import {
  double, est_pair, dire_bonjour, somme, maximum, garder_pairs,
  creer_personne, diviser, attendre, temperature,
} from "./exemples.js"

// 1. Le plus simple : un nombre -> toBe
test("double(4) vaut 8", () => {
  expect(double(4)).toBe(8)
})

// 2. Plusieurs cas dans un describe
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

// 3. Un booléen -> toBe(true) / toBeTruthy
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

// 4. Une chaîne -> toBe, toContain, toMatch
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

// 5. test.each : le même test avec plusieurs données
test.each([
  [[ 1, 2, 3 ], 6 ],
  [[ 10, -5 ], 5 ],
  [[], 0 ],
])("somme(%j) = %i", (tableau, attendu) => {
  expect(somme(tableau)).toBe(attendu)
})

// 6. null / undefined
describe("maximum", () => {
  test("renvoie le plus grand", () => {
    expect(maximum([ 3, 9, 2 ])).toBe(9)
  })
  test("tableau vide -> null", () => {
    expect(maximum([])).toBeNull()
  })
})

// 7. Un tableau -> toEqual (PAS toBe !)
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

// 8. Un objet -> toEqual, toHaveProperty
describe("creer_personne", () => {
  test("objet complet", () => {
    expect(creer_personne("Ana", 20))
      .toEqual({ nom: "Ana", age: 20, majeur: true })
  })
  test("mineur", () => {
    expect(creer_personne("Léo", 12)).toHaveProperty("majeur", false)
  })
})

// 9. Une erreur -> toThrow (avec une FONCTION fléchée)
describe("diviser", () => {
  test("10 / 2 = 5", () => {
    expect(diviser(10, 2)).toBe(5)
  })
  test("division par zéro -> erreur", () => {
    expect(() => diviser(1, 0)).toThrow("Division par zéro")
  })
})

// 10. Asynchrone -> async / await
test("attendre renvoie la valeur", async () => {
  const resultat = await attendre(42)
  expect(resultat).toBe(42)
})

// 11. Simuler fetch (pas de réseau pendant l'examen !)
describe("temperature (fetch simulé)", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
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
