/**
 * @file Petites fonctions très simples pour s'entraîner aux tests.
 * @module exemples
 * @author Hugo
 * @version 1.0.0
 */

/**
 * Multiplie un nombre par 2.
 * @param {number} n - Le nombre.
 * @returns {number} Le double de n.
 * @example
 * double(4) // 8
 */
export function double(n) {
  return n * 2
}

/**
 * Dit si un nombre est pair.
 * @param {number} n - Le nombre.
 * @returns {boolean} true si n est pair.
 */
export function est_pair(n) {
  return n % 2 === 0
}

/**
 * Dit bonjour à quelqu'un.
 * @param {string} prenom - Le prénom.
 * @returns {string} "Bonjour <prenom> !"
 */
export function dire_bonjour(prenom) {
  return `Bonjour ${prenom} !`
}

/**
 * Additionne tous les nombres d'un tableau.
 * @param {number[]} nombres - Les nombres.
 * @returns {number} La somme (0 si tableau vide).
 */
export function somme(nombres) {
  let total = 0
  for (const n of nombres) {
    total = total + n
  }
  return total
}

/**
 * Renvoie le plus grand nombre d'un tableau.
 * @param {number[]} nombres - Les nombres.
 * @returns {number|null} Le maximum, ou null si le tableau est vide.
 */
export function maximum(nombres) {
  if (nombres.length === 0) {
    return null
  }
  return Math.max(...nombres)
}

/**
 * Garde seulement les nombres pairs.
 * @param {number[]} nombres - Les nombres.
 * @returns {number[]} Un nouveau tableau avec les pairs.
 */
export function garder_pairs(nombres) {
  return nombres.filter((n) => est_pair(n))
}

/**
 * Crée un objet personne.
 * @param {string} nom - Le nom.
 * @param {number} age - L'âge.
 * @returns {{nom: string, age: number, majeur: boolean}} La personne.
 */
export function creer_personne(nom, age) {
  return { nom, age, majeur: age >= 18 }
}

/**
 * Divise a par b.
 * @param {number} a - Le dividende.
 * @param {number} b - Le diviseur.
 * @returns {number} Le résultat.
 * @throws {Error} Si b vaut 0.
 */
export function diviser(a, b) {
  if (b === 0) {
    throw new Error("Division par zéro")
  }
  return a / b
}

/**
 * Renvoie une valeur après un petit délai (fonction asynchrone).
 * @async
 * @param {*} valeur - La valeur à renvoyer.
 * @returns {Promise<*>} La valeur, après 10 ms.
 */
export async function attendre(valeur) {
  await new Promise((resolve) => setTimeout(resolve, 10))
  return valeur
}

/**
 * Récupère la température d'une ville depuis une API.
 * @async
 * @param {string} ville - Nom de la ville.
 * @returns {Promise<number|null>} La température, ou null en cas d'erreur.
 */
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
