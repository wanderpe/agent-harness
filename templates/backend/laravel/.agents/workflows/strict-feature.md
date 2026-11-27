---
description: High-context backend feature development combining /backend-engineer workflow, /code-review logic walkthroughs, memory persistence via MEMORY.md, and user-gated verdict control.
---

# Strict Reusable Backend Feature Workflow

Execute backend requirement engineering by leveraging the full rigor of the `/backend-engineer` and `/code-review` workflows, maintaining persistent codebase architecture memory via `.agents/MEMORY.md`, and enforcing **User Plan Review Gates** and **User Final Verdict Gating**.

---

## Loaded Workflows & Skills
Load and apply:
- Agent: `backend-task-context-builder`
- Agent: `backend-architect`
- Agent: `backend-implementation`
- Agent: `backend-code-reviewer`
- Agent: `backend-qa-validator`
- Agent: `backend-release-manager`
- Workflow: `/backend-engineer`
- Workflow: `/code-review`
- Skill: `codebase-inventory`
- Skill: `architecture-designer`
- Skill: `laravel-patterns`
- Skill: `laravel-specialist`
- Skill: `qa-engineer`
- Skill: `caveman`
- Skill: `caveman-explore`
- Skill: `caveman-review`
- Skill: `caveman-commit`
- Skill: `documentation-agent`

---

## Execution Pipeline

### 0. Task Context Building & User Gate 0 (`backend-task-context-builder`)
- Engage with the user interactively to clarify:
  - Feature scope [WHAT] & Business goal [WHY]
  - Roles, actors, and permissions
  - Tenancy boundaries (`ScopedByClient`)
  - Data model and state transitions
  - Constraints and edge cases
  - Target Git branch
- Compile and present the standard task template.
- **USER GATE 0**: Wait for explicit user confirmation before initiating architecture design.
- **DO NOT implement yet.**

### 1. Memory Check & Reusability Audit (`backend-architect` + `codebase-inventory`)
- Check if `.agents/MEMORY.md` exists.
  - **IF EXISTS**: Read `.agents/MEMORY.md` to load cached services, traits, controllers, resources, and multi-tenancy rules immediately. Skip full repository re-scanning!
  - **IF MISSING**: Perform a full codebase audit of `app/Services/`, `app/Actions/`, `app/Traits/`, `app/Helpers/`, and `app/Http/Resources/` using `grep_search` and `list_dir`. Then write the initial `.agents/MEMORY.md`.
- **Rule**: Do NOT write duplicate helper logic. If a service or helper exists in memory or code, you MUST reuse it.
- **DO NOT implement yet.**

### 2. Architecture & Sibling Pattern Matching (`backend-architect`)
- Inspect sibling controllers, form requests, policies, and resources to match conventions 1-to-1:
  - Form Requests vs. Inline validation
  - Database Transactions (`DB::transaction`)
  - Error handling & Exception classes
  - JSON response structure & API Resources
- Produce a detailed architecture plan referencing exact existing codebase functions to be reused.
- **DO NOT implement yet.**

### 3. QA Architecture Review (`backend-architect` + `qa-engineer`)
- Evaluate the plan against QA risks:
  - Tenancy isolation & Cross-tenant data leaks (`ScopedByClient`)
  - Concurrency, race conditions, & DB locks
  - Authorization & Policy enforcement
  - Data integrity & Mass assignment
- Classify risks as CRITICAL, HIGH, MEDIUM, LOW.
- If CRITICAL/HIGH risks exist, revise the architecture plan until QA PASS.
- **DO NOT implement yet.**

### 4. Generate Context-Rich Tasks (`backend-architect`)
- Create structured implementation tasks containing:
  - Task ID & Objective
  - Existing codebase context & similar implementations
  - Exact pre-existing services/traits to reuse
  - Files to create / modify
  - Edge cases & acceptance criteria
- Order tasks by dependency.
- **USER GATE 1**: Present the Architecture & Implementation Tasks to the user for discussion and review. **PAUSE AND WAIT FOR EXPLICIT USER APPROVAL** before proceeding to implementation.
- **DO NOT implement yet.**

### 5. Implementation Execution Plan & Surgical Code Execution (`backend-implementation`)
- **Pre-Implementation Plan (Gate 2)**: Formulate `IMPLEMENTATION_PLAN.md` detailing the file-by-file changes and execution steps before modifying code.
- For every task:
  1. Inspect referenced sibling files.
  2. Implement minimal required changes.
  3. Reuse identified helper functions & services from `MEMORY.md`.
  4. Follow approved architecture strictly.
  5. DO NOT introduce new libraries, DTO layers, or unrequested patterns.
- Produce `IMPLEMENTATION_REPORT.md`.

### 6. Logic Walkthrough & Code Review (`backend-code-reviewer`)
- Prepare a comprehensive post-implementation review:
  - **Code Review**: Correctness, Security, DB queries (N+1), Tenancy, Project alignment.
  - **Logic Walkthrough**: Request → Route → Middleware → Form Request → Controller → Action/Service → Model → Database → Resource.
  - **Mermaid User Flow Diagram**: Visualize the execution path and decision points.

### 7. Independent QA Validation (`backend-qa-validator`)
- Validate against original requirements, acceptance criteria, tenancy, and edge cases.
- Produce `QA_REPORT.md` and manual verification guide.

### 8. User Final Verdict Gate & Release (`backend-release-manager`)
- Present the Manual Verification Guide, Implementation Summary, Logic Walkthrough, and Mermaid Diagram to the USER.
- **PAUSE & WAIT FOR USER VERDICT**:
  - **Option A (User Approves)**: User says `"complete"`, `"this is done"`, `"this is complete"`, `"approved"`, or `"looks good"`.
    $\rightarrow$ Trigger `backend-release-manager` to update `.agents/MEMORY.md`, record `[FINISHED]` entry, commit, push, and create a PR.
  - **Option B (User Rejects / Reports Defects)**: User says `"not yet"`, reports an issue, or requests changes.
    $\rightarrow$ **DO NOT DOCUMENT / COMMIT**. Return to Phase 5 (Surgical Implementation), inspect defective code, apply fixes, and re-run review/QA.