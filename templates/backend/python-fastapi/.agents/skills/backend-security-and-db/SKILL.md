---
name: backend-security-and-db
description: Backend API security, database integrity, migration safety, and query performance invariants. Use when designing or reviewing backend endpoints, DB migrations, auth flows, or multi-model writes.
---

# Backend Security & Database Invariants

Non-negotiable engineering checks for any backend API (Laravel, Node/TS, Python/FastAPI, Go).

## 1. Database & Query Integrity
- **Atomic Multi-Model Writes**: Wrap any operation mutating 2+ tables or financial/inventory state inside an explicit DB transaction.
- **Zero N+1 Queries**: Always eager-load relationships or batch-fetch IDs (`WHERE id IN (...)`). Never query inside loops.
- **Bounded Queries**: Every list endpoint must enforce pagination (`limit`/`cursor`) and explicit sorting; never unbounded `SELECT *`.
- **Safe Migrations**: Make schema changes backward-compatible (add nullable column → backfill → enforce `NOT NULL`). Never drop or rename live columns in a single-step deploy without checking active readers.
- **Index Discipline**: Index foreign keys, tenant columns, and high-cardinality `WHERE` / `ORDER BY` filter columns.

## 2. API Security & Isolation
- **Validate at the Boundary**: Reject unknown/malformed fields at the request boundary (Form Requests, Zod, Pydantic) before touching services or models. Never pass raw request bodies into ORM mass-assignment.
- **Authorization on Every Action**: Enforce object-level authorization (IDOR protection) and tenant scoping on every read/write — never rely solely on route-level "is logged in" middleware.
- **Concurrency & Idempotency**: Guard state transitions and balance/quota updates with optimistic locking, `SELECT ... FOR UPDATE`, or unique DB constraints + idempotency keys.
- **Error Hygiene**: Never leak stack traces, SQL errors, or internal file paths in production HTTP responses. Map domain errors cleanly to `4xx` codes.
- **Rate Limiting & Abuse Guards**: Protect auth, password reset, webhook, and expensive export endpoints with rate limits and timeouts.
