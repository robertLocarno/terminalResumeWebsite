#!/usr/bin/env bash

INPUT="./src/assets/bootloaderAnimation/source.jpg"
OUTPUT="./src/assets/bootloaderAnimation/frames.txt"

SIZE="120x80"
COLORS=16


chafa -c $COLORS -f symbols --color-space din99d --dither none --fill ascii -O 9 -p off -s "$SIZE" --color-extractor median "$INPUT" >| "$OUTPUT"
