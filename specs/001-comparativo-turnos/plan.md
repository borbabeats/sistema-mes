# Implementation Plan: Comparativo de Produtividade entre Turnos

**Branch**: `001-comparativo-turnos` | **Date**: 2026-08-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-comparativo-turnos/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Adicionar um novo endpoint de dashboard que agrega a quantidade produzida
(`quantidadeProduzida` dos apontamentos) por turno (Manhã, Tarde, Noite) em uma
janela de dias configurável (padrão 7 dias). Reaproveita a mesma classificação
de turno (por horário de início) já usada no endpoint existente
`GET /api/dashboard/graficos/producao-por-turno`, mas retorna um resultado
agregado (1 registro por turno) em vez de um heatmap diário, atendendo ao caso
de uso de comparação direta entre turnos.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict mode), Node.js 18+

**Primary Dependencies**: NestJS 11, Prisma 5 (`@prisma/adapter-mariadb`), `class-validator`/`class-transformer`, `@nestjs/swagger`

**Storage**: MySQL/MariaDB via Prisma (tabela `apontamentos`, campos `dataInicio` e `quantidadeProduzida` já existentes — nenhuma migração necessária)

**Testing**: Jest 30 (`*.spec.ts` unit tests colocated with source) + `supertest` for e2e (`test/*.e2e-spec.ts`)

**Target Platform**: Linux server (Docker/PM2), API REST consumida pelo frontend do dashboard

**Project Type**: Web service (NestJS backend) — extensão de um módulo existente (`dashboard`)

**Performance Goals**: Resposta em <300ms p95 para janelas de até 90 dias (mesma ordem de grandeza dos demais endpoints agregados do dashboard, que já rodam `$queryRaw` sobre a tabela `apontamentos`)

**Constraints**: Resultado sempre com exatamente 3 registros (um por turno); endpoint autenticado (JWT) e restrito aos papéis ADMIN/GERENTE/OPERADOR, consistente com os demais endpoints do dashboard

**Scale/Scope**: Um novo endpoint HTTP (`GET /api/dashboard/comparativo/turnos`), um novo DTO de resposta, um novo método de serviço, e testes unitários correspondentes. Nenhuma nova entidade de domínio, nenhuma migração de schema.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Clean Architecture, NON-NEGOTIABLE)**: O módulo `dashboard`
  existente **não** segue a separação domain/application/infrastructure —
  `DashboardService` acessa `PrismaService` diretamente (inclusive via
  `$queryRaw`) e `DashboardController` chama o service diretamente, sem
  camada de use-case. Isto já é o padrão estabelecido para os 10+ endpoints
  analíticos existentes (KPIs, gráficos, alertas, metas, eficiência). Esta
  feature **segue o padrão já estabelecido no módulo** em vez de introduzir
  uma camada de use-case isolada só para este endpoint, o que criaria
  inconsistência dentro do próprio módulo. Ver justificativa em Complexity
  Tracking abaixo — é uma exceção documentada e já vigente, não uma nova
  violação introduzida por esta feature.
- **Principle II (Type Safety & Validation)**: PASS — o parâmetro `dias` será
  validado/normalizado (default e fallback definidos na FR-005); resposta
  tipada via DTO com `@nestjs/swagger`.
- **Principle III (Test-First, NON-NEGOTIABLE)**: PASS — testes unitários do
  novo método de serviço serão escritos antes/junto da implementação (ver
  tasks.md), cobrindo os 4 acceptance scenarios da spec.
- **Principle IV (Prisma as Single Source of Truth)**: PASS — nenhuma
  alteração de schema; reutiliza os campos `dataInicio` e
  `quantidadeProduzida` já modelados em `prisma/schema.prisma`.
- **Principle V (Security by Default)**: PASS — reutiliza `JwtAuthGuard` +
  `RolesGuard` + `@Roles(ADMIN, GERENTE, OPERADOR)` já aplicados no
  `DashboardController`.
- **Principle VI (Observability)**: PASS — segue o padrão dos demais métodos
  do `DashboardService` (sem logging adicional obrigatório além do já
  existente no controller/interceptors globais, se houver).
- **Principle VII (Simplicity & YAGNI)**: PASS — implementação mínima: um
  método de serviço, um DTO, uma rota. Sem novas dependências.

**Resultado do gate**: PASS, com uma exceção documentada e já pré-existente
para o Principle I (ver Complexity Tracking).

## Project Structure

### Documentation (this feature)

```text
specs/001-comparativo-turnos/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── modules/dashboard/
│   ├── dashboard.controller.ts     # + novo endpoint GET comparativo/turnos
│   ├── dashboard.service.ts        # + novo método getComparativoTurnos()
│   ├── dashboard.service.spec.ts   # NOVO — testes unitários do serviço
│   └── dashboard.module.ts         # sem alteração (DI já cobre o novo método)
└── presentation/dto/dashboard/
    └── comparativo-turnos.dto.ts   # NOVO — DTO de resposta (por turno)

test/
└── dashboard.e2e-spec.ts           # NOVO (ou extensão de um e2e existente,
                                     # se já houver) cobrindo o novo endpoint
```

**Structure Decision**: Extensão do módulo NestJS `dashboard` já existente
(`src/modules/dashboard/`), seguindo exatamente o padrão dos outros 10
endpoints do mesmo controller/service (controller fino delegando para o
service, service acessando Prisma diretamente). Não é criado nenhum módulo,
diretório de domínio ou camada de use-case novos — ver Complexity Tracking.

## Complexity Tracking

> Exceção pré-existente ao Principle I (Clean Architecture), já vigente no
> módulo `dashboard` antes desta feature. Documentada aqui por transparência,
> não como uma nova violação introduzida por este plano.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| `DashboardService` acessa `PrismaService` diretamente (sem repository/use-case dedicados), incluindo `$queryRaw` em alguns métodos | Módulo de relatórios/analytics somente-leitura, com ~10 endpoints agregados; introduzir domain entities e use-cases só para leituras agregadas adicionaria indireção sem benefício de testabilidade adicional (não há regra de negócio a proteger, apenas agregação de dados) | Criar uma camada de use-case exclusiva para este único endpoint quebraria a consistência com os outros 10 endpoints do mesmo controller, que já seguem o padrão direto; refatorar todo o módulo está fora do escopo desta feature |
