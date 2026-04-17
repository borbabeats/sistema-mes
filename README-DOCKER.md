# Docker Compose Files - Sistema MES

## 📁 Estrutura de Arquivos

Este projeto possui diferentes arquivos Docker Compose para cada ambiente:

### 🚀 `docker-compose.yml` (Produção EC2)
- **Uso**: Deploy em produção na EC2
- **Banco**: Conectado ao RDS AWS
- **Porta**: 3000
- **Rede**: `apps-network` (compartilhada)

```bash
# Iniciar em produção
docker-compose up -d
```

### 🛠️ `docker-compose.dev.yml` (Desenvolvimento)
- **Uso**: Ambiente local de desenvolvimento
- **Banco**: MySQL local (porta 3307)
- **Porta**: 3001
- **Rede**: `dev-network` (isolada)

```bash
# Iniciar em desenvolvimento
docker-compose -f docker-compose.dev.yml up -d
```

### 📦 `docker-compose.prod.yml` (Produção Completa)
- **Uso**: Produção com banco local
- **Banco**: MySQL local (porta 3306)
- **Porta**: 3000
- **Status**: LEGADO - usar docker-compose.yml

## 🎯 Quando Usar Cada Um

| Arquivo | Ambiente | Banco | Porta API | Uso |
|---------|----------|--------|------------|------|
| `docker-compose.yml` | Produção | 3000 | EC2 + RDS |
| `docker-compose.dev.yml` | Dev | 3001 | Local + MySQL |
| `docker-compose.prod.yml` | Legado | 3000 | Não usar |

## 🚀 Comandos Úteis

### Desenvolvimento
```bash
# Subir ambiente dev
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Parar tudo
docker-compose -f docker-compose.dev.yml down
```

### Produção (EC2)
```bash
# Subir produção
docker-compose up -d

# Ver status
docker-compose ps

# Ver logs
docker-compose logs -f

# Atualizar imagem
docker-compose build --no-cache
docker-compose up -d
```

## 🔄 Deploy Automatizado

O CI/CD usa `docker-compose.yml` para deploy na EC2:
1. Pull do código
2. Build da imagem
3. Deploy via Docker Compose
4. Health check automático

## 📂 Estrutura de Portas

- **3000**: Produção (EC2)
- **3001**: Desenvolvimento (local)
- **3306**: MySQL produção (se usar local)
- **3307**: MySQL desenvolvimento

## 🔐 Segurança das Senhas

### Variáveis de Ambiente
Os arquivos agora usam variáveis de ambiente em vez de senhas hardcoded:

**Arquivos:**
- ✅ `docker-compose.yml` → Usa `${DATABASE_URL}`, `${JWT_SECRET}`, `${JWT_EXPIRES_IN}`
- ✅ `docker-compose.dev.yml` → Usa `${DATABASE_URL}`, `${JWT_SECRET}`, `${JWT_EXPIRES_IN}`
- ✅ `.env.example` → Template com valores de exemplo

### Como Usar

**1. Crie seu arquivo `.env`:**
```bash
cp .env.example .env
nano .env
```

**2. Configure suas credenciais:**
```bash
# Para desenvolvimento
DATABASE_URL=mysql://seu_usuario:sua_senha@localhost:3307/mes_system

# Para produção (EC2 + RDS)
DATABASE_URL=mysql://meuappadmin:SUA_SENHA_REAL@meuapp-mysql.c09is6eqqyn9.us-east-1.rds.amazonaws.com:3306/mes_system
```

**3. Docker Compose usa automaticamente:**
```bash
# As variáveis são lidas do arquivo .env
docker-compose up -d
```

### ⚠️ Importante

- **Sempre use** `docker-compose.yml` para produção
- **Use** `docker-compose.dev.yml` apenas para desenvolvimento local
- **Nunca commit** o arquivo `.env` (está no .gitignore)
- **RDS** é usado apenas em produção
- **Senhas** nunca ficam no código fonte

## ⚠️ Importante

- **Sempre use** `docker-compose.yml` para produção
- **Use** `docker-compose.dev.yml` apenas para desenvolvimento local
- **docker-compose.prod.yml** está obsoleto e será removido
- **RDS** é usado apenas em produção

## 🗑️ Limpeza

Arquivos removidos:
- ❌ `docker-compose.prod.yml` (obsoleto)
- ❌ `docker-compose.yml` antigo (com banco local)
- ❌ `docker-compose.dev.yml` antigo (apenas MySQL)

Arquivos mantidos:
- ✅ `docker-compose.yml` (produção EC2 + RDS)
- ✅ `docker-compose.dev.yml` (desenvolvimento local)
