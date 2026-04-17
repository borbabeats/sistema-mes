#!/bin/bash

# Script para iniciar Docker Compose via PM2
# Este script gerencia o ciclo de vida do container Docker

cd /opt/sistema-mes

# Função para cleanup ao receber sinal de terminação
cleanup() {
    echo "Recebido sinal de terminação, parando container..."
    docker compose down
    exit 0
}

# Capturar sinais de terminação
trap cleanup SIGTERM SIGINT

# Verificar se rede existe, se não, criar
if ! docker network ls | grep -q "apps-network"; then
    echo "Criando rede apps-network..."
    docker network create apps-network
fi

# Iniciar container em foreground (modo attached)
echo "Iniciando Sistema MES API..."
docker compose up --build

# Se chegou aqui, o container parou
echo "Container parado, finalizando..."
