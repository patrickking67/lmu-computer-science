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
- `CONSOLIDATION-REVIEW.md`: record of the 2026-08-22 consolidation

## Setup and validation

No build, no test suite, no dependencies at the repository level. Individual course
projects carry their own toolchains and are archived, not maintained. Do not add a
repository-level build.

- Validation: `scripts/check-ai-config.sh`

## Architecture

This is an archive. The governing rule is that history is preserved, not rewritten.

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

## Coding and security

- Follow existing patterns before creating new abstractions.
- Never commit secrets.
- Do not commit build artifacts. `target/`, `node_modules/`, and `dist/` are ignored.
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
