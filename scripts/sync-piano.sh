#!/bin/sh
# Copies the current SodorPiano sources into piano-lib/.
# Usage: scripts/sync-piano.sh [path to the SodorPiano checkout]
set -eu
cd "$(dirname "$0")/.."
SRC=${1:-../SodorPiano}
[ -f "$SRC/src/ui/piano-vanilla.ts" ] || { echo "No SodorPiano checkout at $SRC" >&2; exit 1; }

rm -rf piano-lib/src
cp -R "$SRC/src" piano-lib/src
for f in LICENSE README.md THIRD_PARTY_NOTICES.md package.json; do
  [ -f "$SRC/$f" ] && cp "$SRC/$f" piano-lib/
done
rev=$(git -C "$SRC" rev-parse --short HEAD 2>/dev/null || echo unknown)
echo "$rev" > piano-lib/VERSION
echo "piano-lib synced with SodorPiano $rev"
