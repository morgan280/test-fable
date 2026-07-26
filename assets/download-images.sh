#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Reticle MS — localize AI-generated site imagery
#
# The site currently hot-links its imagery from the KRAYN render
# CDN. Run this script on any machine with normal internet access
# to download the files into assets/img/ and rewrite index.html
# to use the local copies.
#
#   bash assets/download-images.sh
# ─────────────────────────────────────────────────────────────
set -euo pipefail
cd "$(dirname "$0")/.."

BASE="https://krayawn-mcp.delicate-star-fc13.workers.dev/media"
declare -A IMAGES=(
  [hero]="img_1c9d2b43f2004f75a362"
  [macro]="img_8e1c1317f03e4f7b8541"
  [weld]="img_9f4d5f3b922d4748ae70"
  [inspect]="img_e1f2ab0e8b644a25825a"
  [facility]="img_5d9b1cf594a64e3c89a6"
  [craftsman]="img_efae5d8904a54b83875b"
)

mkdir -p assets/img

for name in "${!IMAGES[@]}"; do
  id="${IMAGES[$name]}"
  out="assets/img/${name}.jpg"
  echo "→ ${name} (${id})"
  curl -fsSL "${BASE}/${id}" -o "${out}"
  # point index.html at the local copy
  sed -i.bak "s|${BASE}/${id}|assets/img/${name}.jpg|g" index.html
done

rm -f index.html.bak
echo "✓ Done — index.html now uses local images in assets/img/"
