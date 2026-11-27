# GitHub Copilot / VS Code Instructions

This repository is governed by the unified **Agent Harness** standard in `AGENTS.md` and `.agents/`.

## Mandatory Entrypoints
- **Project Stack & Non-Negotiable Rules**: Always follow [`AGENTS.md`](../AGENTS.md) and [`.agents/rules/codebase-standards.md`](../.agents/rules/codebase-standards.md).
- **Tiered Memory**: Check [`.agents/memory/INDEX.md`](../.agents/memory/INDEX.md) and [`.agents/memory/conventions.md`](../.agents/memory/conventions.md) before proposing architecture or code changes.
- **Role Contracts**: Use the role definitions in `.agents/agents/<role>/agent.md` when planning, implementing, reviewing, or validating.
- **Skills**: Apply relevant skills from `.agents/skills/<skill>/SKILL.md` (`caveman`, `diagnosing-bugs`, `code-review`, `tdd`, `codebase-design`, `grilling`, `pr`).
- **Workflows**: Follow `.agents/workflows/multiple-agent-workflow.md` (features) or `.agents/workflows/hotfix-workflow.md` (bugs).

## Core Operating Rules
1. Keep responses concise and high-signal (`caveman` protocol: drop filler, deliver exact file paths, diffs, and commands).
2. Never claim a fix or feature passes without an outside judge (executed tests, linter, typechecker, or repro script).
3. Respect task handoff artifacts under `.agent-work/<TASK_ID>/`.
