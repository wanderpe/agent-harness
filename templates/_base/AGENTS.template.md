# Project: {{PROJECT_NAME}}

## Stack
- **Primary Language & Runtime**: {{PRIMARY_STACK}}
- **Framework**: {{FRAMEWORK}}
- **Database / Cache**: {{DATABASE_CACHE}}
- **Authentication**: {{AUTH_SYSTEM}}
- **Testing**: {{TESTING_FRAMEWORK}}

## Architecture & Boundaries
- **Core Domain**: `{{CORE_DOMAIN_DIR}}`
- **Application Services**: `{{SERVICES_DIR}}`
- **Controllers / API Endpoints**: `{{API_DIR}}`
- **Data Models & Schema**: `{{MODELS_DIR}}`

## Non-Negotiable Engineering Conventions
1. **Deterministic Quality**: Every modification must pass automated linting, type-checking, and tests.
2. **Context Budgeting**: Load only the memory chunks and schemas needed for your specific task.
3. **Traceability**: All non-trivial changes require an architecture review and verification plan.
4. **No Premature Release**: Strictly observe agent stage boundaries and human confirmation gates.
5. **Token Optimization (Caveman Protocol)**: All agents operate under the `caveman` skill to maximize engineering signal and minimize token waste (terse output, zero filler, immediate code/diff delivery).

## Tiered Memory System
- **Tier 1 (System Invariants)**: `.agents/memory/conventions.md` (Primary keys, tenancy, error-handling, naming conventions)
- **Tier 2 (Domain Chunks)**: `.agents/memory/domain-chunk.template.md` (Domain rules & schemas)
- **Tier 3 (Catalogs)**: `.agents/memory/services.md` and `models-schema.md` (Service maps and active schema tables)
- **Memory Router**: `.agents/memory/INDEX.md` or `.agents/MEMORY.md` (Master index table)

## Multi-Agent Workflow Pipeline
When executing features or fixes, strictly adhere to `.agents/workflows/multiple-agent-workflow.md`:
1. **Agent 0 (Task Context Builder)**: Gathers scope, files, and contracts -> writes `TASK_CONTEXT.md` -> [User Gate 0]
2. **Agent 1 (Architect)**: Evaluates trade-offs, schemas, edge cases -> writes `ARCHITECTURE_PLAN.md` -> [User Gate 1]
3. **Agent 2 (Implementation Engineer)**: Executes code changes following plans -> conducts self-review
4. **Agent 3 (Code Reviewer)**: Audits against conventions & security -> writes `CODE_REVIEW.md` (PASS/FAIL)
5. **Agent 4 (QA Validator)**: Executes unit/integration/E2E test suite -> writes `QA_REPORT.md`
6. **User Final Approval Gate**: Verification before release
7. **Agent 5 (Release Manager)**: Updates changelog, memory tiers, and creates pull request.

## Commands
- **Run Tests**: `{{TEST_COMMAND}}`
- **Run Linter / Typecheck**: `{{LINT_COMMAND}}`
- **Build**: `{{BUILD_COMMAND}}`
