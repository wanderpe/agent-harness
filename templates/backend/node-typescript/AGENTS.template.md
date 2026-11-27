# Project: {{PROJECT_NAME}} (Node.js & TypeScript)

## Stack
- **Runtime**: Node.js 20+ / Bun, TypeScript 5+
- **Framework**: Express / Fastify / NestJS
- **Database**: PostgreSQL / MongoDB via Prisma or Drizzle ORM
- **Testing**: Vitest / Jest, Supertest
- **Validation**: Zod / TypeBox

## Architecture Conventions
- `src/domain/`: Pure business logic, entities, value objects (framework-agnostic).
- `src/application/`: Use cases, services, DTOs.
- `src/infrastructure/`: Repositories, database clients, third-party adapters.
- `src/interfaces/`: HTTP controllers, middlewares, CLI commands.

## Non-Negotiable Rules
1. **Strict TypeScript**: `noImplicitAny: true`, `strict: true`. No unvetted `any` casts.
2. **Deep Modules & Clean Boundaries**: Enforce dependency direction with `dependency-cruiser` (domain never imports infrastructure).
3. **Validation at the Boundary**: Validate 100% of incoming payloads with Zod schemas before touching application services.
4. **Comprehensive Error Handling**: Use structured domain errors mapped to HTTP status codes at the controller layer.
5. **Token Optimization (Caveman Protocol)**: All agents operate under the `caveman` skill to maximize engineering signal and minimize token waste (terse output, zero filler, immediate code/diff delivery).

## Quick Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Typecheck: `npx tsc --noEmit`
- Tests: `npm test`
