<div align="center">

# LMU Computer Science

Coursework from a BS in Computer Science at **Loyola Marymount University**,
Seaver College of Science and Engineering. **Fall 2021 – Spring 2025**.
Advised by **Dr. Ray Toal**.

![Python](https://img.shields.io/badge/-Python-3776AB?logo=python&logoColor=white&style=flat)
![Java](https://img.shields.io/badge/-Java-007396?logo=openjdk&logoColor=white&style=flat)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black&style=flat)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=flat)
![Rust](https://img.shields.io/badge/-Rust-000000?logo=rust&logoColor=white&style=flat)
![Swift](https://img.shields.io/badge/-Swift-FA7343?logo=swift&logoColor=white&style=flat)
![OCaml](https://img.shields.io/badge/-OCaml-EC6813?logo=ocaml&logoColor=white&style=flat)
![Go](https://img.shields.io/badge/-Go-00ADD8?logo=go&logoColor=white&style=flat)
![Haskell](https://img.shields.io/badge/-Haskell-5D4F85?logo=haskell&logoColor=white&style=flat)
![Kotlin](https://img.shields.io/badge/-Kotlin-7F52FF?logo=kotlin&logoColor=white&style=flat)
![Lua](https://img.shields.io/badge/-Lua-2C2D72?logo=lua&logoColor=white&style=flat)
![C](https://img.shields.io/badge/-C-A8B9CC?logo=c&logoColor=black&style=flat)
![Ohm](https://img.shields.io/badge/-Ohm-1A8FDD?style=flat)

</div>

---

A compiler, a network stack, and thirteen languages. Four years of computer science at
LMU, and the code that came out of it.

**[patrickking67.github.io/lmu-computer-science](https://patrickking67.github.io/lmu-computer-science/)**
presents all of it, and runs the programs that fit in a browser tab — CloudScribe and
myGainz boot in a WebContainer, the compound interest calculator runs inline. Nothing to
clone, nothing to install. The site itself is in [`src/dashboard`](src/dashboard): Astro,
Tailwind, deployed to GitHub Pages.

For the rest — compiled languages, raw sockets, anything wired to a live account — the
build and test commands, with the version pins that make them work, are in
[`docs/building.md`](docs/building.md).

## Courses

Titles follow the [LMU Academic Bulletin](https://bulletin.lmu.edu/course-descriptions/cmsi/).

| Course | Title | Term | Work |
|---|---|---|---|
| [CMSI 1010](src/courses/cmsi-1010) | Computer Programming Laboratory | Fall 2021 | — |
| [CMSI 1900](src/courses/cmsi-1900) | Exploring Computer Science | Fall 2021 | — |
| [CMSI 2021](src/courses/cmsi-2021) | Web Application Development | Fall 2022 | myGainz, 3 web apps |
| [CMSI 2120](src/courses/cmsi-2120) | Data Structures and Applications | Spring 2022 | — |
| [CMSI 2130](src/courses/cmsi-2130) | Algorithms and Analysis | Spring 2023 | 5 projects, Java |
| [CMSI 2210](src/courses/cmsi-2210) | Computer Systems Organization | Fall 2022 | — |
| [CMSI 2820](src/courses/cmsi-2820) | Discrete Mathematics for Computer Science | Fall 2022 | — |
| [CMSI 3300](src/courses/cmsi-3300) | Artificial Intelligence | Fall 2024 | inference and classification |
| [CMSI 3550](src/courses/cmsi-3550) | Networks and the Internet | Spring 2024 | 7 projects, Rust |
| [CMSI 3751](src/courses/cmsi-3751) | Game Design | Fall 2023 | — |
| [CMSI 3801](src/courses/cmsi-3801) | Theories of Computer and Human Languages | Fall 2024 | 13 languages, answer keys |
| [CMSI 3802](src/courses/cmsi-3802) | Programming Language Concepts and Implementation | Spring 2025 | cloudscribe, course material |
| [CMSI 3920](src/courses/cmsi-3920) | Computing Contexts and Ethics | Summer 2024 I | — |
| [CMSI 4071](src/courses/cmsi-4071) | Senior Project I | Fall 2024 | design and specification |
| [CMSI 4072](src/courses/cmsi-4072) | Senior Project II | Spring 2025 | Pathfinder, deliverable set |

Fifteen courses, thirteen of which produced a repository: CMSI 1900 was a zero-unit
seminar and CMSI 3920 a summer session, so their directories hold a README and nothing
else. Eight produced code you can read here. Terms come from the course audit rather
than instructor course pages, which publish whichever offering happens to be current —
all four checked disagreed with the enrolment term.

The full record — grades, credits, and the non-major coursework — is in
[`docs/record.md`](docs/record.md), and `lmucs verify` checks this tree against it in
both directions.

## Still going

Projects that outlived the course that started them.

| Repository | Visibility | Relation |
|---|---|---|
| **CloudScribe** — [`cloudscribe`](https://github.com/patrickking67/cloudscribe) | public | A statically typed language for the work that usually ends up in a fragile shell script. Five-stage Ohm compiler to JavaScript, 143 tests, 99.66% statement coverage. Started in CMSI 3802. |
| **Pathfinder** — [`pathfinder`](https://github.com/patrickking67/pathfinder) | private | The senior capstone, being rebuilt as a product. |
| **myGainz** — [`myGainz`](https://github.com/patrickking67/myGainz) | public | A training log that keeps the set-by-set history most workout apps discard. React and Firestore. Started in CMSI 2021. |

## Reference

Instructor course material is indexed in [`docs/reference.md`](docs/reference.md).
[`docs/publication.md`](docs/publication.md) records what publishing this accepted.

## File structure

```text
lmu-computer-science/
├── src/
│   ├── courses/                   fifteen course directories, cmsi-1010 … cmsi-4072
│   ├── packages/lmucs/            Python package that reads and verifies the record
│   └── dashboard/                 the site (Astro + Tailwind)
├── docs/                          reference notes, the course record, build commands
├── tests/site-data.test.mjs       checks the site's claims against the tree
├── scripts/check-ai-config.sh     repository check, also run in CI
├── .github/workflows/             Pages deploy, Conda package, repository check
├── AGENTS.md                      canonical agent instructions
├── SECURITY.md                    security policy
└── LICENSE                        MIT
```

## Verification

Three checks, all of them run in CI on every push to `main`.

```bash
./scripts/check-ai-config.sh                  # the repository itself
node --test "tests/*.test.mjs"                # the site's claims about it
pytest src/packages/lmucs/tests               # the record and the line counter
```

`check-ai-config.sh` covers the required files, adapter wiring, and that no build
artifact, compiled binary, local configuration, or committed credential is tracked —
plus that no `.gitignore` rule silently drops coursework, and that all fifteen courses
are documented.

`tests/site-data.test.mjs` covers everything the dashboard asserts about this
repository: that each program and snippet path exists, that every quoted line range is
inside the file it quotes, that `courses.ts` and `src/courses/` agree in both
directions, that no private repository is marked as an embeddable container, and that
the published language counts still match a fresh count.

Those counts come from the Python package:

```bash
lmucs summary    # courses, credits, terms
lmucs verify     # the record against the tree, both directions
lmucs stats      # lines of coursework by language
```

Commands that build and test the coursework itself are in
[`docs/building.md`](docs/building.md).

## By the numbers

Counted by `lmucs stats` over tracked files under `src/courses`, lockfiles excluded.

| | |
|---|---|
| Courses | 15, of which 13 produced a repository |
| Lines of coursework | 15,950 |
| Languages | 18 |
| Largest | JavaScript (5,542), Java (4,427), Rust (743) |
| Smallest that still ships | CloudScribe (113), Assembly (30) |

## About

**Patrick King.** BS Computer Science, minor in Business Administration, Loyola
Marymount University.

- LinkedIn: [linkedin.com/in/patrickgking03](https://www.linkedin.com/in/patrickgking03/)
- GitHub: [github.com/patrickking67](https://github.com/patrickking67)

## License

MIT. See [LICENSE](LICENSE).
