#!/bin/sh
# Rebuilds index.html, then runs every browser scenario and the lesson check. Exits non-zero if anything fails.
cd "$(dirname "$0")/../.." || exit 1
export PYTHONUTF8=1
python3 tools/build.py || exit 1
failed=0
for t in tools/tests/*.js; do
  if out=$(python3 tools/tests/play.py "$t" 2>&1); then echo "pass  $(basename "$t")"
  else echo "FAIL  $(basename "$t")"; echo "$out" | grep -E '^(ERROR|LOG FAIL|LOG CHANGED|PLAY FAILED)' | sed 's/^/      /'; failed=1; fi
done
if python3 tools/tests/lessons.py >/dev/null 2>&1; then echo "pass  lessons.py"; else echo "FAIL  lessons.py"; failed=1; fi
exit $failed
