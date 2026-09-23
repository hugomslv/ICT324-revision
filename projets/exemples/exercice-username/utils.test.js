import { describe, test, expect } from "vitest"
import { clean_username } from "./utils.js"

describe("clean_username", () => {
  test.each([
    [ "username", "username" ],
    [ "USERNAME", "username" ],
    [ "username@domain.tld", "username" ],
    [ "user.name@domain.tld", "user.name" ],
    [ "user_name", "user_name" ],
    [ "user123", "user123" ],
    [ "user.name.extra@domain.tld", "user.name.extra" ],
    [ "  Espace  ", "espace" ],
  ])("%s → %s", (entree, attendu) => {
    expect(clean_username(entree)).toBe(attendu)
  })

  const invalides = [ "", "   ", 42, null, undefined ]
  test.each(invalides)("entrée invalide %j → 'error'", (entree) => {
    expect(clean_username(entree)).toBe("error")
  })

  test("un tableau n'est pas accepté", () => {
    expect(clean_username([ "a" ])).toBe("error")
  })
})
