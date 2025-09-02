#!/bin/bash

# Setup script for separate domains configuration
# This script helps configure the video downloader with separate backend and frontend domains

set -e

echo "🚀 Video Downloader - Separate Domains Setup"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_info "Docker and Docker Compose are available."

# Prompt for domain configuration
echo ""
print_info "Domain Configuration"
echo "===================="

read -p "Enter your backend domain (default: backend.com): " BACKEND_DOMAIN
BACKEND_DOMAIN=${BACKEND_DOMAIN:-backend.com}

read -p "Enter your frontend domain (default: frontend.com): " FRONTEND_DOMAIN
FRONTEND_DOMAIN=${FRONTEND_DOMAIN:-frontend.com}

read -p "Environment type (development/production) [default: development]: " ENVIRONMENT
ENVIRONMENT=${ENVIRONMENT:-development}

# Create .env.domains file
print_info "Creating domain configuration file..."
cat > .env.domains << EOF
# Domain Configuration for Separate Backend/Frontend Setup
BACKEND_DOMAIN=${BACKEND_DOMAIN}
FRONTEND_DOMAIN=${FRONTEND_DOMAIN}
ENVIRONMENT=${ENVIRONMENT}

# Port Configuration
BACKEND_PORT=8080
FRONTEND_PORT=3000

# API URLs
REACT_APP_BACKEND_API_URL=http://${BACKEND_DOMAIN}:8080/api/v1
REACT_APP_BACKEND_ADMIN_URL=http://${BACKEND_DOMAIN}:8080/admin
REACT_APP_FRONTEND_URL=http://${FRONTEND_DOMAIN}:3000

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://${FRONTEND_DOMAIN}:3000,https://${FRONTEND_DOMAIN}
SANCTUM_STATEFUL_DOMAINS=${FRONTEND_DOMAIN}:3000,${FRONTEND_DOMAIN}
EOF

print_success "Domain configuration created in .env.domains"

# Update main .env file if it exists
if [ -f .env ]; then
    print_info "Updating main .env file with domain configuration..."
    
    # Backup existing .env
    cp .env .env.backup
    print_info "Backup created: .env.backup"
    
    # Update or add domain variables
    if grep -q "BACKEND_DOMAIN=" .env; then
        sed -i.tmp "s/BACKEND_DOMAIN=.*/BACKEND_DOMAIN=${BACKEND_DOMAIN}/" .env
    else
        echo "BACKEND_DOMAIN=${BACKEND_DOMAIN}" >> .env
    fi
    
    if grep -q "FRONTEND_DOMAIN=" .env; then
        sed -i.tmp "s/FRONTEND_DOMAIN=.*/FRONTEND_DOMAIN=${FRONTEND_DOMAIN}/" .env
    else
        echo "FRONTEND_DOMAIN=${FRONTEND_DOMAIN}" >> .env
    fi
    
    # Update CORS settings
    sed -i.tmp "s|CORS_ALLOWED_ORIGINS=.*|CORS_ALLOWED_ORIGINS=\"http://${FRONTEND_DOMAIN}:3000,http://localhost:3000,http://127.0.0.1:3000\"|" .env
    sed -i.tmp "s|SANCTUM_STATEFUL_DOMAINS=.*|SANCTUM_STATEFUL_DOMAINS=${FRONTEND_DOMAIN}:3000,localhost:3000,127.0.0.1:3000|" .env
    
    # Clean up temporary files
    rm -f .env.tmp
    
    print_success "Main .env file updated"
else
    print_warning ".env file not found. Please copy from .env.example and configure manually."
fi

# Add hosts entries for local development
if [ "$ENVIRONMENT" = "development" ]; then
    print_info "Setting up local hosts entries..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if ! grep -q "$BACKEND_DOMAIN" /etc/hosts; then
            echo "127.0.0.1 $BACKEND_DOMAIN" | sudo tee -a /etc/hosts
            print_success "Added $BACKEND_DOMAIN to /etc/hosts"
        fi
        
        if ! grep -q "$FRONTEND_DOMAIN" /etc/hosts; then
            echo "127.0.0.1 $FRONTEND_DOMAIN" | sudo tee -a /etc/hosts
            print_success "Added $FRONTEND_DOMAIN to /etc/hosts"
        fi
    else
        print_warning "Please manually add these entries to your /etc/hosts file:"
        echo "127.0.0.1 $BACKEND_DOMAIN"
        echo "127.0.0.1 $FRONTEND_DOMAIN"
    fi
fi

# Build and start services
echo ""
print_info "Building and starting services..."

if [ "$ENVIRONMENT" = "production" ]; then
    docker-compose -f docker-compose.prod.yml build
    docker-compose -f docker-compose.prod.yml up -d
else
    docker-compose build
    docker-compose up -d
fi

print_success "Services started successfully!"

# Display access information
echo ""
print_success "Setup Complete!"
echo "==============="
echo ""
print_info "Access URLs:"
if [ "$ENVIRONMENT" = "production" ]; then
    echo "  Frontend: https://$FRONTEND_DOMAIN"
    echo "  Backend Admin: https://$BACKEND_DOMAIN/admin"
    echo "  Backend API: https://$BACKEND_DOMAIN/api"
else
    echo "  Frontend: http://$FRONTEND_DOMAIN:3000"
    echo "  Backend Admin: http://$BACKEND_DOMAIN:8080/admin"
    echo "  Backend API: http://$BACKEND_DOMAIN:8080/api"
fi

echo ""
print_info "Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop services: docker-compose down"
echo "  Restart services: docker-compose restart"

echo ""
print_warning "Note: Make sure to configure your DNS or hosts file to point the domains to your server IP for production use."

print_success "Setup completed successfully! 🎉"
