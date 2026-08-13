---

description: "Task list template for feature implementation"
---

# Tasks: Comparativo de Produtividade entre Turnos

**Input**: Design documents from `/specs/001-comparativo-turnos/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Included and REQUIRED — the project constitution mandates Test-First
(Principle III, NON-NEGOTIABLE): tests must be written before implementation
and must fail first.

**Organization**: There is a single user story (US1, P1) in spec.md, so all
implementation tasks live under one phase. This is also the MVP.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1)
- Paths are relative to the repository root (single NestJS project — no `backend/`/`frontend/` split)

## Phase 1: Setup (Shared Infrastructure)

**Not required for this feature.** It extends the existing `dashboard` module
(`src/modules/dashboard/`) with no new dependencies, no new NestJS module, and
no scaffolding — `package.json`, ESLint/Prettier config, and Prisma client are
already set up and unchanged by this feature.

## Phase 2: Foundational (Blocking Prerequisites)

**Not required for this feature.** All prerequisites already exist and are
reused as-is: `JwtAuthGuard` + `RolesGuard` + `Role` enum
(`src/auth/`), `PrismaService` (`src/prisma/`), and the `DashboardModule`
wiring (`DashboardController` → `DashboardService` → `PrismaService`). No
schema migration is needed (`dataInicio` and `quantidadeProduzida` already
exist on `Apontamento`).

---

## Phase 3: User Story 1 - Comparar produtividade entre turnos (Priority: P1) 🎯 MVP

**Goal**: Um gestor autenticado consulta um endpoint que retorna a
quantidade produzida agregada por turno (Manhã, Tarde, Noite) em uma janela
de dias configurável (padrão 7), sempre com os 3 turnos presentes.

**Independent Test**: Chamar `GET /api/dashboard/comparativo/turnos` (com e
sem `?dias=`) com um token válido e verificar que a resposta tem exatamente 3
itens com os nomes de turno corretos e quantidades corretas; chamar sem token
e verificar `401`.

### Tests for User Story 1 ⚠️ (write first, confirm they FAIL before implementing)

- [X] T001 [P] [US1] Create `src/modules/dashboard/dashboard.service.spec.ts` with unit tests for a new `getComparativoTurnos(dias?: number)` method on `DashboardService`, covering: (a) default period of 7 days when `dias` is omitted (AS1/FR-002), (b) a custom period, e.g. `dias=30` (AS2/FR-003), (c) a turno with no production returns `quantidade: 0` and is still present in the result (AS3/FR-004), (d) an invalid `dias` value (`0`, negative, or non-numeric) falls back to 7 without throwing (FR-005/edge case). Mock `PrismaService.$queryRaw`. Tests MUST fail at this point because the method does not exist yet.
- [X] T002 [P] [US1] Add an e2e test in `test/dashboard.e2e-spec.ts` (create the file if it does not already cover the dashboard controller, following the pattern of existing `test/*.e2e-spec.ts` files) asserting `GET /api/dashboard/comparativo/turnos` returns `401` without an `Authorization` header (AS4/FR-006). Test MUST fail at this point because the route does not exist yet.

### Implementation for User Story 1

- [X] T003 [P] [US1] Create `src/presentation/dto/dashboard/comparativo-turnos.dto.ts` exporting `ComparativoTurnoItemDto` with `turno: string` and `quantidade: number`, both decorated with `@ApiProperty` (per [data-model.md](./data-model.md)).
- [X] T004 [US1] Implement `getComparativoTurnos(dias: number = 7)` in `src/modules/dashboard/dashboard.service.ts`: normalize an invalid/non-positive `dias` to `7`, query `apontamentos` filtered by `dataInicio >= (hoje - dias)` grouped by the same turno `CASE` expression used in `getProducaoPorTurno` summing `quantidadeProduzida`, then build the final array by mapping over `['Manhã', 'Tarde', 'Noite']` and filling `quantidade: 0` for any turno missing from the query result (mirrors the zero-fill pattern already used in `getProducaoPorTurno`). Depends on T001 (tests) and T003 (DTO shape) existing first; must make T001 pass.
- [X] T005 [US1] Add `GET comparativo/turnos` to `src/modules/dashboard/dashboard.controller.ts`: `@Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)`, `@ApiOperation`, `@ApiQuery({ name: 'dias', required: false, type: Number })`, `@ApiResponse({ status: 200, type: [ComparativoTurnoItemDto] })`, delegating to `dashboardService.getComparativoTurnos(dias)`; import `ComparativoTurnoItemDto`. Depends on T004; must make T002 pass.
- [X] T006 [US1] Run `npm test -- dashboard.service.spec.ts` and `npm run test:e2e` and fix any failures until T001 and T002 both pass. Depends on T004, T005.

**Checkpoint**: User Story 1 is fully functional and independently testable — this is also the complete MVP for this feature (there is only one user story).

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup; depends on Phase 3 being complete.

- [X] T007 [P] Run `npm run lint:check` and `npm run build` from the repository root and fix any issues introduced by this feature.
- [X] T008 Manually execute the scenarios in [quickstart.md](./quickstart.md) (Cenários 1–4) against a local `npm run start:dev` instance and confirm the observed responses match the documented expected outcomes.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: N/A — nothing to do, no blocking dependency.
- **Foundational (Phase 2)**: N/A — nothing to do, no blocking dependency.
- **User Story 1 (Phase 3)**: Can start immediately (no prior phases block it).
- **Polish (Phase 4)**: Depends on Phase 3 (T004–T006) being complete.

### Within Phase 3

- T001 and T002 (tests) can be written in parallel (different files) and MUST both be confirmed failing before T004/T005 are implemented.
- T003 (DTO) has no dependency on T001/T002 and can be done in parallel with them.
- T004 depends on T001 (tests to satisfy) and T003 (DTO type used in the method's return shape).
- T005 depends on T004 (calls the new service method) and must satisfy T002.
- T006 depends on T004 and T005 (runs the full test suite against the finished implementation).

### Parallel Opportunities

- T001, T002, T003 can all be started in parallel (three different, currently-nonexistent files).
- T007 (lint/build) can run in parallel with T008 (manual quickstart validation) once Phase 3 is done.

---

## Parallel Example: User Story 1

```bash
# Launch together at the start of Phase 3:
Task: "Create dashboard.service.spec.ts with unit tests for getComparativoTurnos in src/modules/dashboard/dashboard.service.spec.ts"
Task: "Add e2e test for GET /api/dashboard/comparativo/turnos 401 case in test/dashboard.e2e-spec.ts"
Task: "Create ComparativoTurnoItemDto in src/presentation/dto/dashboard/comparativo-turnos.dto.ts"
```

---

## Implementation Strategy

### MVP First (and only) — User Story 1

1. Skip Phase 1 and Phase 2 (nothing required).
2. Complete Phase 3 (T001–T006): tests first, then DTO, service method, controller route, then confirm tests pass.
3. **STOP and VALIDATE**: run `npm test -- dashboard.service.spec.ts` and `npm run test:e2e`; both must be green.
4. Complete Phase 4 (T007–T008): lint/build clean, quickstart scenarios manually confirmed.
5. Deploy/demo — this is the entire feature (single user story = single increment).

## Notes

- [P] tasks touch different files and have no completed-task dependency between them.
- [US1] labels every Phase 3 task since there is only one user story in this feature.
- Verify T001 and T002 fail before starting T003–T005 (Test-First, Constitution Principle III).
- Commit after each task or logical group (e.g., after T001+T002+T003, then after T004, then after T005+T006).
