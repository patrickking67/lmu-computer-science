---
title: Getting started
description: What this repository is, how it is laid out, and what to run first.
order: 1
---

# Getting started

This repository is an archive of computer science coursework, wrapped in a site that
presents it. Those are two different things living in one tree, and the layout keeps them
apart.

## Layout

```text
src/
├── courses/     fifteen course directories, cmsi-1010 … cmsi-4072
├── apps/        runnable mini-apps extracted from that coursework
└── dashboard/   this site (Astro + Tailwind)
docs/            the record: what was vendored, what builds, what publication accepted
scripts/         the repository check, also run in CI
tests/           suites that belong to no single course
```

## The one rule that matters

Course directories are historical records. Nothing in `src/courses/` gets refactored,
reformatted, modernised, or linted. A failing test that fails because the submitted code
was wrong is the archive working correctly — repairing it would contradict the grade the
work actually earned.

Fix the environment freely: pins, toolchains, build files, documentation. Leave the
answers alone.

## First commands

```bash
# validate the repository itself
./scripts/check-ai-config.sh

# run the site locally
cd src/dashboard && npm install && npm run dev
```

Commands that build and test the coursework are in `docs/building.md`, with the exact
version pins that make them work.
