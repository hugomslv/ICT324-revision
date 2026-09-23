---
title: "6. Build et publication FTP"
lead: "But : que le site fonctionne sans aucune 404 (favicon, images, CSS, JS) une fois copié dans un dossier précis du serveur, par exemple https://serveur.ch/mon_dossier/. Tout ce qui est ici a été testé : build, envoi FTP réel vers un serveur local, puis vérification HTTP."
---

## Le problème

Par défaut Vite suppose que le site est à la **racine** du domaine (`base: "/"`). Le build contient alors `<script src="/assets/index.js">`. Si le site est dans `/mon_dossier/`, le navigateur cherche `https://serveur.ch/assets/index.js` → **404**, page blanche.

## La solution : `base`

```js [vite.config.js]
import { defineConfig } from "vite"

export default defineConfig({
  base: "/mon_dossier/",   // commence ET finit par "/"
})
```

Dans le corrigé `currency-converter` : `base: '/ferrarip/'` (le dossier du prof sur le serveur). Mets **le nom de dossier donné dans la consigne**.

Build :

```bash
npm run build
```

`dist/index.html` devient (testé) :

```html
<link rel="icon" type="image/svg+xml" href="/mon_dossier/favicon.svg" />
<script type="module" crossorigin src="/mon_dossier/assets/index-_2MRZmio.js"></script>
<link rel="stylesheet" crossorigin href="/mon_dossier/assets/index-Dj4gvqNB.css">
<img src="/mon_dossier/images/logo.png" alt="Logo" width="80" />
```

### Alternative : `base: "./"`

Tous les chemins deviennent **relatifs** (`./assets/...`) : le site marche dans n'importe quel dossier sans connaître son nom. Testé : HTML → `./assets/index.js`, CSS → `url(../images/logo.png)`, `import.meta.env.BASE_URL` → `"./"`. Limite : sous-pages dans des sous-dossiers ou routeur JS. Si la consigne donne un dossier précis, préfère `base: "/nom_du_dossier/"`.

## Qu'est-ce qui est réécrit ? (testé avec `base: "/mon_dossier/"`)

| Où | Ce que tu écris | Dans `dist/` | Résultat |
|---|---|---|---|
| HTML | `<link rel="icon" href="/favicon.svg">` (fichier dans `public/`) | `/mon_dossier/favicon.svg` | ✅ |
| HTML | `<img src="/images/logo.png">` (dans `public/images/`) | `/mon_dossier/images/logo.png` | ✅ |
| HTML | `<script type="module" src="/src/main.js">` | `/mon_dossier/assets/index-xxx.js` | ✅ |
| HTML | `href="favicon.svg"` (relatif, comme dans currency-converter) | laissé tel quel | ⚠️ marche pour `index.html` à la racine du dossier, fragile |
| CSS | `url("/images/logo.png")` | `url(/mon_dossier/images/logo.png)` | ✅ |
| JS | `import logo from "./assets/vite.svg"` puis `img.src = logo` | `/mon_dossier/assets/vite-BF8QNONU.svg` | ✅ |
| JS | `` img.src = `${import.meta.env.BASE_URL}images/logo.png` `` | `/mon_dossier/images/logo.png` | ✅ |
| JS | `img.src = "/images/logo.png"` | `/images/logo.png` (**pas réécrit**) | ❌ 404 |
| HTML | `<a href="/contact.html">` (lien entre pages) | `/contact.html` (**pas réécrit**) | ❌ 404 → écris `href="contact.html"` (relatif) |

::: danger À retenir
**HTML et CSS** : Vite corrige les chemins absolus. **Chaînes JavaScript** : jamais. Dans le JS, utilise un `import` ou `import.meta.env.BASE_URL`.
:::

## Favicon

1. Mettre le fichier dans **`public/`** : `public/favicon.png` (ou `.svg`, `.ico`).
2. Dans `index.html` : `<link rel="icon" type="image/png" href="/favicon.png" />` (chemin absolu → Vite ajoute `base`).
3. Après le build : `dist/favicon.png` existe et le lien est `/mon_dossier/favicon.png`.

::: info Pourquoi il faut la balise
Sans `<link rel="icon">`, le navigateur demande `/favicon.ico` à la **racine du domaine** (pas dans ton dossier) → 404 dans la console.
:::

## Images

| Image | Où la mettre | Comment la référencer |
|---|---|---|
| Logo / image fixe du HTML | `public/images/` | `<img src="/images/logo.png">` |
| Image de fond CSS | `public/images/` ou `src/assets/` | `url("/images/fond.jpg")` ou `url("./assets/fond.jpg")` (relatif au CSS) |
| Image utilisée dans le JS | `src/assets/` | `import photo from "./assets/photo.jpg"` |
| Image de `public/` utilisée dans le JS | `public/images/` | `` `${import.meta.env.BASE_URL}images/x.png` `` |

## Les pièges « à l'aveugle » (que tu ne verras pas en local)

::: warning 1. Majuscules / minuscules
Windows et macOS ignorent la casse, **le serveur Linux non** : `<img src="/images/Logo.png">` avec un fichier `logo.png` marche chez toi et fait une 404 en ligne. → Tout en **minuscules**, et vérifie avec le script `check-dist.js` (plus bas), qui le détecte.
:::

::: warning 2. Espaces et accents dans les noms
`mon image.png`, `été.jpg` → encodages bizarres, liens cassés. → `mon_image.png`, `ete.jpg`.
:::

::: warning 3. Envoyer le DOSSIER dist au lieu de son CONTENU
Si tu copies `dist/` lui-même, le site est à `/mon_dossier/dist/` et `base` ne correspond plus. Il faut que `index.html` soit **directement** dans `/mon_dossier/`. (`lftp mirror -R dist /mon_dossier` copie bien le contenu, testé.)
:::

::: warning 4. Chemins Windows
Jamais de `\` ni de `C:\...` dans le code : toujours `/`.
:::

::: warning 5. Ressources externes
Les Google Fonts (projet currency) se chargent depuis internet : OK en ligne. Mais tout fichier **local** doit être dans le projet.
:::

## Vérifier `dist/` sans serveur

### 1. `npm run preview` (le plus important)

```bash
npm run build
npm run preview
```

Il affiche `http://localhost:4173/mon_dossier/` : il sert `dist/` **comme le vrai serveur**, sous le sous-dossier. Testé : `/mon_dossier/favicon.svg` → 200, `/images/logo.png` (chemin oublié sans base) → 404.

Ouvre les **DevTools** (<kbd>F12</kbd>) → onglet **Network / Réseau** → recharge (<kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>R</kbd>) → trie par statut : **aucune ligne rouge 404**. Regarde aussi la **Console** et l'icône de l'onglet (favicon).

### 2. Le script `check-dist.js` (fait pour cette épreuve)

Il analyse `dist/` sans serveur et signale : chemins absolus sans `base`, fichiers manquants, **différences de majuscules** (détectées même sous Windows/macOS), noms risqués, favicon absent.

```bash
npm run build
node scripts/check-dist.js              # lit base dans vite.config.js
node scripts/check-dist.js /mon_dossier/
```

Sortie sur un build correct :

```text
base = "/mon_dossier/"
6 fichiers analysés dans dist/
✅ Aucun lien cassé détecté : dist/ est prêt pour le FTP.
```

Sortie sur un build volontairement cassé (testé) :

```text
⚠️  nom de fichier risqué (majuscule, espace ou accent) : images/Logo.png
❌ assets/index-Dj4gvqNB.css (css) : "/mon_dossier/images/logo.png" → MAJUSCULES/minuscules différentes (OK en local, 404 sur Linux)
❌ assets/index-H81kUb9M.js (js) : "/images/logo.png" est absolu mais ne commence pas par "/mon_dossier/" → 404 sur le serveur
```

Le script complet est dans le [projet modèle](modele.html#verifier-dist-sans-serveur) (`projets/modele/scripts/check-dist.js`) : copie-le dans ton projet.

### 3. Recherche manuelle

```bash
grep -rn '"/' dist/assets/*.js     # chaînes qui commencent par "/" dans le JS
grep -rn 'src="\|href="' dist/index.html
```

Sous Windows (PowerShell) : `Select-String -Path dist\assets\*.js -Pattern '"/'`

## Envoyer sur le serveur FTP

### Script du prof (lftp + .env)

```bash
npm install -D dotenv-cli
```

```bash [scripts/publish.sh]
#!/usr/bin/env bash
set -euo pipefail

lftp -u "$FTP_USER,$FTP_PASS" "$FTP_HOST" \
	-e "mirror -R dist /root/$FTP_DEST; bye"
```

```ini [.env]
FTP_HOST=ftp.serveur.ch
FTP_USER=mon_login
FTP_PASS=mon_mot_de_passe
FTP_DEST=mon_dossier
```

```json [package.json]
"scripts": {
  "publish": "dotenv -e .env -- bash scripts/publish.sh"
}
```

```bash
npm run build && npm run publish
```

| Élément | Sens |
|---|---|
| `dotenv -e .env --` | charge les variables de `.env` puis lance la commande |
| `set -euo pipefail` | arrête le script à la première erreur |
| `lftp -u "user,pass" host` | connexion FTP |
| `mirror -R dist /dest` | **R**everse : envoie le **contenu** local de `dist` vers `/dest` (crée le dossier si besoin) |
| `--delete` (option) | supprime sur le serveur ce qui n'existe plus en local |
| `/root/$FTP_DEST` | chemin propre au serveur de l'école (à adapter à la consigne) |
| `bye` | déconnexion |

::: danger Sécurité
`.env` contient le mot de passe : il doit être dans **`.gitignore`**. Fournis plutôt un `.env.example` sans vrai mot de passe.
:::

Version du projet modèle (testée contre un vrai serveur FTP local : les 6 fichiers sont arrivés dans `/mon_dossier`, puis servis en HTTP 200) :

@@include projets/modele/scripts/publish.sh bash@@

::: tip npm run publish
`npm publish` (sans *run*) est une autre commande : elle publie un paquet sur npmjs.com ! Le `"private": true` du `package.json` l'en empêche. Tape bien **`npm run publish`**.
:::

### Sans lftp

- **FileZilla** / **WinSCP** (Windows) : hôte, utilisateur, mot de passe, port 21. À droite, ouvre `/mon_dossier` ; à gauche, entre **dans** `dist/`, sélectionne tout son contenu et glisse-le à droite.
- **curl** (inclus dans Windows 10+), un fichier à la fois :

```bash
curl -T dist/index.html --ftp-create-dirs ftp://ftp.serveur.ch/mon_dossier/ --user login:motdepasse
```

## Checklist finale FTP

- [ ] `base: "/nom_du_dossier/"` dans `vite.config.js`
- [ ] favicon dans `public/` + `<link rel="icon" href="/favicon.xxx">`
- [ ] aucune chaîne `"/..."` vers un fichier dans le JS (→ `import` ou `BASE_URL`)
- [ ] noms de fichiers en minuscules, sans espace ni accent
- [ ] `npm run build` sans avertissement
- [ ] `npm run preview` : 0 erreur 404 dans l'onglet Réseau
- [ ] `node scripts/check-dist.js` : ✅
- [ ] script `publish` + `.env.example`, `.env` dans `.gitignore`
- [ ] on envoie le **contenu** de `dist/`, pas le dossier
