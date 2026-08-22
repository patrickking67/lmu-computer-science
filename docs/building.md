# Building and running the code

What in this archive still compiles and runs, verified on 2026-08-22, with the exact
commands used. Where a suite fails, this file says whether the cause is the coursework or
the environment, because those are different facts and the distinction matters more than
the pass rate.

**Nothing here is a fix list.** This is an archive of work as submitted. A failing test
that fails because the submitted code was wrong is the record doing its job; see
"Do not repair the coursework" below.

## Verified working

Run from the repository root unless a `cd` is shown.

| Course | Component | Command | Result |
|---|---|---|---|
| CMSI 3801 | C | `gcc -o /tmp/t c/string_stack.c c/string_stack_test.c && /tmp/t` | 25 passed, 0 failed |
| CMSI 3801 | C++ | `g++ -std=c++20 -o /tmp/t cpp/stack_test.cpp && /tmp/t` | 27 passed, 0 failed |
| CMSI 3801 | Python | `cd CMSI-3801/python && python3.14 -m unittest -q exercises_test` | 61 passed, 0 failed |
| CMSI 3801 | JavaScript | `cd CMSI-3801/javascript && node --test exercises.test.js` | 19 passed, 0 failed |
| CMSI 3801 | TypeScript | `cd CMSI-3801/typescript && npm install && npm test` | 15 passed, 0 failed |
| CMSI 3801 | Swift | `cd CMSI-3801/swift && swift exercises.swift main.swift` | exit 0, no output |
| CMSI 3802 | cloudscribe | `cd CMSI-3802/cloudscribe && npm install && npm test` | 143 passed, 0 failed, 99.66% statements |

Toolchains these were verified against: Node 24.18.0, Python 3.14.7, Apple Swift 6.4,
Apple clang/gcc as shipped with the Xcode command line tools.

### Python needs 3.10 or newer

`CMSI-3801/python/exercises.py` annotates with `str | None` at module level, which is
[PEP 604](https://peps.python.org/pep-0604/) syntax. On macOS's bundled Python 3.9 the
file raises `TypeError: unsupported operand type(s) for |` at *import* time, so the suite
does not fail, it never collects. Use 3.10 or newer. This was not recorded anywhere before
2026-08-22 and reads as broken code if you hit it on the system interpreter.

## Not verifiable on this machine

Absent toolchains, not evidence of broken code. Nothing was concluded about these.

| Course | Component | Missing |
|---|---|---|
| CMSI 3550 | 6 Rust crates | `cargo`, `rustc` |
| CMSI 3801 | Rust `stack` crate | `cargo`, `rustc` |
| CMSI 3801 | Go, Haskell, Kotlin, Lua, OCaml | `go`, `ghc`, `kotlinc`, `lua`, `ocaml` |
| CMSI 2130 | 5 Java projects | a JDK, and a build file — see below |
| CMSI 2021, 3550, 4072 | React and Vite front ends | not attempted |

`/usr/bin/java` and `/usr/bin/javac` exist on macOS as stubs that only print an install
prompt. `command -v javac` succeeding does **not** mean a JDK is present.

### CMSI 2130 has no build file

Five Java projects, 27 sources between them, `src/main/<package>` and
`src/test/<package>` layout, seven test files importing JUnit, and no `pom.xml`,
`build.gradle`, or anything else that declares the dependency. As committed they cannot be
compiled or run without assembling a classpath by hand.

The JUnit imports are also not consistent:

| Project | JUnit 4 files | JUnit 5 files |
|---|---|---|
| `A* Pathfinder` | 1 | 0 |
| `Constraint Satisfaction Problem` | 2 | 1 |
| `Distle Game` | 2 | 0 |
| `Huffman Coding Compression` | 1 | 0 |
| `Tic Tac Toe Game` | 1 | 0 |

So a single build file would need the JUnit 5 engine plus the vintage engine for the
JUnit 4 tests. No build file has been added here, because one cannot be verified without a
JDK on the machine, and an unverified build file is a claim rather than a fact. This is the
largest open item in the archive.

## CMSI 3300: the harness is here, the solutions are in a bundle

`CMSI-3300/Coursework/Homework/Homework Test Cases/` holds the instructor grading
harnesses for Homework 2 and Homework 4. They import modules that are **not** in this
repository:

| Harness | Imports | Where those live |
|---|---|---|
| `Homework 2 Grading/src/grading_tests.py` | `ad_agent`, `ad_agent_queries`, `constants` | `CMSI-3300_Homework-2.bundle` |
| `Homework 4 Grading/src/classifier_grading_tests.py` | `salary_predictor`, `toxicity_filter` | `CMSI-3300_Homework-4.bundle` |

The GitHub Classroom repositories that held the solutions were deleted; the bundles in
`~/Backups/lmu-cs-history-2026-08-22/` are the only surviving copies. See
[`archive.md`](archive.md). To reconstitute Homework 2:

```bash
git clone ~/Backups/lmu-cs-history-2026-08-22/CMSI-3300_Homework-2.bundle /tmp/hw2
cp "CMSI-3300/Coursework/Homework/Homework Test Cases/Homework 2 Grading/src/grading_constants.py" /tmp/hw2/src/
cp "CMSI-3300/Coursework/Homework/Homework Test Cases/Homework 2 Grading/src/grading_tests.py"     /tmp/hw2/src/
cp "CMSI-3300/Coursework/Homework/Homework Test Cases/Homework 2 Grading/dat/hw2_grading.csv"       /tmp/hw2/dat/
```

### The dependency stack has to be pinned to the course era

`pgmpy` and the 2024 numeric stack have both moved on. Installed naively, the suite fails
at import or collection for reasons that have nothing to do with the coursework. Four
separate breakages, each with a different cause:

| Symptom | Cause |
|---|---|
| `ModuleNotFoundError: No module named 'pkg_resources'` | setuptools ≥81 removed it; older `pgmpy` imports it |
| `AttributeError: module 'numpy' has no attribute 'product'` | removed in numpy 2.0 |
| `AttributeError: module 'numpy' has no attribute 'long'` | current scipy requires numpy ≥2, which the above forbids |
| `ValueError: assignment destination is read-only` | pandas 3 returns read-only `.values`; `pgmpy` writes to it |
| `XGBoostError ... Library not loaded: @rpath/libomp.dylib` | `xgboost` reaches `pgmpy` transitively and needs OpenMP |

This combination runs:

```bash
python3.12 -m venv /tmp/venv
/tmp/venv/bin/pip install 'pgmpy==0.1.26' 'numpy<2' 'pandas<2.2' 'scipy==1.13.1' \
                          'setuptools<81' pytest
brew install libomp    # only needed for the xgboost dylib that pgmpy pulls in
cd /tmp/hw2/src && /tmp/venv/bin/python -m pytest -q grading_tests.py
```

### What that produces, and why it is correct that it fails

**7 passed, 12 failed.** Every one of the 12 is the coursework, not the environment:

| Failures | Kind | Detail |
|---|---|---|
| 8 | Wrong numeric answers | e.g. VPI expected 796.82, computed 234.52; MEU expected 20.779, computed 1.371 |
| 4 | `AttributeError: 'CausalInference' object has no attribute 'map_query'` | `ad_agent.py:44` calls `map_query` on a `CausalInference`. That method has never existed on that class in any `pgmpy` release; `CausalInference` exposes `query` only. `most_likely_consumer` was broken as submitted. |

`CMSI-3300/Coursework/Homework/Homework Feedback and Grading.rtf` records the author's own
mark for this homework as **51%**. A suite that half fails is the archive agreeing with the
gradebook.

## Do not repair the coursework

Making these tests pass would mean editing submitted work so that it no longer resembles
what was submitted and graded. That falsifies the record this repository exists to keep,
and it would silently contradict the grades in [`record.md`](record.md).

Fix the *environment* freely: pins, toolchain versions, build files, documentation. Leave
the *answers* alone. If a defect in submitted coursework is worth recording, record it
here, next to the grade it earned.

## Known content defects

Not code that fails, but material that is incomplete. Recorded rather than repaired.

| Item | Detail |
|---|---|
| `CMSI-3300/Coursework/Test Cases/AttributesAndImportAdd.py` | 0 bytes |
| `CMSI-3550/cmsi3550-pgt-p2p/cards.json` | 0 bytes |
| `CMSI-3300/Coursework/Lectures/` | Lecture 8.1 and 14.2 are missing; the set runs 1 – 15.2 otherwise |
| CMSI 3300 homework | Only the Homework 4 specification survives. Homework 1 – 3 and 5 specs are gone. |

`CMSI-3801/python/__init__.py` is also 0 bytes, which is correct — it is a package marker.

## Removed build artifacts

Two compiled binaries were tracked from the first consolidation pass and were removed on
2026-08-22: `CMSI-3550/demo/main` and `CMSI-3801/cpp/stack_test`. Both were x86_64 Mach-O
executables on an arm64 machine, neither was source, and both rebuild from tracked sources
with the commands above. `.gitignore` covers `target/`, `node_modules/`, `dist/`, `build/`
and `__pycache__/`, but cannot catch an extensionless binary sitting next to its source;
check `file(1)` output rather than relying on it:

```bash
git ls-files -z | while IFS= read -r -d '' f; do
  case "$(file -b "$f")" in *Mach-O*|*ELF*|*"ar archive"*) echo "$f";; esac
done
```

Match on `Mach-O` and `ELF`, not on `executable`: `file` describes any script carrying a
shebang as "script text executable", so a bare `*executable*` pattern flags half the
Python in the repository.
