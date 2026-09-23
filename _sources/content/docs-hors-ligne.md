---
title: "Préparer les docs hors-ligne"
lead: "L'énoncé dit : « vous devrez mettre en place les documentations du linter, de vitest et de JSDoc sur le poste école (hors ligne) ». Voici toutes les façons de les avoir sans internet."
---

## 1. Ce site (déjà prêt)

Le dossier `docs/` de ce site contient les documentations officielles converties en HTML :

| Doc | Pages | Lien |
|---|---|---|
| ESLint : règles | 300+ | [docs/eslint/rules](../docs/eslint/rules/index.html) |
| ESLint : utilisation (config, CLI…) | ~70 | [docs/eslint](../docs/eslint/index.html) |
| Vitest | ~200 | [docs/vitest](../docs/vitest/index.html) |
| Vite | ~40 | [docs/vite](../docs/vite/index.html) |
| JSDoc | 90+ | [docs/jsdoc](../docs/jsdoc/index.html) |

Copie tout le dossier `ICT324-revision` sur une clé USB (ou dans tes notes) et ouvre `index.html` dans n'importe quel navigateur : aucun serveur, aucune connexion nécessaire. La recherche (<kbd>Ctrl</kbd> <kbd>K</kbd>) fonctionne aussi hors-ligne.

## 2. Les README dans node_modules (toujours disponibles)

Après `npm install`, chaque paquet contient son README :

```text
node_modules/eslint/README.md
node_modules/@eslint/js/README.md
node_modules/globals/readme.md
node_modules/vitest/README.md
node_modules/jsdoc/README.md
node_modules/vite/README.md
node_modules/@maintained/eslint-plugin-filename-rules/README.md
```

Ouvre-les dans VS Code avec l'aperçu Markdown (<kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>V</kbd>).

Et la liste **exacte** des règles de ta version d'ESLint :

```bash
ls node_modules/eslint/lib/rules/          # Windows : dir node_modules\eslint\lib\rules
```

Les options de chaque règle sont décrites dans son fichier (`schema`), par exemple `node_modules/eslint/lib/rules/quotes.js`.

## 3. L'aide en ligne de commande

```bash
npx eslint --help
npx vitest --help
npx jsdoc --help
npx vite --help
npx vite build --help
```

## 4. Télécharger les docs officielles soi-même (avec réseau)

C'est ce que j'ai fait pour construire ce site. Les docs sont des fichiers Markdown dans les dépôts GitHub :

```bash
# ESLint : règles + guide d'utilisation
git clone --depth 1 --filter=blob:none --sparse https://github.com/eslint/eslint.git
cd eslint && git sparse-checkout set docs/src/rules docs/src/use && cd ..

# Vitest
git clone --depth 1 --filter=blob:none --sparse https://github.com/vitest-dev/vitest.git
cd vitest && git sparse-checkout set docs && cd ..

# Vite
git clone --depth 1 --filter=blob:none --sparse https://github.com/vitejs/vite.git
cd vite && git sparse-checkout set docs && cd ..

# JSDoc (site jsdoc.app)
git clone --depth 1 https://github.com/jsdoc/jsdoc.github.io.git jsdoc
```

Sans git : sur GitHub, bouton **Code → Download ZIP**.

Emplacements :

| Doc | Dossier |
|---|---|
| ESLint règles | `eslint/docs/src/rules/*.md` (un fichier par règle) |
| ESLint config / CLI | `eslint/docs/src/use/` |
| Vitest | `vitest/docs/api/`, `vitest/docs/config/`, `vitest/docs/guide/` |
| Vite | `vite/docs/guide/`, `vite/docs/config/` |
| JSDoc | `jsdoc/content/*.md` |

## 5. Enregistrer des pages depuis le navigateur

Sur une page de doc : <kbd>Ctrl</kbd> <kbd>S</kbd> → « Page web, complète », ou <kbd>Ctrl</kbd> <kbd>P</kbd> → « Enregistrer en PDF ». Pages les plus utiles :

- https://eslint.org/docs/latest/rules/
- https://eslint.org/docs/latest/use/configure/configuration-files
- https://vitest.dev/api/expect
- https://vitest.dev/guide/coverage
- https://jsdoc.app/ (liste des tags)
- https://vite.dev/guide/build#public-base-path

## Dans le projet d'examen

Si on te demande de **mettre en place** les docs dans le projet, une solution propre :

```text
mon-projet/
└── documentation/
    ├── eslint/      ← copie de docs/eslint de ce site (ou des .md officiels)
    ├── vitest/
    └── jsdoc/
```

Pense à l'ajouter aux ignores d'ESLint (`globalIgnores([ "documentation/" ])`) et à l'exclure du build (il n'est pas dans `public/`, donc Vite ne le copie pas dans `dist/`).
