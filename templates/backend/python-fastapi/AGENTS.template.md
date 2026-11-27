# Project: {{PROJECT_NAME}} (Python FastAPI)

## Stack
- **Framework**: FastAPI, Python 3.11+
- **Data Validation & Schemas**: Pydantic v2
- **Database**: PostgreSQL with SQLAlchemy 2.0 (Async) / Alembic
- **Testing**: pytest, pytest-asyncio, httpx
- **Linter & Formatter**: Ruff, mypy

## Architecture Conventions
- `app/api/`: Route handlers and endpoint dependencies.
- `app/schemas/`: Pydantic request and response schemas.
- `app/services/`: Business logic operations.
- `app/models/`: SQLAlchemy ORM database models.
- `app/core/`: Application settings, security, database session factories.

## Non-Negotiable Rules
1. **Async Discipline**: Do not block the event loop; use async database drivers (e.g. `asyncpg`) and async HTTP clients.
2. **Schema Invariants**: Always declare explicit response schemas with `response_model` or type annotations.
3. **Dependency Injection**: Use `Depends(...)` for auth, database sessions, and configuration.
4. **Testing**: Maintain high test coverage with isolated test database fixtures and `pytest-asyncio`.

## Quick Commands
- Dev: `uvicorn app.main:app --reload`
- Tests: `pytest`
- Typecheck: `mypy app`
- Lint: `ruff check app`
