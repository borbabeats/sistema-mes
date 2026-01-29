# API de Apontamentos - Documentação

## Endpoint: GET /apontamentos

### Descrição
Lista todos os apontamentos com suporte a filtros e paginação.

### Query Parameters

#### Filtros:
- `opId` (number, opcional): ID da Ordem de Produção
- `maquinaId` (number, opcional): ID da Máquina
- `usuarioId` (number, opcional): ID do Usuário
- `dataInicio` (string, opcional): Data de início (formato ISO)
- `dataFim` (string, opcional): Data de fim (formato ISO)
- `status` (enum, opcional): Status da Ordem de Produção
  - `RASCUNHO`
  - `PLANEJADA`
  - `EM_ANDAMENTO`
  - `PAUSADA`
  - `FINALIZADA`
  - `CANCELADA`
  - `ATRASADA`
- `setorId` (number, opcional): ID do Setor
- `ativo` (boolean, opcional): Se o apontamento está ativo (em andamento)

#### Paginação (Padrão Refine):
- `_start` (number, opcional): Posição inicial (default: 0)
- `_end` (number, opcional): Posição final (default: 10)
- **Cálculo:** `limit = _end - _start + 1`

#### Busca:
- `search` (string, opcional): Termo de busca para pesquisar em múltiplos campos
- `searchField` (string, opcional): Campo específico para busca
  - `op.codigo`: Busca apenas no código da OP
  - `maquina.nome`: Busca apenas no nome da máquina
  - `usuario.nome`: Busca apenas no nome do usuário
  - `op.produto`: Busca apenas no nome do produto
  - Se não informado, busca em todos os campos acima

### Exemplos de Uso

#### 1. Listar todos os apontamentos (primeiros 10 itens)
```
GET /apontamentos?_start=0&_end=9
```

#### 2. Filtrar por status
```
GET /apontamentos?status=EM_ANDAMENTO&_start=0&_end=19
```

#### 3. Filtrar por setor e paginação
```
GET /apontamentos?setorId=2&_start=20&_end=39
```

#### 4. Filtrar apontamentos ativos
```
GET /apontamentos?ativo=true&_start=0&_end=9
```

#### 5. Filtrar por período
```
GET /apontamentos?dataInicio=2024-01-01T00:00:00Z&dataFim=2024-01-31T23:59:59Z&_start=0&_end=29
```

#### 6. Combinação de filtros
```
GET /apontamentos?status=EM_ANDAMENTO&setorId=1&ativo=true&_start=0&_end=14
```

#### 7. Busca em múltiplos campos
```
GET /apontamentos?search=Prensa&_start=0&_end=9
```

#### 8. Busca em campo específico
```
GET /apontamentos?search=João&searchField=usuario.nome&_start=0&_end=9
```

#### 9. Busca por código da OP
```
GET /apontamentos?search=OP-2024&searchField=op.codigo&_start=0&_end=9
```

#### 10. Combinação de busca e filtros
```
GET /apontamentos?search=Plástico&status=EM_ANDAMENTO&ativo=true&_start=0&_end=19
```

### Response Format

```json
{
  "data": [
    {
      "id": 14,
      "opId": 13,
      "maquinaId": 5,
      "usuarioId": 22,
      "quantidadeProduzida": 21,
      "quantidadeDefeito": 0,
      "dataInicio": "2026-01-25T01:26:03.435Z",
      "dataFim": null,
      "maquina": {
        "id": 5,
        "nome": "Injetora Plástica 01",
        "codigo": "INJ-001",
        "setor": {
          "id": 2,
          "nome": "Produção"
        }
      },
      "usuario": {
        "id": 22,
        "nome": "João Silva",
        "email": "joao.silva@empresa.com"
      },
      "op": {
        "id": 13,
        "codigo": "OP-2024-001",
        "produto": "Peça Plástica A",
        "status": "EM_ANDAMENTO"
      }
    }
  ],
  "total": 150
}
```

### Campos do Response

- `data`: Array de apontamentos com dados relacionados
  - **Campos principais:** `id`, `opId`, `maquinaId`, `usuarioId`, `quantidadeProduzida`, `quantidadeDefeito`, `dataInicio`, `dataFim`
  - **maquina:** Objeto com dados da máquina (`id`, `nome`, `codigo`) e seu `setor`
  - **usuario:** Objeto com dados do usuário (`id`, `nome`, `email`)
  - **op:** Objeto com dados da ordem de produção (`id`, `codigo`, `produto`, `status`)
- `total`: Número total de registros (para o Refine calcular paginação)

**Nota:** O Refine usa o `total` para calcular internamente a paginação com base nos parâmetros `_start` e `_end`.
