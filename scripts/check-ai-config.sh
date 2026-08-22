#!/usr/bin/env bash
# Validates the repository's AI agent configuration.
# Exits non-zero on any failure. Run before declaring work complete.
set -uo pipefail

cd "$(dirname "$0")/.." || exit 1
fail=0
ok()   { printf '  ok    %s\n' "$1"; }
bad()  { printf '  FAIL  %s\n' "$1"; fail=1; }
warn() { printf '  warn  %s\n' "$1"; }

echo "Required files"
for f in AGENTS.md CLAUDE.md README.md LICENSE .gitignore \
         .github/copilot-instructions.md .codex/config.toml .claude/settings.json \
         docs/archive.md docs/reference.md docs/publication.md; do
  [ -f "$f" ] && ok "$f" || bad "$f missing"
done

echo
echo "Adapter wiring"
if head -1 CLAUDE.md | grep -qx '@AGENTS.md'; then
  ok "CLAUDE.md imports AGENTS.md"
else
  bad "CLAUDE.md must start with '@AGENTS.md'"
fi
grep -q 'AGENTS.md' .github/copilot-instructions.md \
  && ok "copilot-instructions.md points at AGENTS.md" \
  || bad "copilot-instructions.md must reference AGENTS.md"

echo
echo "Scoped AGENTS.md adapters"
while IFS= read -r a; do
  d=$(dirname "$a")
  [ "$d" = "." ] && continue
  [ -f "$d/CLAUDE.md" ] && ok "$d has CLAUDE.md adapter" || bad "$d/AGENTS.md lacks CLAUDE.md adapter"
done < <(find . -name AGENTS.md -not -path './.git/*')

echo
echo "Prohibited files not tracked"
for p in CLAUDE.local.md .claude/settings.local.json; do
  if git ls-files --error-unmatch "$p" >/dev/null 2>&1; then bad "$p is tracked"; else ok "$p not tracked"; fi
done
if git ls-files | grep -q '\.bundle$'; then bad "*.bundle files are tracked"; else ok "no *.bundle tracked"; fi
if git ls-files | grep -qE '(^|/)(target|node_modules|dist)/'; then
  bad "build artifacts are tracked"
else
  ok "no build artifacts tracked"
fi

echo
echo "MCP policy"
shopt -s nullglob
mcp=(.mcp.json .cursor/mcp.json .vscode/mcp.json)
found=0
for m in "${mcp[@]}"; do
  [ -f "$m" ] || continue
  found=1
  if grep -qE '"(command|args)"|stdio|localhost|127\.0\.0\.1|npx|uvx|docker' "$m"; then
    bad "$m uses a prohibited local/stdio MCP definition"
  else
    ok "$m is remote-only"
  fi
done
[ "$found" -eq 0 ] && ok "no MCP config in repo (none required)"
if grep -rlE '(sk-[A-Za-z0-9]{16,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16})' \
     --include='*.json' --include='*.toml' --include='*.md' . 2>/dev/null \
     | grep -v '^./scripts/check-ai-config.sh$' | grep -q .; then
  bad "possible committed credential"
else
  ok "no credential-shaped strings"
fi

echo
echo "Archive integrity"
# Warning, not a failure: the archive is expected to move off this machine.
# Its absence here means "check your backup", not "the repository is broken".
ARCHIVE="${LMU_CS_ARCHIVE:-$HOME/Backups/lmu-cs-history-2026-08-22}"
if [ -d "$ARCHIVE" ]; then
  n=$(find "$ARCHIVE" -name '*.bundle' | wc -l | tr -d ' ')
  [ "$n" -eq 19 ] && ok "history archive present, $n bundles" \
                  || warn "history archive has $n bundles, expected 19"
else
  warn "history archive not at $ARCHIVE; confirm the off-machine copy (docs/archive.md)"
fi

# Vendored coursework carries its own .gitignore files. Those rules apply in
# this repository too and have already dropped files that upstream tracked.
# Anything ignored that is not a build artifact is a hole in the archive.
leaked=$(git ls-files --others --ignored --exclude-standard \
  | grep -vE '(^|/)(target|node_modules|dist|build|__pycache__|\.venv)/|\.DS_Store$' || true)
if [ -n "$leaked" ]; then
  bad "coursework files excluded by .gitignore:"
  printf '%s\n' "$leaked" | sed 's/^/          /'
else
  ok "no coursework silently excluded by .gitignore"
fi

echo
echo "Course coverage"
missing=0
for c in 1010 1900 2021 2120 2130 2210 2820 3300 3550 3751 3801 3802 4071 4072; do
  if [ -f "CMSI-$c/README.md" ]; then :; else bad "CMSI-$c/README.md missing"; missing=1; fi
done
[ "$missing" -eq 0 ] && ok "all 14 course directories documented"

echo
if [ "$fail" -eq 0 ]; then echo "PASS"; else echo "FAIL"; fi
exit "$fail"
