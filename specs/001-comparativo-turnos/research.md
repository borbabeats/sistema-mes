# Research: Comparativo de Produtividade entre Turnos

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

Nenhum item do Technical Context ficou marcado como `NEEDS CLARIFICATION` —
todas as decisões técnicas foram resolvidas por reuso direto de padrões já
existentes no código. Este documento registra as decisões e alternativas
consideradas.

## Decisão 1: Classificação de turno

- **Decision**: Reutilizar exatamente a mesma lógica de classificação de
  turno já usada em `DashboardService.getProducaoPorTurno` (CASE por
  `HOUR(a.dataInicio)`: 06–13 = Manhã, 14–21 = Tarde, demais = Noite).
- **Rationale**: A spec (FR-007) exige uma única fonte de verdade para "o que
  é um turno". Duplicar a lógica com valores diferentes criaria
  inconsistência entre o heatmap existente e o novo comparativo.
- **Alternatives considered**:
  - Buscar turno de uma tabela de configuração/`Setor` — rejeitado: não existe
    modelagem de turno no schema Prisma hoje, e criar uma seria fora do
    escopo (spec não pede turnos configuráveis).
  - Duplicar o `CASE` em SQL bruto dentro do novo método — aceitável e é o
    que será feito (mesma expressão, não uma abstração compartilhada), pois
    Prisma não oferece uma forma nativa de expressar essa lógica sem raw SQL
    e o método existente já faz o mesmo.

## Decisão 2: Fonte e agregação de dados

- **Decision**: Consultar a tabela `apontamentos` via `this.prisma.$queryRaw`,
  agrupando por turno e somando `quantidadeProduzida`, filtrando por
  `dataInicio >= dataInicio(N dias atrás)`.
- **Rationale**: Mesma tabela/campo já usados por `getProducaoPorTurno` e
  pelos KPIs de produção; evita joins ou novas queries Prisma Client
  tipadas quando um `GROUP BY` com `CASE` é mais direto via raw SQL,
  consistente com o padrão do módulo.
- **Alternatives considered**:
  - Buscar todos os apontamentos do período via Prisma Client e agregar em
    memória (TypeScript) — rejeitado: menos eficiente para períodos longos e
    inconsistente com o padrão de agregação no banco já usado no módulo.

## Decisão 3: Parâmetro de período e validação

- **Decision**: Parâmetro de query opcional `dias` (número), default `7`.
  Valores inválidos (não numérico, ≤ 0) fazem fallback silencioso para `7`
  (FR-005), seguindo o mesmo padrão de "default silencioso" já usado nos
  outros endpoints do dashboard (ex.: `dias` em `producao-diaria` e
  `producao-por-turno`, que usam `@Query('dias') dias: number = 30/7` sem
  validação explícita adicional).
- **Rationale**: Consistência com os endpoints vizinhos, que não retornam erro
  para parâmetros ausentes/mal formados — apenas aplicam o default do NestJS
  pipe de conversão de tipo.
- **Alternatives considered**:
  - Rejeitar com `400 Bad Request` para valores inválidos — rejeitado: spec
    (FR-005) exige aplicar o default sem erro, e isso quebraria a paridade
    com os endpoints existentes.

## Decisão 4: Garantir os 3 turnos sempre presentes

- **Decision**: Após a query agregada, montar o array de resposta iterando
  sobre a lista fixa `['Manhã', 'Tarde', 'Noite']` e preenchendo com `0`
  quando a query não retornar linha para aquele turno — mesmo padrão já
  usado em `getProducaoPorTurno` para preencher dias/turnos faltantes no
  heatmap.
- **Rationale**: FR-004/SC-002 exigem exatamente 3 registros sempre. O padrão
  de "preencher com zero" já existe no código (`heatmapData.push(...)` com
  `quantidade: producao ? Number(producao.quantidade) : 0`).
- **Alternatives considered**: Nenhuma — reuso direto de padrão comprovado.

## Decisão 5: Autenticação e autorização

- **Decision**: Reaproveitar os guards de classe já aplicados em
  `DashboardController` (`@UseGuards(JwtAuthGuard, RolesGuard)` a nível de
  controller) e o decorator `@Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)`
  no novo método, igual aos outros endpoints do mesmo controller.
- **Rationale**: FR-006 exige o mesmo controle de acesso já vigente para os
  demais dados do dashboard; não há necessidade de um papel mais restrito.
- **Alternatives considered**: Nenhuma — requisito explícito de paridade com
  os demais endpoints.

## Resumo

Todas as decisões reduzem a zero risco técnico novo: a feature é composta
inteiramente de padrões já comprovados no próprio módulo `dashboard`. Não há
nova dependência, migração de schema, ou decisão arquitetural em aberto.
