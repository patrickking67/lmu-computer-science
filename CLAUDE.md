@AGENTS.md

# Claude Code specific instructions

- Treat `AGENTS.md` as canonical.
- Do not refactor, reformat, or "fix" coursework under `src/courses/`.
- Do not create or rely on local or user-level configuration.
- Never place secrets in repository files.
- After durable changes, update `AGENTS.md` and run `./scripts/check.sh`.
- The preview pane config is `.claude/launch.json` (site dev server, port 4322).
