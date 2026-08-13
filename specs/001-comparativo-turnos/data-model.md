# Data Model: Comparativo de Produtividade entre Turnos

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

Nenhuma entidade de domínio nova é persistida. Esta feature apenas agrega
dados já existentes na tabela `apontamentos` (via Prisma) em uma nova forma de
resposta.

## Entidades existentes utilizadas (sem alteração de schema)

### Apontamento (`apontamentos`, modelo Prisma `Apontamento`)

Campos relevantes para esta feature (já existentes em
`prisma/schema.prisma`):

| Campo                | Tipo       | Uso nesta feature                                   |
|-----------------------|-----------|------------------------------------------------------|
| `dataInicio`          | `DateTime`| Determina o turno (hora do dia) e o filtro de período |
| `quantidadeProduzida` | `Int`     | Valor somado por turno                                |

Nenhum outro campo de `Apontamento` é lido por esta feature. Nenhuma
validação de negócio nova é aplicada — os dados já são validados na criação
e finalização do apontamento (fora do escopo desta feature).

## Entidade derivada (não persistida)

### Turno

Classificação calculada em tempo de consulta a partir de `HOUR(dataInicio)`,
idêntica à já usada em `getProducaoPorTurno`:

| Turno  | Faixa horária        |
|--------|------------------------|
| Manhã  | 06:00 – 13:59          |
| Tarde  | 14:00 – 21:59          |
| Noite  | 22:00 – 05:59 (demais) |

Não há tabela, enum Prisma, ou configuração para "Turno" — é um valor de
string calculado, igual ao comportamento atual do sistema.

## Forma de resposta (DTO)

### `ComparativoTurnoItemDto`

Representa a produtividade agregada de um único turno no período consultado.

| Campo         | Tipo     | Descrição                                              | Exemplo   |
|---------------|----------|----------------------------------------------------------|-----------|
| `turno`       | `string` | Nome do turno: `"Manhã"`, `"Tarde"` ou `"Noite"`         | `"Manhã"` |
| `quantidade`  | `number` | Soma de `quantidadeProduzida` no período, para esse turno (0 se não houver produção) | `1250`    |

### Resposta do endpoint

`ComparativoTurnoItemDto[]` — array com **exatamente 3 elementos**, sempre na
ordem `["Manhã", "Tarde", "Noite"]`, conforme FR-004/SC-002.

## Regras de validação e invariantes

- **INV-001**: O array de resposta sempre tem length 3 — um item por turno,
  nunca omitido (FR-004).
- **INV-002**: `quantidade` é sempre um inteiro ≥ 0 (soma de quantidades
  produzidas; nunca negativo).
- **INV-003**: A soma de `quantidade` dos 3 turnos é igual à soma total de
  `quantidadeProduzida` de todos os apontamentos com `dataInicio` dentro do
  período — nenhum apontamento é contado duas vezes ou perdido (todo
  apontamento com `dataInicio` válida pertence a exatamente um turno).
- **INV-004**: Apontamentos com `dataInicio` nulo/ausente (se existirem) são
  excluídos da agregação (Assumption da spec), sem gerar erro.
