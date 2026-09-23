---
title: "Tuto 4 : configurer la publication FTP"
lead: "Consigne : « Configurer correctement votre projet pour qu'il puisse être publié en FTP dans un dossier spécifique sans qu'il y ait d'erreurs (favicon, images et autre). Cette partie se fera à l'aveugle. » Résultat attendu : un dist/ qui marche dans /nom_du_dossier/, vérifié sans serveur."
---

<div class="progress"><span></span></div>
<p class="small muted">Progression : <span id="progress-label"></span> · <a href="#" id="reset-checks">tout décocher</a></p>

Dans ce tuto, le dossier s'appelle **`mon_dossier`** : remplace-le partout par le nom donné dans la consigne.

## Pourquoi c'est un piège

Le site sera à `https://serveur.ch/mon_dossier/`. Par défaut Vite écrit des chemins comme `/assets/index.js`, que le navigateur cherche à `https://serveur.ch/assets/index.js`, **en dehors** de ton dossier. Résultat : page blanche, pas de favicon, images cassées. Et comme tu es hors-ligne, tu ne pourras pas le voir : il faut le vérifier en local.

## Étape 1 : indiquer le dossier dans vite.config.js

- [ ] Créer (ou compléter) **`vite.config.js`** à la racine :

```js [vite.config.js]
import { defineConfig, coverageConfigDefaults } from "vitest/config"

export default defineConfig({
  base: "/mon_dossier/",
  test: {
    coverage: {
      provider: "v8",
      include: [ "src/**/*.js" ],
      exclude: [ "src/main.js", ...coverageConfigDefaults.exclude ],
    },
  },
})
```

::: danger Les deux slashs
`base: "/mon_dossier/"` : un `/` **au début** et un `/` **à la fin**. Testé :

- `"mon_dossier"` : Vite corrige mais avertit *« "base" option should start with a slash »*.
- `"/mon_dossier"` (sans `/` final) : **aucun avertissement**, mais `import.meta.env.BASE_URL` vaut `/mon_dossier` et `` `${import.meta.env.BASE_URL}images/logo.png` `` devient **`/mon_dossierimages/logo.png`** → 404. Le script de l'étape 6b le détecte.
:::

(Le bloc `test` vient du [tuto 2](tuto-2-tests.html) ; si tu ne fais pas de couverture, `base` suffit, avec `import { defineConfig } from "vite"`.)

## Étape 2 : le favicon

- [ ] Mettre le favicon dans **`public/`** : `public/favicon.svg` (Vite en crée un) ou ton propre `public/favicon.png`.
- [ ] Dans **`index.html`**, dans `<head>`, un lien avec un chemin qui commence par **`/`** :

```html [index.html]
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<!-- ou pour un PNG : -->
<link rel="icon" type="image/png" href="/favicon.png" />
```

Au build, Vite le transforme en `/mon_dossier/favicon.svg` (testé).

## Étape 3 : les images

Deux endroits possibles, selon l'usage :

- [ ] Images **fixes** (logo…) dans **`public/images/`**, par exemple `public/images/logo.png`.
- [ ] Images utilisées **par le JavaScript** dans **`src/assets/`**, par exemple `src/assets/vite.svg`.

Et **comment les écrire** :

| Où tu écris le chemin | Écris | Au build |
|---|---|---|
| dans `index.html` | `<img src="/images/logo.png">` | ✅ devient `/mon_dossier/images/logo.png` |
| dans un `.css` | `url("/images/logo.png")` | ✅ devient `/mon_dossier/images/logo.png` |
| dans un `.js`, image de `src/assets/` | `import logo from "./assets/vite.svg"` puis `img.src = logo` | ✅ |
| dans un `.js`, image de `public/` | `` img.src = `${import.meta.env.BASE_URL}images/logo.png` `` | ✅ |
| dans un `.js` | ~~`img.src = "/images/logo.png"`~~ | ❌ **pas modifié → 404** |
| lien vers une autre page | `<a href="contact.html">` (sans `/` au début) | ✅ |

::: warning Noms de fichiers
Tout en **minuscules**, sans espace ni accent. Le serveur est sous Linux : `Logo.png` et `logo.png` sont deux fichiers différents. Sur ton PC ça marche, en ligne ça fait une 404.
:::

## Étape 4 : écrire un main.js propre

Le `main.js` de démo de Vite contient des chemins en dur (`/icons.svg#...`) qui cassent dans un sous-dossier. Remplace-le.

- [ ] Supprimer ce qui ne sert plus : `src/counter.js`, `public/icons.svg`, `src/assets/javascript.svg`, `src/assets/hero.png`.
- [ ] **`index.html`** :

@@include projets/tuto/index.html@@

- [ ] **`src/main.js`** (les deux bonnes façons de mettre une image depuis le JS) :

@@include projets/tuto/src/main.js@@

- [ ] **`src/style.css`** (image de fond depuis `public/`) :

@@include projets/tuto/src/style.css@@

## Étape 5 : construire (build)

- [ ] Lancer :

```bash
npm run build
```

Sortie attendue (testé) :

```text
dist/index.html                 0.59 kB │ gzip: 0.35 kB
dist/assets/vite-BF8QNONU.svg   8.70 kB │ gzip: 1.60 kB
dist/assets/index-Dj4gvqNB.css  0.14 kB │ gzip: 0.14 kB
dist/assets/index-Blj_DcOc.js   1.10 kB │ gzip: 0.57 kB
✓ built in 359ms
```

- [ ] Ouvrir **`dist/index.html`** dans VS Code (pas dans le navigateur) et vérifier que **tous** les chemins commencent par `/mon_dossier/` :

```html
<link rel="icon" type="image/svg+xml" href="/mon_dossier/favicon.svg" />
<script type="module" crossorigin src="/mon_dossier/assets/index-Blj_DcOc.js"></script>
<img src="/mon_dossier/images/logo.png" alt="Logo" width="80" />
```

- [ ] Vérifier le contenu de `dist/` :

```text
dist/
├── index.html
├── favicon.svg          ← copié depuis public/
├── images/logo.png      ← copié depuis public/
└── assets/              ← JS, CSS et images importées (noms avec un code)
```

::: info Double-cliquer sur dist/index.html donne une page blanche
C'est **normal** : un site construit ne s'ouvre pas en `file://`. Utilise l'étape 6.
:::

## Étape 6 : vérifier « à l'aveugle » (sans serveur, sans réseau)

### 6a. Avec `npm run preview`

- [ ] Lancer :

```bash
npm run preview
```

- [ ] Ouvrir l'adresse affichée : **`http://localhost:4173/mon_dossier/`**. `preview` se comporte comme le vrai serveur, dans le sous-dossier.
- [ ] Appuyer sur <kbd>F12</kbd> → onglet **Réseau** (Network) → recharger avec <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>R</kbd>.
- [ ] **Aucune ligne en rouge** (404). Le favicon apparaît dans l'onglet du navigateur. Les images s'affichent.
- [ ] Onglet **Console** : aucune erreur.
- [ ] <kbd>Ctrl</kbd> <kbd>C</kbd> dans le terminal pour arrêter.

### 6b. Avec le script de vérification

Il détecte aussi les erreurs de **majuscules** que ton PC ne voit pas.

- [ ] Copier `projets/modele/scripts/check-dist.js` (de ce site) dans **`scripts/check-dist.js`** de ton projet ([code](modele.html#verifier-dist-sans-serveur)).
- [ ] Dans `package.json` : `"check": "node scripts/check-dist.js"`
- [ ] Lancer :

```bash
npm run build
npm run check
```

Résultat attendu (testé) :

```text
base = "/mon_dossier/"
6 fichiers analysés dans dist/
✅ Aucun lien cassé détecté : dist/ est prêt pour le FTP.
```

S'il affiche des ❌, il dit quel fichier et quel chemin corriger.

## Étape 7 : préparer l'envoi FTP

Même si tu ne peux pas l'envoyer (hors-ligne), prépare tout pour que ça marche.

- [ ] Installer (avec réseau) : `npm install -D dotenv-cli`
- [ ] Créer **`scripts/publish.sh`** :

@@include projets/tuto/scripts/publish.sh bash@@

- [ ] Créer **`.env.example`** (le modèle, sans vrai mot de passe) :

@@include projets/tuto/.env.example ini@@

- [ ] Pour envoyer pour de vrai : copier `.env.example` en **`.env`** et y mettre les vrais identifiants.
- [ ] Dans `.gitignore`, ajouter **`.env`** (le mot de passe ne doit jamais être partagé).
- [ ] Dans `package.json` :

```json
"publish": "dotenv -e .env -- bash scripts/publish.sh"
```

Envoi : `npm run build` puis `npm run publish` (**`run`** obligatoire : `npm publish` est une autre commande). Testé contre un serveur FTP local : les 6 fichiers arrivent dans `/mon_dossier/`, puis le site répond sans aucune 404.

::: tip Sans lftp (Windows)
FileZilla ou WinSCP : connexion, ouvrir `/mon_dossier/` à droite, entrer **dans** `dist/` à gauche, tout sélectionner et glisser. On envoie le **contenu** de `dist/`, pas le dossier `dist` lui-même.
:::

## Le package.json final

@@include projets/tuto/package.json@@

## Checklist finale

- [ ] `base: "/mon_dossier/"` (bon nom, deux slashs)
- [ ] favicon dans `public/` + `<link rel="icon" href="/favicon...">`
- [ ] images fixes dans `public/images/`, chemins en `/images/...` dans le HTML et le CSS
- [ ] dans le JS : `import` ou `import.meta.env.BASE_URL`, jamais `"/images/..."`
- [ ] noms de fichiers en minuscules, sans espace ni accent
- [ ] `npm run build` : pas d'erreur
- [ ] `dist/index.html` : tous les chemins en `/mon_dossier/...`
- [ ] `npm run preview` : 0 erreur 404
- [ ] `npm run check` : ✅
- [ ] `scripts/publish.sh`, `.env.example`, `.env` dans `.gitignore`

Plus de détails et d'explications : [6. Build & publication FTP](build-ftp.html). Le projet terminé des 4 tutos est dans `projets/tuto/`.
