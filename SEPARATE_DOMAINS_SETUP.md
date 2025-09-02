# Separate Domains Setup Guide

This guide explains how to set up the video downloader application with separate domains for backend and frontend.

## Architecture Overview

The new architecture separates the application into two distinct domains:

- **Backend Domain** (e.g., `backend.com:8080`): Serves Laravel admin panel and API
- **Frontend Domain** (e.g., `frontend.com:3000`): Serves React application

## Services Structure

### Development Environment (`docker-compose.yml`)
- `backend-nginx`: Nginx serving backend on port 8080
- `frontend-nginx`: Nginx serving frontend on port 3000
- `backend`: Laravel PHP-FPM container
- `frontend`: React build container
- `mysql`: Database service

### Production Environment (`docker-compose.prod.yml`)
- `backend-nginx`: Nginx serving backend on port 80
- `frontend-nginx`: Nginx serving frontend on port 8080
- `backend`: Laravel PHP-FPM container
- `frontend`: React build container
- `mysql`: Database service

## Setup Instructions

### 1. Environment Configuration

Copy the domain configuration template:
```bash
cp .env.domains.example .env.domains
```

Edit `.env.domains` with your actual domains:
```env
BACKEND_DOMAIN=your-backend-domain.com
FRONTEND_DOMAIN=your-frontend-domain.com
```

### 2. Update Main Environment File

Add these variables to your `.env` file:
```env
# Domain Configuration
BACKEND_DOMAIN=backend.com
FRONTEND_DOMAIN=frontend.com

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://frontend.com:3000,https://frontend.com
SANCTUM_STATEFUL_DOMAINS=frontend.com:3000,frontend.com

# Frontend API Configuration
REACT_APP_BACKEND_API_URL=http://backend.com:8080/api/v1
REACT_APP_BACKEND_ADMIN_URL=http://backend.com:8080/admin
```

### 3. DNS/Hosts Configuration

For local development, add entries to your `/etc/hosts` file:
```
127.0.0.1 backend.com
127.0.0.1 frontend.com
```

For production, configure your DNS to point:
- `backend.com` → Server IP:80
- `frontend.com` → Server IP:8080

### 4. Start Services

Development:
```bash
docker-compose up -d
```

Production:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Access URLs

### Development
- Frontend: http://frontend.com:3000
- Backend Admin: http://backend.com:8080/admin
- Backend API: http://backend.com:8080/api

### Production
- Frontend: https://frontend.com
- Backend Admin: https://backend.com/admin
- Backend API: https://backend.com/api

## SSL/HTTPS Configuration

For production with SSL, you'll need to:

1. Obtain SSL certificates for both domains
2. Update nginx configurations to include SSL settings
3. Modify docker-compose.prod.yml to mount certificates
4. Update environment variables to use HTTPS URLs

Example SSL nginx configuration additions:
```nginx
listen 443 ssl http2;
ssl_certificate /etc/ssl/certs/domain.crt;
ssl_certificate_key /etc/ssl/private/domain.key;
```

## Troubleshooting

### CORS Issues
If you encounter CORS errors:
1. Verify `CORS_ALLOWED_ORIGINS` includes your frontend domain
2. Check `SANCTUM_STATEFUL_DOMAINS` configuration
3. Ensure nginx CORS headers are properly configured

### Build Issues
If containers fail to build:
1. Clear Docker cache: `docker system prune -a`
2. Rebuild without cache: `docker-compose build --no-cache`
3. Check Dockerfile syntax and paths

### Network Issues
If services can't communicate:
1. Verify all services are on the same Docker network
2. Check service names in nginx configurations
3. Ensure ports are not conflicting

## Migration from Single Domain

To migrate from the previous single-domain setup:

1. Backup your current `.env` file
2. Update frontend API URLs in React components
3. Test thoroughly in development before production deployment
4. Update any hardcoded URLs in your application

## Monitoring and Logs

View logs for specific services:
```bash
# Backend logs
docker-compose logs -f backend-nginx backend

# Frontend logs  
docker-compose logs -f frontend-nginx frontend

# All services
docker-compose logs -f
```

## Performance Considerations

- Frontend static assets are cached for 1 year
- Backend API responses include appropriate cache headers
- Gzip compression is enabled for both domains
- Health checks are configured for all services
