#!/usr/bin/env bash
set -euo pipefail

lftp -u "$FTP_USER,$FTP_PASS" "$FTP_HOST" \
	-e "mirror -R dist /root/$FTP_DEST; bye"