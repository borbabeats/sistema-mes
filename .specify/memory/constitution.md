<!--
Sync Impact Report
- Version change: (none) → 1.0.0
- Modified principles: N/A (initial ratification)
- Added sections:
  - Core Principles: I. Clean Architecture, II. Type Safety & Validation,
    III. Test-First (NON-NEGOTIABLE), IV. Prisma as Single Source of Truth,
    V. Security by Default, VI. Observability, VII. Simplicity & YAGNI
  - Technology Stack Constraints
  - Development Workflow & Quality Gates
  - Governance
- Removed sections: N/A
- Follow-up TODOs: none
-->

# Sistema MES Constitution

## Core Principles

### I. Clean Architecture (NON-NEGOTIABLE)

Every feature MUST be organized across the four canonical layers, with
dependencies pointing inward toward the domain:

- `src/domain/` — Entities and repository interfaces. No framework deps.
- `src/application/use-cases/` — Business logic orchestration. Depends only on
  domain interfaces.
- `src/infrastructure/repositories/` — Prisma-backed repository implementations
  of domain interfaces.
- `src/presentation/` — DTOs (`dto/`) and controllers (`controllers/`). The only
  layer allowed to touch HTTP/WebSocket concerns.
- `src/modules/` — NestJS module wiring (DI containers). No business logic.

Domain and application layers MUST NOT import from infrastructure or
presentation. Controllers MUST NOT contain business rules — they delegate to use
cases. Rationale: keeps the core testable in isolation and allows swapping
Prisma/HTTP without touching business rules.

### II. Type Safety & Validation

TypeScript strict mode is mandatory. Every HTTP endpoint and WebSocket message
MUST validate input via `class-validator` DTOs before reaching a use case.
Prisma-generated types are the canonical shapes for persisted data; never
redefine entity shapes by hand in the domain layer — re-export or adapt them
through repository interfaces. `any` is forbidden in new code; `unknown` with
narrowing is the escape hatch when types are genuinely dynamic.

### III. Test-First (NON-NEGOTIABLE)

Jest is the test framework. New use cases, repository adapters, and controllers
MUST ship with tests. The Red-Green-Refactor cycle is enforced:

1. Write a failing test that pins the desired behavior.
2. Implement the minimum code to make it pass.
3. Refactor without changing behavior.

Unit tests live next to source (`*.spec.ts`) under `src/`; end-to-end tests
live under `test/` using the `jest-e2e` config. A PR that decreases coverage on
touched files without justification MUST NOT be merged.

### IV. Prisma as Single Source of Truth

`prisma/schema.prisma` is the only place where the data model is declared.
Entity fields, enums (`Cargo`, `StatusMaquina`, `StatusOP`, `PrioridadeOP`,
`TipoManutencao`, etc.), and relations are defined there and generated into
types via `prisma generate`. Manual mirror types in `src/domain/entities/` MUST
stay in sync with the schema or be replaced by generated types. Schema changes
require a migration (`prisma migrate dev`) committed alongside the code.

### V. Security by Default

Authentication is JWT-based via `@nestjs/jwt` + `passport-jwt`. Passwords are
hashed with `bcrypt` — plaintext passwords MUST NEVER be logged, persisted, or
returned in responses. Route protection uses NestJS Guards; role-based access
(`ADMIN`, `GERENTE`, `OPERADOR`) is enforced via decorators on controllers.
Secrets (`JWT_SECRET`, `DATABASE_URL`) come from environment variables loaded by
`dotenv` and MUST NEVER be committed to the repository. The `.env` file stays
gitignored; only `.env.example` is versioned.

### VI. Observability

Structured logging uses `nest-winston` + `winston`. Every controller and use
case MUST emit contextual logs (operation name, entity ids, outcome). Logs go to
`logs/` and never include secrets or PII beyond what is necessary for
auditing. Real-time notifications flow through `@nestjs/websockets` +
`socket.io`; WebSocket events MUST mirror the domain event that triggered them,
not internal implementation steps.

### VII. Simplicity & YAGNI

Start with the smallest solution that satisfies the spec. Avoid speculative
abstraction — a second use case is the trigger to extract a shared base, not the
first. Prefer NestJS built-in primitives (`@Injectable`, modules, pipes) over
hand-rolled equivalents. New dependencies require justification in the PR
description and MUST be pinned in `package.json` (no floating `latest`).

## Technology Stack Constraints

- **Runtime**: Node.js 18+, TypeScript 5.9+ (strict).
- **Framework**: NestJS 11. No alternative web framework may be introduced.
- **ORM**: Prisma 5 with `@prisma/adapter-mariadb`. Raw SQL is permitted only
  for migrations or performance-critical queries that Prisma cannot express;
  such queries MUST be reviewed and documented.
- **Database**: MySQL/MariaDB. Schema changes go through `prisma migrate`.
- **Auth**: `@nestjs/jwt`, `passport-jwt`, `bcrypt`. No other auth libraries.
- **Validation**: `class-validator` + `class-transformer` on every DTO.
- **Docs**: Swagger/OpenAPI via `@nestjs/swagger`. Every endpoint MUST have a
  decorator-based summary and response type.
- **Logging**: `nest-winston` + `winston`. `console.log` is forbidden in
  production code.
- **Realtime**: `@nestjs/platform-socket.io` + `socket.io` only.
- **Tests**: Jest 30, `supertest` for HTTP e2e, `ts-jest` for compilation.
- **Lint/Format**: ESLint 9 (`typescript-eslint`) + Prettier. `npm run lint`
  and `npm run format` MUST pass before commit.

## Development Workflow & Quality Gates

1. **Spec first**: Non-trivial work follows the SDD workflow
   (`/speckit.specify` → `/speckit.plan` → `/speckit.tasks` →
   `/speckit.implement`). Trivial fixes may skip SDD but still need a test.
2. **Branching**: Feature branches off `main`. No direct commits to `main`.
3. **Pre-commit gates** (MUST pass locally before pushing):
   - `npm run lint:check`
   - `npm run build`
   - `npm test` (affected suites minimum; full suite for shared modules)
4. **PR requirements**:
   - Linked spec or task ID in the description.
   - Tests covering the change.
   - Swagger docs updated for any endpoint change.
   - Prisma migration committed if schema changed.
5. **Review**: At least one approval. Reviewers verify layer boundaries
   (Principle I), no secrets in diff, and no `any` without justification.
6. **CI**: GitHub Actions runs lint, build, and tests on every PR. A red CI
   blocks merge.
7. **Deployment**: Docker (`Dockerfile` + `docker-compose.*.yml`) or PM2
   (`ecosystem.config.js`). Production deploys use `npm run start:prod`
   (`node dist/main`). Database migrations run via `npm run db:migrate` before
   the app starts.

## Governance

This constitution supersedes ad-hoc decisions in code comments and chat. When
code conflicts with a principle, the principle wins unless an amendment is
ratified.

- **Amendments**: Any principle change MUST be documented in this file with a
  version bump, a rationale, and (for MAJOR bumps) a migration plan for existing
  code. Amendments are proposed via PR modifying
  `.specify/memory/constitution.md`.
- **Versioning**: Semantic versioning — MAJOR for principle removal/redefinition,
  MINOR for new principle/section, PATCH for clarifications.
- **Compliance review**: Every PR review MUST check constitution compliance.
  Reviewers cite the principle number when requesting changes.
- **Runtime guidance**: Use `/speckit.specify` and downstream SDD commands for
  feature-level guidance; this constitution is the project-level invariant.

**Version**: 1.0.0 | **Ratified**: 2026-08-12 | **Last Amended**: 2026-08-12
