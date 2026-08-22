# LMU CS Repository Consolidation Review

**Date:** 2026-08-22
**Scope:** Every local and remote copy of Patrick King's LMU Computer Science coursework.
**Status:** Complete. Reviewed, decided, and executed on 2026-08-22.

---

## Outcome

Decision taken: bundle every history, then vendor the working trees into a single
repository. Executed in full.

| # | Action | Result |
|---|---|---|
| 1 | Preserve all 19 repo histories as git bundles | Done. 285 MB in `~/Backups/lmu-cs-history-2026-08-22/`. All 19 verified by all-refs fetch, 0 failures. |
| 2 | Remove verified duplicate clones | Done. 13 root-level duplicates removed, each confirmed identical at HEAD first. |
| 3 | Strip nested `.git` directories | Done. 12 stripped. Histories live in the bundles. |
| 4 | Drop regenerable build artifacts | Done. 5 Rust `target/` trees, 43 MB. |
| 5 | Scaffold all 13 course directories | Done. Every course has a README with its bulletin title. |
| 6 | Rewrite `README.md` | Done. 13 dead links removed. |
| 7 | Adopt the AI agent repository standard | Done. `scripts/check-ai-config.sh` passes. |
| 8 | Prune the stale worktree | Done. |

Result: 511 MB and 19 nested repositories collapsed to 85 MB in one repository, with
360 files and zero history lost.

### Still open

| Action | Owner | Notes |
|---|---|---|
| Back up `~/Backups/lmu-cs-history-2026-08-22/` off this machine | Patrick | The only copy of 13 deleted repositories' history. Not on GitHub, too large to commit. |
| Push the consolidated repository | Patrick | Not pushed. Publishing to a public repo needs an explicit call. |
| Decide whether `lmu-cs` should stay public | Patrick | It is public today and now contains far more material than before. |

---

## Finding 1: thirteen GitHub repositories no longer exist

This is the urgent finding. `README.md` presents itself as a portfolio index linking to
per-course repositories. Thirteen of those repositories have been deleted from GitHub.
The local clones in this directory are the only surviving copies of their history.

Verified by direct API lookup, not inference:

| Repository the README links to | GitHub status | Local clone | Commits |
|---|---|---|---|
| `cmsi3801` | deleted | `cmsi3801/` | 108 |
| `cmsi3801-pk-fall2024` | deleted | `CMSI-3801/` | 108 |
| `cmsi3550` | deleted | `CMSI-3550/` | 18 |
| `cmsi3550-p2pfinal` | deleted | `cmsi3550-p2pfinal/` | 8 |
| `cmsi3550-pgt-p2p` | deleted | `cmsi3550-pgt-p2p/` | 4 |
| `cmsi3550-quizapr22` | deleted | `CMSI-3550/cmsi3550-quizapr22/` | 0 |
| `cmsi3802` | deleted | n/a, README link only | n/a |
| `cmsi3802-patrickthomas` | deleted | `CMSI-3802/` | 9 |
| `Java-Algorithms` | deleted | `Java-Algorithms/`, `CMSI-2130/` | 8 |
| `Artist-Data-API` | deleted | `Artist-Data-API/` | 17 |
| `Blog-Application` | deleted | `Blog-Application/` | 3 |
| `Compound-Interest-Calculator` | deleted | `Compound-Interest-Calculator/` | 10 |
| `Pathfinder-Old` | deleted | n/a, README link only | n/a |

Still alive on GitHub:

| Repository | Visibility | Local clone | Sync state |
|---|---|---|---|
| `lmu-cs` | public | this directory | in sync, 4 files only |
| `myGainz` | public | `mygainz/`, `CMSI-2021/myGainz/` | in sync |
| `pathfinder` | private | `pathfinder/`, `Senior Project/Pathfinder/` | in sync |
| `cloudscribe` | public | `~/GitHub/cloudscribe` | in sync |
| `peoplebase` | public | none, was `Database-Management-System` | n/a |

Two README links resolve to nothing at all: `cmsi3802` and `Pathfinder-Old` are both
deleted and have no local clone. That history is gone.

Total at-risk local data: 511 MB across this directory, no second copy anywhere.

## Finding 2: four names for one project

| Name | Where | Notes |
|---|---|---|
| `loyola-marymount-cs` | local directory, `~/GitHub/` | holds all the actual coursework |
| `lmu-cs` | GitHub repository | the live remote, 4 files |
| `LMU-Computer-Science` | old GitHub name | redirects to `lmu-cs`, still the local remote URL |
| `lmu-computer-science` | local directory, `~/GitHub/` | empty, created 2026-08-22 |

A fifth, historical: the stale worktree points at `~/Development/Personal/lmu-cs`,
a path that no longer exists. Evidence `lmu-cs` was the intended name before.

## Finding 3: nothing is committed

The parent repository tracks exactly four files: `AGENTS.md`, `CLAUDE.md`, `LICENSE`,
`README.md`. All 27 top-level coursework entries are untracked. The remote is 7 KB.

Cause: 19 nested `.git` directories. Git will not add a directory containing its own
`.git` to the parent index, so every course folder is invisible to `git add`.

```
CMSI-2021/myGainz          CMSI-3550/Final              Java-Algorithms
CMSI-2130                  CMSI-3550/cmsi3550-pgt-p2p   Senior Project/Pathfinder
CMSI-3550                  CMSI-3550/cmsi3550-quizapr22 mygainz
CMSI-3801                  CMSI-3802/cloudscribe        pathfinder
CMSI-3802                  cmsi3550-p2pfinal            Artist-Data-API
Compound-Interest-Calculator  cmsi3550-pgt-p2p          Blog-Application
cmsi3801
```

## Finding 4: six duplicate clone pairs, all identical

Verified by comparing HEAD SHAs. Each pair is byte-identical at HEAD, so deduplication
is safe and no history is lost by removing either side.

| Course-organized copy | Root-level duplicate | HEAD | Commits |
|---|---|---|---|
| `CMSI-3801` | `cmsi3801` | `660ee795` | 108 |
| `CMSI-2130` | `Java-Algorithms` | `622576e1` | 8 |
| `CMSI-3550/Final` | `cmsi3550-p2pfinal` | `8084ea9a` | 8 |
| `CMSI-3550/cmsi3550-pgt-p2p` | `cmsi3550-pgt-p2p` | `b733b81a` | 4 |
| `CMSI-2021/myGainz` | `mygainz` | `8f4f136c` | 95 |
| `Senior Project/Pathfinder` | `pathfinder` | `a38d37fa` | 57 |

Recommendation: keep the course-organized copy, drop the root-level duplicate. This
removes 6 of the 19 nested repos and about half the directory size.

All uncommitted changes across every nested repo are `.DS_Store` files and untracked
nested directories. Nothing of value is uncommitted.

## Finding 5: cloudscribe has split into two lineages

| Copy | HEAD | State | Role |
|---|---|---|---|
| `~/GitHub/cloudscribe` | `7eaf266` | in sync with origin | the live project |
| `CMSI-3802/cloudscribe` | `25b48f1` | 46 behind, 27 ahead | the CMSI 3802 coursework history |

The 27 "ahead" commits are the original course-era history, superseded when the project
was rewritten as a standalone. They are the academic record of the class project and
exist nowhere else. Preserve as an archive; do not push to `cloudscribe` origin.

## Finding 6: course inventory

Official titles from the [LMU Academic Bulletin](https://bulletin.lmu.edu/course-descriptions/cmsi/).
Where the current README uses a different title, the README is the older or colloquial
name; both are recorded.

| Course | Official bulletin title | README title | Local work | Files |
|---|---|---|---|---|
| CMSI 1010 | Computer Programming Laboratory | Computer Programming and Laboratory | none | 0 |
| CMSI 2021 | Web Application Development | Web Application Practicum | `myGainz` | 61 |
| CMSI 2120 | Data Structures and Applications | same | none, work sits in 2130 | 0 |
| CMSI 2130 | Algorithms and Analysis | same | 5 projects | 63 |
| CMSI 2210 | Computer Systems Organization | same | none | 0 |
| CMSI 2820 | Discrete Mathematics for Computer Science | not listed | none | 0 |
| CMSI 3300 | Artificial Intelligence | same | none | 0 |
| CMSI 3550 | Networks and the Internet | Networks and Internets | 8 projects | 599 |
| CMSI 3751 | Game Design | not listed | none | 0 |
| CMSI 3801 | Theories of Computer and Human Languages | Languages and Automata I | 13 languages | 70 |
| CMSI 3802 | Programming Language Concepts and Implementation | Languages and Automata II | `cloudscribe` + 2 HW | 104 |
| CMSI 4071 | Senior Project I | Senior Project I | none separate | 0 |
| CMSI 4072 | Senior Project II | Senior Project II | `Pathfinder` | 136 |

Six course folders are empty: 1010, 2120, 2210, 2820, 3300, 3751.

`CMSI-2130` contains: A* Pathfinder, Constraint Satisfaction Problem, Distle Game,
Huffman Coding Compression, Tic Tac Toe Game. Its git remote was `Java-Algorithms`,
which is really CMSI 2120 material, so the two courses' work is currently merged.

`CMSI-3801` contains one directory per language: c, cpp, go, haskell, java, javascript,
kotlin, lua, ocaml, python, rust, swift, typescript.

Unfiled at root, not yet mapped to a course: `Artist-Data-API`, `Blog-Application`,
`Compound-Interest-Calculator`, `Homework1`, `Homework2`, `demo`, `guessing_game`,
`homework1_myip`, `homework2_subcalc`, `quiz_feb21`. The last five are duplicates of
directories already inside `CMSI-3550`.

## Finding 7: instructor reference repositories

Course material from LMU faculty, useful as reference but not the user's own work.
These belong in a linked reference table, never vendored into this repository.

Dr. Ray Toal (`rtoal`), thesis advisor:

| Repository | Relevance |
|---|---|
| `cmsi-1010-classroom`, `cmsi1010` | CMSI 1010 |
| `cmsi-3801-classroom`, `lmu-cmsi-3801-template` | CMSI 3801 |
| `babyjs`, `bella`, `bella-compiler`, `bella-interpreter`, `bella2` | CMSI 3802 |
| `carlos`, `cassowary`, `astro`, `astro-compiler`, `astro-interpreter` | CMSI 3802 |
| `ael`, `ael-ohm`, `iki`, `iki-compiler`, `pigeon`, `dax`, `ple` | compiler course lineage |
| `plainscript`, `tiger-compiler`, `plang-glossary`, `js-ast` | language theory |
| `lmucs-senior-projects` | CMSI 4071/4072 |
| `enhanced-dining-philosophers`, `flask-security-homework` | assignments |

Prof. `jazzyfresh`:

| Repository | Relevance |
|---|---|
| `cmsi3801`, `cmsi3801-plang` | CMSI 3801 |
| `cmsi3550` | CMSI 3550 |
| `cmsi3510` | CMSI 3510, Operating Systems |
| `cmsi3520` | CMSI 3520, Database Systems |
| `cmsi281` | legacy Data Structures |
| `cmsi6998` | graduate topics |

## Finding 8: stale worktree

`git worktree list` reports a prunable worktree for branch
`claude/eager-aryabhata-eeef81` at `~/Development/Personal/lmu-cs/.claude/worktrees/`,
a path that no longer exists. Run `git worktree prune` before renaming this directory.

---

## Open decisions

**1. Orphaned coursework: vendor or recreate.** Thirteen repositories are gone from
GitHub and the local clones are the only copies. Two ways forward:

- *Vendor.* Strip the nested `.git` directories and commit the working trees into
  `lmu-cs` as one repository. One repo, one push, everything safe. Cost: the 19
  individual commit histories are lost, roughly 350 commits.
- *Recreate.* Push each orphaned clone back to a fresh GitHub repository, keep `lmu-cs`
  as the index. Preserves every commit and keeps the README's linking model honest.
  Cost: 13 new repositories to create and maintain.

A third option preserves both: vendor the working trees into `lmu-cs` for a single
readable portfolio, and archive the full clones as git bundles committed alongside or
stored off-repo. Nothing is lost and there is one repository to maintain.

**2. Repository name.** Recommendation is `lmu-cs`, addressed in the summary. Not
really open, but recorded here because three candidate names were in play.

**3. Pathfinder.** Patrick intends to rebuild Pathfinder as a personal product. It is
alive and private on GitHub, so it should be referenced from `lmu-cs`, not copied into
it. The academic deliverables under `Senior Project/Pathfinder/` (Deliverables,
Homework, Final Product Delivery) are coursework and stay in `lmu-cs`. The application
code becomes its own product repository.

---

## What was executed

Every destructive step was gated on a verification that ran first.

| Step | Gate that ran before it |
|---|---|
| Removed 13 duplicate directories | HEAD SHA comparison, or content MD5 for the non-git copies |
| Stripped 12 nested `.git` directories | All 19 bundles fetched into bare repos, commit counts matched |
| Removed 5 `target/` trees | Confirmed a sibling `Cargo.toml`, so regenerable |
| Removed `CMSI-3550/cmsi3550-quizapr22` | `git count-objects` reported 0 objects, 0 files |
| Removed duplicate 19 MB `Homework1.pdf` | Identical MD5 to the copy kept in `cloudscribe/assignments/` |

Not done, deliberately:

- Nothing was pushed to GitHub. No repository was created, renamed, or deleted remotely.
- Archived coursework was not reformatted, refactored, or linted.
- Original student READMEs in `CMSI-3550/` and `CMSI-3801/` were left exactly as written.
- `CMSI-3802/cloudscribe/` was not pushed to the live `cloudscribe` remote.

## Corrections to the earlier findings

Two statements in the original review were wrong and are corrected here.

- The old README labelled `Java-Algorithms` as CMSI 2120. Its contents are CMSI 2130
  project work. Filed under `CMSI-2130/`; `CMSI-2120/` has no preserved work.
- `cmsi3550-quizapr22` was described as a clone. It contained zero git objects and zero
  files, so it was a failed clone. That quiz was never on this machine and its remote is
  deleted, so it is unrecoverable.
