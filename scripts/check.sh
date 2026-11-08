#!/usr/bin/env bash
# One command for everything that is fast and offline:
#
#   1. the repository check (scripts/check-ai-config.sh)
#   2. the site-data tests (tests/*.test.mjs)
#   3. the lmucs package tests
#   4. the site build (src/dashboard)
#
# Usage: ./scripts/check.sh [--no-build]
#
# It leaves no test residue behind: pytest runs without its cache and Python
# writes no bytecode, so the repository check passes again afterwards. The
# build writes src/dashboard/dist/, which is ignored. Course toolchains are not
# run here; docs/building.md has those commands.
#
# Written for bash 3.2, the only bash macOS ships (see AGENTS.md).
set -uo pipefail

cd "$(dirname "$0")/.." || exit 1
root=$(pwd)
build=1
for arg in "$@"; do
  case "$arg" in
    --no-build) build=0 ;;
    -h|--help) sed -n '2,15p' "$0"; exit 0 ;;
    *) echo "unknown option: $arg" >&2; exit 2 ;;
  esac
done

export PYTHONDONTWRITEBYTECODE=1
failed=""
step() { printf '\n== %s\n' "$1"; }
record() { if [ "$1" -ne 0 ]; then failed="$failed\n  - $2"; fi; }

need() {
  command -v "$1" >/dev/null 2>&1 || { echo "check.sh: $1 is required ($2)" >&2; exit 2; }
}
need node "Node 22.18 or later"
need npm "ships with Node"
need python3 "Python 3.10 or later"

# Type stripping, which lets the tests import the site's .ts data files, needs
# no flag from Node 22.18 on. Older Node fails with a confusing syntax error.
node -e '
  const [a, b] = process.versions.node.split(".").map(Number);
  if (a < 22 || (a === 22 && b < 18)) {
    console.error("check.sh: Node " + process.versions.node + " is too old; need 22.18 or later");
    process.exit(1);
  }' || exit 2
python3 -c 'import pytest' 2>/dev/null \
  || { echo "check.sh: pytest is required (python3 -m pip install pytest)" >&2; exit 2; }

step "Repository check"
/bin/bash scripts/check-ai-config.sh
record $? "repository check"

step "Site-data tests"
node --test "tests/*.test.mjs"
record $? "site-data tests"

step "lmucs tests"
(cd src/packages/lmucs && python3 -m pytest -q -p no:cacheprovider tests)
record $? "lmucs tests"

if [ "$build" -eq 1 ]; then
  step "Site build"
  (
    cd src/dashboard || exit 1
    [ -d node_modules ] || npm ci --no-audit --no-fund || exit 1
    npm run build
  )
  record $? "site build"
fi

cd "$root" || exit 1
if [ -n "$failed" ]; then
  printf '\nFAIL:%b\n' "$failed"
  exit 1
fi
printf '\nPASS\n'
