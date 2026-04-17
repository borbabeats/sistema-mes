#!/bin/bash

# Deploy script for Sistema MES to EC2
# Usage: ./scripts/deploy-ec2.sh [environment]

set -e

# Configuration
EC2_HOST="ec2-13-220-174-157.compute-1.amazonaws.com"
EC2_USER="ec2-user"
SSH_KEY="meuapp-key.pem"
PROJECT_DIR="/opt/sistema-mes"
BACKUP_DIR="/opt/backups"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if SSH key exists
check_ssh_key() {
    if [ ! -f "$SSH_KEY" ]; then
        print_error "SSH key not found: $SSH_KEY"
        print_status "Please ensure the SSH key is in the current directory"
        exit 1
    fi
}

# Backup current deployment
backup_current() {
    print_status "Creating backup of current deployment..."
    
    ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" << EOF
        if [ -d "$PROJECT_DIR" ]; then
            sudo mkdir -p $BACKUP_DIR
            sudo cp -r $PROJECT_DIR $BACKUP_DIR/sistema-mes-backup-\$(date +%Y%m%d_%H%M%S)
            print_status "Backup created successfully"
        else
            print_warning "Project directory not found, skipping backup"
        fi
EOF
}

# Deploy application
deploy_app() {
    print_status "Starting deployment..."
    
    ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" << EOF
        # Entrar no diretório do projeto
        cd $PROJECT_DIR
        
        # Fazer pull das atualizações
        print_status "Pulling latest changes..."
        git pull origin main
        
        # Instalar dependências
        print_status "Installing dependencies..."
        npm ci --production
        
        # Gerar Prisma client
        print_status "Generating Prisma client..."
        npx prisma generate
        
        # Build da aplicação
        print_status "Building application..."
        npm run build
        
        # Reiniciar aplicação com PM2
        print_status "Restarting application..."
        pm2 restart sistema-mes
        
        # Verificar status
        print_status "Checking PM2 status..."
        pm2 status
        
        # Mostrar logs recentes
        print_status "Recent logs:"
        pm2 logs sistema-mes --lines 10
        
        print_status "Deployment completed successfully!"
EOF
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    # Wait for application to start
    sleep 10
    
    # Check if application is responding
    response=$(curl -s -o /dev/null -w "%{http_code}" "http://$EC2_HOST:3000/health" || echo "000")
    
    if [ "$response" = "200" ]; then
        print_status "✅ Health check passed - Application is responding"
    else
        print_error "❌ Health check failed - Status code: $response"
        print_warning "Check PM2 logs: ssh -i $SSH_KEY $EC2_USER@$EC2_HOST 'pm2 logs sistema-mes'"
        exit 1
    fi
    
    # Check API documentation
    api_response=$(curl -s -o /dev/null -w "%{http_code}" "http://$EC2_HOST:3000/api" || echo "000")
    
    if [ "$api_response" = "200" ]; then
        print_status "✅ API documentation is accessible"
    else
        print_warning "⚠️ API documentation not accessible - Status code: $api_response"
    fi
}

# Rollback function
rollback() {
    print_status "Rolling back to previous version..."
    
    ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" << EOF
        # Find latest backup
        LATEST_BACKUP=\$(ls -t $BACKUP_DIR/sistema-mes-backup-* 2>/dev/null | head -1)
        
        if [ -z "\$LATEST_BACKUP" ]; then
            print_error "No backup found for rollback"
            exit 1
        fi
        
        print_status "Rolling back to: \$LATEST_BACKUP"
        
        # Stop current application
        pm2 stop sistema-mes
        
        # Restore backup
        sudo rm -rf $PROJECT_DIR
        sudo cp -r \$LATEST_BACKUP $PROJECT_DIR
        sudo chown -R $EC2_USER:$EC2_USER $PROJECT_DIR
        
        # Start application
        cd $PROJECT_DIR
        pm2 start ecosystem.config.js --env production
        
        print_status "Rollback completed"
EOF
}

# Show logs
show_logs() {
    print_status "Showing PM2 logs..."
    ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" "pm2 logs sistema-mes --lines 50 --nostream"
}

# Show status
show_status() {
    print_status "PM2 Status:"
    ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" "pm2 status"
    
    print_status "System Info:"
    ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" "df -h && free -h"
}

# Main function
main() {
    case "${1:-deploy}" in
        "deploy")
            check_ssh_key
            backup_current
            deploy_app
            health_check
            ;;
        "rollback")
            check_ssh_key
            rollback
            health_check
            ;;
        "logs")
            check_ssh_key
            show_logs
            ;;
        "status")
            check_ssh_key
            show_status
            ;;
        "health")
            health_check
            ;;
        *)
            echo "Usage: $0 {deploy|rollback|logs|status|health}"
            echo ""
            echo "Commands:"
            echo "  deploy   - Deploy application to EC2"
            echo "  rollback - Rollback to previous version"
            echo "  logs     - Show PM2 logs"
            echo "  status   - Show PM2 and system status"
            echo "  health   - Perform health check"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
