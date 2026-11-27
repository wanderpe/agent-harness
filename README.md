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

### 4. Universal Cross-Agent Compatibility (Zero Duplication)
`.agents/` and `AGENTS.md` act as the **single source of truth**. On `init`, thin ~15-line adapters and skill symlinks/junctions are automatically wired so every major AI coding agent uses the exact same harness:

| AI Agent / IDE | Entrypoint | Skills Discovery |
| :--- | :--- | :--- |
| **Antigravity (Google)** | `AGENTS.md` (native) | `.agents/skills/` (native) |
| **OpenAI Codex CLI** | `AGENTS.md` (native) | `.agents/skills/` (native) |
| **Claude Code** | `CLAUDE.md` (thin pointer) | `.claude/skills` → `.agents/skills/` |
| **Cursor** | `.cursor/rules/agent-harness.mdc` | `.cursor/skills` → `.agents/skills/` |
| **VS Code / GitHub Copilot** | `.github/copilot-instructions.md` | References `.agents/skills/` |
| **Windsurf / OpenCode / Aider** | `AGENTS.md` (native) | `.agents/skills/` |

Control adapters with `--adapters all|claude,cursor,copilot|none` (defaults to `all`).

---

## ⚡ Quickstart

Run inside your repository root:

```bash
npx create-agent-harness
# or: npm create agent-harness
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
npx create-agent-harness --stack nextjs

# Backend Laravel
npx create-agent-harness --stack laravel

# Backend Node TypeScript
npx create-agent-harness --stack node-typescript

# Backend Python FastAPI
npx create-agent-harness --stack python-fastapi
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

To use directly from GitHub without publishing to npm:
```bash
# Run CLI directly from GitHub
npx github:wanderpe/agent-harness init

# Or copy base .agents folder via degit
npx degit wanderpe/agent-harness/templates/_base/.agents .agents
```

## 📚 References, Inspiration & Credits

This harness synthesizes ideas, architectures, and open-source skills from the following resources:

### Core Philosophy & Strategic Engineering
- **[How to Actually Code with AI (ft. Matt Pocock)](https://www.youtube.com/watch?v=mU8WKII1gpk)** — NetworkChuck interview with Matt Pocock on tactical vs. strategic programming, keeping context in the "Smart Zone", grilling requirements before coding, leading words, and reviewing by merge danger.
- **[How to Be More Ambitious: A Tutorial for Humans with Models](https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/)** — Felix Rieseberg's framework on the four dimensions of model ambition (**Speed, Altitude, Depth, Range**), the Depth Prompt, and the **Outside Judge** invariant (never letting the model grade its own work).

### Bundled & Adapted Open-Source Skills
- **[mattpocock/skills](https://github.com/mattpocock/skills)** *(MIT License)* — Engineering & productivity skills (`diagnosing-bugs`, `code-review`, `tdd`, `codebase-design`, `domain-modeling`, `grilling`, `pr`, `writing-for-agents`, `prototype`, `setup-pre-commit`, `setup-ts-deep-modules`, `retro`, `research`, `handoff`, `wizard`, `improve-codebase-architecture`).
- **[JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)** — Token-compression communication engine (`caveman`, `cavecrew`, `caveman-explore`, `caveman-review`, `caveman-commit`, and optional compression utilities).
- **[humanlayer/skills (`show-me`)](https://github.com/humanlayer/skills/blob/main/plugins/show-me/skills/show-me/SKILL.md)** — Dex Horthy / Humanlayer visual PR body & Merge Danger format (credited via `pr` skill).
- **[google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills)** — `shadcn-ui` component patterns and verification scripts.
- **[nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)** — `ui-ux-pro-max` frontend design intelligence.
- **[sickn33/antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills)** — `nextjs-best-practices` App Router guidelines.
- **[mindrally/skills](https://github.com/mindrally/skills)** — `redux-toolkit` state management patterns.
- **[patricio0312rev/skills](https://github.com/patricio0312rev/skills)** — `framer-motion-animator` animation patterns.

See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for license details.

---

## License
MIT License. Free for open source and commercial use.
