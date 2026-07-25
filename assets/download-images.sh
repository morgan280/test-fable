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
  [hero]="img_54ef3683467947d28943"
  [macro]="img_7198065c039a485a9c67"
  [weld]="img_04ddf6ba60f54bdd9249"
  [inspect]="img_fbf97ea6b20e47218a1e"
  [facility]="img_283dc7593df04cd29c5f"
  [craftsman]="img_6a2c705132b7438ebfb5"
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
