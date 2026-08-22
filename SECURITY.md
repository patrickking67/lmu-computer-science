# Security policy

This repository is an archive of university coursework, wrapped in a site that presents
it. It ships no product and has no releases, so the usual "supported versions" table does
not apply: there is one branch, `main`, and it is the only thing that is maintained.

| What | Maintained |
|---|---|
| `main` | Yes — the site, the checks, and the tooling |
| `src/courses/**` | No, by design. Archived as submitted; see below |
| Git bundles (off-machine) | Frozen historical artifacts |

## Archived coursework is not maintained

Course directories are historical records. Vulnerable, dated, or plainly wrong code in
`src/courses/` is the correct state — repairing it would falsify the record and contradict
the grades in `docs/record.md`. Reports about archived coursework are welcome as
*information*, and will be recorded in `docs/building.md` rather than patched out.

The one exception is credentials. Those get rotated, always.

## Known exposure

`src/courses/cmsi-4072/Pathfinder/backend/` contains, in vendored senior-project
coursework:

- a Google service-account private key (`serviceAccountKey.json`)
- a RapidAPI key, hardcoded twice in `functions/index.js`

The repository is private, so neither has been published. Both are tracked as a blocker on
making it public, and `scripts/check-ai-config.sh` fails on them on every run rather than
letting the tree look clean. See `docs/publication.md` for the remediation and the open
archive question.

Firebase *Web* API keys (`AIza…`) appear in three front ends. Those are not secrets —
Google ships them in every web bundle and they are guarded by Security Rules and API-key
restrictions. The check reports them and does not fail.

## Reporting

Email **patrickking673@gmail.com** with `SECURITY` in the subject, or open a private
security advisory via GitHub's *Security → Advisories* tab. Please do not open a public
issue for anything credential-related.

What to expect:

| Stage | Timing |
|---|---|
| Acknowledgement | Within 7 days |
| Assessment and decision | Within 30 days |
| Fix, or a recorded decision not to | Tracked in `docs/publication.md` |

A report about a live credential is treated as urgent regardless of where it sits in the
tree. A report about archived coursework being outdated will be acknowledged and recorded,
not fixed — that is the archive working as intended, not a declined vulnerability.
