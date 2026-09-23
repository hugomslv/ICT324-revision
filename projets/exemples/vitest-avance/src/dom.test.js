// @vitest-environment jsdom
import { test, expect } from "vitest"
import { render_title } from "./api.js"

test("affiche un titre dans le DOM", () => {
  document.body.innerHTML = "<div id=\"app\"></div>"
  const app = document.querySelector("#app")
  render_title(app, "Salut")
  expect(app.querySelector("h1").textContent).toBe("Salut")
  expect(app.querySelector("h1").classList.contains("title")).toBe(true)
})
