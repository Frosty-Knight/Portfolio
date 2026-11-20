#!/usr/bin/env bash
# Mac/Linux: copies your compressed clips into assets/video under the names the site expects.
# Usage:  ./tools/place_videos.sh  /path/to/your/compressed-videos
set -u
src="${1:?usage: place_videos.sh <folder-with-your-clips>}"
dest="$(cd "$(dirname "$0")/.." && pwd)/assets/video"
mkdir -p "$dest"
while IFS='=' read -r key name; do
  f="$(find "$src" -maxdepth 1 -iname "*${key}*.mp4" | head -n 1)"
  if [ -n "$f" ]; then cp "$f" "$dest/$name.mp4" && echo "OK       $(basename "$f")  ->  $name.mp4"
  else echo "MISSING  no .mp4 whose name contains '$key'"; fi
done <<'MAP'
elevatorweaponpickup=arena-elevator-weapon-pickup
spawnscore=arena-spawn-score
navmeshinviswalls=arena-navmesh-invisible-walls
shootdeath=arena-shoot-death
rangedenemy=souls-ranged-enemy
player=souls-player
chainattackhiteffects=souls-chain-attack-hit-effects
attacksense=souls-attack-sense
soundenemyattacks=souls-sound-enemy-attacks
enemypathsightdeath=souls-enemy-path-sight-death
blockforget=souls-block-forget
MAP
