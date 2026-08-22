---
title: Building cloudscribe
description: A statically typed language for IT automation, and the five stages it compiles through.
order: 3
---

# Building cloudscribe

cloudscribe is a statically typed scripting language for IT automation that compiles to
JavaScript. It started as the CMSI 3802 term project and is still being developed.

The problem it targets: shell scripts are fast to write and impossible to trust. A typo in
a variable name is a runtime failure at 3am. cloudscribe keeps the terseness and adds a
type checker.

## Five stages

```text
source → parse → analyse → optimise → generate → JavaScript
```

**Parse** uses [Ohm](https://ohmjs.org), a PEG grammar toolkit. The grammar lives in
`cloudscribe.ohm` as a separate file rather than embedded in code, so the language
definition can be read on its own.

**Analyse** walks the parse tree and builds the AST, resolving names against a scope chain
and attaching types as it goes. This is where undeclared variables, type mismatches, and
bad call arities are caught — all of it before a single line of output exists.

**Optimise** does constant folding, dead branch elimination, and identity simplification:
`x + 0` becomes `x`, `if false {...}` disappears entirely.

**Generate** emits JavaScript, with a fresh-name generator so that a cloudscribe variable
can never collide with a JavaScript keyword or a runtime helper.

## Testing

143 tests, 99.66% statement coverage, run with the Node test runner and `c8`:

```bash
npm test
```

The coverage number is worth a caveat. High statement coverage on a compiler is easier
than it sounds — most of the work is walking trees, and a handful of programs touch a lot
of nodes. What actually catches regressions is the error-case suite: every diagnostic the
analyser can emit has a test that provokes it, because a type checker that fails to reject
bad input is worse than no type checker.

## Try it

```bash
cd src/courses/cmsi-3802/cloudscribe
npm install
npm test
node src/cloudscribe.js examples/hello.cs
```

The live version is at [github.com/patrickking67/cloudscribe](https://github.com/patrickking67/cloudscribe).
