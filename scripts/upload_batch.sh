#!/usr/bin/env bash
# upload_batch.sh
# Script pour ajouter des vidéos en lots et les pousser via Git LFS
# Usage: ./upload_batch.sh /chemin/vers/dossier_videos [batch_size]

set -euo pipefail

SRC_DIR="${1:-}"
BATCH_SIZE="${2:-10}"

if [[ -z "$SRC_DIR" ]]; then
  echo "Usage: $0 /chemin/vers/dossier_videos [batch_size]"
  exit 1
fi

if [[ ! -d "$SRC_DIR" ]]; then
  echo "Le dossier $SRC_DIR n'existe pas"
  exit 1
fi

# Assure que git lfs est installé
git lfs install || true

cd "$(git rev-parse --show-toplevel)" || true || exit 0

files=("$SRC_DIR"/*.{mp4,mov,mkv} )
# handle case where glob doesn't match
shopt -s nullglob
files=("$SRC_DIR"/*.{mp4,mov,mkv})
shopt -u nullglob

total=${#files[@]}
if [[ $total -eq 0 ]]; then
  echo "Aucune vidéo trouvée dans $SRC_DIR"
  exit 0
fi

echo "Found $total files. Starting batch upload with batch size $BATCH_SIZE"

i=0
batch=()
for f in "${files[@]}"; do
  batch+=("$f")
  ((i++))
  if (( i % BATCH_SIZE == 0 )); then
    echo "Adding batch of $BATCH_SIZE files..."
    mkdir -p videos
    for bf in "${batch[@]}"; do
      cp "$bf" videos/ || { echo "Failed to copy $bf"; exit 1; }
      git add "videos/$(basename "$bf")"
    done
    git commit -m "Ajout batch de vidéos: ${i-BATCH_SIZE+1}..${i}"
    git push
    batch=()
  fi
done

# Remaining files
if [[ ${#batch[@]} -gt 0 ]]; then
  echo "Adding final batch of ${#batch[@]} files..."
  mkdir -p videos
  for bf in "${batch[@]}"; do
    cp "$bf" videos/ || { echo "Failed to copy $bf"; exit 1; }
    git add "videos/$(basename "$bf")"
  done
  git commit -m "Ajout final de vidéos"
  git push
fi

echo "All done." 
