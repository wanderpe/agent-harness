---
name: node-api-best-practices
description: Production Node.js & TypeScript backend API patterns (Express/Fastify/NestJS, Zod boundary validation, clean layering, Prisma/Drizzle, Vitest/Supertest). Use when building or reviewing Node.js backend endpoints or services.
---

# Node.js & TypeScript API Best Practices

## 1. Boundary Validation & Strict Types
- Validate 100% of `req.body`, `req.params`, and `req.query` with Zod (or TypeBox) at the HTTP boundary; infer handler types directly from schemas (`z.infer<typeof Schema>`).
- Never use `any` or blind `as` casts on external/DB inputs; enforce `strict: true` and `noUncheckedIndexedAccess: true`.

## 2. Layered Deep Modules
- Keep HTTP controllers thin (parse → call service → map response).
- Place business invariants in `src/domain/` or `src/application/` with zero HTTP framework imports (`req`/`res` never leak into services).
- Centralize error handling via a typed `AppError` hierarchy mapped to HTTP status codes in one global error middleware.

## 3. Reliability & Database Hygiene
- Always use explicit timeouts on outbound `fetch`/HTTP calls (`AbortSignal.timeout(...)`) and DB connection pools.
- Wrap multi-step writes in ORM transactions (`prisma.$transaction(...)` / `db.transaction(...)`).
- Implement graceful shutdown (`SIGTERM`/`SIGINT`) draining in-flight HTTP requests and closing DB/Redis pools cleanly.

## 4. Testing Seams (Vitest / Supertest)
- Test HTTP contracts via `supertest` (or `app.inject()` in Fastify) against an isolated test DB to catch middleware, validation, serialization, and SQL bugs together.
- Verify `tsc --noEmit` + linter + tests pass before handoff.
