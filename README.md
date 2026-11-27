# Agent Harness 🚀

A modular, production-grade agentic harness system and scaffolding tool for multi-agent software engineering.

## Overview

**Agent Harness** provides an end-to-end framework to equip any codebase with autonomous agent workflows, strict quality gates, and tiered memory.

It standardizes how AI coding agents (Antigravity, Codex, Claude Code, Cursor, Copilot) navigate your code, propose designs, implement features, conduct code reviews, and validate changes before release.

---

## 🏛 Architecture

### 1. The 6-Agent Sequential Pipeline
Every non-trivial engineering task progresses through sequential stages with human verification gates:

```
[Task Request]
      │
      ▼
┌────────────────────────┐
│ Agent 0: Task Context  │ ──> Produces TASK_CONTEXT.md & REQUIREMENT.md
└────────────────────────┘
      │
   [Gate 0: User Approval]
      │
      ▼
┌────────────────────────┐
│ Agent 1: Architect     │ ──> Produces ARCHITECTURE_PLAN.md & boundaries
└────────────────────────┘
      │
   [Gate 1: User Approval]
      │
      ▼
┌────────────────────────┐
│ Agent 2: Implementer   │ ──> Implements code & self-reviews
└────────────────────────┘
      │
      ▼
┌────────────────────────┐
│ Agent 3: Code Reviewer │ ──> Produces CODE_REVIEW.md (PASS / FAIL)
└────────────────────────┘
      │
      ▼
┌────────────────────────┐
│ Agent 4: QA Validator  │ ──> Runs tests & produces QA_REPORT.md
└────────────────────────┘
      │
   [Gate 2: Final Verdict]
      │
      ▼
┌────────────────────────┐
│ Agent 5: Release Mgr   │ ──> Updates memory, changelog, and creates PR
└────────────────────────┘
```

### 2. Tiered Memory System
Avoids token bloat by organizing memory into progressive tiers:
- **Router** (`.agents/memory/INDEX.md` or `.agents/MEMORY.md`): Master tag matrix (~150 tokens).
- **Tier 1 (Invariants)** (`.agents/memory/conventions.md`): Core non-negotiable rules.
- **Tier 2 (Domain Chunks)** (`.agents/memory/domain-chunk.md`): High-context domain models.
- **Tier 3 (Catalogs)** (`.agents/memory/services.md`, `models-schema.md`): Dynamic API and DB schemas.
- **Tier 4 (Cold Archive)** (`.agents/MEMORY_ARCHIVE.md`): Historical releases.

### 3. Built-In Token Optimization & Engineering Skills (Context-Budgeted)
Every scaffolded project automatically comes with a **lean, high-signal built-in skill suite** pre-installed directly inside `.agents/skills/` (~1,000 tokens/turn in `_base`, zero bloat):

- **Core Caveman Engine (5 skills)**: `caveman`, `cavecrew`, `caveman-explore`, `caveman-review`, `caveman-commit`, plus the `caveman-adapter.md` workflow.
- **Core Engineering Skills (8 universal + stack-specific)**: `diagnosing-bugs`, `code-review` (two-axis Standards vs Spec + Fowler smells), `tdd`, `codebase-design`, `domain-modeling`, `grilling`, `pr`, `writing-for-agents`, plus stack skills (`setup-pre-commit`, `setup-ts-deep-modules`, `prototype` for Next.js, `laravel-best-practices` for Laravel).
- **Optional Catalog (`skills/`)**: Situational utilities (`caveman-compress`, `caveman-stats`, `retro`, `research`, `handoff`, `wizard`, `improve-codebase-architecture`, etc.) live in the optional catalog via `npx agent-harness add-skill <name>` so they never bloat your daily system prompt. See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for MIT attribution.

---

## ⚡ Quickstart

Run inside your repository root:

```bash
npx agent-harness init
```

The CLI will auto-detect your project stack or prompt you to select one:
1. **Next.js**: App Router, Server Components, shadcn/ui, Playwright E2E.
2. **Laravel**: Multi-tenancy, Form Requests, API Resources, PHPStan rules.
3. **Node.js & TypeScript**: Clean architecture, Zod boundaries, Vitest.
4. **Python FastAPI**: Pydantic v2, SQLAlchemy async, pytest.
5. **Base Only**: Core 6 roles and tiered memory for any custom stack.

### Direct Stack Initialization
```bash
# Frontend Next.js
npx agent-harness init --stack nextjs

# Backend Laravel
npx agent-harness init --stack laravel

# Backend Node TypeScript
npx agent-harness init --stack node-typescript

# Backend Python FastAPI
npx agent-harness init --stack python-fastapi
```

---

## 📂 Scaffolded Directory Structure

```text
your-project/
├── AGENTS.md                  # Root agent instructions and project overview
└── .agents/
    ├── config.json            # Harness metadata and tracking
    ├── agents/                # Core role definitions
    │   ├── architect.md
    │   ├── code-reviewer.md
    │   ├── implementation-engineer.md
    │   ├── qa-validator.md
    │   ├── release-manager.md
    │   └── task-context-builder.md
    ├── memory/                # Progressive tiered memory system
    │   ├── conventions.md
    │   ├── domain-chunk.md
    │   ├── INDEX.md
    │   ├── models-schema.md
    │   └── services.md
    ├── rules/                 # Engineering and test rules
    │   ├── codebase-standards.md
    │   └── test-rules.md
    ├── scripts/               # Deterministic validation and sync scripts
    │   ├── manage-state.ts
    │   ├── sync-catalogs.ts
    │   └── validate-artifact.ts
    └── workflows/             # Autonomous workflow procedures
        ├── multiple-agent-workflow.md
        ├── hotfix-workflow.md
        └── strict-feature.md
```

---

## 🤝 Publishing to GitHub / NPM

To publish this package to NPM:
```bash
npm login
npm publish --access public
```

To use directly from GitHub without publishing:
```bash
npx degit <your-github-username>/agent-harness/templates/_base/.agents .agents
```

## License
MIT License. Free for open source and commercial use.
