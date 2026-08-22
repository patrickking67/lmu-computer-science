---
title: Archive and history
description: Why thirteen repositories exist only as git bundles, and how to restore one.
order: 2
---

# Archive and history

Thirteen of the original per-course repositories were deleted from GitHub. Their working
trees are vendored into `src/courses/`; their commit histories survive only as git
bundles, twenty-nine in total, held off-machine.

## Why bundles rather than directories

A nested git repository inside another repository is not preservable as a plain
directory — the history is the point, and a copy of the working tree throws it away. So
each one became a bundle instead.

This is also what makes file counts collapse. In the 2026-08-22 vendoring pass, 40,479 of
40,676 candidate files were inside twelve nested repositories. What remained was 197
files.

## Restoring one

```bash
git clone ~/Backups/lmu-cs-history-2026-08-22/CMSI-3300_Homework-2.bundle /tmp/hw2
```

The bundle is a complete repository. Clone it and the full history comes with it.

## A counting trap worth knowing

An evicted iCloud file is invisible to the obvious checks. `ls` shows it, `find` finds it,
`du` reports its full size — and reading it returns nothing. The only reliable test is an
allocated block count of zero against a non-zero size:

```bash
stat -f '%z %b' <file>
```

Counts taken without that check have been wrong by an order of magnitude in this
repository's history.
