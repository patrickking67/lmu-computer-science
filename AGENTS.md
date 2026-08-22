# Repository agent instructions

## Purpose

Archive of Patrick King's LMU Computer Science coursework, BS 2025. One directory per
course. The coursework itself lives here; this is not an index of links.

## Repository map

- `CMSI-1010/` … `CMSI-4072/`: one directory per course, named by catalog number
- `docs/archive.md`: git bundle inventory and restore procedure
- `docs/reference.md`: instructor course material, links only
- `docs/record.md`: authoritative course, term, title, grade, and credit record
- `docs/publication.md`: what publishing accepted, and what is still unresolved
- `docs/vendoring.md`: what was vendored from iCloud, and every exclusion rule
- `docs/building.md`: what compiles and runs, with verified commands and version pins
- `CONSOLIDATION-REVIEW.md`: record of the 2026-08-22 consolidation
- `scripts/check-ai-config.sh`: the repository check, also run in CI
- `.github/workflows/check-ai-config.yml`: runs that check on every push to `main`

## Setup and validation

No build, no test suite, no dependencies at the repository level. Individual course
projects carry their own toolchains and are archived, not maintained. Do not add a
repository-level build.

- Validation: `scripts/check-ai-config.sh`

The check runs in GitHub Actions on every push to `main` and on pull requests. It
warns rather than fails when the bundle archive is absent, because the archive is
expected to live off-machine and no runner will ever see it. A warning there means
"confirm your backup", not "the repository is broken".

## Architecture

This is an archive. The governing rule is that history is preserved, not rewritten.

- Never repair submitted coursework to make a test pass. A failing test that fails
  because the submitted code was wrong is the archive working correctly, and "fixing" it
  contradicts the grade recorded in `docs/record.md`. CMSI 3300's Homework 2 harness
  scores 7 of 19 against a homework the gradebook marks 51%, and four of those failures
  are a real bug: `ad_agent.py:44` calls `map_query` on a `pgmpy` `CausalInference`, which
  has never had that method. Record such defects in `docs/building.md`; do not edit them
  out. Fix the environment freely, never the answers.
- Before concluding that archived code is broken, confirm the toolchain and the pins.
  `docs/building.md` records four separate dependency breakages in the CMSI 3300 stack
  that all look like broken coursework and are not. `/usr/bin/javac` exists on macOS as a
  stub that only prints an install prompt, so `command -v javac` succeeding does not mean
  a JDK is present.
- Course directories are historical records. Do not refactor, reformat, modernize, or
  lint archived coursework. Broken or dated code is the correct state.
- Original student-authored READMEs in `CMSI-3550/` and `CMSI-3801/` are artifacts.
  Leave them as written.
- Thirteen upstream repositories were deleted from GitHub. Their commit histories exist
  only as git bundles in `~/Backups/lmu-cs-history-2026-08-22/`, outside this repository
  and outside GitHub. Never delete that directory. See `docs/archive.md`.
- `CMSI-3802/cloudscribe/` is a course-era snapshot at commit `25b48f1`, diverged 46
  commits behind the live [`cloudscribe`](https://github.com/patrickking67/cloudscribe).
  Never push it to that remote.
- Work that continues outside the archive is referenced, never vendored.
- Fifteen computer science courses, not thirteen. The count grew twice: CMSI 1900 is a
  zero-unit seminar that left no repository, and CMSI 3920 was only in the course audit.
  An inventory built from repositories alone will undercount. `docs/record.md` is
  authoritative for courses, terms, and titles.
- Course terms come from the author's course audit. Instructor course pages document
  whichever offering is currently published; all four checked disagreed with the
  enrollment term. Never take a term from a course-page URL.
- Source material lives in iCloud at `Projects/Loyola Marymount University/`. It is
  reorganized by hand and synced across devices, so verify it is settled before copying
  from it. Never copy while `brctl status` shows active transfers. The vendoring pass
  completed 2026-08-22; `docs/vendoring.md` records what it took and what it refused.
- An evicted iCloud file is invisible to the obvious checks. `ls` shows it, `find` finds
  it, `du` reports its full size, and reading it returns nothing. The only reliable test
  is an allocated block count of zero against a non-zero size:
  `stat -f '%z %b' <file>`. Census a tree that way before trusting any file count or
  byte total taken from it. Counts taken without this check have been wrong by an order
  of magnitude in this repository's history.
- A nested git repository becomes a bundle, never a vendored directory. This is what
  makes the file counts collapse: 40,479 of 40,676 candidate files in the 2026-08-22 pass
  were inside twelve nested repositories. Before bundling one, check whether an existing
  bundle already covers its objects; two of the twelve did.
- Filing location does not establish scope. Another department's material found inside a
  CMSI folder is still out of scope, and the publication decision does not extend to it.
- This repository is published publicly by the author's explicit decision, including
  instructor material, answer keys, exam solutions, and grades. `docs/publication.md`
  records what that decision accepted. Do not re-open it; do not quietly remove
  material it covers.
- Vendored coursework carries its own `.gitignore` files whose rules apply here.
  They have already dropped files that upstream tracked. Use `git add -f` for
  coursework, and never add a `.gitignore` rule that could match one. `pathfinder` and
  `myGainz` are live repositories.
- The check enforces that rule mechanically: it lists every ignored-but-present file
  and fails on anything that is not a build artifact. So `.gitignore` cannot be used
  to drop coursework quietly, including material held pending a publication decision.
  Held files stay untracked and visible in `git status`, never ignored.

## Coding and security

- Follow existing patterns before creating new abstractions.
- Never commit secrets. Two are already committed, in vendored CMSI 4072 coursework: a
  Google service-account private key at
  `CMSI-4072/Pathfinder/backend/serviceAccountKey.json` and a RapidAPI key hardcoded
  twice in `CMSI-4072/Pathfinder/backend/functions/index.js`. They block making this
  repository public and `scripts/check-ai-config.sh` fails on them today. Do not delete
  them to make the check pass; the remedy is rotation, and the archive question is the
  author's. See `docs/publication.md`. Firebase *Web* API keys (`AIza…`) in three front
  ends are not secrets and are reported rather than failed.
- A check that reports "no credentials" is worth exactly what its pattern list covers.
  The one here asserted a clean tree for as long as it existed while a private key sat in
  a tracked `.json`, because it matched three token shapes none of which a Firebase
  project produces. Widen the patterns before trusting the verdict.
- Do not commit build artifacts. `target/`, `node_modules/`, `dist/`, `build/`,
  `coverage/`, `.pytest_cache/`, `__pycache__/`, and `*.class` are ignored. A compiled
  binary with no extension is not caught by any of those; two were tracked from the first
  pass until 2026-08-22. Test with `file(1)`, matching `Mach-O` or `ELF` and **not**
  `executable`, which also describes every script carrying a shebang.
- Running a test suite here leaves artifacts in the working tree: `.pytest_cache/`,
  `coverage/`, and a `package-lock.json` in any npm project that lacked one. Clean them
  before committing. `scripts/check-ai-config.sh` catches them.
- Do not commit `*.bundle`. The largest exceeds GitHub's file size limit.

## Generated files

None. Nothing in this repository is generated.

## AI configuration maintenance

- This `AGENTS.md` is canonical. `CLAUDE.md`, `.github/copilot-instructions.md`, and
  `.codex/config.toml` are thin adapters and must not duplicate it.
- Update it only when durable repository knowledge changes.
- Repository-shared files only. No user-local or secret-bearing files.
- Run `scripts/check-ai-config.sh` before completion.

## Definition of done

- Requested behavior is complete.
- No archived coursework was modified as a side effect.
- Durable documentation is current.
- `scripts/check-ai-config.sh` passes.
- Commands run and unresolved risks are reported.
