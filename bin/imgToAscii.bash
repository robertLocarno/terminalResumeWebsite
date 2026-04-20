#!/usr/bin/env bash

INPUT_PREFIX="./src/assets/bootloaderAnimation/frame_"
INPUT_SUFFIX=".png"
OUTPUT="./src/assets/bootloaderAnimation/frames.txt"

SIZE="120x80"
COLORS="full"

FIRST_FRAME_ID=1
LAST_FRAME_ID=134

: >| "$OUTPUT"

for i in $(seq "$FIRST_FRAME_ID" "$LAST_FRAME_ID"); do
  FRAME_ID=$(printf "%04d" "$i")
  INPUT="${INPUT_PREFIX}${FRAME_ID}${INPUT_SUFFIX}"
  [ "$i" -gt "$FIRST_FRAME_ID" ] && echo "--F--" >> "$OUTPUT"
  chafa -c $COLORS -f symbols --color-space din99d --dither bayer --fill ascii -O 9 -w 9 -p off -s "$SIZE" --color-extractor average --dither-intensity 10.0 "$INPUT" >> "$OUTPUT"
done
