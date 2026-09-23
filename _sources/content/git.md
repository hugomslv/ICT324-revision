---
title: "Git : corrigés et mémo"
lead: "Les corrigés Git du cours (exercice basique et exercice binCraft), expliqués ligne par ligne, puis un mémo des commandes. L'exercice basique a été rejoué en local avec Git 2.54 : les erreurs citées sont les vraies."
---

## Exercice basique

### Le corrigé

```bash
$ mkdir ex-git
$ cd ex-git
$ git init --initial-branch=main
$ echo "Pierre Ferrari" > ferrarip
$ git add ferrarip
$ git commit -m "chore: First commit"
$ git remote add origin https://git.s2.rpn.ch/ict-324/exercice-base.git
$ git pull origin main
# → déclenche une erreur (voir plus bas)
$ git pull origin main --allow-unrelated-histories
```

### Ligne par ligne

| Commande | Ce qu'elle fait |
|---|---|
| `mkdir ex-git` | crée le dossier du projet |
| `cd ex-git` | entre dedans |
| `git init --initial-branch=main` | transforme le dossier en dépôt Git, avec une branche nommée `main` (au lieu de `master`) |
| `echo "Pierre Ferrari" > ferrarip` | crée un fichier `ferrarip` qui contient ton nom (le nom du fichier = ton login, ex : `ferrarip` pour Ferrari Pierre) |
| `git add ferrarip` | ajoute le fichier à la **zone de préparation** (staging) |
| `git commit -m "chore: First commit"` | enregistre une version (un *commit*) avec un message |
| `git remote add origin <url>` | relie ton dépôt local au dépôt du serveur, sous le nom `origin` |
| `git pull origin main` | récupère la branche `main` du serveur et la fusionne avec la tienne : **erreur** |
| `git pull origin main --allow-unrelated-histories` | force la fusion de deux historiques qui n'ont rien en commun |

### Pourquoi le premier `git pull` échoue

Ton dépôt local a son propre premier commit (`chore: First commit`), et le dépôt du serveur a **son propre** premier commit. Les deux historiques n'ont **aucun ancêtre commun** : Git refuse de les mélanger par sécurité.

Testé avec Git 2.54, selon ta configuration, tu obtiens l'une de ces deux erreurs :

**Cas 1 : Git ne sait pas comment fusionner** (configuration par défaut, le plus probable sur un poste neuf)

```text
hint: You have divergent branches and need to specify how to reconcile them.
...
fatal: Need to specify how to reconcile divergent branches.
```

Solution : dire à Git de **fusionner** (merge), puis autoriser les historiques sans rapport :

```bash
git pull --no-rebase origin main --allow-unrelated-histories
```

Ou une fois pour toutes :

```bash
git config --global pull.rebase false
```

**Cas 2 : les historiques n'ont rien en commun** (si `pull.rebase` est déjà réglé, c'est l'erreur du corrigé)

```text
fatal: refusing to merge unrelated histories
```

Solution : `git pull origin main --allow-unrelated-histories`

Résultat (testé) : un commit de fusion qui réunit les deux historiques, et tu as les fichiers des deux côtés :

```text
*   691aee2 Merge branch 'main' of ...
|\
| * 9e1e130 init                  ← le commit du serveur
* 0b367ea chore: First commit     ← ton commit
```

::: tip Si Git ouvre un éditeur pour le message de fusion
C'est souvent **vim** : tape `:wq` puis <kbd>Entrée</kbd> pour valider le message proposé. Dans **nano** : <kbd>Ctrl</kbd> <kbd>X</kbd>. Pour éviter l'éditeur : ajoute `--no-edit` à la commande.
:::

Ensuite, pour envoyer ton travail sur le serveur :

```bash
git push -u origin main
```

`-u` mémorise `origin main` : la prochaine fois, `git push` et `git pull` suffisent.

::: warning Si Git demande qui tu es
`Author identity unknown *** Please tell me who you are.` → à faire une fois sur le poste :

```bash
git config --global user.name "Prénom Nom"
git config --global user.email "prenom.nom@rpn.ch"
```
:::

## Exercice binCraft

### Le corrigé

```bash
$ git diff --patch cf2cb6d8 HEAD binCraft_decoder.py > patch.txt
$ cat patch.txt
```

| Morceau | Sens |
|---|---|
| `git diff` | montre les différences entre deux versions |
| `--patch` | au format *patch* (le format par défaut de `git diff`, écrit explicitement) |
| `cf2cb6d8` | l'identifiant (le *hash*, abrégé) d'un ancien commit |
| `HEAD` | le commit actuel (le dernier de ta branche) |
| `binCraft_decoder.py` | limite la comparaison à ce fichier |
| `> patch.txt` | enregistre le résultat dans un fichier au lieu de l'afficher |
| `cat patch.txt` | affiche le fichier |

Pour trouver l'identifiant d'un commit :

```bash
git log --oneline
git log --oneline -- binCraft_decoder.py   # seulement les commits qui touchent ce fichier
```

### Le patch obtenu

```diff [patch.txt]
+++ b/binCraft_decoder.py
@@ -1,4 +1,4 @@
-#!/usr/bin/python3
+#!/usr/bin/env python3
 # -*- coding: utf-8 -*-
 import struct
 import math
@@ -96,10 +96,10 @@ def binCraftReader(file,zstd_compressed=False):
        ac['lat'] = s32[2] / 1e6;
        ac['lon'] = s32[3] / 1e6;

-       ac['alt_baro'] = s16[8] * 25;
-       ac['alt_geom'] = s16[9] * 25;
-       ac['baro_rate'] = s16[10] * 8;
-       ac['geom_rate'] = s16[11] * 8;
+       ac['alt_baro'] = s16[10] * 25;
+       ac['alt_geom'] = s16[11] * 25;
+       ac['baro_rate'] = s16[8] * 8;
+       ac['geom_rate'] = s16[9] * 8;

        ac['nav_altitude_mcp'] = u16[12] * 4;
        ac['nav_altitude_fms'] = u16[13] * 4;
@@ -150,7 +150,7 @@ def binCraftReader(file,zstd_compressed=False):
        ac['nic_a'] = (u8[72] & 64) >> 6;
        ac['nic_c'] = (u8[72] & 128) >> 7;

-       ac['rssi'] = 10 * math.log10(u8[86]*u8[86]/65025 + 1.125e-5);
+       ac['rssi'] = 10 * math.log10(u8[86]*u8[86]/65025 + 1.125e-5) / math.log(10);
        ac['dbFlags'] = u8[87];

        ac['flight'] = genStr(u8,78,87)
```

### Lire un patch

| Ligne | Sens |
|---|---|
| `--- a/fichier` / `+++ b/fichier` | l'ancienne version (a) et la nouvelle (b) |
| `@@ -96,10 +96,10 @@` | un bloc (*hunk*) : dans l'ancienne version, 10 lignes à partir de la ligne 96 ; dans la nouvelle, 10 lignes à partir de la ligne 96 |
| `-ligne` (rouge) | ligne **supprimée** |
| `+ligne` (vert) | ligne **ajoutée** |
| ` ligne` (espace) | ligne inchangée, affichée pour le contexte |

Les 3 modifications de ce patch :

1. **Ligne 1** : `#!/usr/bin/python3` → `#!/usr/bin/env python3` (trouve Python là où il est installé, plus portable).
2. **Lignes 99 à 102** : les indices de `s16` sont échangés : `alt_baro` / `alt_geom` lisent maintenant `s16[10]` / `s16[11]`, et `baro_rate` / `geom_rate` lisent `s16[8]` / `s16[9]`.
3. **Ligne 153** : le calcul de `rssi` est divisé par `math.log(10)`.

### Appliquer un patch

```bash
git apply --check patch.txt   # vérifie qu'il s'applique, sans rien modifier
git apply patch.txt           # applique les modifications aux fichiers
git diff                      # voir ce qui a changé
```

### La dernière partie

Pour le dernier exercice, le corrigé dit : **il suffit de faire les add / commit l'un après l'autre**. Donc une modification = un commit :

```bash
# modification 1
git add binCraft_decoder.py
git commit -m "fix: shebang portable avec /usr/bin/env"

# modification 2
git add binCraft_decoder.py
git commit -m "fix: inversion des indices altitude / vitesse verticale"

# modification 3
git add binCraft_decoder.py
git commit -m "fix: correction du calcul du rssi"

git log --oneline   # vérifier : 3 commits
```

::: tip Plusieurs modifications déjà faites dans le même fichier ?
`git add -p binCraft_decoder.py` te propose chaque bloc un par un : `y` = l'ajouter à ce commit, `n` = le garder pour plus tard. Tu peux ainsi faire 3 commits séparés à partir d'un seul fichier modifié.
:::

## Messages de commit (Conventional Commits)

Le corrigé utilise `chore: First commit`. Le format : `type: description`.

| Type | Pour |
|---|---|
| `feat:` | une nouvelle fonctionnalité |
| `fix:` | une correction de bug |
| `docs:` | la documentation |
| `style:` | la mise en forme (pas de changement de logique) |
| `refactor:` | réorganisation du code sans changer le comportement |
| `test:` | les tests |
| `chore:` | maintenance (config, dépendances, premier commit…) |

## Mémo des commandes Git

### Démarrer

| Commande | Effet |
|---|---|
| `git init --initial-branch=main` | nouveau dépôt dans le dossier courant |
| `git clone <url>` | copie un dépôt du serveur |
| `git config --global user.name "Nom"` | ton nom (une fois par poste) |
| `git config --global user.email "mail"` | ton e-mail |

### Au quotidien

| Commande | Effet |
|---|---|
| `git status` | état : fichiers modifiés, ajoutés, non suivis |
| `git add fichier` / `git add .` | prépare un fichier / tout |
| `git commit -m "message"` | enregistre une version |
| `git log --oneline --graph` | historique compact |
| `git diff` | modifications pas encore ajoutées |
| `git diff --staged` | modifications ajoutées (prêtes à commit) |
| `git diff <commit1> <commit2> fichier` | différences entre deux versions |
| `git show <commit>` | détail d'un commit |

### Serveur (remote)

| Commande | Effet |
|---|---|
| `git remote add origin <url>` | relie au serveur |
| `git remote -v` | affiche les serveurs reliés |
| `git push -u origin main` | envoie (la 1re fois) |
| `git push` | envoie |
| `git pull` | récupère et fusionne |
| `git fetch` | récupère sans fusionner |

### Branches

| Commande | Effet |
|---|---|
| `git branch` | liste les branches |
| `git switch -c nouvelle` | crée une branche et va dessus |
| `git switch main` | change de branche |
| `git merge nouvelle` | fusionne `nouvelle` dans la branche actuelle |
| `git branch -d nouvelle` | supprime une branche fusionnée |

### Annuler

| Commande | Effet |
|---|---|
| `git restore fichier` | annule les modifications non ajoutées d'un fichier |
| `git restore --staged fichier` | retire un fichier de la zone de préparation |
| `git commit --amend -m "msg"` | corrige le dernier commit (s'il n'est pas encore poussé) |
| `git revert <commit>` | crée un commit qui annule un ancien commit |
| `git stash` / `git stash pop` | met de côté les modifications / les récupère |

### Le fichier .gitignore

```text [.gitignore]
node_modules/
dist/
docs/
coverage/
.env
```

Un fichier déjà suivi par Git n'est pas ignoré après coup : `git rm --cached fichier` pour arrêter de le suivre.
