# Security policy

This repository holds university coursework and the site that presents it. It ships no
product and cuts no releases, so the usual "supported versions" table does not apply:
there is one branch, `main`, and it is the only thing maintained.

| What | Maintained |
|---|---|
| `main` | Yes — the site, the checks, and the tooling |
| `src/courses/**` | No, by design — submitted work, kept as submitted |
| Git bundles (off-machine) | Frozen |

## Coursework is not maintained

`src/courses/` is submitted student work. Dated, vulnerable, or plainly wrong code in
there is the correct state — editing it would contradict the record in `docs/record.md`
and delete the information the failure carries. Reports about it are welcome as
*information* and get recorded in `docs/building.md` rather than patched out.

The one exception is credentials. Those get rotated, always.

## Known exposure

`src/courses/cmsi-4072/Pathfinder/backend/` contains, in senior-project coursework:

- a Google service-account private key (`serviceAccountKey.json`)
- a RapidAPI key, hardcoded twice in `functions/index.js`

The repository is private, so neither has been published. Both are tracked as a blocker on
making it public, and `scripts/check-ai-config.sh` fails on them on every run rather than
letting the tree look clean. See `docs/publication.md` for the remediation and the open
question of what happens to the files afterwards.

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
tree. A report that coursework is outdated will be acknowledged and recorded rather than
fixed — that is the policy above, not a declined vulnerability.
