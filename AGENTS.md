# Repository agent instructions

## Purpose

Patrick King's LMU computer science coursework, Fall 2021 – Spring 2025, plus the site
that presents it. The code itself lives here; this is not an index of links.

## Repository map

- `src/courses/cmsi-1010/` … `src/courses/cmsi-4072/`: one directory per course, named by catalog number
- `src/dashboard/`: the site (Astro + Tailwind), deployed to GitHub Pages
- `src/packages/lmucs/`: Python package that reads and verifies `docs/record.md`
- `docs/archive.md`: git bundle inventory and restore procedure
- `docs/reference.md`: instructor course material, links only
- `docs/record.md`: authoritative course, term, title, grade, and credit record
- `docs/publication.md`: what publishing accepted, and what is still unresolved
- `docs/vendoring.md`: what was vendored from iCloud, and every exclusion rule
- `docs/building.md`: what compiles and runs, with verified commands and version pins
- `tests/site-data.test.mjs`: checks the dashboard's claims against the tree
- `scripts/check-ai-config.sh`: the repository check, also run in CI
- `.github/workflows/`: the repository check, the Python package, the site-data tests, Pages

## Setup and validation

No build at the repository root. `src/dashboard` and `src/packages/lmucs` carry their
own, and each course project carries its own toolchain. Course projects are not
maintained. Do not add a repository-level build that spans them.

- Validation: `scripts/check-ai-config.sh`
- Site data: `node --experimental-strip-types --test tests/` (needs `lmucs` importable)
- Package: `pytest` in `src/packages/lmucs`

Running any of these leaves artifacts. `.pytest_cache/` and `lmucs.egg-info/` appear the
moment pytest or an editable install runs, and `check-ai-config.sh` fails on them, which
is the intended order: clean before committing.

The check runs in GitHub Actions on every push to `main` and on pull requests. It
warns rather than fails when the git bundles are absent, because they live off-machine
and no runner will ever see them. A warning there means "confirm your backup", not
"the repository is broken".

## Architecture

Coursework in `src/courses/` is submitted work. The governing rule is that it stays as
submitted; everything outside it is normal, maintained code.

- Never repair submitted coursework to make a test pass. A test that fails because the
  original code was wrong is telling you something true, and editing it to pass just
  deletes the information — it also contradicts the grade in `docs/record.md`. CMSI 3300's Homework 2 harness
  scores 7 of 19 against a homework the gradebook marks 51%, and four of those failures
  are a real bug: `ad_agent.py:44` calls `map_query` on a `pgmpy` `CausalInference`, which
  has never had that method. Record such defects in `docs/building.md`; do not edit them
  out. Fix the environment freely, never the answers.
- Before concluding that course code is broken, confirm the toolchain and the pins.
  `docs/building.md` records four separate dependency breakages in the CMSI 3300 stack
  that all look like broken coursework and are not. `/usr/bin/javac` exists on macOS as a
  stub that only prints an install prompt, so `command -v javac` succeeding does not mean
  a JDK is present.
- Do not refactor, reformat, modernize, or lint anything under `src/courses/`. Dated
  code is the correct state there.
- Original student-authored READMEs in `src/courses/cmsi-3550/` and `src/courses/cmsi-3801/`
  are part of the submitted work. Leave them as written.
- Thirteen upstream repositories were deleted from GitHub. Their commit histories exist
  only as git bundles in `~/Backups/lmu-cs-history-2026-08-22/`, outside this repository
  and outside GitHub. Never delete that directory. See `docs/archive.md`.
- `src/courses/cmsi-3802/cloudscribe/` is a course-era snapshot at commit `25b48f1`, diverged 46
  commits behind the live [`cloudscribe`](https://github.com/patrickking67/cloudscribe).
  Never push it to that remote.
- Work that continues in its own repository is referenced, never copied in.
- Course terms and the course list are checked in three places, and all three must agree:
  `docs/record.md`, `src/courses/`, and `src/dashboard/src/data/courses.ts`.
- Fifteen computer science courses, thirteen of which produced a repository. CMSI 1900 is
  a zero-unit seminar and CMSI 3920 a summer session; both carry a directory holding only
  a README, so a count of repositories undercounts the courses by two while a count of
  directories does not. `docs/record.md` is authoritative for courses, terms, and titles;
  `lmucs verify` checks the tree against it in both directions, and
  `tests/site-data.test.mjs` checks the dashboard's copy of the same list.
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
- The dashboard runs programs in the page instead of printing commands to copy. Three
  paths, and the distinction is not cosmetic: `inline` reads a program's own files at
  build time and hands them to a sandboxed iframe as `srcdoc`; `container` boots a
  StackBlitz WebContainer against a **public** GitHub repository; `source` is everything
  else. StackBlitz cannot reach a private repository, so only `cloudscribe` and `myGainz`
  can be containerized — this repository and `pathfinder` cannot, and no amount of
  configuration changes that. Never mark a program runnable that will not boot.
- The inline embed reads out of `src/courses/` and writes nothing back. It also cannot
  resolve `Compound-Interest-Calculator/index.html`'s reference to `interest.jpg`, because
  the file is `Interest.jpeg` — a real defect in the submitted work. The embed rewrites
  that one `src` at build time; the coursework keeps the broken reference.
- Astro rewrites `import.meta.url` in the built output, so a build-time file read must
  anchor on the repository root found by walking up from `process.cwd()`, not on the
  component's own URL. `src/dashboard/src/lib/repo.ts` is the only thing that reads the
  coursework, and it only reads.
- The dashboard's data files make checkable claims — a path, a line range, a line count —
  and every one of them can rot without breaking the build. `tests/site-data.test.mjs`
  checks them against the tree instead: paths exist, quoted ranges are inside their file,
  `courses.ts` and `src/courses/` agree both ways, no private repository is marked
  containerizable, and the published counts match a fresh `lmucs stats --json`. Add a
  test with any new claim rather than trusting the data file.
- Published numbers come from `lmucs stats`, never from a hand count. It counts tracked
  files only, so an untracked scratch file cannot inflate a total, and it excludes
  lockfiles.
- Commits are authored by Patrick King. On 2026-08-22 five commits carrying an assistant
  identity were re-authored to match the rest of the history.
- Course projects carry their own `.gitignore` files whose rules apply here. They have
  already dropped files that upstream tracked. Use `git add -f` for coursework, and never
  add a `.gitignore` rule that could match one. `pathfinder` and `myGainz` are live
  repositories.
- The check enforces that rule mechanically: it lists every ignored-but-present file
  and fails on anything that is not a build artifact. So `.gitignore` cannot be used
  to drop coursework quietly, including material held pending a publication decision.
  Held files stay untracked and visible in `git status`, never ignored.

## Coding and security

- Follow existing patterns before creating new abstractions.
- Never commit secrets. Two were committed in CMSI 4072 coursework and were removed on
  2026-08-22: a Google service-account private key (file deleted and purged from every
  commit) and a RapidAPI key (replaced with `REVOKED-RAPIDAPI-KEY` across all history).
  Rotation in the respective consoles is the part a rewrite cannot do. See
  `docs/publication.md`. Firebase *Web* API keys (`AIza…`) in three front ends are not
  secrets and are reported rather than failed.
- History was rewritten once, on 2026-08-22, to remove those credentials. That is the only
  sanctioned reason to do it again.
- `src/courses/cmsi-4072/Pathfinder/backend/index.js` requires a `serviceAccountKey.json`
  that no longer exists. Do not fabricate one; supply your own to run it.
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
- No coursework under `src/courses/` was modified as a side effect.
- Durable documentation is current.
- `scripts/check-ai-config.sh` passes.
- Commands run and unresolved risks are reported.
