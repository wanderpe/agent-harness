---
name: fastapi-best-practices
description: Production FastAPI, Pydantic v2, async SQLAlchemy 2.0, and pytest-asyncio engineering patterns. Use when building or reviewing Python FastAPI routers, schemas, services, or async DB code.
---

# FastAPI Best Practices

## 1. Async Event Loop Discipline
- Never call blocking I/O (`requests`, `time.sleep`, sync psycopg2, heavy CPU work) inside `async def` routes; use `httpx.AsyncClient`, `asyncpg`, or sync `def` routes (which FastAPI runs in a threadpool).
- Keep DB sessions scoped per request via `async def get_db()` dependency with explicit commit/rollback boundaries.

## 2. Pydantic v2 & API Contracts
- Define separate schemas for `Create`, `Update`, and `Response` — never expose ORM models directly.
- Always declare `response_model=...` (or return type annotation) so sensitive columns (hashes, internal flags) are stripped automatically.
- Use `model_config = ConfigDict(from_attributes=True)` for ORM serialization and `Annotated` + `Field(...)` for strict boundary validation.

## 3. Architecture & Dependency Injection
- Keep routers thin: parse input, inject auth/DB via `Depends(...)`, delegate business logic to `app/services/`, and map domain exceptions to `HTTPException` via centralized exception handlers.
- Use `alembic` for all schema migrations; never auto-create tables in production startup.

## 4. Testing Seams (`pytest-asyncio`)
- Test endpoints end-to-end through `httpx.AsyncClient(transport=ASGITransport(app=app))` against a real isolated test database rolled back per test — avoid mocking away the DB query layer.
- Enforce `ruff check` and `mypy` as deterministic gates.
