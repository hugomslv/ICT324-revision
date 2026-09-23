import { describe, test, expect, vi, afterEach, beforeEach } from "vitest"
import { get_rate, divide } from "./api.js"

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("get_rate", () => {
  test("renvoie le taux (fetch simulé)", async () => {
    const fake_fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ eur: { chf: 0.94 } }),
    })
    vi.stubGlobal("fetch", fake_fetch)
    await expect(get_rate("eur", "chf")).resolves.toBe(0.94)
    expect(fake_fetch).toHaveBeenCalledOnce()
    expect(fake_fetch).toHaveBeenCalledWith("https://api.test/eur.json")
  })
  test("lève une erreur si HTTP KO", async () => {
    const fake_fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 })
    vi.stubGlobal("fetch", fake_fetch)
    await expect(get_rate("eur", "chf")).rejects.toThrow("HTTP 404")
  })
})

describe("divide", () => {
  test("toThrow a besoin d'une fonction", () => {
    expect(() => divide(1, 0)).toThrow("Division par zéro")
    expect(() => divide(1, 0)).toThrowError(/zéro/)
  })
  test("matchers divers", () => {
    expect(divide(1, 3)).toBeCloseTo(0.333, 3)
    expect(divide(4, 2)).toBeTypeOf("number")
    expect([ 1, 2, 3 ]).toContain(2)
    expect([ 1, 2, 3 ]).toHaveLength(3)
    expect({ a: { b: 1 } }).toHaveProperty("a.b", 1)
    expect("bonjour").toMatch(/jour/)
    expect({ a: 1, b: undefined }).toEqual({ a: 1 })
    expect({ a: 1, b: undefined }).not.toStrictEqual({ a: 1 })
    expect(NaN).toBeNaN()
    expect(null).toBeNull()
    expect(0).toBeFalsy()
  })
  const spy_target = { log: (m) => m }
  beforeEach(() => {
    vi.spyOn(spy_target, "log")
  })
  test("spyOn", () => {
    spy_target.log("x")
    expect(spy_target.log).toHaveBeenCalledTimes(1)
  })
})
