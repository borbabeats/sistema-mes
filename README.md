# Sistema MES (Manufacturing Execution System)

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">Sistema de Execução de Manufatura construído com <a href="http://nodejs.org" target="_blank">Node.js</a> e <a href="https://nestjs.com/" target="_blank">NestJS</a></p>

## Descrição

Sistema MES completo para gestão de produção industrial, desenvolvido com arquitetura limpa (Clean Architecture) e melhores práticas de desenvolvimento. O sistema gerencia ordens de produção, máquinas, setores, usuários e apontamentos de produção.

## 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture** com as seguintes camadas:

```
src/
├── application/          # Use Cases (lógica de negócio)
│   └── use-cases/
├── domain/              # Entidades e interfaces de repositórios
│   ├── entities/
│   └── repositories/
├── infrastructure/      # Implementações de repositórios
│   └── repositories/
├── presentation/        # DTOs e controllers
│   ├── dto/
│   └── controllers/
└── modules/             # Módulos NestJS
```

## 🚀 Tecnologias

- **Framework**: NestJS
- **Linguagem**: TypeScript
- **Banco de Dados**: MySQL/MariaDB com Prisma ORM
- **Autenticação**: JWT
- **Validação**: class-validator
- **Documentação**: Swagger/OpenAPI
- **Segurança**: bcrypt (hash de senhas)
- **Logging**: Winston
- **WebSocket**: Notificações em tempo real

## 📋 Funcionalidades

### 🔐 Autenticação e Autorização
- Login com JWT
- Sistema de roles (ADMIN, GERENTE, OPERADOR)
- Guards de proteção de rotas

### 👥 Gestão de Usuários
- CRUD de usuários
- Perfis de acesso
- Associação com setores

### 🏭 Gestão de Setores
- Cadastro de setores produtivos
- Organização hierárquica

### 🤖 Gestão de Máquinas
- Cadastro de máquinas
- Controle de status (DISPONÍVEL, EM_USO, MANUTENÇÃO, INATIVA, PARADA, DESATIVADA)
- Associação com setores
- Controle de horas de uso

### 🔧 Gestão de Manutenções
- Agendamento de manutenções (PREVENTIVA, CORRETIVA, PREDITIVA, LUBRIFICAÇÃO, CALIBRACAO)
- Controle de status das manutenções
- Histórico de manutenções
- Controle de custos

### 📋 Ordens de Produção (OP)
- Criação e gestão de OPs
- Controle de status (RASCUNHO, PLANEJADA, EM_ANDAMENTO, PAUSADA, FINALIZADA, CANCELADA, ATRASADA)
- Priorização de produção (BAIXA, MEDIA, ALTA, URGENTE)
- Controle de quantidades planejadas vs produzidas
- Controle de prazos planejados vs reais
- Histórico de mudanças de status

### ⏱️ Apontamentos de Produção
- Registro de tempo de produção
- Controle de quantidades produzidas e com defeito
- Associação com OPs, máquinas e operadores
- Finalização de apontamentos

### 📊 Dashboard Analytics
- **KPIs de Produção**: OPs ativas, produção do dia, eficiência global, taxa de defeitos
- **KPIs de Qualidade**: índice de qualidade, rejeições do mês, conformidade
- **KPIs de Recursos**: máquinas ativas, OEE, disponibilidade
- **KPIs de Prazos**: OPs em atraso, cumprimento de prazos, tempo médio de ciclo
- **Gráficos**: produção diária, produção por setor, status das OPs, tendência de qualidade
- **Relatórios**: OEE em tempo real, top 5 produtos, produção por turno
- **Alertas**: máquinas paradas, OPs atrasadas, taxa de defeitos alta
- **Metas**: progresso diário, eficiência por operador

### 🔔 Sistema de Notificações
- Configuração de notificações por evento
- Envio via WebSocket e WhatsApp
- Tipos de eventos: máquina parada, OP atrasada, defeito alto, OP finalizada
- Histórico de envio de notificações

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- MySQL/MariaDB
- npm ou yarn
- Docker (opcional)

### Instalação

```bash
# Clonar o repositório
git clone <repository-url>
cd sistema_mes

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Executar migrações do banco de dados
npx prisma migrate dev

# Iniciar em modo desenvolvimento
npm run start:dev
```

### Variáveis de Ambiente

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/mes_system"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="24h"

# Porta do servidor
PORT=3000
```

## 📚 Documentação da API

### Autenticação

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@mes.com",
  "senha": "password123"
}
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@mes.com",
    "cargo": "ADMIN"
  }
}
```

### Usuários

#### Listar Usuários
```http
GET /usuarios
Authorization: Bearer <token>
```

#### Criar Usuário
```http
POST /usuarios
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@empresa.com",
  "telefone": "11999999999",
  "senha": "password123",
  "cargo": "OPERADOR",
  "setorId": 1
}
```

#### Obter Perfil
```http
GET /usuarios/profile/me
Authorization: Bearer <token>
```

### Setores

#### Listar Setores
```http
GET /setores
Authorization: Bearer <token>
```

#### Criar Setor
```http
POST /setores
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Produção",
  "descricao": "Setor principal de produção",
  "responsavelId": 1
}
```

### Máquinas

#### Listar Máquinas
```http
GET /maquinas
Authorization: Bearer <token>
```

#### Criar Máquina
```http
POST /maquinas
Authorization: Bearer <token>
Content-Type: application/json

{
  "codigo": "MAQ-001",
  "nome": "Torno CNC",
  "descricao": "Torno computadorizado",
  "fabricante": "DMG Mori",
  "modelo": "CTX 310",
  "capacidade": "100 peças/hora",
  "setorId": 1
}
```

### Manutenções

#### Listar Manutenções
```http
GET /manutencoes
Authorization: Bearer <token>
```

#### Criar Manutenção
```http
POST /manutencoes
Authorization: Bearer <token>
Content-Type: application/json

{
  "maquinaId": 1,
  "tipo": "PREVENTIVA",
  "descricao": "Manutenção preventiva mensal",
  "dataAgendada": "2024-12-20T08:00:00Z",
  "custoEstimado": 500.00,
  "responsavelId": 2
}
```

### Ordens de Produção

#### Listar Ordens de Produção
```http
GET /ordens-producao
Authorization: Bearer <token>
```

#### Criar Ordem de Produção
```http
POST /ordens-producao
Authorization: Bearer <token>
Content-Type: application/json

{
  "codigo": "OP-2024-001",
  "produto": "Peça A",
  "quantidadePlanejada": 1000,
  "dataPrevista": "2024-12-31",
  "setorId": 1,
  "prioridade": "ALTA",
  "responsavelId": 1
}
```

#### Iniciar Produção
```http
PATCH /ordens-producao/:id/iniciar
Authorization: Bearer <token>
```

### Apontamentos

#### Listar Apontamentos
```http
GET /apontamentos
Authorization: Bearer <token>
```

#### Criar Apontamento
```http
POST /apontamentos
Authorization: Bearer <token>
Content-Type: application/json

{
  "opId": 1,
  "maquinaId": 1,
  "operadorId": 1,
  "quantidadePlanejada": 100
}
```

#### Finalizar Apontamento
```http
PATCH /apontamentos/:id/finalizar
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantidadeProduzida": 95,
  "quantidadeDefeito": 5
}
```

### Dashboard Analytics

#### KPIs de Produção
```http
GET /dashboard/kpis/producao
Authorization: Bearer <token>
```

#### KPIs de Qualidade
```http
GET /dashboard/kpis/qualidade
Authorization: Bearer <token>
```

#### KPIs de Recursos
```http
GET /dashboard/kpis/recursos
Authorization: Bearer <token>
```

#### KPIs de Prazos
```http
GET /dashboard/kpis/prazos
Authorization: Bearer <token>
```

#### Gráfico de Produção Diária
```http
GET /dashboard/graficos/producao-diaria?dias=30
Authorization: Bearer <token>
```

#### Produção por Setor
```http
GET /dashboard/graficos/producao-por-setor?periodo=mes
Authorization: Bearer <token>
```

#### Status das OPs
```http
GET /dashboard/graficos/status-ops
Authorization: Bearer <token>
```

#### OEE em Tempo Real
```http
GET /dashboard/graficos/oee-tempo-real
Authorization: Bearer <token>
```

#### Top 5 Produtos
```http
GET /dashboard/graficos/top-produtos?periodo=mes
Authorization: Bearer <token>
```

#### Produção por Turno
```http
GET /dashboard/graficos/producao-por-turno?dias=7
Authorization: Bearer <token>
```

#### Alertas Críticos
```http
GET /dashboard/alertas/criticos
Authorization: Bearer <token>
```

#### Metas do Dia
```http
GET /dashboard/metas/dia
Authorization: Bearer <token>
```

#### Eficiência por Operador
```http
GET /dashboard/eficiencia/operadores?periodo=semana
Authorization: Bearer <token>
```

## 📊 Estrutura de Dados

### Status das Ordens de Produção
- `RASCUNHO`: Ordem criada mas não iniciada
- `PLANEJADA`: Ordem planejada e agendada
- `EM_ANDAMENTO`: Em produção
- `PAUSADA`: Produção interrompida temporariamente
- `FINALIZADA`: Produção concluída
- `CANCELADA`: Ordem cancelada
- `ATRASADA`: Ordem fora do prazo planejado

### Status das Máquinas
- `DISPONIVEL`: Máquina disponível para uso
- `EM_USO`: Máquina em operação
- `MANUTENCAO`: Máquina em manutenção
- `INATIVA`: Máquina inativa
- `PARADA`: Máquina parada
- `DESATIVADA`: Máquina desativada permanentemente

### Tipos de Manutenção
- `PREVENTIVA`: Manutenção preventiva agendada
- `CORRETIVA`: Manutenção corretiva por falha
- `PREDITIVA`: Manutenção preditiva baseada em condições
- `LUBRIFICACAO`: Lubrificação programada
- `CALIBRACAO`: Calibração de equipamentos
- `OUTRA`: Outro tipo de manutenção

### Prioridades
- `BAIXA`: Baixa prioridade
- `MEDIA`: Prioridade média
- `ALTA`: Alta prioridade
- `URGENTE`: Urgente

### Cargos de Usuário
- `ADMIN`: Administrador do sistema
- `GERENTE`: Gerente de produção
- `OPERADOR`: Operador de máquina

## 🧪 Testes

```bash
# Executar testes unitários
npm run test

# Executar testes e2e
npm run test:e2e

# Gerar coverage
npm run test:cov
```

## 🚀 Deploy

### Produção
```bash
# Build para produção
npm run build

# Iniciar em modo produção
npm run start:prod
```

### Docker
```bash
# Construir imagem
docker build -t sistema-mes .

# Executar container
docker run -p 3000:3000 sistema-mes
```

## 📝 Scripts Úteis

```bash
# Gerar nova migration
npx prisma migrate dev --name <migration-name>

# Resetar banco de dados
npx prisma migrate reset

# Visualizar banco de dados
npx prisma studio

# Gerar documentação Swagger
npm run build
# Acessar http://localhost:3000/api
```

## 🔧 Desenvolvimento

### Comandos

```bash
# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm run start:dev

# Build do projeto
npm run build

# Verificar lint
npm run lint

# Corrigir lint
npm run lint:fix
```

### Padrões de Código

- TypeScript strict mode
- ESLint + Prettier
- Convenção de nomenclatura CamelCase
- Clean Architecture
- SOLID Principles

## 📄 Licença

Este projeto está licenciado sob a MIT License.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte e dúvidas, entre em contato através dos issues do GitHub.
