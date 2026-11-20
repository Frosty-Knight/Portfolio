#!/usr/bin/env bash
# Shrinks gameplay recordings so they load fast and fit GitHub's upload limits.
# Usage:  ./tools/compress_videos.sh  path/to/raw-clips  assets/video
# Requires ffmpeg (https://ffmpeg.org). Output is 1080p-max H.264 mp4 with the
# "web-ready" flag, so videos start playing before they finish downloading.
set -euo pipefail
in="${1:?usage: compress_videos.sh <input-folder> <output-folder>}"
out="${2:?usage: compress_videos.sh <input-folder> <output-folder>}"
mkdir -p "$out"
shopt -s nullglob nocaseglob
for f in "$in"/*.mp4 "$in"/*.mov "$in"/*.mkv "$in"/*.webm; do
  name="$(basename "${f%.*}")"
  echo "-> $name"
  ffmpeg -y -loglevel error -i "$f" \
    -vf "scale='min(1920,iw)':-2" -c:v libx264 -preset veryfast -crf 26 -pix_fmt yuv420p \
    -c:a aac -b:a 96k -movflags +faststart "$out/$name.mp4"
done
echo "done. Rename the outputs to souls-01.mp4 ... souls-07.mp4 and arena-01.mp4 ... arena-04.mp4"
