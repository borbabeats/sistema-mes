# AWS Deployment Guide - Sistema MES
## EC2 + RDS + Docker + PM2

## � Arquitetura Simplificada

```
Internet → EC2 (t3.micro) → RDS MySQL (db.t3.micro)
```

**Dentro do Free Tier:**
- ✅ EC2 t3.micro: 750 horas/mês (12 meses)
- ✅ RDS db.t3.micro: 750 horas/mês (12 meses)
- **Custo estimado: ~$15-20/mês**

## 🚀 Deploy Passo a Passo

### 1. Pré-requisitos

```bash
# Instalar AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configurar credenciais
aws configure
# AWS Access Key ID: [sua chave]
# AWS Secret Access Key: [sua chave secreta]
# Default region name: us-east-1
# Default output format: json
```

### 2. Criar Rede e Security Groups

```bash
# Criar VPC
VPC_ID=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=mes-vpc}]" --query Vpc.VpcId --output text)
echo "VPC criada: $VPC_ID"

# Criar subnets
SUBNET1_ID=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.1.0/24 --availability-zone us-east-1a --query Subnet.SubnetId --output text)
SUBNET2_ID=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.2.0/24 --availability-zone us-east-1b --query Subnet.SubnetId --output text)
echo "Subnets criadas: $SUBNET1_ID, $SUBNET2_ID"

# Criar Internet Gateway
IGW_ID=$(aws ec2 create-internet-gateway --tag-specifications "ResourceType=internet-gateway,Tags=[{Key=Name,Value=mes-igw}]" --query InternetGateway.InternetGatewayId --output text)
aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID
echo "Internet Gateway criado: $IGW_ID"

# Criar Route Table
RT_ID=$(aws ec2 create-route-table --vpc-id $VPC_ID --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=mes-rt}]" --query RouteTable.RouteTableId --output text)
aws ec2 create-route --route-table-id $RT_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID
aws ec2 associate-route-table --route-table-id $RT_ID --subnet-id $SUBNET1_ID
aws ec2 associate-route-table --route-table-id $RT_ID --subnet-id $SUBNET2_ID
echo "Route Table configurada: $RT_ID"
```

### 3. Criar Security Groups

```bash
# Security Group para EC2
EC2_SG_ID=$(aws ec2 create-security-group --group-name mes-ec2-sg --description "Security Group for MES EC2" --vpc-id $VPC_ID --query GroupId --output text)
aws ec2 authorize-security-group-ingress --group-id $EC2_SG_ID --protocol tcp --port 22 --cidr 0.0.0.0/0  # SSH
aws ec2 authorize-security-group-ingress --group-id $EC2_SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0  # HTTP
aws ec2 authorize-security-group-ingress --group-id $EC2_SG_ID --protocol tcp --port 443 --cidr 0.0.0.0/0  # HTTPS
echo "Security Group EC2 criado: $EC2_SG_ID"

# Security Group para RDS
RDS_SG_ID=$(aws ec2 create-security-group --group-name mes-rds-sg --description "Security Group for MES RDS" --vpc-id $VPC_ID --query GroupId --output text)
aws ec2 authorize-security-group-ingress --group-id $RDS_SG_ID --protocol tcp --port 3306 --source-group $EC2_SG_ID
echo "Security Group RDS criado: $RDS_SG_ID"
```

### 4. Criar Key Pair

```bash
# Criar key pair para SSH
aws ec2 create-key-pair --key-name mes-keypair --query 'KeyMaterial' --output text > ~/.ssh/mes-keypair.pem
chmod 400 ~/.ssh/mes-keypair.pem
echo "Key Pair criado: ~/.ssh/mes-keypair.pem"
```

### 5. Criar Banco RDS

```bash
# Criar subnet group
aws rds create-db-subnet-group --db-subnet-group-name mes-subnet-group --db-subnet-group-description "Subnet group for MES" --subnet-ids $SUBNET1_ID $SUBNET2_ID

# Gerar senha aleatória
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
DB_IDENTIFIER="mes-production-db"

# Criar instância RDS
aws rds create-db-instance \
    --db-instance-identifier $DB_IDENTIFIER \
    --db-instance-class db.t3.micro \
    --engine mysql \
    --engine-version 8.0 \
    --master-username mes_user \
    --master-user-password $DB_PASSWORD \
    --allocated-storage 20 \
    --vpc-security-group-ids $RDS_SG_ID \
    --db-subnet-group-name mes-subnet-group \
    --backup-retention-period 0 \
    --storage-type gp2 \
    --no-multi-az \
    --publicly-accessible false \
    --deletion-protection false

# Aguardar RDS ficar disponível
echo "Aguardando RDS ficar disponível..."
aws rds wait db-instance-available --db-instance-identifier $DB_IDENTIFIER

# Obter endpoint do RDS
DB_ENDPOINT=$(aws rds describe-db-instances --db-instance-identifier $DB_IDENTIFIER --query 'DBInstances[0].Endpoint.Address' --output text)
echo "RDS criado: $DB_ENDPOINT"
echo "DATABASE_URL=mysql://mes_user:$DB_PASSWORD@$DB_ENDPOINT:3306/mes_system"
```

### 6. Criar Instância EC2

```bash
# Criar script de inicialização
cat > user-data.sh << 'EOF'
#!/bin/bash
yum update -y
yum install -y docker git nodejs npm
systemctl start docker
systemctl enable docker

# Instalar PM2 globalmente
npm install -g pm2

# Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Criar diretório do projeto
mkdir -p /opt/sistema-mes
cd /opt/sistema-mes

# Clonar projeto
git clone https://github.com/borbabeats/sistema-mes.git .

# Instalar dependências
npm install

# Gerar Prisma client
npx prisma generate

# Build da aplicação
npm run build

# Criar arquivo de ambiente
cat > .env.production << EOFE
NODE_ENV=production
PORT=3000
DATABASE_URL=COLOCAR_AQUI_SUA_DATABASE_URL
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=24h
EOFE

echo "Setup concluído!"
echo "Próximos passos:"
echo "1. Configure o DATABASE_URL em .env.production"
echo "2. Execute: pm2 start ecosystem.config.js"
echo "3. Execute: pm2 save"
echo "4. Execute: pm2 startup"
EOF

# Criar instância EC2
INSTANCE_ID=$(aws ec2 run-instances \
    --image-id ami-0c55b159cbfafe1f0 \
    --instance-type t3.micro \
    --key-name mes-keypair \
    --security-group-ids $EC2_SG_ID \
    --subnet-id $SUBNET1_ID \
    --user-data file://user-data.sh \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=mes-server}]" \
    --query 'Instances[0].InstanceId' \
    --output text)

echo "Instância EC2 criada: $INSTANCE_ID"

# Aguardar instância ficar disponível
aws ec2 wait instance-running --instance-ids $INSTANCE_ID

# Obter IP público
PUBLIC_IP=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)
echo "IP Público: $PUBLIC_IP"
echo "SSH: ssh -i \"meuapp-key.pem\" ec2-user@ec2-13-220-174-157.compute-1.amazonaws.com"
```

## 🔧 Configuração na EC2

### 1. Acessar a Instância

```bash
# SSH na instância
ssh -i "meuapp-key.pem" ec2-user@ec2-13-220-174-157.compute-1.amazonaws.com
```

### 2. Configurar Variáveis de Ambiente

```bash
# Entrar no diretório do projeto
cd /opt/sistema-mes

# Editar arquivo de ambiente
nano .env.production

# Substituir COLOCAR_AQUI_SUA_DATABASE_URL pela URL real:
DATABASE_URL=mysql://mes_user:SUA_SENHA@$DB_ENDPOINT:3306/mes_system
```

### 3. Criar Configuração PM2

```bash
# Criar arquivo ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'sistema-mes',
    script: 'dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOF

# Criar diretório de logs
mkdir -p logs
```

### 4. Iniciar Aplicação com PM2

```bash
# Iniciar aplicação
pm2 start ecosystem.config.js --env production

# Salvar configuração
pm2 save

# Configurar startup automático
pm2 startup

# Verificar status
pm2 status

# Verificar logs
pm2 logs
```

### 5. Configurar Nginx (Opcional)

```bash
# Instalar Nginx
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Criar configuração
sudo nano /etc/nginx/conf.d/sistema-mes.conf

# Conteúdo do arquivo:
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Testar e reiniciar Nginx
sudo nginx -t
sudo systemctl restart nginx
## 📊 Monitoramento e Manutenção

### Comandos PM2 Úteis

```bash
# Status da aplicação
pm2 status

# Reiniciar aplicação
pm2 restart sistema-mes

# Parar aplicação
pm2 stop sistema-mes

# Ver logs em tempo real
pm2 logs

# Reiniciar tudo
pm2 restart all

# Monitorar
pm2 monit

# Listar processos
pm2 list

# Remover processo
pm2 delete sistema-mes
```

### Atualizar Aplicação

```bash
# SSH na instância
ssh -i "meuapp-key.pem" ec2-user@ec2-13-220-174-157.compute-1.amazonaws.com

# Entrar no diretório
cd /opt/sistema-mes

# Pull das atualizações
git pull origin main

# Instalar novas dependências
npm install

# Gerar Prisma client
npx prisma generate

# Build da aplicação
npm run build

# Reiniciar PM2
pm2 restart sistema-mes

# Verificar status
pm2 status
```

### Backup Manual (se necessário)

```bash
# Instalar MySQL client
sudo yum install -y mysql

# Fazer backup
mysqldump -h $DB_ENDPOINT -u mes_user -p$DB_PASSWORD mes_system > backup_$(date +%Y%m%d).sql

# Upload para S3 (se tiver bucket)
aws s3 cp backup_$(date +%Y%m%d).sql s3://seu-bucket/backups/
```

## 🔒 Segurança

### Configurações Adicionais

```bash
# Configurar firewall
sudo yum install -y firewalld
sudo systemctl start firewalld
sudo systemctl enable firewalld

# Liberar portas necessárias
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload

# Configurar fail2ban
sudo yum install -y epel-release
sudo yum install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Configurar logrotate
sudo nano /etc/logrotate.d/sistema-mes

# Conteúdo:
/opt/sistema-mes/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 ec2-user ec2-user
    postrotate
        pm2 reloadLogs
    endscript
}
```

## 📝 Checklist Final

### Antes de ir para produção
- [ ] Variáveis de ambiente configuradas
- [ ] Aplicação rodando com PM2
- [ ] PM2 configurado para startup automático
- [ ] Logs sendo gerados corretamente
- [ ] Nginx configurado (se necessário)
- [ ] Firewall configurado
- [ ] Testes de funcionamento

### URLs de Acesso
- **Aplicação**: http://$PUBLIC_IP
- **API Docs**: http://$PUBLIC_IP/api
- **Health Check**: http://$PUBLIC_IP/health

### Comandos de Emergência
```bash
# Reiniciar tudo
pm2 restart all

# Verificar logs de erro
pm2 logs sistema-mes --err

# Parar aplicação
pm2 stop sistema-mes

# Status completo
pm2 show sistema-mes
```

## 💰 Custos Estimados

### Free Tier (12 meses)
- **EC2 t3.micro**: ~$7.50/mês
- **RDS db.t3.micro**: ~$11.50/mês
- **Data Transfer**: ~$5/mês
- **Total**: ~$24/mês

### Pós-Free Tier
- **EC2 t3.micro**: ~$15/mês
- **RDS db.t3.micro**: ~$23/mês
- **Data Transfer**: ~$5/mês
- **Total**: ~$43/mês

## 🚀 Resumo do Deploy

1. **Preparar ambiente AWS** (5 min)
2. **Criar infraestrutura** (10 min)
3. **Configurar EC2** (10 min)
4. **Deploy da aplicação** (5 min)
5. **Testes e ajustes** (10 min)

**Tempo total: ~40 minutos**

## 📞 Suporte

### Problemas Comuns

1. **Aplicação não inicia**
   - Verificar logs: `pm2 logs`
   - Verificar variáveis de ambiente
   - Testar conexão com banco

2. **Erro de conexão com RDS**
   - Verificar security groups
   - Testar string de conexão
   - Verificar se RDS está no mesmo VPC

3. **PM2 não inicia automaticamente**
   - Verificar: `pm2 startup`
   - Verificar se está no systemd: `systemctl status pm2-root`

### Comandos Úteis
```bash
# Verificar uso de recursos
htop
df -h
free -h

# Verificar logs do sistema
sudo journalctl -u nginx -f
sudo journalctl -u docker -f

# Testar aplicação localmente
curl http://localhost:3000/health
```

## 🚀 Deploy Completo em um Script

### Script Automatizado

```bash
#!/bin/bash
# deploy-complete.sh - Deploy completo do Sistema MES

# Configuração
AWS_REGION="us-east-1"
PROJECT_NAME="sistema-mes"

echo "🚀 Iniciando deploy completo..."

# 1. Criar VPC e networking
VPC_ID=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=$PROJECT_NAME-vpc}]" --query Vpc.VpcId --output text)
SUBNET1_ID=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.1.0/24 --availability-zone us-east-1a --query Subnet.SubnetId --output text)
SUBNET2_ID=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.2.0/24 --availability-zone us-east-1b --query Subnet.SubnetId --output text)
IGW_ID=$(aws ec2 create-internet-gateway --tag-specifications "ResourceType=internet-gateway,Tags=[{Key=Name,Value=$PROJECT_NAME-igw}]" --query InternetGateway.InternetGatewayId --output text)
aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID
RT_ID=$(aws ec2 create-route-table --vpc-id $VPC_ID --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=$PROJECT_NAME-rt}]" --query RouteTable.RouteTableId --output text)
aws ec2 create-route --route-table-id $RT_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID
aws ec2 associate-route-table --route-table-id $RT_ID --subnet-id $SUBNET1_ID
aws ec2 associate-route-table --route-table-id $RT_ID --subnet-id $SUBNET2_ID

# 2. Criar Security Groups
EC2_SG_ID=$(aws ec2 create-security-group --group-name $PROJECT_NAME-ec2-sg --description "Security Group for MES EC2" --vpc-id $VPC_ID --query GroupId --output text)
aws ec2 authorize-security-group-ingress --group-id $EC2_SG_ID --protocol tcp --port 22 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $EC2_SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $EC2_SG_ID --protocol tcp --port 443 --cidr 0.0.0.0/0

RDS_SG_ID=$(aws ec2 create-security-group --group-name $PROJECT_NAME-rds-sg --description "Security Group for MES RDS" --vpc-id $VPC_ID --query GroupId --output text)
aws ec2 authorize-security-group-ingress --group-id $RDS_SG_ID --protocol tcp --port 3306 --source-group $EC2_SG_ID

# 3. Criar Key Pair
aws ec2 create-key-pair --key-name $PROJECT_NAME-keypair --query 'KeyMaterial' --output text > ~/.ssh/$PROJECT_NAME-keypair.pem
chmod 400 ~/.ssh/$PROJECT_NAME-keypair.pem

# 4. Criar RDS
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
aws rds create-db-subnet-group --db-subnet-group-name $PROJECT_NAME-subnet-group --db-subnet-group-description "Subnet group for MES" --subnet-ids $SUBNET1_ID $SUBNET2_ID
aws rds create-db-instance --db-instance-identifier $PROJECT_NAME-db --db-instance-class db.t3.micro --engine mysql --engine-version 8.0 --master-username mes_user --master-user-password $DB_PASSWORD --allocated-storage 20 --vpc-security-group-ids $RDS_SG_ID --db-subnet-group-name $PROJECT_NAME-subnet-group --backup-retention-period 0 --storage-type gp2 --no-multi-az --publicly-accessible false --deletion-protection false
aws rds wait db-instance-available --db-instance-identifier $PROJECT_NAME-db
DB_ENDPOINT=$(aws rds describe-db-instances --db-instance-identifier $PROJECT_NAME-db --query 'DBInstances[0].Endpoint.Address' --output text)

# 5. Criar EC2 com setup automático
cat > user-data-complete.sh << EOF
#!/bin/bash
yum update -y
yum install -y docker git nodejs npm
systemctl start docker
systemctl enable docker
npm install -g pm2
curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-\$(uname -s)-\$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
mkdir -p /opt/sistema-mes
cd /opt/sistema-mes
git clone https://github.com/borbabeats/sistema-mes.git .
npm install
npx prisma generate
npm run build
cat > .env.production << EOFE
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://mes_user:$DB_PASSWORD@$DB_ENDPOINT:3306/mes_system
JWT_SECRET=\$(openssl rand -base64 32)
JWT_EXPIRES_IN=24h
EOFE
cat > ecosystem.config.js << EOFE
module.exports = {
  apps: [{
    name: 'sistema-mes',
    script: 'dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOFE
mkdir -p logs
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
EOF

INSTANCE_ID=$(aws ec2 run-instances --image-id ami-0c55b159cbfafe1f0 --instance-type t3.micro --key-name $PROJECT_NAME-keypair --security-group-ids $EC2_SG_ID --subnet-id $SUBNET1_ID --user-data file://user-data-complete.sh --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$PROJECT_NAME-server}]" --query 'Instances[0].InstanceId' --output text)
aws ec2 wait instance-running --instance-ids $INSTANCE_ID
PUBLIC_IP=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)

echo "✅ Deploy concluído!"
echo "🌐 URL: http://$PUBLIC_IP"
echo "📚 API: http://$PUBLIC_IP/api"
echo "🔑 SSH: ssh -i ~/.ssh/$PROJECT_NAME-keypair.pem ec2-user@$PUBLIC_IP"
echo "🗄️  Database: $DB_ENDPOINT"
```

### Como Usar

```bash
# Baixar script
curl -O https://raw.githubusercontent.com/borbabeats/sistema-mes/main/deploy-complete.sh
chmod +x deploy-complete.sh

# Executar deploy
./deploy-complete.sh
```

**Tempo total: ~15 minutos**

# Conectar no container
aws ecs execute-command \
    --cluster mes-cluster \
    --task 1234567890abcdef0 \
    --container mes-container \
    --command "/bin/sh" \
    --interactive
```
