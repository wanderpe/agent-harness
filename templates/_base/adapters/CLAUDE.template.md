# CLAUDE.md — Claude Code Entrypoint

This repository uses the unified **Agent Harness** standard.

- **Primary Instructions**: Read and follow [`AGENTS.md`](./AGENTS.md).
- **Memory Router**: Start every non-trivial task by reading [`.agents/memory/INDEX.md`](./.agents/memory/INDEX.md) and [`.agents/memory/conventions.md`](./.agents/memory/conventions.md).
- **Sub-Agent Personas**: Located in [`.agents/agents/`](./.agents/agents/) (`task-context-builder`, `architect`, `implementation-engineer`, `code-reviewer`, `qa-validator`, `release-manager`).
- **Skills**: Located in [`.agents/skills/`](./.agents/skills/) (including `caveman`, `diagnosing-bugs`, `code-review`, `tdd`, `grilling`, `pr`).
- **Workflows**: Located in [`.agents/workflows/`](./.agents/workflows/) (`multiple-agent-workflow.md`, `hotfix-workflow.md`, `caveman-adapter.md`).
- **Context Policy**: Follow [`.agents/context-policy.md`](./.agents/context-policy.md) — stay in the Smart Zone, never self-grade QA without an outside judge, and operate under the `caveman` compression protocol.
