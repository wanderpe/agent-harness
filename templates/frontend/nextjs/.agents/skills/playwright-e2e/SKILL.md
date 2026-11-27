---
name: playwright-e2e
description: End-to-end browser automation & testing intelligence with Playwright. Enforces accessible locator strategies (getByRole, getByLabel), web-first auto-waiting, snapshot YAML inspection, resilient actionability checks, and clean browser session lifecycles.
---

# Playwright E2E & Browser Automation Testing (On-Demand Skill)

Use this skill when designing, writing, or executing live browser tests, Playwright MCP commands, or headless E2E verification suites against Next.js applications.

---

## 1. Core Locator Philosophy: Accessible & Resilient

Never use fragile CSS paths (e.g. `div > div.flex > button:nth-child(2)`) or unstable auto-generated test IDs when accessible selectors exist.

### Locator Hierarchy of Preference

| Priority | Locator Pattern | Best Used For |
|:---|:---|:---|
| **1 (Highest)** | **Accessible Role & Name** (`role="button"`, name="Save") | Buttons, dialogs, tabs, headings, links, switches |
| **2** | **Label Text** (`label[for]`, `aria-label`) | Form inputs, textareas, search fields |
| **3** | **Placeholder Text** (`placeholder="Search jobs..."`) | Quick filters, search bars without explicit labels |
| **4** | **Text Content** (`has-text("Submit")`) | Status badges, confirmation text, table cell values |
| **5 (Fallback)**| **Stable Test ID** (`data-testid="job-status-menu"`) | Complex composite widgets, custom canvas or SVG elements |

> [!IMPORTANT]
> When using **Playwright MCP**, inspect the accessible element tree output from `browser_snapshot`. Reference elements by their accessibility role, label, or assigned snapshot node rather than guessed CSS classes.

---

## 2. Web-First Auto-Waiting vs. Hardcoded Sleeps

> [!CAUTION]
> **Anti-Pattern**: Hardcoded sleeps (`page.waitForTimeout(3000)`, `sleep 3`). They cause test flakiness, mask latency regressions, and waste execution time.

### Actionability Rules
Before performing any action (`browser_click`, `browser_type`, `browser_fill_form`), ensure the target element satisfies Playwright's actionability checks:
1. **Attached** to the DOM.
2. **Visible** (non-zero bounding box, not `display: none` or `visibility: hidden`).
3. **Stable** (not animating or undergoing CSS transitions).
4. **Receives Events** (not obscured by sticky headers, modal backdrops, or floating popovers).
5. **Enabled** (for form inputs and submit buttons).

Use `browser_wait_for` on the element's appearance or text change to confirm dynamic state transitions (e.g. modal overlay open, spinner resolution).

---

## 3. Playwright MCP Tool Calling Protocol

When executing live tests via Playwright MCP tools:

1. **Session Bootstrapping (`browser_navigate`)**:
   - Navigate to the target route (`http://localhost:3000/...`).
   - Read initial accessibility snapshot to locate key elements.
2. **Sequential Flow Execution**:
   - Use `browser_click` and `browser_fill_form` / `browser_type` to drive workflows.
   - For multi-step wizards or modals, use `browser_snapshot` after navigation transitions to verify hydration.
3. **Sentinels & Verification**:
   - Query `browser_console_messages` after actions to detect uncaught exceptions, React warnings, or hydration errors.
   - Use `browser_network_requests` to catch slow endpoints (>1s) or 4xx/5xx responses.
4. **Guaranteed Teardown (`browser_close`)**:
   - Always call `browser_close` once testing concludes to release system resources.

---

## 4. Common Next.js 15 Edge Cases in Playwright

- **Portals & Dialogs (Radix UI)**: Modals render into `document.body` via a portal. Always query the modal role container (`[role="dialog"]`) to avoid selecting obscured background elements.
- **Select Dropdowns (`<FormSelect />`)**: Clicking the trigger opens a detached popover menu. Wait for `role="listbox"` or `role="option"` before selecting.
- **Parallel Routes (`@modal`)**: Verify direct reload maintains the modal overlay and browser Back closes the modal without corrupting the URL.
