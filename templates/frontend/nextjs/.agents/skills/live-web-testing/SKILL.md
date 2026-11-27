---
name: live-web-testing
description: "Live website and web application end-to-end testing, visual verification, resilient browser automation, and latency/interaction diagnostics inspired by skills.sh best practices."
risk: safe
source: skills.sh
date_added: "2026-11-16"
---

# Live Web Testing Skill

> Production-grade live website and web application testing strategies derived from **skills.sh** E2E testing patterns (`microsoft/playwright-cli`, `currents-dev/playwright-best-practices`, and `@qaskills/playwright-e2e-testing`).

---

## 1. Core Testing Dimensions

When validating a live website or running web app:

```
Live Web Testing
├── Functional Journeys (Happy path, validation barriers, multi-step wizards)
├── Visual & Latency Audits (Skeleton flashing, blank shells, layout shift)
├── Navigation Resiliency (Browser Back/Forward, direct URL refreshes, route guards)
├── Network & Error Trapping (Uncaught console errors, 4xx/5xx responses, failed assets)
└── Responsive Layouts (Mobile 375px, Tablet 768px, Desktop 1280px+)
```

---

## 2. Resilient Selector Priority (skills.sh standards)

Always prefer user-facing role and accessibility selectors over brittle CSS or XPath selectors:

| Priority | Selector Type | Example | Reason |
|:---|:---|:---|:---|
| 1 (Best) | **Role & Accessible Name** | `getByRole('button', { name: 'Save & Next' })` | Closest to actual user perception |
| 2 | **Label Association** | `getByLabel('Listing Title')` | Verifies accessible form structure |
| 3 | **Placeholder / Text** | `getByPlaceholder('Enter price...')`, `getByText('Product Details')` | Resilient to DOM tag changes |
| 4 | **Test IDs** | `getByTestId('step-indicator-2')` | Stable explicit test contract |
| 5 (Avoid) | Brittle CSS / XPath | `div > div:nth-child(3) > span` | Extremely fragile against UI updates |

---

## 3. Detecting UI Regressions & Flashes

### Skeleton Flash & Blank Screen Detection
- **Symptom**: When navigating between steps or pressing browser **Back**, the UI briefly unmounts the form, shows a skeleton loader, then remounts.
- **Cause**: Client component resetting `loading` state to `true` while awaiting secondary client fetch, or unmounting during route change.
- **Verification Rule**: Form inputs, headers, and previous step data MUST stay rendered during in-wizard step transitions. Background data loads should be silent (optimistic or non-blocking).

### Browser History Navigation
- Test sequential step transitions (Step 1 → Step 2 → Step 3).
- Click the browser **Back** button. Verify:
  1. The previous step form restores instantly.
  2. Input values entered in previous steps are preserved.
  3. No unhandled `TypeError` or blank screen occurs.

---

## 4. Console & Network Diagnostics Checklist

During any live test session:
1. **Console Logs**: Capture all `console.error` and `console.warn` occurrences. Flag uncaught promise rejections immediately.
2. **Network Failures**: Filter failed HTTP requests (status >= 400).
3. **TTFB & Latency**: Measure time elapsed between clicking an action and the appearance of updated DOM elements or route change completion.

---

## 5. Playwright MCP Toolset Integration

The environment is configured with Microsoft's official `@playwright/mcp` server (`~/.gemini/config/mcp_config.json`):
- **Accessibility Snapshots**: High-fidelity, token-efficient representation of visible elements and accessible roles.
- **Auto-Waiting Actions**: Playwright automatically awaits element visibility, enablement, and stable layout before executing clicks or fills.
- **Combined with Chrome DevTools**: Use Playwright MCP for fast structural navigation and step assertion, and Chrome DevTools MCP for deep performance (LCP, memory leaks) and cookie/session analysis.

