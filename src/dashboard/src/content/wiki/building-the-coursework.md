---
title: Building the coursework
description: What still compiles, what does not, and why the difference matters.
order: 3
---

# Building the coursework

Verified 2026-08-22. Where a suite fails, the useful question is whether the cause is the
code or the environment — those are different facts.

## Verified working

| Course | Component | Result |
|---|---|---|
| CMSI 3801 | C | 25 passed |
| CMSI 3801 | C++ | 27 passed |
| CMSI 3801 | Python | 61 passed |
| CMSI 3801 | JavaScript | 19 passed |
| CMSI 3801 | TypeScript | 15 passed |
| CMSI 3802 | cloudscribe | 143 passed, 99.66% statements |

## Two traps

**Python needs 3.10 or newer.** `exercises.py` annotates with `str | None` at module
level. On Python 3.9 that raises at *import* time, so the suite does not fail — it never
collects.

**`javac` existing does not mean a JDK is installed.** On macOS `/usr/bin/javac` is a stub
that prints an install prompt. `command -v javac` succeeds anyway.

## Known gap

CMSI 2130 has five Java projects, 27 sources, seven JUnit test files — and no build file
of any kind. The JUnit imports are also split across versions 4 and 5, so a single build
file would need the JUnit 5 engine plus the vintage engine. None has been added, because
one cannot be verified without a JDK, and an unverified build file is a claim rather than
a fact.

Full detail, including the pinned dependency stack the CMSI 3300 work needs, is in
`docs/building.md`.
