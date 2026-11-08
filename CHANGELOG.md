# Changelog

All notable changes to this repository are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/). The coursework itself does not
change; entries describe the site, the checks and the tooling around it.

## [Unreleased]

### Added

- `scripts/check.sh`: one command for the repository check, the site-data
  tests, the `lmucs` tests and the site build. CI runs it on every pull request.
- Front page leads with three projects: the CloudScribe compiler, the CMSI 3550
  network stack and the Pathfinder senior project.
- Courses page: a jump list by year and a "By language" table of lines per
  language, each linked to the courses it was written in.
- `llms.txt`, served at the site root and kept identical to the repository copy
  by a test.
- Canonical URLs and alt text for the social card.
- `.claude/launch.json` for the site dev server on port 4322.
- `CONTRIBUTING.md`, this changelog, `.editorconfig`, `.gitattributes`,
  `CODEOWNERS`, Dependabot for the site and workflows, issue and pull request
  templates.

### Changed

- Faint text now meets WCAG AA contrast in both themes (4.9:1 light, 5.4:1 dark).
- Section labels are set in sentence case in the body face instead of tracked
  monospace capitals.
- Motion is limited to the opening sequence; scroll-in fades and card lifts are
  gone. Hover darkens a card's border.
- The header drops the LMU lettering below 640px so every nav link fits at 375px.
- Em dashes are gone from the site copy, `README.md`, `AGENTS.md` and `SECURITY.md`.

## [1.0.0] - 2026-08-25

The repository as first published.

### Added

- 2026-08-22: coursework from fifteen CMSI courses consolidated into one
  repository under `src/courses`, with thirteen upstream histories preserved as
  off-machine git bundles (`docs/archive.md`).
- The `lmucs` Python package, which verifies `docs/record.md` against the tree
  and counts lines by language.
- The Astro and Tailwind site in `src/dashboard`, deployed to GitHub Pages: an
  inline calculator embed, a CloudScribe playground that runs the submitted
  compiler in the page, and tests that check every claim the site makes.
- `scripts/check-ai-config.sh`, run in CI on Ubuntu and on macOS under bash 3.2.
- A narrow Content-Security-Policy, an accessible tablist for the playground,
  and a social card (2026-08-22 to 2026-08-25).

### Security

- 2026-08-22: two committed credentials removed from all history, and the
  credential scan widened to catch them.

## [0.1.0] - 2025-03-18

### Added

- Initial README for the course repositories.

[Unreleased]: https://github.com/patrickking67/lmu-computer-science/compare/8867739...HEAD
[1.0.0]: https://github.com/patrickking67/lmu-computer-science/commit/8867739
[0.1.0]: https://github.com/patrickking67/lmu-computer-science/commits/main
