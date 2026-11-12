# Contributing

This is a personal coursework archive, so contributions are limited to fixes:
a broken link, a wrong claim on the site, a failing check, an accessibility
problem. New solutions to course assignments are out of scope and will be
closed. Code under `src/courses/` is kept exactly as submitted, defects
included; a report about it is welcome and gets recorded in
[`docs/building.md`](docs/building.md) rather than patched.

For anything security-related, use a
[private advisory](https://github.com/patrickking67/lmu-computer-science/security/advisories/new),
not an issue.

## Setup

You need Node 22.18 or later and Python 3.10 or later.

```bash
git clone git@github.com:patrickking67/lmu-computer-science.git
cd lmu-computer-science
python3 -m venv .venv && . .venv/bin/activate
python3 -m pip install -e src/packages/lmucs pytest
npm --prefix src/dashboard ci
```

Run the site at <http://localhost:4322/>:

```bash
npm --prefix src/dashboard run dev -- --port 4322
```

## Checks

One command runs everything fast and offline: the repository check, the
site-data tests, the `lmucs` tests and the site build.

```bash
./scripts/check.sh            # add --no-build to skip the site build
```

CI runs the same script on every pull request. Course toolchains (Java, Rust,
the CMSI 3801 languages) are not part of it; their commands are in
[`docs/building.md`](docs/building.md).

## Branches and commits

- Branch from `main` as `feat/…`, `fix/…`, `docs/…` or `chore/…`.
- Use [Conventional Commits](https://www.conventionalcommits.org/):
  `fix(site): …`, `docs: …`, `test: …`.
- One logical change per commit. Stage paths explicitly; never `git add -A`,
  which can publish material held out of version control (see `AGENTS.md`).
- Add a line under `[Unreleased]` in [`CHANGELOG.md`](CHANGELOG.md).

## Pull request checklist

- [ ] `./scripts/check.sh` passes
- [ ] Nothing under `src/courses/` changed
- [ ] Any new claim the site makes (a path, a count, a line range) has a test in `tests/site-data.test.mjs`
- [ ] `node scripts/course-map.mjs` re-run if `courses.ts` or `stats.ts` changed
- [ ] No classmate named outside `src/courses/`
- [ ] No secrets, grades, student IDs or other personal data added
