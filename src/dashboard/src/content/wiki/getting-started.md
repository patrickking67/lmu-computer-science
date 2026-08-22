---
title: Getting started
description: How the repository is laid out and what to run first.
order: 1
---

# Getting started

Four years of computer science coursework, plus the site that presents it.

## Layout

```text
src/
├── courses/     fifteen course directories, cmsi-1010 … cmsi-4072
├── apps/        runnable projects pulled out of the coursework
├── packages/    lmucs, a Python package for the course record
└── dashboard/   this site (Astro + Tailwind)
docs/            reference notes and the course record
scripts/         the repository check, also run in CI
tests/           suites that belong to no single course
```

## One rule

Coursework in `src/courses/` is submitted work and stays as submitted. It does not get
refactored, reformatted, or modernised — a test that fails because the original code was
wrong is telling you something true, and editing it to pass just deletes the information.

Fix the environment freely: pins, toolchains, build files, docs. Leave the answers alone.

## First commands

```bash
# check the repository itself
./scripts/check-ai-config.sh

# run the site
cd src/dashboard && npm install && npm run dev

# course record
pip install -e src/packages/lmucs && lmucs summary
```

Build and test commands for the coursework, with the version pins that make them work, are
in `docs/building.md`.
