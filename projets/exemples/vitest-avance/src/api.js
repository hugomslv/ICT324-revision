export async function get_rate(from, to) {
  const res = await fetch(`https://api.test/${from}.json`)
  if (!res.ok) throw new Error("HTTP " + res.status)
  const data = await res.json()
  return data[from][to]
}
export function divide(a, b) {
  if (b === 0) throw new Error("Division par zéro")
  return a / b
}
export function render_title(el, text) {
  el.innerHTML = `<h1 class="title">${text}</h1>`
}
