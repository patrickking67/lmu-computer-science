# Changelog

All notable changes to this repository are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/). The coursework itself does not
change; entries describe the site, the checks and the tooling around it.

## [Unreleased]

### Added

- Case-study pages for CloudScribe, the network stack and Pathfinder at
  `/projects/<slug>/`: problem, approach, architecture figure, what was hard,
  what I would do differently, and links to source. A Projects entry in the nav.
- Architecture figures drawn as inline SVG at build time, one per project and
  one for the site itself. No diagram script ships to the browser.
- The front page runs the CloudScribe playground directly, links the other two
  demos, and adds "How it works" and "What checks it" sections with counted
  numbers.
- `docs/architecture.md`: six Mermaid diagrams, including how the courses build
  on each other.
- `scripts/course-map.mjs`, which generates `docs/course-map.md` and the course
  map in `README.md` (timeline, courses by term, language by course matrix) from
  the site data. A test fails when either is stale.
- `lmucs stats --json` reports lines per language for each course directory.
- Course pages show lines per language, what a course builds on and leads to,
  and, for the eight courses whose directory holds only a README, why.
- `docs/building.md`: a dated matrix of the nine suites re-run on 2026-11-11,
  with toolchain versions and results, and a list of what was skipped.
- README screenshots in `docs/assets/`, light and dark, and a 1200x630 social
  card taken from the real front page.
- Eight site-data tests covering the case studies, figures, course
  progression, generated course map, proof numbers and README.
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

- README rewritten to open with the three projects, each with what was hard, a
  picture, its code and its page on the site.
- The Courses page's "By language" table lists the courses whose directories
  hold files in each language, with the count for each, instead of the courses
  that name the language in their stack.
- The header puts its links on a second row below 640px, so all five are
  visible at 375px.
- Faint text now meets WCAG AA contrast in both themes (4.9:1 light, 5.4:1 dark).
- Section labels are set in sentence case in the body face instead of tracked
  monospace capitals.
- Motion is limited to the opening sequence; scroll-in fades and card lifts are
  gone. Hover darkens a card's border.
- The header drops the LMU lettering below 640px so every nav link fits at 375px.
- Em dashes are gone from the site copy, `README.md`, `AGENTS.md` and `SECURITY.md`.

### Fixed

- The recorded Swift command (`swift exercises.swift main.swift`) ran only the
  first file and never executed the 68 assertions. `docs/building.md` now
  compiles both with `swiftc`: 68 passed.
- Three claims that did not match the code: the compiler has four stages, not
  five; the CMSI 3550 final project is a libp2p trading card network, not file
  transfer over raw sockets; Pathfinder is described as submitted.
- A program note said this repository was not public.

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
