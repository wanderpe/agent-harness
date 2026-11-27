<!-- TEMPLATE_VERSION: 1.0.0 -->
---
description: Universal Plug-and-Play Caveman Agent Adapter (Prerequisite Verification -> Tiered Memory -> Worker Upgrade -> Workflow Streamlining -> Test Verification).
---

# Universal Caveman Agent Adapter Workflow

A plug-and-play workflow that adapts any repository's agent OS to the token-optimized Caveman architecture with strict prerequisite validation and early exits.

Works across **any tech stack** (Laravel, Next.js, Node/Express, Go, Python/FastAPI, Django, Ruby on Rails, etc.) and any codebase memory structure.

---

## Adaptation Pipeline Overview

```text
Run /caveman-adapter
  │
  ▼
Phase 0: Strict Prerequisite Gates ──► Missing Skills / Workers / Memory ──► EARLY EXIT (Abort)
  │ (All Prerequisites PASS)
  ▼
Phase 1: Tech-Stack & Architecture Auto-Discovery
  │
  ▼
Phase 2: Tiered Memory Transformation (Active MEMORY.md + MEMORY_ARCHIVE.md)
  │
  ▼
Phase 3: Stack-Aware Worker Agent Upgrade (Inject Caveman Contracts)
  │
  ▼
Phase 4: Workflow Orchestrator Streamlining (Lean Artifact Handoffs)
  │
  ▼
Phase 5: Deterministic Remeasurement & Test Verification
```

---

## Phase 0: Prerequisite Verification (Strict Early Exits)

Execute these 3 checks in order before inspecting or modifying any other files. If any check fails, **HALT IMMEDIATELY**.

### Check 1: Caveman Skills Verification
* Inspect `.agents/skills/` (or global skills path) for core Caveman skills:
  - `caveman` (Compression engine)
  - `cavecrew` (Subagent delegation contracts)
  - `caveman-explore` (FastContext parallel exploration)
  - `caveman-review` (Line-anchored severity reviews)
  - `caveman-commit` (Terse conventional commits)
  - `caveman-compress` (Memory markdown compressor)
* **Early Exit Condition**: If Caveman skills are not found:
  ```text
  [ADAPTER ABORTED]: No Caveman skills found in .agents/skills/.
  Please install or copy the Caveman skill suite before running this adapter.
  ```

### Check 2: Agent Workers Verification
* Inspect `.agents/agents/` for worker agent definitions (`agent.md` files).
* **Early Exit Condition**: If `.agents/agents/` is empty or missing:
  ```text
  [ADAPTER ABORTED]: No agent workers found in .agents/agents/.
  Please bootstrap your project's agent workers first before running this adapter.
  ```

### Check 3: Active Memory File Verification
* Inspect `.agents/MEMORY.md`.
* **Early Exit Condition**: If `.agents/MEMORY.md` does not exist:
  ```text
  [ADAPTER ABORTED]: No .agents/MEMORY.md found.
  Please create your initial codebase inventory memory file before running this adapter.
  ```

---

## Phase 1: Tech-Stack & Architecture Auto-Discovery

1. **Parse `.agents/MEMORY.md`**:
   - Extract primary language, framework, ORM/query builder, database engine, cache driver, queue system, and auth mechanism.
   - Extract multi-tenancy rules and security constraints (e.g. `ScopedByClient`, schema-per-tenant, row-level filters).
   - Extract test framework and test execution commands (e.g. `php artisan test`, `npm test`, `pytest`, `go test`).
2. **Inventory Agent Workers**:
   - List all worker subdirectories in `.agents/agents/`.
   - Classify each agent's role:
     - `Context Builder / Triage`
     - `Architect / System Designer`
     - `Implementation Engineer / Builder`
     - `Code Reviewer / Security Auditor`
     - `QA Validator / Systems Tester`
     - `Release Manager / Documentation Keeper`

---

## Phase 2: Tiered Memory Transformation

1. **Create Historical Archive (`.agents/MEMORY_ARCHIVE.md`)**:
   - If `.agents/MEMORY_ARCHIVE.md` does not exist, create it with a standard archive header.
   - Extract all historical completed tasks, feature logs, and old changelog entries from `.agents/MEMORY.md` into `MEMORY_ARCHIVE.md`.
2. **Compress Active Core (`.agents/MEMORY.md`)**:
   - Apply `caveman-compress` syntax to active sections (Project Overview, Directory Map, Core Services, Models/Schema, Conventions, Testing):
     - Strip conversational filler words (`basically`, `simply`, `actually`, `in order to`).
     - Strip articles (`a`, `an`, `the`) where grammar allows.
     - **Preserve 100% exact symbols**: Class names, function signatures, database column names, routes, paths, shell commands, and Markdown table structures.
3. **Inject Compact Pointer Index in `MEMORY.md`**:
   - Replace the large changelog section with a clean, 1-line pointer table referencing `MEMORY_ARCHIVE.md` and `.agent-work/` artifacts:
     ```markdown
     ## 7. Change History & Feature Log Index
     > Detailed change logs are archived in [.agents/MEMORY_ARCHIVE.md](file:///.../MEMORY_ARCHIVE.md).
     | Timestamp | Type | TASK_ID | Description | Artifacts |
     | :--- | :--- | :--- | :--- | :--- |
     ```

---

## Phase 3: Stack-Aware Worker Agent Upgrade

Iterate across all agent definitions in `.agents/agents/*/agent.md` and upgrade their prompt contracts while preserving all repository-specific rules:

1. **Context Builder / Triage Agents**:
   - Inject `caveman-explore` ("FastContext") protocol: parallel tool searches (glob, grep, read slices) and compact citation output:
     `<filepath>:<start>-<end> — <short reason>`
   - Enforce generation of high-density `TASK_SPEC.md` / `TASK_CONTEXT.md` dropping narrative preambles.
2. **Architect / Planner Agents**:
   - Standardize output into a unified `EXECUTION_PLAN.md` with explicit task checkboxes, reused `MEMORY.md` services, and QA risk evaluation matrices.
3. **Implementation Agents**:
   - Adopt `cavecrew-builder` verification reporting (`<filepath>:<lines> — <change>, verified: <status>`).
   - Retain 100% adherence to SOLID principles, framework conventions, and multi-tenancy/transaction boundaries.
4. **Code Reviewer Agents**:
   - Adopt `caveman-review` line-anchored severity vectors:
     - `🔴 bug:` — Broken business rule, security leak, missing transaction, crash risk.
     - `🟡 risk:` — Race condition, missing null check, N+1 query, missing eager loading.
     - `🔵 nit:` — Style, naming, micro-optimization.
     - `❓ q:` — Ambiguous intent or unstated assumption.
   - Retain Mermaid sequence diagrams and strict security/tenancy gates.
5. **QA Validator Agents**:
   - Structure verification as an assertion matrix (`[PASS|FAIL] <criterion>: <evidence>`).
   - Enforce FIRST testing principles and step-by-step copy-pasteable manual test guides.
6. **Release Manager Agents**:
   - Enforce active knowledge sync (update `.agents/memory/conventions.md` & `domains/`) + two-tier memory updates (append full log to `MEMORY_ARCHIVE.md` + append 1-line pointer to `MEMORY.md`).
   - Enforce `caveman-commit` conventional commit standards (`≤50 chars subject`, why-focused).

---

## Phase 4: Workflow Orchestrator Streamlining

Update workflow files in `.agents/workflows/`:
1. Streamline handoff artifacts between steps:
   `TASK_SPEC.md -> EXECUTION_PLAN.md -> IMPLEMENTATION_PLAN.md -> CODE_REVIEW.md -> QA_REPORT.md -> RELEASE_REPORT.md`
2. Eliminate redundant cross-file copying of requirements and large code dumps.
3. Ensure user approval gates (Gate 0, Gate 1, Final Verdict Gate) remain 100% enforced.

---

## Phase 5: Deterministic Remeasurement & Test Verification

1. **Net-Token-Negative Measurement**:
   - Measure byte sizes and line counts before and after across `.agents/MEMORY.md` and `.agents/agents/`.
   - Confirm net token reduction exceeds $\ge 40-60\%$.
2. **Automated Test Run**:
   - Execute the project's native test command from `MEMORY.md` (e.g. `php artisan test`, `npm test`, `pytest`).
   - Confirm all existing tests pass with zero regression.
3. **Adapter Summary Report**:
   - Present a concise summary of adapted files, token reduction achieved, and test verification results to the user.
