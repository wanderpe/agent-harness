# Agent Harness 🚀

A modular, production-grade agentic harness system and scaffolding tool for multi-agent software engineering.

## Why This Harness Exists & What It Solves

Without a harness, every new AI coding session starts with **amnesia**: the model guesses your architecture, ignores conventions, bloats a single chat window until reasoning degrades, and self-grades its own output with *"looks good to me."*

**Agent Harness** turns your repository itself into both the AI's **hard-harnessed knowledgebase** and its **executable engineering operating system** — regardless of which model or IDE you plug in (Antigravity, Claude Code, Codex, Cursor, VS Code Copilot).

### 1. The Hard-Harnessed Knowledgebase (Stateful, Persistent Brain)
- **Stateful at Two Levels:**
  - **Project-Level Memory:** `AGENTS.md` + `.agents/memory/` (`conventions.md`, `domains/`, `lessons/`, `catalogs/`) + `MEMORY.md` / `MEMORY_ARCHIVE.md` give every AI session a **version-controlled, model-agnostic institutional memory** updated on every release.
  - **Task-Level State Graph:** `.agent-work/<TASK_ID>/STATE.json` (managed deterministically by `manage-state.ts` / `manage-state.php`) tracks active pipeline nodes, rework counters, and human gate approvals — so you can clear context or start a fresh agent session and resume right where you left off.

### 2. The Executable Guardrails (Active Engineering OS)
A static wiki alone is passive — models still drift, rush, or hallucinate. The harness enforces *how* the AI works on that knowledgebase:
- **Smart-Zone Isolation:** 6 distinct sub-agents + handoff artifacts (`.agent-work/<TASK_ID>/`) keep every stage in a clean context window instead of dragging one bloated thread.
- **Human Gates:** Forces alignment *before* code is written (`grilling` + Gate 0 & Gate 1) and before shipping (Gate 2 + Merge Danger).
- **Outside Judges (No Self-Grading):** Deterministic checks (`manage-state.ts`, `validate-artifact.ts`, `tdd`, `diagnosing-bugs`, `live-web-tester`, `live-api-tester`) prove changes work instead of trusting model confidence.
- **YAGNI, KISS & Scale-Up-First:** High rigor without over-engineering — agents reject speculative abstractions, measure bottlenecks before adding infra, and use complexity-gated routing (`SMALL` stays on 1 strong agent; `LARGE` uses the full 6-agent pipeline).
- **Token Discipline:** Built-in `caveman` compression + tiered memory ensure agents load only the exact slice of knowledge they need.

> **The Goal:** Any frontier model you plug into your repo immediately operates like a senior engineer who already knows your codebase — with strict, repeatable guardrails.

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

### Lifecycle Commands (`doctor` & `update`)
Keep your harness healthy and up to date across every repo:
```bash
# Audit .agents/ health, Smart-Zone token budget, IDE skill links & Live QA prerequisites
npx create-agent-harness doctor

# Safely upgrade core agents, skills, scripts & workflows WITHOUT touching your memory/ or rules/
npx create-agent-harness update

# Preview an update without modifying files
npx create-agent-harness update --dry-run
```

### Recommended Live QA Prerequisites (MCP & CLI)
To unlock the closed-loop live QA & hotfix workflows (`live-test-and-hotfix.md` and `api-test-and-hotfix.md`), ensure the matching tool + MCP server is available:
- **Frontend (`nextjs`)**: Install Playwright (`npm i -D @playwright/test && npx playwright install`) and enable the **Playwright MCP server** (`@playwright/mcp`) in your AI IDE.
- **Backend (`laravel`, `node-typescript`, `python-fastapi`)**: Install Newman (`npm i -g newman`) or Postman CLI and enable the **Postman MCP server** in your AI IDE.

*(Running `npx create-agent-harness` automatically checks for these tools and prints a non-blocking warning if they are missing.)*

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
    ├── MEMORY.md              # Progressive tiered memory router
    ├── MEMORY_ARCHIVE.md      # Cold storage archive (bounded hot window)
    ├── memory/                # Progressive tiered memory system
    │   ├── INDEX.md
    │   ├── conventions.md     # Tier 1: System invariants
    │   ├── domains/           # Tier 2: Domain-scoped chunks
    │   ├── lessons/           # Tier 2.5: Durable heuristics & post-mortems
    │   └── catalogs/          # Tier 3: Models, schemas & services maps
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
- **[Arjay McCandless (`@arjay_mccandless` / Devmaxx)](https://www.tiktok.com/@arjay_mccandless)** — Empirical, benchmark-driven system design ("scale up first, measure before scaling out", constrained-budget optimization, and real load testing over textbook theory) informing `empirical-system-design` and complexity-gated agent scaling.

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
