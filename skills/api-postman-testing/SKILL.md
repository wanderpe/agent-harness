---
name: api-postman-testing
description: Live API contract, Postman/Newman CLI, and curl verification harness. Use when testing running backend endpoints, auditing auth/RBAC/tenancy guards, verifying 4xx/5xx error envelopes, or running regression collections.
---

# Live API & Postman Testing Harness

Drive live local or staging HTTP APIs deterministically via **Postman CLI / Newman** or scripted `curl` / `httpie` assertions. Treat every endpoint as potentially defective until verified against a running server.

## Secret Redaction (Mandatory)
- Store base URLs, bearer tokens, and API keys strictly in environment variables or Postman environment files (never hardcoded in markdown reports or git).
- Redact `Authorization`, `Cookie`, `Set-Cookie`, and API key headers as `<REDACTED>` in all captured evidence.

## Execution Priority (Fastest Deterministic Outside Judge)
1. **Newman / Postman CLI** (preferred when a collection exists):
   ```bash
   npx newman run postman/collection.json -e postman/local.env.json --reporters cli --bail
   ```
2. **Targeted `curl` / `httpie` Contract Script** (for surgical endpoint checks or when no collection exists):
   - Capture HTTP status code, response latency (`time_total`), key headers, and JSON body.
   - Assert exact JSON shape and status codes via `jq` or a small Node/Python check script.

## Mandatory Endpoint Audit Matrix
For every endpoint under test, verify all 5 vectors:
1. **Happy Path Contract**: Exact HTTP status (`200`/`201`/`204`), response schema keys/types, pagination envelope, and DB persistence (re-fetch with `GET` after `POST`/`PUT`/`PATCH`).
2. **Validation Boundary (`422` / `400`)**: Missing required fields, wrong types, boundary values, duplicate unique keys — confirm structured validation errors, never unhandled `500`.
3. **Auth & RBAC Negative Guards (`401` / `403`)**: Unauthenticated request → `401`; wrong role or another user's resource (IDOR) → `403`/`404`.
4. **Tenant Isolation** *(if multi-tenant)*: Cross-tenant ID lookup must return `404`/`403` and leak zero records.
5. **Idempotency & Latency**: Repeated `PUT`/`DELETE` or idempotency-key `POST` produces no duplicate state; p95 latency stays within budget (flag >500ms or N+1 spikes).

## Postman Collection Conventions
- Keep collections versioned under `postman/` (or `tests/postman/`) with a `.env.example.json` (no real secrets).
- Every request must include at least 2 `pm.test(...)` assertions: status code + schema/business invariant.
- Chain auth tokens via collection variables (`pm.collectionVariables.set("access_token", ...)`).
