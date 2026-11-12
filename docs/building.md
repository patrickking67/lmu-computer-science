# Building and running the code

What in this archive still compiles and runs, with the exact commands used. First
verified on 2026-08-22; the suites with an installed toolchain were re-run on
2026-11-11. Where a suite fails, this file says whether the cause is the coursework or
the environment, because those are different facts and the distinction matters more than
the pass rate.

**Nothing here is a fix list.** This is an archive of work as submitted. A failing test
that fails because the submitted code was wrong is the record doing its job; see
"Do not repair the coursework" below.

## Suites run on 2026-11-11

Every suite whose toolchain was installed on the machine was re-run on 2026-11-11 from a
clean checkout. Run from the repository root unless a `cd` is shown. Compiled test
binaries go to `$TMPDIR` so nothing lands in the tree.

| Course | Suite | Toolchain | Command | Result |
|---|---|---|---|---|
| CMSI 3801 | C | Apple clang 21.0.0 | `cd src/courses/cmsi-3801 && gcc -o "$TMPDIR/c_t" c/string_stack.c c/string_stack_test.c && "$TMPDIR/c_t"` | 25 passed, 0 failed |
| CMSI 3801 | C++ | Apple clang 21.0.0, `-std=c++20` | `cd src/courses/cmsi-3801 && g++ -std=c++20 -o "$TMPDIR/cpp_t" cpp/stack_test.cpp && "$TMPDIR/cpp_t"` | 27 passed, 0 failed |
| CMSI 3801 | Python | Python 3.14.10 | `cd src/courses/cmsi-3801/python && python3.14 -m unittest -q exercises_test` | 61 passed, 0 failed |
| CMSI 3801 | JavaScript | Node 24.22.2 | `cd src/courses/cmsi-3801/javascript && node --test exercises.test.js` | 19 passed, 0 failed |
| CMSI 3801 | TypeScript | Node 24.22.2, TypeScript 5.9.3 | `cd src/courses/cmsi-3801/typescript && npm install && npm test` | 15 passed, 0 failed |
| CMSI 3801 | Swift | Apple Swift 6.4.2 | `cd src/courses/cmsi-3801/swift && swiftc -o "$TMPDIR/swift_t" exercises.swift main.swift && "$TMPDIR/swift_t"` | 68 passed, 0 failed |
| CMSI 3801 | Go | Go 1.27.3 | `cd src/courses/cmsi-3801/go && go vet restaurant.go && go run restaurant.go` | vets clean, runs to "Restaurant has closed" in about 30 s; the file has no tests |
| CMSI 3802 | cloudscribe | Node 24.22.2, c8 10 | `cd src/courses/cmsi-3802/cloudscribe && npm install && npm test` | 143 passed, 0 failed, 99.66% statements |
| CMSI 3802 | Homework 5, Exercise 1 (regex) | Node 24.22.2 | `cd "src/courses/cmsi-3802/cloudscribe/assignments/Homework 5/Exercise 1" && node --test` | 159 passed, 0 failed |

Nine suites run, nine green, no coursework edited. One breakage was real and it was in
this file, not in the coursework; see the next section.

Skipped on 2026-11-11, because the toolchain is not installed and nothing large was
installed to change that:

| Course | Suite | Missing |
|---|---|---|
| CMSI 3550 | 7 Rust crates | `cargo`, `rustc` |
| CMSI 3801 | Rust `stack` crate | `cargo`, `rustc` |
| CMSI 3801 | Java, Kotlin | a JDK, `kotlinc` |
| CMSI 3801 | Haskell, Lua, OCaml | `ghc`, `lua`, `ocaml` |
| CMSI 2130 | 5 Java projects | a JDK, and a build file (see below) |
| CMSI 3300 | Homework 2 and 4 harnesses | the solution bundles in `~/Backups/lmu-cs-history-2026-08-22/` were not on this machine; last run 2026-08-22, results below |
| CMSI 2021, 3550, 4072 | React and Vite front ends | not attempted: no test suites beyond the Create React App placeholder |

### The Swift command used to verify nothing

Until 2026-11-11 this file recorded Swift as
`swift exercises.swift main.swift`, "exit 0, no output". That command does not run the
tests. `swift a.swift b.swift` interprets the first file as a script and passes the
second to it as an argument, so only `exercises.swift` ran, which defines functions and
prints nothing. `main.swift` holds the 68 assertions and its last line prints the tally,
and it was never executed. Compiling the two files together with `swiftc` runs them:
68 passed, 0 failed. The coursework was right all along; the check was empty.

### Go has no tests to run

`go/restaurant.go` is the Homework 5 concurrency simulation: ten customers and three cooks
as goroutines, a buffered channel of three orders standing in for the waiter, a
`sync.WaitGroup` and an atomic order counter. It
ships no `_test.go`. `go vet` is clean and the program runs to completion, which is all
that can be claimed.

### Python needs 3.10 or newer

`src/courses/cmsi-3801/python/exercises.py` annotates with `str | None` at module level, which is
[PEP 604](https://peps.python.org/pep-0604/) syntax. On macOS's bundled Python 3.9 the
file raises `TypeError: unsupported operand type(s) for |` at *import* time, so the suite
does not fail, it never collects. Use 3.10 or newer. This was not recorded anywhere before
2026-08-22 and reads as broken code if you hit it on the system interpreter.

## Toolchain traps

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

`src/courses/cmsi-3300/Coursework/Homework/Homework Test Cases/` holds the instructor grading
harnesses for Homework 2 and Homework 4. They import modules that are **not** in this
repository:

| Harness | Imports | Where those live |
|---|---|---|
| `Homework 2 Grading/src/grading_tests.py` | `ad_agent`, `ad_agent_queries`, `constants` | `CMSI-3300_Homework-2.bundle` |
| `Homework 4 Grading/src/classifier_grading_tests.py` | `salary_predictor`, `toxicity_filter` | `CMSI-3300_Homework-4.bundle` |

The GitHub Classroom repositories that held the solutions were deleted; the bundles in
`~/Backups/lmu-cs-history-2026-08-22/` are the only surviving copies. See
[`archive.md`](archive.md). Both were reconstituted and run on 2026-08-22. Homework 2:

```bash
git clone ~/Backups/lmu-cs-history-2026-08-22/CMSI-3300_Homework-2.bundle /tmp/hw2
cp "src/courses/cmsi-3300/Coursework/Homework/Homework Test Cases/Homework 2 Grading/src/grading_constants.py" /tmp/hw2/src/
cp "src/courses/cmsi-3300/Coursework/Homework/Homework Test Cases/Homework 2 Grading/src/grading_tests.py"     /tmp/hw2/src/
cp "src/courses/cmsi-3300/Coursework/Homework/Homework Test Cases/Homework 2 Grading/dat/hw2_grading.csv"       /tmp/hw2/dat/
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
/tmp/venv/bin/pip install 'scikit-learn<1.6'   # Homework 4 only
brew install libomp    # only needed for the xgboost dylib that pgmpy pulls in
cd /tmp/hw2/src && /tmp/venv/bin/python -m pytest -q grading_tests.py
```

That exact install line was re-run in a clean 3.12 virtualenv on 2026-08-22 and
resolved to pgmpy 0.1.26, numpy 1.26.4, pandas 2.1.4, scipy 1.13.1, setuptools 80.10.2,
scikit-learn 1.5.2, reproducing the results below. `brew install libomp` installs a
Homebrew package on the machine; `brew uninstall libomp` reverses it.

The `scikit-learn` bound is weaker evidence than the others and should be read that way.
Every other pin here was found by hitting a failure and tracing it to the version that
caused it. `scikit-learn<1.6` was not: it was chosen because it satisfies the numpy 1.26
floor the other pins impose, and it resolved to 1.5.2. Nothing here establishes that 1.5.2
is what the course used in Fall 2024. It is a version the rest of the stack tolerates, and
it is the version the Homework 4 numbers below were measured under.

### Homework 2: what that produces, and why it is correct that it fails

**7 passed, 12 failed.** Every one of the 12 is the coursework, not the environment:

| Failures | Kind | Detail |
|---|---|---|
| 8 | Wrong numeric answers | e.g. VPI expected 796.82, computed 234.52; MEU expected 20.779, computed 1.371 |
| 4 | `AttributeError: 'CausalInference' object has no attribute 'map_query'` | `ad_agent.py:44` calls `map_query` on a `CausalInference`. That method has never existed on that class in any `pgmpy` release; `CausalInference` exposes `query` only. `most_likely_consumer` was broken as submitted. |

`src/courses/cmsi-3300/Coursework/Homework/Homework Feedback and Grading.rtf` records the author's own
mark for this homework as **51%**. A suite that half fails is the archive agreeing with the
gradebook.

### Homework 4, reconstituted the same way

**9 passed, 1 failed.** Same recipe, same pinned stack plus `scikit-learn<1.6`; the harness
needs both its own files copied in:

```bash
git clone ~/Backups/lmu-cs-history-2026-08-22/CMSI-3300_Homework-4.bundle /tmp/hw4
cp "src/courses/cmsi-3300/Coursework/Homework/Homework Test Cases/Homework 4 Grading/src/classifier_grading_tests.py" /tmp/hw4/src/
cp "src/courses/cmsi-3300/Coursework/Homework/Homework Test Cases/Homework 4 Grading/dat/salary_grading.csv"           /tmp/hw4/dat/
cd /tmp/hw4/src && /tmp/venv/bin/python -m pytest -q classifier_grading_tests.py
```

The one failure is not an error, it is a scoring tier. The salary classifier is graded at
three accuracy thresholds against an unseen grading set; the submitted model clears 0.80
and 0.82 and misses 0.84, scoring **0.827**. The recorded mark for Homework 4 is **96%**,
which is what clearing everything but the top stretch tier looks like.

One caveat worth stating rather than hiding: that verdict rests on a 1.3-point margin, and
accuracy can shift slightly with the scikit-learn version. Under 1.5.2 the tier misses. It
is not the kind of failure that would flip with a bug fix, but it is close enough to a
threshold that the version matters, which is why the version is pinned above.

## Do not repair the coursework

Making these tests pass would mean editing submitted work so that it no longer resembles
what was submitted and graded. That falsifies the record this repository exists to keep,
and it would silently contradict the grades in [`record.md`](record.md).

Fix the *environment* freely: pins, toolchain versions, build files, documentation. Leave
the *answers* alone. If a defect in submitted coursework is worth recording, record it
here, next to the grade it earned.

## CMSI 3802: the compiler's back end is broken, and the tests do not show it

Found 2026-08-22 while building the browser playground on `src/dashboard`. Recorded
here, not repaired — the rule in `AGENTS.md` applies: a test suite that passes over a
real defect is telling you something true about the submitted work.

`npm test` reports 143 passing and 99.66% statement coverage, and that number is honest
as far as it goes. Both defects below sit in the gap the suite does not cover. Line
coverage measures which lines ran, not whether what they produced was correct, and every
one of these is a function that ran and returned the wrong thing.

### Every example program fails to generate JavaScript

All seven programs in `examples/` parse, analyse and optimise, and none of them reach
JavaScript:

```
$ cd src/courses/cmsi-3802/cloudscribe && npm install
$ node src/cloudscribe.js examples/network_monitoring.csc parsed
Syntax is ok
$ node src/cloudscribe.js examples/network_monitoring.csc js
Error: generator: unhandled node kind TaskDeclaration
```

`generator.js` has no `TaskDeclaration` case, so it falls through to the `default` that
throws. `task` is the language's headline construct and every example is wrapped in one.
`analyzer.test.js` exercises `task` sixteen times; `generator.test.js` never does, which
is exactly why 143 tests pass.

### The optimiser damages exactly what it tries to optimise

`visit()` at `optimizer.js:34` returns the node untouched when no visitor is registered
for its kind. Four of the visitors that *are* registered compute their parts and then
fall off the end, returning `undefined`: `foldBinary` (line 50) when the operands are not
both literals, `UnaryExpression` (102), `Conditional` (115), and `WhileStatement` (74),
which returns `null` only for a literal-`false` test.

That `undefined` is then swallowed twice over:

- in an expression position, `generator.js:13` opens `exp()` with `if (e == null) return ""`,
  so it becomes an empty string rather than an error
- in a statement position, `visitBlock` (`optimizer.js:40`) drops results with `r == null`,
  which catches `undefined` as well as `null`, so the statement is deleted

The result is that constructs the optimiser ignores survive intact, and constructs it
handles are corrupted. Verified against the compiler on 2026-08-22:

| Source | Generated JavaScript | |
|---|---|---|
| `t = t + i;` | `t_0 = t_0 + i_1;` | correct — no `Assignment` visitor |
| `if x > 1 { … }` | `if (x_0 > 1) { … }` | correct — no `IfStatement` visitor |
| `print(1 + 2);` | `console.log(3);` | correct — both operands are literals, so it folds |
| `print(x + 1);` | `console.log();` | argument dropped |
| `let y = x + 1;` | `let y_1 = ;` | not valid JavaScript |
| `let y = -x;` | `let y_1 = ;` | same, via `UnaryExpression` |
| `while n > 0 { … }` | *nothing* | the whole loop is deleted |
| `while true { … }` | *nothing* | the whole program compiles to empty output |

The last two are the serious ones. A dropped argument is visible the moment you look at
the output; a deleted loop is not, and the program still runs.

`print(1 + 2)` compiling correctly is the reason the suite does not catch any of this:
the optimiser folds literal arithmetic before the generator ever sees a
`BinaryExpression`, so generator tests written against constants pass.

To reproduce, from `src/courses/cmsi-3802/cloudscribe` after `npm install`:

```
$ printf 'let n = 3;\nwhile n > 0 {\n  print("tick");\n  n--;\n}\nprint("end");\n' > /tmp/p.csc
$ node src/cloudscribe.js /tmp/p.csc js
let n_0 = 3;
console.log("end");
```

The four working stages are worth seeing, so the dashboard's CloudScribe playground runs
the real `analyzer.js`, `optimizer.js` and `generator.js` in the browser and shows the
generator failing on the example programs rather than hiding it.
`tests/site-data.test.mjs` pins these defects, so none can be quietly repaired or
quietly regress without a test failing.

## Known content defects

Not code that fails, but material that is incomplete. Recorded rather than repaired.

| Item | Detail |
|---|---|
| `src/courses/cmsi-3300/Coursework/Test Cases/AttributesAndImportAdd.py` | 0 bytes |
| `src/courses/cmsi-3550/cmsi3550-pgt-p2p/cards.json` | 0 bytes |
| `src/courses/cmsi-3300/Coursework/Lectures/` | Lecture 8.1 and 14.2 are missing; the set runs 1 – 15.2 otherwise |
| CMSI 3300 homework | Only the Homework 4 specification survives. Homework 1 – 3 and 5 specs are gone. |

`src/courses/cmsi-3801/python/__init__.py` is also 0 bytes, which is correct: it is a package marker.

## Removed build artifacts

Two compiled binaries were tracked from the first consolidation pass and were removed on
2026-08-22: `src/courses/cmsi-3550/demo/main` and `src/courses/cmsi-3801/cpp/stack_test`. Both were x86_64 Mach-O
executables on an arm64 machine, neither was source, and both rebuild from tracked sources
with the commands above. `.gitignore` covers `target/`, `node_modules/`, `dist/`, `build/`
and `__pycache__/`, but cannot catch an extensionless binary sitting next to its source;
check `file(1)` output rather than relying on it:

```bash
git ls-files -z | while IFS= read -r -d '' f; do
  t=$(file -b "$f")
  printf '%s' "$t" | grep -qE 'Mach-O|ELF|ar archive' && echo "$f"
done
```

Not a `case` statement, deliberately. bash 3.2 cannot parse `case`/`esac` inside a
command substitution, and 3.2.57 is the only bash macOS ships. The earlier form of
this loop is what `scripts/check-ai-config.sh` used, and it aborted the whole script
with a syntax error on any Mac while parsing cleanly on the ubuntu runner.

Match on `Mach-O` and `ELF`, not on `executable`: `file` describes any script carrying a
shebang as "script text executable", so a bare `*executable*` pattern flags half the
Python in the repository.

`scripts/check-ai-config.sh` now runs that scan itself, so the next tracked binary is
caught without anyone remembering to type the loop above.

## Dependency audit of the coursework, 2026-08-22

Recorded, not acted on. These are submitted projects and the rule in
[Do not repair the coursework](#do-not-repair-the-coursework) applies to their
dependencies exactly as it applies to their source: a lockfile is part of what was
handed in. `npm audit fix` here would rewrite submitted work to satisfy a scanner.

Five projects carry a lockfile, so `npm audit --package-lock-only` can resolve them
without installing anything:

| Project | Total | Critical | High | Moderate | Low |
|---|---|---|---|---|---|
| `cmsi-2021/Blog-Application` | 80 | 6 | 39 | 20 | 15 |
| `cmsi-2021/myGainz/mygainz` | 80 | 6 | 39 | 20 | 15 |
| `cmsi-3550/Final/p2p-app` | 65 | 3 | 33 | 14 | 15 |
| `cmsi-3550/cmsi3550-pgt-p2p/my-react-app` | 64 | 3 | 32 | 14 | 15 |
| `cmsi-4072/Pathfinder/Archive/my-app` | 59 | 3 | 28 | 15 | 13 |

348 advisories, 21 of them critical. Nine further `package.json` files carry no
lockfile, so no count exists for them; that is not a clean bill of health.

The number is less alarming than it looks, and it is worth knowing why before anyone
panics or dismisses it. Most of it is the Create React App build chain, which
`react-scripts@5.0.1` pins to versions that stopped receiving fixes: `@svgr/webpack`,
`css-select`, `http-proxy-middleware`, `braces`, `cross-spawn`, `@babel/traverse`.
None of that ships to a browser, so for a project nobody builds any more the practical
exposure is zero.

The part that is not build tooling: `firebase@9.13`, `@firebase/firestore`,
`@grpc/grpc-js`, `express`, `body-parser` and `form-data` are runtime dependencies and
do reach a built bundle.

### Two of these are still deployed

That matters because two of the front ends are still live and publicly reachable:

| Host | Status | Project |
|---|---|---|
| `patrickking-blogapp.web.app` | HTTP 200 | `cmsi-2021/Blog-Application` |
| `mygainz2022.web.app` | HTTP 200 | `cmsi-2021/myGainz` |
| `pathfinder-cae4f.web.app` | HTTP 404 | not deployed |

They serve 2022 bundles built against the Firebase SDK above. Whether to leave them up
is a decision about the deployment, not about this repository, and nothing here can
change it: the fix is to take the hosting down or redeploy, both from the Firebase
console.

### What the probes did and did not establish

Checked 2026-08-22 against all three Firebase projects, unauthenticated:

- No Realtime Database is provisioned on any of them. The classic open-rules
  exposure, an unauthenticated `GET /.json` returning the whole tree, cannot happen
  where no database exists.
- Storage object listing is closed on all three buckets.
- **Firestore and Storage security rules are not in this repository.** No `.rules`
  file is tracked anywhere, so the rules live only in the Firebase console and cannot
  be reviewed from a checkout. A pass on the two probes above says nothing about them.

The three `AIza…` strings in the front ends are Firebase Web API keys, which are
client identifiers rather than secrets; `scripts/check-ai-config.sh` reports them and
does not fail on them. They are guarded by Security Rules, which is the same set of
rules nobody can currently read from here.
