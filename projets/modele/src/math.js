/**
 * @file Fonctions mathématiques de base.
 * @module math
 * @author Hugo
 * @version 1.0.0
 */

/**
 * Additionne deux nombres.
 * @param {number} a - Premier nombre.
 * @param {number} b - Second nombre.
 * @returns {number|string} La somme, ou "error" si un paramètre n'est pas
 * un nombre.
 * @example
 * add(1, 2) // 3
 * add(1, "a") // "error"
 */
export function add(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    return "error"
  }
  return a + b
}

/**
 * Soustrait deux nombres.
 * @param {number} a - Premier nombre.
 * @param {number} b - Nombre à soustraire.
 * @returns {number|string} La différence, ou "error".
 */
export function sub(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    return "error"
  }
  return a - b
}

/**
 * Fait tourner un tableau de n positions vers la gauche.
 * @param {number[]} arr - Tableau de nombres.
 * @param {number} [n=1] - Nombre de positions.
 * @returns {number[]|string} Nouveau tableau, ou "error".
 * @throws {never} Ne lance jamais d'exception, retourne "error".
 * @see {@link add}
 */
export function rotate(arr, n = 1) {
  if (!Array.isArray(arr)) {
    return "error"
  }
  if (arr.some((v) => typeof v !== "number")) {
    return "error"
  }
  return arr.slice(n).concat(arr.slice(0, n))
}
