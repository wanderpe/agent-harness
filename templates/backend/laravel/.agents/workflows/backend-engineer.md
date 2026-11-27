---
description: 
---

# Laravel Backend Feature Development

## Token Optimization & Caveman Mode
Execute all engineering phases under the `caveman` protocol:
- Drop polite filler, hedging, and conversational preamble.
- Deliver code, file paths, exact line slices, and technical reasoning directly.
- Use `caveman-explore` for targeted codebase inspection without token bloat.

---

Guide a Laravel backend requirement through architecture,
QA review, context-rich task generation, implementation,
and manual verification.

The existing codebase is the source of truth.

The USER is the final reviewer and has the final decision
on whether the implementation is complete.

Do not run automated tests unless the user explicitly asks
for them.

---

## 1. Requirement Analysis

Understand whether the request is:

- new feature
- enhancement
- bug fix
- refactor
- performance improvement
- architectural change

Ask only questions that cannot be answered by inspecting
the repository.

Do not implement yet.

---

## 2. Architecture Design

Load and apply:

- `architecture-designer`
- `laravel-patterns`
- `laravel-specialist`

Inspect the existing codebase before designing anything.

Identify:

- existing architecture
- similar implementations
- models and relationships
- migrations
- controllers
- requests
- resources
- actions/services
- policies
- events/listeners
- jobs
- routes
- tests
- authorization
- tenancy
- performance considerations

Prefer existing project patterns over introducing new ones.

Produce a detailed implementation plan.

Do NOT implement yet.

---

## 3. QA Architecture Review

Load and apply:

- `qa-engineer`

Review the implementation plan for:

- correctness
- regression risks
- authorization
- tenancy
- database integrity
- concurrency
- validation
- API behavior
- performance
- test coverage strategy
- Laravel alignment
- codebase alignment

Classify findings as:

- CRITICAL
- HIGH
- MEDIUM
- LOW

If CRITICAL or HIGH issues exist:

1. Return to architecture design.
2. Revise the plan.
3. Re-run QA.

Do not proceed until the plan passes QA review.

QA approval does NOT mean the feature is complete.

The USER remains the final reviewer.

---

## 4. Generate Context-Rich Tasks

After QA PASS, create implementation tasks.

Every task must contain:

- task ID
- objective
- why the task exists
- existing codebase context
- relevant files
- similar implementations
- architecture decision
- Laravel pattern to follow
- Laravel specialist considerations
- files to create
- files to modify
- dependencies
- business rules
- authorization
- tenancy
- edge cases
- testing considerations
- acceptance criteria
- implementation constraints

Tasks must contain enough context for an implementation
agent to understand WHY the change is being made and HOW
it fits the existing codebase.

Order tasks by dependency.

Do NOT implement yet.

---

## 5. Implementation

For EVERY task:

1. Read the complete task.
2. Inspect all referenced files.
3. Search the repository for similar implementations.
4. Load `laravel-patterns`.
5. Load `laravel-specialist`.
6. Confirm alignment with the existing codebase.
7. Implement the smallest change necessary.
8. Follow the approved architecture.
9. Add or update tests where appropriate, but DO NOT run
   the automated test suite unless the user explicitly asks.
10. Verify the implementation against the task acceptance
    criteria.

Rules:

- Do not introduce unnecessary abstractions.
- Do not modify unrelated code.
- Do not silently change the approved architecture.
- Do not replace existing project patterns without
  justification.
- Preserve existing authorization and tenancy behavior.

If implementation reveals that the approved architecture
is incorrect:

STOP.

Explain:

- what was discovered
- why the architecture is insufficient
- what existing code caused the discovery
- proposed change
- affected tasks

Return to architecture review before continuing.

---

## 6. Manual Verification Preparation

After implementation, DO NOT run automated tests.

Instead, prepare a manual verification guide for the USER.

The guide must explain:

### A. What Changed

List:

- files created
- files modified
- database changes
- API changes
- configuration changes

### B. How The Logic Works

Provide a clear walkthrough of the complete request flow.

Example:

Request
→ Route
→ Middleware
→ Authentication
→ Form Request
→ Controller
→ Policy
→ Action/Service
→ Model
→ Database
→ Event/Job
→ Resource/Response

Explain what each layer does.

### C. Business Logic Walkthrough

Explain:

- main happy path
- validation
- authorization
- tenancy
- state transitions
- database operations
- side effects
- error handling
- edge cases

### D. Manual Verification Steps

Give the USER concrete steps to verify the implementation.

For example:

1. Create/identify the required test data.
2. Authenticate as the appropriate user.
3. Send the request to the endpoint.
4. Verify the response.
5. Verify the database state.
6. Verify authorization behavior.
7. Verify tenant isolation.
8. Verify relevant side effects.
9. Verify existing behavior that could have regressed.

Include example API requests or SQL queries when useful.

### E. Expected Results

For every verification step, explain:

- what should happen
- what should NOT happen
- what indicates a failure

### F. Regression Checklist

List existing functionality that should be manually checked.

---

## 7. Final Review — USER DECIDES

The USER is the final reviewer.

Do not declare the feature "complete" automatically.

Present:

### Implementation Summary

What was changed and why.

### Logic Walkthrough

How the implementation works from request to response.

### Manual Verification Guide

Exactly how the USER can verify the feature.

### Known Risks

Any remaining concerns.

### QA Findings

Summarize the QA review and whether all identified issues
were addressed.

### Recommended Follow-ups

Optional improvements that are NOT required for completion.

Then ask the USER to decide:

- Complete
- Needs Changes
- Needs Further Investigation

Do not override the USER's decision.

---

# IMPORTANT RULES

## No Automatic Test Execution

Do NOT automatically run:

- `php artisan test`
- Pest
- PHPUnit
- integration test suites
- feature test suites

unless the USER explicitly requests it.

Tests may be created or updated as part of the implementation,
but execution is controlled by the USER.

---

## User Has Final Authority

The agent provides:

- architecture
- implementation
- QA analysis
- logic walkthrough
- manual verification instructions
- risks
- recommendations

The USER decides whether the implementation is complete.

Never claim that the feature is fully verified merely because
the implementation was completed.

---

## Codebase Alignment

For every implementation:

Existing Codebase
→ Approved Architecture
→ Existing Project Patterns
→ Task Context
→ Laravel Patterns
→ Laravel Specialist
→ Implementation

Always inspect before changing.

Never guess.

Never silently introduce a new architecture.