# Quickstart: Validar o Comparativo de Produtividade entre Turnos

**Feature**: [spec.md](./spec.md) | **Contract**: [contracts/dashboard-comparativo-turnos.md](./contracts/dashboard-comparativo-turnos.md)

## Prerequisites

- Banco de dados local configurado (`DATABASE_URL` no `.env`) com migrações
  aplicadas: `npx prisma migrate dev`.
- Ao menos um usuário existente (ADMIN, GERENTE ou OPERADOR) para autenticar.
- Alguns apontamentos de produção finalizados nos últimos 7 dias, em
  horários distintos (manhã/tarde/noite), para validar a agregação. Podem
  ser criados via `POST /apontamentos` + `PATCH /apontamentos/:id/finalizar`
  (ver README.md) ou via seed (`npm run db:seed`, se o seed cobrir isso).

## Setup

```bash
npm install
npm run start:dev
```

## Cenário 1 — Período padrão (7 dias)

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mes.com","senha":"password123"}' | jq -r .access_token)

curl -s http://localhost:3000/api/dashboard/comparativo/turnos \
  -H "Authorization: Bearer $TOKEN" | jq
```

**Expected outcome**: Array JSON com exatamente 3 objetos
(`{"turno": "Manhã"|"Tarde"|"Noite", "quantidade": <number>}`), refletindo a
soma de `quantidadeProduzida` dos apontamentos com `dataInicio` nos últimos 7
dias.

## Cenário 2 — Período customizado

```bash
curl -s "http://localhost:3000/api/dashboard/comparativo/turnos?dias=30" \
  -H "Authorization: Bearer $TOKEN" | jq
```

**Expected outcome**: Mesma forma de resposta, mas somando os últimos 30 dias.
Os valores de `quantidade` devem ser ≥ aos do Cenário 1 (janela maior nunca
produz soma menor, assumindo produção contínua).

## Cenário 3 — Turno sem produção

Com uma base de dados sem nenhum apontamento no turno Noite dentro do
período:

```bash
curl -s http://localhost:3000/api/dashboard/comparativo/turnos \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | select(.turno == "Noite")'
```

**Expected outcome**: `{"turno": "Noite", "quantidade": 0}` — o item aparece,
não é omitido do array.

## Cenário 4 — Sem autenticação

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  http://localhost:3000/api/dashboard/comparativo/turnos
```

**Expected outcome**: `401`.

## Validação automatizada

Após a implementação, os cenários acima devem estar cobertos por:

- Testes unitários em `src/modules/dashboard/dashboard.service.spec.ts`
  (agregação, default de período, turno com zero produção).
- Teste e2e cobrindo autenticação/autorização do endpoint (ver
  `test/*.e2e-spec.ts` existentes como referência de padrão).

Rodar:

```bash
npm test -- dashboard.service.spec.ts
npm run test:e2e
```
