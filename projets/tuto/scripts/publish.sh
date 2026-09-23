#!/usr/bin/env bash
# Envoie le contenu de dist/ dans le dossier FTP_DEST du serveur
set -euo pipefail

lftp -u "$FTP_USER,$FTP_PASS" "$FTP_HOST" \
  -e "set ssl:verify-certificate no; mirror -R --delete dist $FTP_DEST; bye"
