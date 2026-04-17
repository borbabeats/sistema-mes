# CI/CD Setup Guide - Sistema MES

## 🚀 Configurando CI/CD para EC2

Este guia mostra como configurar deploy automático da sua API para a instância EC2 usando GitHub Actions.

## 📋 Pré-requisitos

1. **Instância EC2 já configurada** com PM2 e projeto clonado
2. **Chave SSH configurada** para acesso à EC2
3. **Projeto no GitHub** com branch `main`

## 🔧 Configuração no GitHub

### 1. Criar Secrets no Repositório

Vá para: `Settings > Secrets and variables > Actions`

Adicione os seguintes secrets:

```
EC2_HOST=ec2-13-220-174-157.compute-1.amazonaws.com
EC2_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
[conteúdo completo do arquivo meuapp-key.pem]
-----END OPENSSH PRIVATE KEY-----
```

**Como obter o conteúdo da chave SSH:**
```bash
# No seu computador local
cat meuapp-key.pem
```

### 2. Workflow do GitHub Actions

O arquivo `.github/workflows/deploy-ec2.yml` já foi criado com:

- **Testes automatizados** (lint, test, build)
- **Deploy automático** para branch `main`
- **Health check** pós-deploy
- **Rollback automático** em caso de falha

## 🛠️ Script de Deploy Manual

O arquivo `scripts/deploy-ec2.sh` oferece comandos para deploy manual:

```bash
# Deploy completo
./scripts/deploy-ec2.sh deploy

# Ver status
./scripts/deploy-ec2.sh status

# Ver logs
./scripts/deploy-ec2.sh logs

# Health check
./scripts/deploy-ec2.sh health

# Rollback (se necessário)
./scripts/deploy-ec2.sh rollback
```

## 🔄 Fluxo de CI/CD

### Push para `main`:
1. **GitHub Actions** inicia automaticamente
2. **Rodar testes** (lint, unit tests, build)
3. **Deploy para EC2** via SSH
4. **Health check** da aplicação
5. **Notificação** de sucesso/falha

### Pull Request:
1. **Rodar testes** apenas (sem deploy)
2. **Validar** código antes do merge
3. **Prevenção** de deploy com falhas

## 📊 Monitoramento

### Logs do Deploy:
- **GitHub Actions**: Verifique na aba "Actions" do repositório
- **PM2 Logs**: `./scripts/deploy-ec2.sh logs`
- **Application Logs**: Via PM2 ou diretamente na EC2

### Health Checks:
- **Endpoint**: `http://ec2-13-220-174-157.compute-1.amazonaws.com:3000/health`
- **API Docs**: `http://ec2-13-220-174-157.compute-1.amazonaws.com:3000/api`

## 🚨 Troubleshooting

### Deploy Falha:
1. **Verifique secrets** no GitHub
2. **Teste conexão SSH** manualmente
3. **Verifique logs** do GitHub Actions
4. **Verifique PM2 status** na EC2

### Health Check Falha:
1. **Aguarde mais tempo** (aplicação pode estar iniciando)
2. **Verifique PM2 logs** para erros
3. **Verifique porta 3000** está aberta
4. **Teste localmente** na EC2

### Rollback Necessário:
```bash
# Via script
./scripts/deploy-ec2.sh rollback

# Manualmente na EC2
ssh -i "meuapp-key.pem" ec2-user@ec2-13-220-174-157.compute-1.amazonaws.com
cd /opt/sistema-mes
pm2 restart sistema-mes
```

## 🔄 Processo de Deploy

### 1. Setup Inicial (uma vez):
```bash
# Na EC2
cd /opt/sistema-mes
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 2. Deploy Automático (sempre):
```bash
# Localmente
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

### 3. Deploy Manual (se necessário):
```bash
# Localmente
./scripts/deploy-ec2.sh deploy
```

## 📈 Benefícios

✅ **Deploy Automático** - Zero intervenção manual  
✅ **Testes Automatizados** - Qualidade garantida  
✅ **Rollback Automático** - Segurança em caso de falha  
✅ **Health Checks** - Monitoramento contínuo  
✅ **Logs Centralizados** - Facilidade de debugging  
✅ **Backup Automático** - Segurança dos dados  

## 🎯 Próximos Passos

1. **Configurar secrets** no GitHub
2. **Testar deploy manual** com o script
3. **Fazer primeiro push** para testar CI/CD
4. **Monitorar logs** e health checks
5. **Ajustar** conforme necessário

## 📞 Suporte

### Comandos Úteis:
```bash
# Verificar status do PM2
ssh -i "meuapp-key.pem" ec2-user@ec2-13-220-174-157.compute-1.amazonaws.com "pm2 status"

# Verificar logs em tempo real
ssh -i "meuapp-key.pem" ec2-user@ec2-13-220-174-157.compute-1.amazonaws.com "pm2 logs sistema-mes -f"

# Reiniciar aplicação
ssh -i "meuapp-key.pem" ec2-user@ec2-13-220-174-157.compute-1.amazonaws.com "pm2 restart sistema-mes"

# Verificar uso de recursos
ssh -i "meuapp-key.pem" ec2-user@ec2-13-220-174-157.compute-1.amazonaws.com "htop"
```

### URLs Importantes:
- **GitHub Actions**: https://github.com/borbabeats/sistema-mes/actions
- **Aplicação**: http://ec2-13-220-174-157.compute-1.amazonaws.com:3000
- **API Docs**: http://ec2-13-220-174-157.compute-1.amazonaws.com:3000/api
