---
title: Building cloudscribe
description: A statically typed language for IT automation, and the four stages it compiles through.
order: 3
---

# Building cloudscribe

cloudscribe is a statically typed scripting language for IT automation that compiles to
JavaScript. It started as the CMSI 3802 term project and is still being developed.

The problem it targets: shell scripts are fast to write and impossible to trust. A typo in
a variable name is a runtime failure at 3am. cloudscribe keeps the terseness and adds a
type checker.

## Four stages

```text
source → parse → analyse → optimise → generate → JavaScript
```

**Parse** uses [Ohm](https://ohmjs.org), a PEG grammar toolkit. The grammar lives in
`cloudscribe.ohm` as a separate file rather than embedded in code, so the language
definition can be read on its own.

**Analyse** walks the parse tree and builds the AST, resolving names against a scope chain
and attaching types as it goes. This is where undeclared variables, type mismatches, and
bad call arities are caught, all of it before a single line of output exists.

**Optimise** was meant to do constant folding, dead-branch elimination and identity
simplification. It does the first one. `1 + 2` becomes `3`. `x + 0` does not become `x`,
and `if false { … }` does not disappear; it is emitted verbatim. See below.

**Generate** emits JavaScript, with a fresh-name generator so that a cloudscribe variable
can never collide with a JavaScript keyword or a runtime helper.

## Testing, and what 99.66% did not buy

143 tests pass, at 99.66% statement coverage, run with the Node test runner and `c8`:

```bash
cd src/courses/cmsi-3802/cloudscribe
npm install
npm test
```

Both numbers are true. Neither is worth much, and finding out why is the most useful thing
this project taught me.

Building the playground on the Programs page meant running the compiler outside its test
suite for the first time: on its own example programs, end to end. Every one of them
fails:

```bash
node src/cloudscribe.js examples/network_monitoring.csc parsed
# Syntax is ok

node src/cloudscribe.js examples/network_monitoring.csc js
# Error: generator: unhandled node kind TaskDeclaration
```

`task` is the language's whole reason to exist, and the generator has no case for it.
`analyzer.test.js` exercises `task` sixteen times; `generator.test.js` never does.

The second defect is quieter and worse. Four visitors in `optimizer.js` compute their
result and then fall off the end of the function, returning `undefined`. In an expression
position the generator's `exp()` turns that into an empty string; in a statement position
the optimiser's own `visitBlock` filters it out. So:

| Source | Generated |
|---|---|
| `t = t + i;` | `t_0 = t_0 + i_1;`: correct, because nothing visits an assignment |
| `print(x + 1);` | `console.log();`: the argument is gone |
| `let y = x + 1;` | `let y_1 = ;`: not valid JavaScript |
| `while n > 0 { … }` | nothing at all; the loop is deleted |

The optimiser only breaks what it tries to optimise. Everything it has no visitor for
passes through untouched and works.

And `print(1 + 2)` emits `console.log(3)` perfectly, because the folding path runs before
the generator ever sees a binary expression, which is exactly why a generator test suite
written against literal arithmetic goes green over all of it.

Statement coverage measures which lines ran. It cannot tell you whether what they returned
was right, and every one of these is a function that ran and returned the wrong thing.

None of it is repaired. Editing submitted work to make it look better would delete the
only interesting thing here. It is written up in `docs/building.md`, pinned by tests in
`tests/site-data.test.mjs` so it cannot silently change, and visible in the playground:
switch to the Generate tab and watch it throw.

## Try it

The playground on the [Programs](../programs) page runs all of this in your browser: the
real `analyzer.js`, `optimizer.js` and `generator.js`, on the real example programs.

Development continues at
[github.com/patrickking67/cloudscribe](https://github.com/patrickking67/cloudscribe).
