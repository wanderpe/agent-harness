# Project: {{PROJECT_NAME}} (Next.js)

## Stack
- **Framework**: Next.js (App Router), React 19 / 18, TypeScript
- **Styling**: TailwindCSS, CSS Modules
- **UI Components**: shadcn/ui, Radix UI primitives, Lucide React
- **Animations**: Framer Motion
- **State Management**: Zustand / Redux Toolkit / React Query
- **Testing**: Playwright (E2E), Vitest / React Testing Library (Unit)

## Architecture Conventions
- `app/`: Routing, Layouts, Server Components, Route Handlers.
- `components/ui/`: Atomic, reusable UI primitives (shadcn).
- `components/features/`: Feature-scoped composite components.
- `services/` or `lib/api/`: API client services, fetch wrappers, and token management.
- `hooks/`: Custom client-side reusable hooks.

## Non-Negotiable Rules
1. **Server vs Client Boundary**: Default to Server Components. Mark `'use client'` strictly at the leaf interactive layer.
2. **Deterministic UI Testing**: Test key user flows using Playwright and webapp-testing skills.
3. **Responsive & Accessible**: Strict color contrast, keyboard navigation, and semantic HTML (a11y).
4. **Token Management**: Refresh tokens and credentials must be handled through HTTP-only cookies or dedicated services.

## Multi-Agent Workflow
Refer to `.agents/workflows/multiple-agent-workflow.md` or `.agents/workflows/frontend-engineer.md` for execution steps.

## Quick Commands
- Dev Server: `npm run dev`
- Typecheck: `npx tsc --noEmit`
- Linter: `npm run lint`
- E2E Tests: `npx playwright test`
