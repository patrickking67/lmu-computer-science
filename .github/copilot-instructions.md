# GitHub Copilot repository instructions

Before changing code:

- Read and follow the root `AGENTS.md`. It is canonical.

Non-negotiables, repeated here because they are easy to get wrong:

- This repository is an archive of university coursework. Do not refactor, modernize,
  reformat, or lint archived course directories. Dated code is the correct state.
- Do not commit build artifacts or `*.bundle` files.
- Do not push `src/courses/cmsi-3802/cloudscribe/` to the `cloudscribe` remote. It is a snapshot that
  has intentionally diverged.

Before completion:

- Run `scripts/check-ai-config.sh`.
- Update `AGENTS.md` only when durable repository knowledge changes.
