<div align="center">

# LMU Computer Science

Coursework from a BS in Computer Science at **Loyola Marymount University**,
Seaver College of Science and Engineering. Graduated **2025**.
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

This repository holds the coursework itself, not links to it. Thirteen per-course
repositories were deleted from GitHub; their working trees are vendored here and their
full commit histories are preserved as git bundles, 29 in total, kept off-machine. See
[`docs/archive.md`](docs/archive.md).

## Courses

Titles follow the [LMU Academic Bulletin](https://bulletin.lmu.edu/course-descriptions/cmsi/).

| Course | Title | Term | Work |
|---|---|---|---|
| [CMSI 1010](CMSI-1010) | Computer Programming Laboratory | Fall 2021 | none preserved |
| [CMSI 1900](CMSI-1900) | Exploring Computer Science | Fall 2021 | none, 0 units by design |
| [CMSI 2021](CMSI-2021) | Web Application Development | Fall 2022 | myGainz, 3 web apps |
| [CMSI 2120](CMSI-2120) | Data Structures and Applications | Spring 2022 | none preserved |
| [CMSI 2130](CMSI-2130) | Algorithms and Analysis | Spring 2023 | 5 projects, Java |
| [CMSI 2210](CMSI-2210) | Computer Systems Organization | Fall 2022 | none preserved |
| [CMSI 2820](CMSI-2820) | Discrete Mathematics for Computer Science | Fall 2022 | none preserved |
| [CMSI 3300](CMSI-3300) | Artificial Intelligence | Fall 2024 | course material |
| [CMSI 3550](CMSI-3550) | Networks and the Internet | Spring 2024 | 7 projects, Rust |
| [CMSI 3751](CMSI-3751) | Game Design | Fall 2023 | none preserved |
| [CMSI 3801](CMSI-3801) | Theories of Computer and Human Languages | Fall 2024 | 13 languages, answer keys |
| [CMSI 3802](CMSI-3802) | Programming Language Concepts and Implementation | Spring 2025 | cloudscribe, course material |
| [CMSI 3920](CMSI-3920) | Computing Contexts and Ethics | Summer 2024 I | none committed |
| [CMSI 4071](CMSI-4071) | Senior Project I | Fall 2024 | see 4072 |
| [CMSI 4072](CMSI-4072) | Senior Project II | Spring 2025 | Pathfinder, deliverable set |

Fifteen computer science courses. Terms come from the author's course audit, not from
instructor course pages, which document whichever offering is currently published and
disagreed with the enrollment term in all four cases checked.

Seven courses hold nothing but a README: CMSI 1010, 1900, 2120, 2210, 2820, 3751, and
4071. Their repositories were deleted before any local clone existed, or none was ever
created, and the iCloud source held only an empty template. CMSI 1900 produced none by
design, and CMSI 4071's deliverables are filed under CMSI 4072. That is a real gap, not
work in progress.

Course material that existed only in iCloud was vendored on 2026-08-22, adding 98 files
across four courses. Thirteen more were committed and then removed on review, nine are
held pending two publication questions. See [`docs/vendoring.md`](docs/vendoring.md) and
[`docs/publication.md`](docs/publication.md).

Grades, credits, repeated attempts, and the non-major coursework are in
[`docs/record.md`](docs/record.md). What still compiles and runs, with the commands and
version pins that make it do so, is in [`docs/building.md`](docs/building.md).

## Live repositories

Work that continues outside this archive.

| Repository | Visibility | Relation |
|---|---|---|
| [`cloudscribe`](https://github.com/patrickking67/cloudscribe) | public | Grew out of CMSI 3802. Statically typed language for IT automation, compiles to JavaScript. Five-stage Ohm compiler. |
| [`pathfinder`](https://github.com/patrickking67/pathfinder) | private | CMSI 4072 senior project. Being rebuilt as a personal product. |
| [`myGainz`](https://github.com/patrickking67/myGainz) | public | CMSI 2021 fitness tracker. |

## Reference

Instructor course material is indexed in [`docs/reference.md`](docs/reference.md).

Published publicly by deliberate decision, including instructor material, answer keys,
and grades. [`docs/publication.md`](docs/publication.md) records what that accepted, and
the two questions the 2026-08-22 vendoring pass raised that it did not.

## File structure

```text
lmu-cs/
├── CMSI-1010 … CMSI-4072/         one directory per course, 15 in total
├── docs/
│   ├── archive.md                 bundle inventory and restore commands
│   ├── building.md                what compiles and runs, and what does not
│   ├── publication.md             what publication accepted, and what is unresolved
│   ├── record.md                  grades, credits, and the full course record
│   ├── reference.md               instructor repositories
│   └── vendoring.md               what was vendored from iCloud, and what was excluded
├── scripts/
│   └── check-ai-config.sh         repository configuration check
├── .github/
│   ├── copilot-instructions.md    Copilot adapter
│   └── workflows/
│       └── check-ai-config.yml    runs the check on every push
├── .claude/settings.json          shared Claude settings
├── .codex/config.toml             Codex configuration
├── AGENTS.md                      canonical agent instructions
├── CLAUDE.md                      Claude adapter, imports AGENTS.md
├── CONSOLIDATION-REVIEW.md        2026-08-22 consolidation record
└── LICENSE                        MIT
```

## Verification

```bash
./scripts/check-ai-config.sh
```

Checks the required files, adapter wiring, that no build artifact or local
configuration is tracked, that no `.gitignore` rule silently drops coursework, and that
all fifteen courses are documented. Runs on every push to `main`. Commands that build and
test the coursework itself are in [`docs/building.md`](docs/building.md).

## About

**Patrick King.** BS Computer Science, minor in Business Administration. CTO at Barkrow
Systems.

- LinkedIn: [linkedin.com/in/patrickgking03](https://www.linkedin.com/in/patrickgking03/)
- GitHub: [github.com/patrickking67](https://github.com/patrickking67)

## License

MIT. See [LICENSE](LICENSE).
