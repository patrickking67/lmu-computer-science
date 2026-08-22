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
LMU, with the code that came out of it — all of it runnable, with the commands in
[`docs/building.md`](docs/building.md).

The site that presents it is in [`src/dashboard`](src/dashboard): Astro and Tailwind,
deployed to GitHub Pages.

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

Fifteen courses. Eight produced code you can clone and run; the rest were lecture and
exam courses. Terms come from the author's course audit rather than instructor course
pages, which publish whichever offering is current.

The full record — grades, credits, and the non-major coursework — is in
[`docs/record.md`](docs/record.md). Build and test commands, with the version pins that
make them work, are in [`docs/building.md`](docs/building.md).

## Still going

Projects that outlived the course that started them.

| Repository | Visibility | Relation |
|---|---|---|
| [`cloudscribe`](https://github.com/patrickking67/cloudscribe) | public | Statically typed language for IT automation, compiling to JavaScript. Five-stage Ohm compiler, 99.66% statement coverage. Started in CMSI 3802. |
| [`pathfinder`](https://github.com/patrickking67/pathfinder) | private | The senior capstone, being rebuilt as a product. |
| [`myGainz`](https://github.com/patrickking67/myGainz) | public | Fitness tracker. React and Firestore. Started in CMSI 2021. |

## Reference

Instructor course material is indexed in [`docs/reference.md`](docs/reference.md).
[`docs/publication.md`](docs/publication.md) records what publishing this accepted.

## File structure

```text
lmu-computer-science/
├── src/
│   ├── courses/                   fifteen course directories, cmsi-1010 … cmsi-4072
│   ├── apps/                      runnable projects
│   ├── packages/lmucs/            Python package for the course record
│   └── dashboard/                 the site (Astro + Tailwind)
├── docs/                          reference notes, the course record, build commands
├── scripts/check-ai-config.sh     repository check, also run in CI
├── tests/                         suites that belong to no single course
├── .github/workflows/             Pages deploy, Conda package, repository check
├── AGENTS.md                      canonical agent instructions
├── SECURITY.md                    security policy
└── LICENSE                        MIT
```

## Verification

```bash
./scripts/check-ai-config.sh
```

Checks the required files, adapter wiring, that no build artifact, compiled binary, or
local configuration is tracked, that no committed credential is present, that no
`.gitignore` rule silently drops coursework, and that all fifteen courses are documented.
Runs on every push to `main`. Commands that build and test the coursework itself are in
[`docs/building.md`](docs/building.md).

**The check currently fails**, on two committed credentials in CMSI 4072 coursework.
They are why this repository is still private. See
[`docs/publication.md`](docs/publication.md#committed-credentials-a-blocker-on-publication).

## About

**Patrick King.** BS Computer Science, minor in Business Administration. CTO at Barkrow
Systems.

- LinkedIn: [linkedin.com/in/patrickgking03](https://www.linkedin.com/in/patrickgking03/)
- GitHub: [github.com/patrickking67](https://github.com/patrickking67)

## License

MIT. See [LICENSE](LICENSE).
