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

## Credentials

Two credentials were committed in CMSI 4072 coursework and were removed on 2026-08-22: a
Google service-account private key (file deleted, purged from every commit) and a RapidAPI
key (replaced across all history). The repository was private throughout, so neither was
published by it. Both still require rotation at the provider — a history rewrite does not
revoke anything.

`scripts/check-ai-config.sh` scans every tracked file on every run and fails on private-key
blocks, service-account `private_key` fields, provider tokens, and API keys in request
headers.

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
