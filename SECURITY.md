# Security policy

This repository holds university coursework and the site that presents it. It
ships no product and cuts no releases, so there is one supported version: the
`main` branch.

## Supported versions

| What | Supported |
|---|---|
| `main`: the site, the checks and the tooling | Yes |
| `src/courses/**` | No, by design: submitted work, kept as submitted |
| Git bundles (off-machine) | Frozen |

## Reporting a vulnerability

Report privately through a
[GitHub security advisory](https://github.com/patrickking67/lmu-computer-science/security/advisories/new),
or email **patrickking673@gmail.com** with `SECURITY` in the subject. Please do
not open a public issue for anything credential-related.

| Stage | Timing |
|---|---|
| Acknowledgement | Within 7 days |
| Assessment and decision | Within 30 days |
| Fix, or a recorded decision not to | Tracked in `docs/publication.md` |

A report about a live credential is treated as urgent wherever it sits in the
tree.

## Scope

In scope: the site in `src/dashboard` (it is static, served by GitHub Pages,
and runs visitor-typed CloudScribe only inside an opaque-origin sandboxed
iframe), the `lmucs` package, the workflows, and any credential anywhere in the
tree.

Out of scope: dated or vulnerable code under `src/courses/`. That is submitted
student work, and editing it would contradict the record in `docs/record.md`
and delete the information the failure carries. Reports about it are welcome as
information and get recorded in `docs/building.md` rather than patched. A
report that coursework is outdated will be acknowledged and recorded rather
than fixed; that is this policy, not a declined vulnerability. The one
exception is credentials, which are always rotated.

## Credentials

Two credentials were committed in CMSI 4072 coursework and were removed on
2026-08-22: a Google service-account private key (file deleted, purged from
every commit) and a RapidAPI key (replaced across all history). The repository
was private throughout, so neither was published by it. Both still require
rotation at the provider; a history rewrite does not revoke anything.

`scripts/check-ai-config.sh` scans every tracked file on every run and fails on
private-key blocks, service-account `private_key` fields, provider tokens, and
API keys in request headers.

Firebase Web API keys (`AIza…`) appear in three front ends. They are not
secrets: Google ships them in every web bundle, and they are guarded by Security
Rules and API-key restrictions. The check reports them and does not fail.
