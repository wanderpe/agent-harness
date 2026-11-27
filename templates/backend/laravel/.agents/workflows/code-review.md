---
description: 
---

# Laravel Code Review & Logic Walkthrough

## Severity Vectors (caveman-review format)
Classify all review findings strictly using Caveman severity vectors:
- `🔴 bug:` Defects that cause crashes, data corruption, or auth bypass.
- `🟡 risk:` Performance bottlenecks, N+1 queries, unindexed DB columns, edge cases.
- `🔵 nit:` Style discrepancies, redundant imports, minor naming.
- `❓ q:` Questions about intent or unhandled edge cases.

---

Review existing Laravel code to understand its behavior,
identify risks and issues, and explain the implementation
clearly to the USER.

This workflow is for reviewing existing code.

It must NOT automatically redesign or rewrite the feature.

The existing codebase is the source of truth.

The USER is the final reviewer.

Do not run automated tests unless the USER explicitly asks.

---

## 1. Understand Review Scope

Determine what the USER wants reviewed.

The scope may be:

- specific file
- class
- method
- feature
- endpoint
- branch
- PR
- recent changes
- complete user flow
- specific business logic
- specific question

If the USER asks a specific question, answer that question
using the actual codebase.

Do not review unrelated code unless it affects the requested
logic.

---

## 2. Inspect The Codebase

Before reviewing, inspect the relevant code and its
dependencies.

Trace:

- routes
- middleware
- authentication
- authorization
- Form Requests
- controllers
- actions/services
- models
- relationships
- scopes
- database queries
- events
- listeners
- jobs
- notifications
- resources
- API responses
- frontend/API consumers when relevant
- tests for behavioral context

Search for similar implementations when necessary.

Do not assume behavior.

Trace the actual execution path.

---

## 3. Load Laravel Expertise

When relevant, load:

- `laravel-specialist`
- `laravel-patterns`
- `architecture-designer`
- `qa-engineer`

Use these to evaluate:

- Laravel correctness
- project conventions
- architecture
- security
- authorization
- tenancy
- database integrity
- performance
- maintainability
- regression risks

The existing codebase remains the source of truth.

Do not recommend changes simply because they differ from
generic Laravel conventions.

---

## 4. Code Review

Review the requested code for:

### Correctness

- Does the logic actually satisfy its intended behavior?
- Are edge cases handled?
- Are state transitions valid?
- Can invalid states occur?

### Security

- authorization
- authentication
- tenant isolation
- mass assignment
- input validation
- data exposure
- insecure direct object access

### Database

- N+1 queries
- unnecessary queries
- transactions
- race conditions
- relationships
- indexes
- data consistency

### Laravel

- Eloquent usage
- Form Requests
- Policies
- Actions/Services
- Events/Listeners
- Jobs
- Resources
- dependency injection

### Maintainability

- duplication
- unnecessary abstraction
- unclear naming
- excessive complexity
- coupling
- hidden side effects

### Project Alignment

Determine whether the implementation follows existing
project patterns.

---

## 5. Findings

Report findings using:

### CRITICAL

Likely to cause serious security, data integrity, or
functional problems.

### HIGH

Likely to cause significant bugs or regressions.

### MEDIUM

Maintainability, performance, or correctness concerns that
should be addressed.

### LOW

Minor improvements or code-quality suggestions.

For every finding include:

- severity
- location
- problem
- why it matters
- actual behavior
- recommended improvement

Do not report speculative issues as confirmed problems.

---

# 6. Logic Walkthrough

After the review, provide a clear explanation of how the
logic currently works.

Explain it from the entry point through the final result.

For example:

Request
→ Route
→ Middleware
→ Authentication
→ Form Request
→ Controller
→ Policy
→ Action
→ Model
→ Database
→ Event
→ Listener
→ Response

For every important step explain:

- what happens
- why it happens
- what data is passed
- what conditions are checked
- what happens on success
- what happens on failure
- what side effects occur

Use actual class, method, route, and model names from the
codebase.

Do not invent names.

---

## 7. User Flow Documentation

Create documentation describing the behavior in plain
language.

Structure it as:

### Purpose

What this feature does.

### Entry Point

Where the user/system enters the flow.

### Main Flow

Step-by-step behavior.

### Decision Points

Explain important conditions.

### Data Flow

Explain how important data moves through the system.

### Side Effects

Explain:

- database changes
- events
- jobs
- notifications
- logs
- external API calls

### Failure Paths

Explain validation failures, authorization failures,
exceptions, and other important failure cases.

### Edge Cases

Explain important edge cases and their current behavior.

---

## 8. Mermaid User Flow

Generate a Mermaid diagram representing the actual logic.

Example:

```mermaid
flowchart TD
    A[User submits request] --> B[Route]
    B --> C[Authentication]
    C --> D{Authorized?}

    D -->|No| E[403 Response]

    D -->|Yes| F[Form Request Validation]
    F -->|Invalid| G[422 Response]

    F -->|Valid| H[Controller]
    H --> I[Action]

    I --> J{Valid State?}

    J -->|No| K[Business Error]
    J -->|Yes| L[Database Transaction]

    L --> M[Update Model]
    M --> N[Dispatch Event]
    N --> O[API Resource]
    O --> P[Response]