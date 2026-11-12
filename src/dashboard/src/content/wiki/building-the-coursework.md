---
title: Building the coursework
description: What still compiles, what does not, and why the difference matters.
order: 4
---

# Building the coursework

First verified 2026-08-22; every suite with an installed toolchain was re-run on
2026-11-11, and the Rust, Java, Kotlin, Haskell, Lua and OCaml suites were run on
2026-11-12. Where a suite fails, the useful question is whether the cause is the
code or the environment. Those are different facts.

## Verified working

| Course | Component | Result |
|---|---|---|
| CMSI 3801 | C | 25 passed |
| CMSI 3801 | C++ | 27 passed |
| CMSI 3801 | Python | 61 passed |
| CMSI 3801 | JavaScript | 19 passed |
| CMSI 3801 | TypeScript | 15 passed |
| CMSI 3801 | Swift | 68 passed |
| CMSI 3801 | Go | vets clean and runs; ships no tests |
| CMSI 3802 | cloudscribe | 143 passed, 99.66% statements |
| CMSI 3802 | Homework 5 regex exercise | 159 passed |
| CMSI 3801 | Rust `stack` | 4 passed |
| CMSI 3801 | Java | 71 passed |
| CMSI 3801 | Kotlin | 67 passed |
| CMSI 3801 | Haskell | 41 passed |
| CMSI 3801 | OCaml | 7 passed |
| CMSI 3550 | 6 Rust crates | build; define no tests |

## Failing, and why

| Suite | Cause |
|---|---|
| CMSI 3801 Lua | Lua 5.5 made for-loop variables read-only; `exercises.lua:60` assigns to one, so the module fails to load. The course used Lua 5.4. |
| CMSI 3550 `cmsi3550-pgt-p2p` | A literal `...` placeholder at `src/main.rs:112` and a misplaced block: the crate was submitted unfinished and does not compile on any Rust version. |

Neither was repaired. The CMSI 2130 Java projects were not run: see Known gap.

## Three traps

**`swift a.swift b.swift` runs only the first file.** The second is passed to it as an
argument. The Swift row was recorded as "exit 0, no output" for that reason until
2026-11-11: the file holding the 68 assertions had never run. Compile both with `swiftc`.

**Python needs 3.10 or newer.** `exercises.py` annotates with `str | None` at module
level. On Python 3.9 that raises at *import* time, so the suite does not fail; it never
collects.

**`javac` existing does not mean a JDK is installed.** On macOS `/usr/bin/javac` is a stub
that prints an install prompt. `command -v javac` succeeds anyway.

## Known gap

CMSI 2130 has five Java projects, 27 sources, seven JUnit test files, and no build file
of any kind. The JUnit imports are also split across versions 4 and 5, so a single build
file would need the JUnit 5 engine plus the vintage engine. None has been added, because
one cannot be verified without fetching the JUnit jars, and an unverified build file is a
claim rather than a fact. The main sources of four of the five compile with plain `javac`.

Full detail, including the pinned dependency stack the CMSI 3300 work needs, is in
`docs/building.md`.
