# Contract: GET /api/dashboard/comparativo/turnos

**Feature**: [../spec.md](../spec.md) | **Data Model**: [../data-model.md](../data-model.md)

## Request

```http
GET /api/dashboard/comparativo/turnos?dias=7
Authorization: Bearer <token>
```

### Query Parameters

| Param  | Type   | Required | Default | Notes                                                                 |
|--------|--------|----------|---------|------------------------------------------------------------------------|
| `dias` | number | No       | `7`     | Janela de análise em dias. Valores inválidos (não numérico, ≤ 0) fazem fallback silencioso para `7` (FR-005). |

### Authorization

- Requer JWT válido (`JwtAuthGuard`).
- Papéis permitidos: `ADMIN`, `GERENTE`, `OPERADOR` (`RolesGuard` + `@Roles`).
- Sem token válido → `401 Unauthorized`.
- Papel fora da lista permitida → `403 Forbidden`.

## Response

### 200 OK

Sempre um array com exatamente 3 elementos, na ordem Manhã, Tarde, Noite.

```json
[
  { "turno": "Manhã", "quantidade": 1250 },
  { "turno": "Tarde", "quantidade": 980 },
  { "turno": "Noite", "quantidade": 430 }
]
```

Quando um turno não teve produção no período:

```json
[
  { "turno": "Manhã", "quantidade": 0 },
  { "turno": "Tarde", "quantidade": 0 },
  { "turno": "Noite", "quantidade": 0 }
]
```

### 401 Unauthorized

Retornado quando a requisição não inclui um JWT válido.

### 403 Forbidden

Retornado quando o usuário autenticado não possui um dos papéis permitidos.

## Mapeamento para os Acceptance Scenarios da spec

| Cenário (spec.md)                                             | Comportamento neste contrato                                   |
|-----------------------------------------------------------------|------------------------------------------------------------------|
| AS1 — consulta sem informar período                             | `dias` omitido → default `7`, resposta com os 3 turnos          |
| AS2 — consulta com período customizado (ex. 30)                 | `?dias=30` → soma considera a janela de 30 dias                 |
| AS3 — turno sem produção no período                              | Item correspondente retorna `"quantidade": 0`, não é omitido    |
| AS4 — requisição sem autenticação                                | `401 Unauthorized`                                               |
