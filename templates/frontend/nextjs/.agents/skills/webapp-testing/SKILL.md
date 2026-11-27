---
name: webapp-testing
description: Local web application & interactive UI flow testing intelligence. Verifies local dev servers, NextAuth authentication states, multi-tenant route guards, parallel route reloads, Radix form interactions, and toast notification assertions.
---

# Web Application & Interactive UI Testing (On-Demand Skill)

Use this skill when driving live local web applications (`http://localhost:3000`), testing end-to-end interactive journeys, inspecting form state retention, and verifying toast feedback loops.

---

## 1. Local Server & Environment Preflight

Before driving browser actions:
1. **Server Verification**: Confirm the Next.js local server is active (default: `http://localhost:3000`).
2. **Locale & Multi-Tenancy Scoping**: Ensure URLs carry the correct locale prefix (`/en/...`) and tenant identifier.
3. **Session State**: Confirm whether testing requires authenticated state (Admin vs Member credentials) or public guest routes (`/en/sign-in`, `/(marketing)`).

---

## 2. Interactive Flow Verification Patterns

### A. Parallel Route `@modal` Invariant
- **Deep-Link Direct Load**: Direct navigation to `@modal` URLs (e.g. `/en/dashboard/jobs/edit/123`) must render the base page + modal overlay cleanly.
- **Browser History Synchronization**:
  1. Open modal via UI click -> URL updates with modal path.
  2. Press browser **Back** -> Modal closes smoothly; base page remains intact.
  3. Press browser **Forward** -> Modal reopens cleanly without flashing empty content.
- **Escape Key & Backdrop Click**: Verify pressing `Escape` or clicking outside dismisses modal without unhandled rejection.

### B. Form Validation & Data Retention
- **Negative Testing (Empty Submit)**: Trigger submit on empty mandatory fields. Verify:
  - Red field border or validation text renders.
  - Page does not reload or discard previously filled optional inputs.
  - An error Sonner toast or alert banner is displayed.
- **Positive Testing (Successful Submit)**:
  - Submit valid payload.
  - Verify success toast appears.
  - Verify modal auto-closes or page navigates to target route.
  - Verify table/list updates with new/updated entry.

### C. Dropdowns & Radix UI Select Controls
- Test that clicking `<FormSelect />` immediately displays the options menu without requiring multiple clicks.
- Select an option and verify the displayed label reflects the choice and form state updates immediately.
- Verify lowercase normalized enums (`billing_type`, `priority_type`) match correctly.

---

## 3. Real-Time & Feedback Sentinel

- **Sonner Toast Auditing**: Confirm toasts appear with high visual contrast, correct variant (success / error), and auto-dismiss after timeout.
- **Console Sentinel**: Ensure no React hydration warnings (`Hydration failed because the initial UI does not match...`), invalid DOM nesting, or missing `next-intl` translation keys (`MISSING_MESSAGE: ...`).
- **Network Telemetry**: Flag slow API responses (>1s) and ensure failed requests show user-friendly error feedback.
