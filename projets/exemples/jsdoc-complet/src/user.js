/**
 * @file Gestion des utilisateurs (exemple complet de tags JSDoc).
 * @module user
 * @author Hugo <hugo@exemple.ch>
 * @version 1.2.0
 * @since 1.0.0
 * @license MIT
 * @see {@link https://jsdoc.app|Documentation JSDoc}
 */

/**
 * Un utilisateur.
 * @typedef {Object} User
 * @property {string} name - Nom complet.
 * @property {number} age - Âge en années.
 * @property {string} [email] - Adresse e-mail (optionnelle).
 */

/**
 * Fonction appelée pour chaque utilisateur.
 * @callback UserCallback
 * @param {User} user - L'utilisateur courant.
 * @returns {void}
 */

/**
 * Âge minimum pour être majeur.
 * @constant {number}
 * @default
 */
export const MAJORITE = 18

/**
 * Nettoie un nom d'utilisateur : minuscules, sans domaine.
 * @param {string} username - Le nom brut, ex : "User.Name@domain.tld".
 * @returns {string} Le nom nettoyé, ex : "user.name".
 * @throws {TypeError} Si `username` n'est pas une chaîne.
 * @example
 * clean_username("USERNAME")              // "username"
 * clean_username("user.name@domain.tld")  // "user.name"
 */
export function clean_username(username) {
  if (typeof username !== "string") throw new TypeError("string attendu")
  return username.toLowerCase().split("@")[0]
}

/**
 * Crée un utilisateur.
 * @param {string} name - Nom.
 * @param {number} [age=18] - Âge (18 par défaut).
 * @param {Object} [options] - Options.
 * @param {boolean} [options.admin=false] - Droits admin.
 * @returns {User} L'utilisateur créé.
 */
export function create_user(name, age = 18, options = {}) {
  return { name, age, admin: options.admin ?? false }
}

/**
 * Applique un callback à chaque utilisateur.
 * @param {User[]} users - Liste des utilisateurs.
 * @param {UserCallback} callback - Fonction à appeler.
 */
export function for_each_user(users, callback) {
  users.forEach(callback)
}

/**
 * Charge un utilisateur depuis une API.
 * @async
 * @param {number} id - Identifiant.
 * @returns {Promise<User|null>} L'utilisateur, ou null si erreur.
 * @deprecated Utiliser {@link create_user} à la place.
 * @todo Gérer le cache.
 */
export async function fetch_user(id) {
  const res = await fetch(`/api/users/${id}`)
  return res.ok ? res.json() : null
}

/**
 * Représente un compte bancaire.
 * @class
 */
export class Compte {
  /**
   * @param {string} titulaire - Nom du titulaire.
   * @param {number} [solde=0] - Solde initial.
   */
  constructor(titulaire, solde = 0) {
    /** @type {string} */
    this.titulaire = titulaire
    /** @private */
    this._solde = solde
  }

  /**
   * Dépose un montant.
   * @param {number} montant - Montant positif.
   * @returns {number} Le nouveau solde.
   */
  deposer(montant) {
    this._solde += montant
    return this._solde
  }
}
