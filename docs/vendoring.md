# Vendoring pass, 2026-08-22

Second and final pass, adding course material that existed only in iCloud. The first
pass (`CONSOLIDATION-REVIEW.md`) drew from local git clones and covered code. This pass
covers lecture decks, syllabi, exams, and deliverable PDFs.

## Source

```text
~/Library/Mobile Documents/com~apple~CloudDocs/Projects/Loyola Marymount University/
```

Two subtrees were used: `Courses/<Term>/CMSI <number>/` for the fifteen course folders,
and `Senior Project/` for the Pathfinder deliverables.

Verify the source is settled before reading it. `brctl status` must show `client:idle`
and `caught-up`; `optimize-storage` must be `0` or macOS will evict files faster than
they can be copied. See "iCloud eviction" below.

## What was selected

Of 40,676 candidate files under the fifteen course folders, 120 were selected and 111
were committed. The reduction is almost entirely nested git repositories, which are
preserved as bundles rather than as working trees. The nine uncommitted files are the two
open publication questions in [`publication.md`](publication.md).

| Course | Committed | Held | Size |
|---|---|---|---|
| `CMSI-3300/` | 45 | 8 | 31.2 MB |
| `CMSI-3801/` | 9 | — | 3.6 MB |
| `CMSI-3802/` | 45 | — | 70.7 MB |
| `CMSI-3920/` | 0 | 1 | 0.1 MB |
| `CMSI-4072/` | 12 | — | 8.2 MB |

Largest single file 19.3 MB. Nothing approaches GitHub's 100 MB limit.

### What landed, by course

| Course | Added |
|---|---|
| `CMSI-3300/` | 28 lecture decks, classwork solutions, homework specs and grading record, final exam cheat sheet, syllabus. The four Berkeley Ghostbusters solution sets are held. |
| `CMSI-3801/` | `Coursework/`: syllabus plus answer keys for three exams and five homeworks |
| `CMSI-3802/` | Two `Coursework` trees: assignment specs, condensed notes, 16 instructor decks, exam preparation, 8 screenshots |
| `CMSI-3920/` | One course reading, held |
| `CMSI-4072/` | The seven-document senior project deliverable set, plus five delivered-application screenshots |

`CMSI-3801/`'s new `Coursework/` directory is documented here rather than in that
course's README, because `CMSI-3801/README.md` is an original student-authored artifact
that `AGENTS.md` requires be left as written.

## Bundles from this pass

Twelve nested git repositories were found in the source. Ten became new bundles and two
were already fully covered by existing ones. The archive went from 19 bundles to 29, and
`scripts/check-ai-config.sh` asserts 29. Four of the ten are not the author's
repositories. Full inventory and evidence: [`archive.md`](archive.md).

## Exclusion rules

| Rule | Files | Why |
|---|---|---|
| Inside a nested git repository | 40,479 | Preserved as bundles; see `docs/archive.md` |
| `Class Files/Math 251/` | 66 | Another department's material, including instructor solutions |
| Build artifacts, `.DS_Store`, `._*`, `*.pyc` | — | Already covered by `.gitignore` |
| iCloud stub `README.md` | 15 | Empty templates; see below |
| Duplicate content, by SHA-256 | 3 | Same bytes reachable by two paths |

### Math 251

`CMSI-3802/Coursework (from LMU)/Class Files/` contained a `Math 251/` folder holding 66
files, 33 of them instructor solutions. It is excluded. This repository is an archive of
computer science coursework, and `docs/publication.md` accepted publishing *CS*
instructor material, not a blanket waiver for anything that happened to be filed in a CS
folder. Filing location does not determine scope.

### Stub READMEs

Each iCloud course folder carries a generated `README.md` of roughly 250 bytes: course
metadata followed by the line "Add syllabus, notes, code, and graded work here." They are
to-do templates, not coursework. The metadata they carry is already in `docs/record.md`,
and six of them would have overwritten authored course READMEs that state each course's
preservation status. All were dropped.

## Courses with no vendored material

Seven courses have no coursework in either source and remain README-only: CMSI 1010,
1900, 2120, 2210, 2820, 3751, and 4071. For CMSI 1900, a zero-unit seminar, that is
expected. For the rest, the upstream repository was deleted before consolidation and
iCloud held only the stub README. This is a real gap in the archive, not an oversight.

CMSI 4071 is a special case: Senior Project I and II produced one continuous set of
Pathfinder deliverables, all exported together on 2025-05-07. They are vendored under
`CMSI-4072/Senior Project Deliverables/` because nothing distinguishes which semester
produced which document. `CMSI-4071/README.md` points there.

## iCloud eviction

"Optimize Mac Storage" evicts iCloud content when the disk fills and then declines to
rehydrate it. During the first attempt at this pass, 3,874 download requests returned
`attempts:0` after 39 minutes: the daemon was not retrying, it was refusing.

The tell is a file whose logical size is non-zero while its allocated block count is
zero:

```bash
stat -f '%z logical %b blocks -- %N' <file>
```

Census a tree before trusting it. A dataless file reads as present to `ls` and to
`find`, and `du` reports its logical size, so nothing short of the block count reveals
the problem:

```bash
find <dir> -type f -print0 | xargs -0 stat -f '%z %b' \
  | awk '{ if ($2==0 && $1>0) d++; else m++ } END { print "materialized", m, "dataless", d }'
```

To fix: set `defaults write com.apple.bird optimize-storage 0`, free disk space, then
request specific paths with `brctl download <path>`. Requesting a whole tree at once is
what wedged the daemon the first time.
