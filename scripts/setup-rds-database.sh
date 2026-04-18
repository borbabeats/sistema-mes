#!/bin/bash

# Script para configurar banco de dados RDS do zero
# Uso: ./scripts/setup-rds-database.sh <DATABASE_URL>

set -e

DATABASE_URL=${1:-$DATABASE_URL}

if [ -z "$DATABASE_URL" ]; then
    echo "ERRO: DATABASE_URL não fornecida"
    echo "Uso: ./scripts/setup-rds-database.sh mysql://user:pass@host:3306/dbname"
    exit 1
fi

echo "=== Configurando banco de dados RDS ==="
echo "DATABASE_URL: $DATABASE_URL"

# 1. Reset do banco (se necessário)
echo "1. Resetando banco de dados..."
mysql -h $(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p') \
      -P $(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p') \
      -u $(echo $DATABASE_URL | sed -n 's/\/\/\([^:]*\):.*/\1/p') \
      -p$(echo $DATABASE_URL | sed -n 's/.*:\([^@]*\)@.*/\1/p') \
      < scripts/reset-database.sql

# 2. Rodar Prisma Migrations
echo "2. Aplicando migrations do Prisma..."
DATABASE_URL="$DATABASE_URL" npx prisma migrate deploy

# 3. Gerar Prisma Client
echo "3. Gerando Prisma Client..."
npx prisma generate

# 4. (Opcional) Popular com dados iniciais
if [ -f "prisma/seed.ts" ] || [ -f "prisma/seed.js" ]; then
    echo "4. Populando banco com dados iniciais..."
    DATABASE_URL="$DATABASE_URL" npm run seed || echo "Seed script não encontrado ou falhou"
fi

echo "=== Banco de dados configurado com sucesso! ==="
