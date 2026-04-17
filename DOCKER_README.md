# Docker - MySQL para Sistema MES

## Configuração do Banco de Dados

Este projeto inclui configuração Docker para MySQL 8.0.

### Arquivos Criados:
- `docker-compose.yml` - Configuração principal
- `docker-compose.dev.yml` - Configuração para desenvolvimento
- `mysql-init/01-init-database.sql` - Script de inicialização
- `.env.example` - Exemplo de variáveis de ambiente

### Como Usar

#### 1. Para Ambiente de Desenvolvimento:
```bash
# Iniciar o MySQL para desenvolvimento (porta 3307)
docker-compose -f docker-compose.dev.yml up -d

# Parar os containers
docker-compose -f docker-compose.dev.yml down
```

#### 2. Para Ambiente de Produção:
```bash
# Iniciar o MySQL para produção (porta 3306)
docker-compose up -d

# Parar os containers
docker-compose down
```

### Acesso ao Banco de Dados

#### MySQL:
- **Host:** localhost
- **Porta:** 3306 (produção) ou 3307 (desenvolvimento)
- **Database:** mes_system
- **Username:** mes_user
- **Password:** mes123
- **Root Password:** root123


### Configuração no Projeto

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Ajuste as configurações no `.env` conforme necessário:
```env
DB_HOST=localhost
DB_PORT=3306  # ou 3307 para desenvolvimento
DB_USERNAME=mes_user
DB_PASSWORD=mes123
DB_DATABASE=sistema_mes
```

### Estrutura do Banco

O script de inicialização cria as seguintes tabelas:
- `usuarios` - Usuários do sistema
- `produtos` - Cadastro de produtos
- `ordens_producao` - Ordens de produção
- `paradas_producao` - Registro de paradas

### Comandos Úteis

```bash
# Ver status dos containers
docker-compose ps

# Ver logs do MySQL
docker-compose logs mysql

# Acessar o container MySQL
docker-compose exec mysql mysql -u mes_user -p mes_system

# Reiniciar o MySQL
docker-compose restart mysql

# Remover volumes (cuidado: apaga todos os dados)
docker-compose down -v
```

### Portas Utilizadas

- **3306:** MySQL (produção)
- **3307:** MySQL (desenvolvimento)

### Volume de Dados

Os dados do MySQL são persistidos em volumes Docker:
- `mysql_data` (produção)
- `mysql_dev_data` (desenvolvimento)

Isso garante que seus dados não sejam perdidos ao reiniciar os containers.
