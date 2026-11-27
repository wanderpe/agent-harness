# <TASK_ID> — Browser Test Instructions

## Task
- **ClickUp Task ID:** <CUSTOM_ID> (<RAW_ID>)
- **ClickUp URL:** https://app.clickup.com/t/<RAW_ID>
- **Title:** <TASK_TITLE>
- **Repository:** `C:/Work/jobzpro`
- **Route:** `http://localhost:3000/<ROUTE>`
- **Target QA Artifact:** `.agent-work/<TASK_ID>/QA_REPORT.md`

## Preconditions & Setup
1. Local dev server running on `http://localhost:3000`.
2. Dedicated Chrome browser profile connected over CDP (`127.0.0.1:9222`).
3. Authenticated user role required (e.g. Job Seeker / Employer / Admin).
4. Initial navigation URL or starting step.

## Test Procedure
1. **Scenario 1: [Action / Navigation]**
   - Step 1: ...
   - Expected: ...
2. **Scenario 2: [Interaction / Assertions]**
   - Step 2: ...
   - Expected: ...
3. **Scenario 3: [Persistence / Reload / State]**
   - Step 3: ...
   - Expected: ...
4. **Code Quality Checks**:
   - `bun run lint`
   - `bun run build`

## Required Deliverables
- Update `.agent-work/<TASK_ID>/QA_REPORT.md` with:
  - `QA_STATUS: PASS` or `QA_STATUS: FAIL`
  - Step-by-step results
  - Visual screenshot evidence (`MEDIA:...`)
- Report back to `@eric-cartman`.
