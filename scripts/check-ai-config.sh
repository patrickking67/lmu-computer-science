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
         docs/archive.md docs/reference.md docs/publication.md docs/record.md \
         docs/vendoring.md docs/building.md; do
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
scoped=0
while IFS= read -r a; do
  d=$(dirname "$a")
  [ "$d" = "." ] && continue
  scoped=1
  [ -f "$d/CLAUDE.md" ] && ok "$d has CLAUDE.md adapter" || bad "$d/AGENTS.md lacks CLAUDE.md adapter"
done < <(find . -name AGENTS.md -not -path './.git/*')
[ "$scoped" -eq 0 ] && ok "no scoped AGENTS.md below the root (none required)"

echo
echo "Prohibited files not tracked"
for p in CLAUDE.local.md .claude/settings.local.json; do
  if git ls-files --error-unmatch "$p" >/dev/null 2>&1; then bad "$p is tracked"; else ok "$p not tracked"; fi
done
if git ls-files | grep -q '\.bundle$'; then bad "*.bundle files are tracked"; else ok "no *.bundle tracked"; fi
# Keep this list in step with .gitignore and the AGENTS.md "Coding and security"
# list. It previously covered only target/, node_modules/ and dist/, so a tracked
# build/, coverage/, .pytest_cache/ or *.class went unreported.
if git ls-files \
  | grep -qE '(^|/)(target|node_modules|dist|build|coverage|__pycache__|\.pytest_cache|\.gradle|\.venv|\.ipynb_checkpoints)/|\.(class|pyc|o|obj)$'; then
  bad "build artifacts are tracked"
else
  ok "no build artifacts tracked"
fi

# An extensionless compiled binary matches no rule above. Two were tracked from
# the first consolidation pass until 2026-08-22; docs/building.md records them and
# names this scan as the way to catch the next one. Match Mach-O and ELF, never
# *executable*, which also describes every script carrying a shebang.
# `case ... esac` cannot appear inside `$( )` under bash 3.2, which is the only
# bash macOS ships (/bin/bash 3.2.57). The old form parsed on the ubuntu runner
# and died here with "syntax error near unexpected token `;;`", aborting the
# script before it reached the credential scan. grep says the same thing and
# parses everywhere.
binaries=$(git ls-files -z | while IFS= read -r -d '' f; do
  t=$(file -b "$f" 2>/dev/null)
  printf '%s' "$t" | grep -qE 'Mach-O|ELF|ar archive' && printf '%s\n' "$f"
done)
if [ -n "$binaries" ]; then
  bad "compiled binaries are tracked:"
  printf '%s\n' "$binaries" | sed 's/^/          /'
else
  ok "no compiled binaries tracked"
fi

echo
echo "MCP policy"
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
echo
echo "Credentials"
# This scan covers every tracked file, not just *.json, *.toml and *.md, and it
# looks for the shapes that are actually in reach of coursework: service-account
# private keys, provider tokens, and API keys pasted into request headers. The
# earlier version matched only sk-/ghp_/AKIA inside three extensions and so
# reported "ok" on a tree holding a Google service-account private key.
#
# The patterns live in this array rather than one regex so that each one can say
# what it is when it fires.
secret_names=(
  "private key block"
  "service-account private_key field"
  "OpenAI-style token"
  "GitHub token"
  "AWS access key id"
  "Slack token"
  "API key in a request header"
)
secret_pats=(
  '-----BEGIN [A-Z ]*PRIVATE KEY-----'
  '"private_key"[[:space:]]*:[[:space:]]*"[^"]{40,}"'
  'sk-[A-Za-z0-9_-]{20,}'
  '(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{22,}'
  'AKIA[0-9A-Z]{16}'
  'xox[baprs]-[A-Za-z0-9-]{10,}'
  '"(x-rapidapi-key|x-api-key|api[_-]?key|authorization)"[[:space:]]*:[[:space:]]*"[A-Za-z0-9_-]{24,}"'
)
found_secret=0
for i in "${!secret_pats[@]}"; do
  hits=$(git ls-files -z \
    | xargs -0 grep -lIE -- "${secret_pats[$i]}" 2>/dev/null \
    | grep -v '^scripts/check-ai-config.sh$' || true)
  if [ -n "$hits" ]; then
    found_secret=1
    bad "${secret_names[$i]} in tracked files:"
    printf '%s\n' "$hits" | sed 's/^/          /'
  fi
done
[ "$found_secret" -eq 0 ] && ok "no committed secrets"

# Firebase Web API keys are client identifiers, not secrets: Google publishes them
# in every web app bundle, and they are guarded by Security Rules and API-key
# restrictions rather than by being hidden. They are reported, never failed, so
# that the count stays visible and nobody removes one thinking it is a leak.
webkeys=$(git ls-files -z | xargs -0 grep -lIE -- 'AIza[0-9A-Za-z_-]{35}' 2>/dev/null \
  | grep -v '^scripts/check-ai-config.sh$' || true)
if [ -n "$webkeys" ]; then
  n=$(printf '%s\n' "$webkeys" | wc -l | tr -d ' ')
  warn "$n file(s) hold a Firebase Web API key (public by design; confirm Security Rules and key restrictions)"
else
  ok "no Firebase Web API keys"
fi

echo
echo "Archive integrity"
# Warning, not a failure: the archive is expected to move off this machine.
# Its absence here means "check your backup", not "the repository is broken".
ARCHIVE="${LMU_CS_ARCHIVE:-$HOME/Backups/lmu-cs-history-2026-08-22}"
if [ -d "$ARCHIVE" ]; then
  n=$(find "$ARCHIVE" -name '*.bundle' | wc -l | tr -d ' ')
  [ "$n" -eq 29 ] && ok "history archive present, $n bundles" \
                  || warn "history archive has $n bundles, expected 29"
else
  warn "history archive not at $ARCHIVE; confirm the off-machine copy (docs/archive.md)"
fi

# Vendored coursework carries its own .gitignore files. Those rules apply in
# this repository too and have already dropped files that upstream tracked.
# Anything ignored that is not a build artifact is a hole in the archive.
#
# Three buckets, because they mean three different things and used to share one
# message. Build and editor artifacts are expected and silent; test-run residue is
# the author's own to clean; anything left is a hole in the archive.
#
# The artifact list has to track .gitignore. It did not: .gitignore ignores
# *.class, *.pyc, *.o, *.obj, .gradle/ and .ipynb_checkpoints/, none of which were
# excluded here, so compiling any of the five CMSI 2130 Java projects made this
# check fail with "coursework files excluded by .gitignore" over a .class file.
artifact_re='(^|/)(target|node_modules|dist|build|__pycache__|\.venv|\.gradle|\.ipynb_checkpoints|\.idea|\.astro)/|\.egg-info/'
artifact_re="$artifact_re"'|\.(class|pyc|o|obj|swp|swo)$|(^|/)(\.DS_Store|Icon.?)$|(^|/)\._|~$'
residue_re='(^|/)(\.pytest_cache|coverage)/'

# A fourth bucket, because a third thing turned up that is none of the other
# three. Coding agents write session state into the working tree: `.remember/`
# carries its own `.gitignore` holding `*`, so all of it lands in the ignored
# list and every file of it was reported as "coursework excluded by .gitignore".
# It is not coursework and its absence is not a hole in the archive.
#
# Deliberately a narrow, root-anchored allowlist rather than a wildcard. The
# property worth keeping is that nobody can hide coursework by choosing a
# directory name, so this bucket warns rather than passing in silence, and it
# names only the two directories that actually occur.
tool_re='^\.(remember|claude)/'

ignored=$(git ls-files --others --ignored --exclude-standard || true)
residue=$(printf '%s\n' "$ignored" | grep -E "$residue_re" || true)
toolstate=$(printf '%s\n' "$ignored" | grep -E "$tool_re" || true)
leaked=$(printf '%s\n' "$ignored" \
  | grep -vE "$artifact_re" | grep -vE "$residue_re" | grep -vE "$tool_re" || true)

if [ -n "$leaked" ]; then
  bad "coursework files excluded by .gitignore:"
  printf '%s\n' "$leaked" | sed 's/^/          /'
else
  ok "no coursework silently excluded by .gitignore"
fi
if [ -n "$residue" ]; then
  bad "test-run residue in the working tree; clean it before committing:"
  printf '%s\n' "$residue" | sed 's/^/          /' | sort -u | head -5
fi
if [ -n "$toolstate" ]; then
  n=$(printf '%s\n' "$toolstate" | wc -l | tr -d ' ')
  warn "$n agent/tool state file(s) ignored (.remember, .claude); not coursework"
fi

echo
echo "Course coverage"
# docs/record.md is authoritative for the course list; this array mirrors it. An
# inventory built from directories alone undercounts, which is why the expected
# set is written out. The count in the message is derived from the array so the
# two cannot drift, and an unlisted CMSI-* directory is reported rather than
# passed over in silence.
courses=(1010 1900 2021 2120 2130 2210 2820 3300 3550 3751 3801 3802 3920 4071 4072)
missing=0
for c in "${courses[@]}"; do
  [ -f "src/courses/cmsi-$c/README.md" ] || { bad "src/courses/cmsi-$c/README.md missing"; missing=1; }
done
[ "$missing" -eq 0 ] && ok "all ${#courses[@]} course directories documented"
for d in src/courses/cmsi-*/; do
  [ -d "$d" ] || continue   # no nullglob: an unmatched glob arrives literally
  c=${d#src/courses/cmsi-}; c=${c%/}
  case " ${courses[*]} " in
    *" $c "*) ;;
    *) bad "src/courses/cmsi-$c is not in the expected course list (update docs/record.md)" ;;
  esac
done

echo
if [ "$fail" -eq 0 ]; then echo "PASS"; else echo "FAIL"; fi
exit "$fail"
