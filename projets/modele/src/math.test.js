import { describe, test, it, expect } from "vitest"
// Le test est DANS src/ -> chemin relatif "./math.js" (pas "./src/math.js")
import { add, sub, rotate } from "./math.js"

describe("add", () => {
  test("1 + 2 = 3", () => {
    expect(add(1, 2)).toBe(3)
  })
  test("0.1 + 0.2 ≈ 0.3 (flottants)", () => {
    expect(add(0.1, 0.2)).toBeCloseTo(0.3)
  })
  test("paramètre invalide -> 'error'", () => {
    expect(add(1, "a")).toBe("error")
  })
})

describe("sub", () => {
  it("1 - 2 = -1", () => {
    expect(sub(1, 2)).toBe(-1)
  })
  // test.each : un même test avec plusieurs jeux de données
  test.each([
    [ 5, 3, 2 ],
    [ 0, 0, 0 ],
    [ -1, -1, 0 ],
  ])("sub(%i, %i) = %i", (a, b, expected) => {
    expect(sub(a, b)).toBe(expected)
  })
})

describe("rotate", () => {
  test("[1,2,3,4] -> [2,3,4,1]", () => {
    // toEqual pour comparer le CONTENU d'un tableau / objet
    expect(rotate([ 1, 2, 3, 4 ])).toEqual([ 2, 3, 4, 1 ])
  })
  test("tableau vide", () => {
    expect(rotate([])).toEqual([])
  })
  test("pas un tableau -> 'error'", () => {
    expect(rotate("abc")).toBe("error")
  })
  test("tableau imbriqué -> 'error'", () => {
    expect(rotate([[ 1 ], 2 ])).toBe("error")
  })
})
