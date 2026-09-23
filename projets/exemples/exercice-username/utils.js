/**
 * Nettoie un nom d'utilisateur : minuscules, sans le domaine de l'e-mail.
 * @param {string} username - Nom brut (ex : "User.Name@domain.tld").
 * @returns {string} Nom nettoyé (ex : "user.name"), ou "error".
 */
export function clean_username(username) {
  if (typeof username !== "string" || username.trim() === "") {
    return "error"
  }
  return username.trim().toLowerCase().split("@")[0]
}
