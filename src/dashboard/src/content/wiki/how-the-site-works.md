---
title: How the site works
description: Why the pages read the repository at build time, and what stops them lying about it.
order: 2
---

# How the site works

The dashboard makes claims about this repository. It says a program lives at a
path, that a snippet quotes particular lines of a particular file, that there
are 15,950 lines of coursework here. Every one of those can go stale without
breaking anything: a file moves, a course is renamed, a language is added, and
the page keeps rendering — now wrong.

So nothing on the site is retyped from the tree. It is read out of the tree, at
build time, and checked by tests.

## Reading, never copying

`src/dashboard/src/lib/repo.ts` is the only thing that touches the coursework,
and it only reads. Two components use it:

- **`Snippet.astro`** quotes a file. It takes a path and an optional line
  range, slices the real file, and throws if the range runs past the end. A
  snippet cannot show code that is not there, because the build fails first.
- **`Embed.astro`** composes the compound interest calculator into a single
  self-contained document — its own HTML, its own CSS, its own JavaScript, and
  its own image as a data URI — and hands that to a sandboxed iframe.

Coursework under `src/courses/` stays exactly as submitted. The one exception
is documented on the page it affects: `index.html` asks for `interest.jpg`
where the committed file is `Interest.jpeg`, and the embed rewrites that single
attribute so the image resolves. The defect stays in the coursework.

### The one trap worth knowing

Astro rewrites `import.meta.url` in the built output. By the time a component's
code actually runs it lives in `dist/.prerender/chunks/`, so resolving a path
against the component's own location silently points at nothing. `repo.ts`
anchors on the repository root instead, found by walking up from the working
directory until `src/courses` appears.

## Three ways a program runs

`src/dashboard/src/data/programs.ts` gives every program one of three modes,
and the mode is a promise the page has to keep:

| Mode | What happens |
|---|---|
| `inline` | Files are read at build time and rendered in a sandboxed iframe |
| `container` | A StackBlitz WebContainer installs and runs a **public** repository in the tab |
| `source` | Nothing runs — a native toolchain, or a repository nothing can reach |

StackBlitz cannot load a private repository. That is not a configuration
problem, it is the whole design, and it is why Pathfinder and the projects that
live in this repository are `source` rather than `container`. Marking one of
them runnable would produce a box that spins forever.

## What the tests check

`tests/site-data.test.mjs` runs on every push. It reads the site's own data
files and checks them against the tree:

- every program path and snippet path exists
- every snippet's line range is inside the file it quotes
- `courses.ts` and `src/courses/` agree in both directions
- the published language counts match a fresh count from `lmucs stats`
- no private repository is marked as a container embed
- the calculator still has the broken image reference the embed rewrites —
  because if the coursework were ever "fixed", the rewrite would become a
  silent no-op and the note on the page would be wrong

Run them with:

```bash
node --experimental-strip-types --test tests/
```

## Where the numbers come from

`lmucs stats` counts lines in tracked files under `src/courses`, grouped by
extension, ignoring lockfiles. `src/dashboard/src/data/stats.ts` holds the
published copy, and the test above fails the moment the two disagree.

```bash
lmucs stats           # a table
lmucs stats --json    # what the test compares against
```

Untracked files are not counted, so nothing in a scratch directory can inflate
a total.
