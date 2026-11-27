# QA Report — {{TASK_ID}}

QA_STATUS: FAIL
QA_COMMIT_SHA: <git rev-parse HEAD>
QA_BRANCH: <git rev-parse --abbrev-ref HEAD>

## QA Status

<!-- PASS or FAIL with one-sentence justification -->

## Requirement Validation

<!-- Does the implementation satisfy all requirements from TASK_CONTEXT.md? -->

| Requirement | Status | Notes |
|:---|:---|:---|
| | ✅ / ❌ | |

## Acceptance Criteria

<!-- Verify each acceptance criterion -->

| Criterion | Status | Notes |
|:---|:---|:---|
| | ✅ / ❌ | |

## Automated Checks

| Check | Command | Result |
|:---|:---|:---|
| Lint | `npm run lint` | ✅ / ❌ |
| Build | `npm run build` | ✅ / ❌ |
| Type Check | `npx tsc --noEmit` | ✅ / ❌ |

## Responsive Verification

| Breakpoint | Status | Notes |
|:---|:---|:---|
| Mobile (<640px) | ✅ / ❌ | |
| Tablet (640-1024px) | ✅ / ❌ | |
| Desktop (>1024px) | ✅ / ❌ | |

## Edge Cases & Blast Radius

| Edge Case / Verification | Status | Notes |
|:---|:---|:---|
| Empty state (no data) | ✅ / ❌ | |
| Error / API failure state (toast) | ✅ / ❌ | |
| Null / undefined field fallback | ✅ / ❌ | |
| Token balance boundary (zero / integer) | ✅ / ❌ | |
| Blast radius sibling route regression check | ✅ / ❌ | |
| Loading / skeleton state | ✅ / ❌ | |

## Manual Verification Guide

<!-- Step-by-step browser instructions for the user to verify the feature -->

### Prerequisites

1. 

### Steps

1. 
2. 
3. 

### Expected Results

1. 
