# Feature Specification: Comparativo de Produtividade entre Turnos

**Feature Branch**: `001-comparativo-turnos`

**Created**: 2026-08-13

**Status**: Draft

**Input**: User description: "Evoluir o Dashboard Analytics adicionando um novo KPI/gráfico de comparativo de produtividade entre turnos (Manhã, Tarde, Noite), com período padrão de 7 dias, filtrável, seguindo o padrão dos demais endpoints do dashboard."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Comparar produtividade entre turnos (Priority: P1)

Como gerente ou administrador, quero visualizar um comparativo de produtividade
(quantidade produzida) entre os turnos Manhã, Tarde e Noite, para identificar
rapidamente qual turno está mais ou menos produtivo e agir sobre desvios.

**Why this priority**: É o único KPI solicitado nesta evolução e entrega valor
imediato de identificação de gaps de produtividade entre turnos, apoiando
decisões de alocação de mão de obra e investigação de causas.

**Independent Test**: Pode ser testado chamando o endpoint do comparativo com o
período padrão (últimos 7 dias) e verificando que a resposta traz a quantidade
produzida agregada por turno, permitindo montar o gráfico comparativo sem
depender de nenhuma outra funcionalidade nova.

**Acceptance Scenarios**:

1. **Given** existem apontamentos de produção finalizados nos últimos 7 dias,
   **When** o usuário consulta o comparativo de produtividade entre turnos sem
   informar período, **Then** o sistema retorna a quantidade total produzida em
   cada um dos três turnos (Manhã, Tarde, Noite) para os últimos 7 dias.
2. **Given** o usuário é ADMIN, GERENTE ou OPERADOR autenticado, **When** ele
   consulta o comparativo informando um número de dias diferente do padrão
   (ex.: 30), **Then** o sistema retorna a quantidade produzida por turno
   considerando a janela de dias informada.
3. **Given** um turno não teve nenhuma produção registrada no período
   consultado, **When** o comparativo é gerado, **Then** esse turno aparece no
   resultado com quantidade produzida igual a zero (não é omitido).
4. **Given** um usuário não autenticado tenta acessar o comparativo, **When** a
   requisição é feita sem token válido, **Then** o sistema nega o acesso.

---

### Edge Cases

- O que acontece quando não há nenhum apontamento no período (todos os turnos
  ficam com produção zero)? O sistema deve retornar os três turnos com valor
  zero, não uma lista vazia.
- Como o sistema trata um período informado com valor inválido (zero,
  negativo, ou não numérico)? Deve aplicar o valor padrão de 7 dias ou rejeitar
  a requisição de forma explícita — ver FR-005.
- Como o sistema trata apontamentos que atravessam a fronteira entre dois
  turnos (ex.: iniciados às 13h59 e finalizados às 14h10)? O turno é
  determinado pelo horário de início do apontamento, consistente com a
  classificação de turno já usada no gráfico de produção por turno existente.
- Como o comparativo se comporta com grandes volumes de dados (ex.: período de
  1 ano)? A resposta deve continuar sendo apenas 3 registros agregados (um por
  turno), independente do tamanho do período.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST fornecer um comparativo de produtividade que
  agregue a quantidade produzida (soma de `quantidadeProduzida` dos
  apontamentos) por turno (Manhã, Tarde, Noite) dentro de um período
  configurável.
- **FR-002**: O sistema MUST usar como período padrão os últimos 7 dias quando
  nenhum período for informado pelo usuário, consistente com o padrão já
  adotado no gráfico de produção por turno existente.
- **FR-003**: O sistema MUST permitir que o usuário informe um número
  diferente de dias para a janela de análise.
- **FR-004**: O sistema MUST retornar os três turnos (Manhã, Tarde, Noite)
  sempre, mesmo quando um ou mais turnos não tiverem produção no período
  (quantidade zero nesse caso).
- **FR-005**: O sistema MUST aplicar o valor padrão de 7 dias quando o
  parâmetro de período for inválido (não numérico, zero ou negativo), sem
  retornar erro ao usuário.
- **FR-006**: O sistema MUST restringir o acesso ao comparativo a usuários
  autenticados com papel ADMIN, GERENTE ou OPERADOR, consistente com o
  controle de acesso já aplicado aos demais dados do dashboard.
- **FR-007**: O sistema MUST classificar cada apontamento em um único turno
  (Manhã, Tarde ou Noite) com base no horário de início do apontamento, usando
  a mesma definição de faixas horárias já vigente no gráfico de produção por
  turno existente (para não haver duas fontes de verdade divergentes sobre o
  que é "Manhã", "Tarde" ou "Noite").
- **FR-008**: O sistema MUST expor, para cada turno, a quantidade total
  produzida no período, permitindo ordenação/comparação direta entre os três
  valores.

### Key Entities *(include if feature involves data)*

- **Apontamento de Produção**: registro de produção existente que contém
  quantidade produzida e horário de início; é a fonte de dados para o
  comparativo. Nenhum novo dado é persistido por esta feature.
- **Turno**: classificação derivada (não é uma entidade persistida) que
  agrupa apontamentos em Manhã, Tarde ou Noite conforme o horário de início.
- **Comparativo de Produtividade por Turno**: resultado agregado, contendo um
  registro por turno com a quantidade total produzida no período analisado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um gestor consegue identificar, em até 5 segundos de leitura do
  comparativo, qual turno teve a maior e a menor produtividade no período.
- **SC-002**: O comparativo sempre retorna exatamente 3 registros (um por
  turno), garantindo visualização consistente independentemente do volume de
  dados ou de turnos sem produção.
- **SC-003**: Alterar o período de análise (ex.: de 7 para 30 dias) reflete
  corretamente a soma de produção do novo período, sem necessidade de
  recarregar outras partes do dashboard.
- **SC-004**: 100% das requisições sem autenticação válida são recusadas.

## Assumptions

- As faixas horárias de turno reutilizam a definição já existente no sistema:
  Manhã (06h–13h59), Tarde (14h–21h59), Noite (demais horários), evitando
  criar uma segunda definição de turno divergente.
- A métrica de produtividade considerada é a quantidade produzida
  (`quantidadeProduzida`) somada por turno; qualidade/defeitos e OEE por turno
  ficam fora do escopo desta evolução (podem ser tratados em uma iteração
  futura, conforme decisão do usuário durante a especificação).
- O comparativo é consultado sob demanda (requisição HTTP), sem requisito de
  atualização em tempo real via WebSocket nesta iteração.
- Os mesmos três papéis de usuário que já acessam o dashboard (ADMIN, GERENTE,
  OPERADOR) têm acesso ao comparativo; não há um papel mais restrito para este
  dado específico.
- Apontamentos sem `dataInicio` definida (se existirem) são excluídos da
  agregação, pois não podem ser classificados em um turno.
