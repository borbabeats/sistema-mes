# PM2 + Docker - Gerenciando Múltiplas Aplicações

## 🚀 Por que PM2 com Docker?

**PM2 é ideal para gerenciar containers Docker porque:**
- ✅ **Gerenciamento unificado** - Todas apps em um só lugar
- ✅ **Restart automático** - Se um container falha, PM2 reinicia
- ✅ **Logs centralizados** - Todas as aplicações com logs formatados
- ✅ **Monitoramento** - `pm2 monit` para ver tudo
- ✅ **Cluster mode** - Máximo desempenho
- ✅ **Startup automático** - Survive a reboots

## 📁 Estrutura de Aplicações

```
/apps/
├── sistema-mes/
│   ├── docker-compose.yml
│   ├── ecosystem.config.js
│   └── logs/
├── outra-app-1/
│   ├── docker-compose.yml
│   ├── ecosystem.config.js
│   └── logs/
└── outra-app-2/
    ├── docker-compose.yml
    ├── ecosystem.config.js
    └── logs/
```

## 🔧 Configuração PM2

### ecosystem.config.js (Exemplo Completo)

```javascript
module.exports = {
  apps: [
    {
      name: 'sistema-mes-api',
      script: 'docker-compose up',
      cwd: '/apps/sistema-mes',
      interpreter: '/bin/bash',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: '3000'
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      kill_timeout: 5000
    },
    // Adicione outras aplicações aqui
    {
      name: 'outra-app-1',
      script: 'docker-compose -f /apps/outra-app-1/docker-compose.yml up',
      cwd: '/apps/outra-app-1',
      interpreter: '/bin/bash',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: '3001'
      }
    },
    {
      name: 'outra-app-2',
      script: 'docker-compose -f /apps/outra-app-2/docker-compose.yml up',
      cwd: '/apps/outra-app-2',
      interpreter: '/bin/bash',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: '3002'
      }
    }
  ]
};
```

## 🚀 Comandos PM2

### Iniciar Todas as Aplicações
```bash
# Iniciar tudo
pm2 start ecosystem.config.js

# Iniciar aplicação específica
pm2 start sistema-mes-api

# Iniciar em modo cluster
pm2 start ecosystem.config.js --env production
```

### Gerenciamento
```bash
# Ver status de todas
pm2 status

# Ver logs de todas
pm2 logs

# Logs de aplicação específica
pm2 logs sistema-mes-api

# Reiniciar aplicação específica
pm2 restart sistema-mes-api

# Parar aplicação específica
pm2 stop sistema-mes-api

# Deletar aplicação específica
pm2 delete sistema-mes-api
```

### Monitoramento
```bash
# Monitoramento em tempo real
pm2 monit

# Ver uso de memória
pm2 show sistema-mes-api

# Ver informações detalhadas
pm2 describe sistema-mes-api
```

### Backup e Restore
```bash
# Salvar configuração atual
pm2 save

# Listar processos salvos
pm2 list

# Restaurar startup automático
pm2 resurrect
```

## 🔄 Deploy Automatizado

O CI/CD pode usar PM2 para gerenciar múltiplos containers:

```yaml
# No .github/workflows/deploy-ec2.yml
script: |
  cd /apps/sistema-mes
  git pull origin main
  docker-compose down
  docker-compose build --no-cache
  docker-compose up -d
  
  # Reiniciar PM2 se já estiver rodando
  pm2 restart sistema-mes-api || pm2 start ecosystem.config.js
```

## 📊 Benefícios

✅ **Gerenciamento centralizado** - Todas apps em um só lugar  
✅ **Recuperação automática** - Restart em falhas  
✅ **Logs unificados** - Formato consistente  
✅ **Monitoramento fácil** - Comandos simples  
✅ **Cluster mode** - Máximo desempenho  
✅ **Startup automático** - Survive reboots  

## 🎯 Quando Usar

| Situação | Docker Compose | PM2 | Recomendação |
|----------|----------------|------|--------------|
| Uma aplicação | ✅ | ❌ | Docker Compose direto |
| Múltiplas apps | ✅ | ✅ | PM2 + Docker Compose |
| Produção | ✅ | ✅ | PM2 + Docker Compose |
| Desenvolvimento | ❌ | ❌ | Docker Compose direto |

**Para múltiplas aplicações, PM2 é essencial!** 🚀
