# FreeBoardGames.org - Docker Setup Guide

This guide provides simple instructions for running FreeBoardGames.org with Docker Compose.

## Prerequisites

- Docker Engine 20.10+ 
- Docker Compose v2.0+
- Git (to clone the repository)

## Quick Start (Development)

For local development and testing:

```bash
# Clone the repository (if you haven't already)
git clone https://github.com/freeboardgames/FreeBoardGames.org
cd FreeBoardGames.org

# Build and start all services
docker-compose up --build

# Access the application
# Web: http://localhost:3000
# API: http://localhost:3001
# Game Server: http://localhost:8001
```

That's it! The application will be running with all games included.

### Stopping the Services

```bash
# Stop services (keeps data)
docker-compose down

# Stop services and remove volumes (clears database)
docker-compose down -v
```

## Production Deployment

For production deployment with automatic SSL/HTTPS:

### 1. Configure Your Domain

First, point your domain's DNS A record to your server's IP address:
- `example.com` → Your Server IP
- `traefik.example.com` → Your Server IP (for Traefik dashboard, optional)

### 2. Update Environment Variables

Edit the `.env` file with your production values:

```bash
# Generate a secure JWT secret
openssl rand -base64 32

# Generate Traefik dashboard password
echo $(htpasswd -nb admin yourpassword) | sed -e s/\\$/\\$\\$/g
```

Then update `.env`:
```bash
# Database
POSTGRES_PASSWORD=your-secure-password-here

# Security
JWT_SECRET=your-generated-secret-here

# Domain Configuration
DOMAIN=yourdomain.com
ACME_EMAIL=youremail@example.com

# Traefik Dashboard
TRAEFIK_DASHBOARD_AUTH=admin:$$apr1$$generated$$hashhere
```

### 3. Deploy

```bash
# Build and start all services with SSL
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check status
docker-compose -f docker-compose.prod.yml ps
```

### 4. Access Your Site

After a few moments for SSL certificate generation:
- **Website**: https://yourdomain.com
- **Traefik Dashboard**: https://traefik.yourdomain.com (use credentials from .env)

The first time, Traefik will automatically obtain an SSL certificate from Let's Encrypt. This may take 1-2 minutes.

## Architecture

The setup includes these services:

### Development (`docker-compose.yml`)
- **postgres**: PostgreSQL database for user data and game rooms
- **redis**: Redis cache for sessions
- **fbg-server**: NestJS backend API
- **web**: Next.js frontend application
- **bgio**: boardgame.io game server

### Production (`docker-compose.prod.yml`)
Same services as development, plus:
- **traefik**: Reverse proxy with automatic SSL/HTTPS via Let's Encrypt

## Common Tasks

### View Logs

```bash
# Development
docker-compose logs -f [service-name]

# Production
docker-compose -f docker-compose.prod.yml logs -f [service-name]
```

### Rebuild After Code Changes

```bash
# Development
docker-compose up --build

# Production
docker-compose -f docker-compose.prod.yml up -d --build
```

### Database Backup

```bash
# Backup
docker-compose exec postgres pg_dump -U fbg freeboardgames > backup.sql

# Restore
docker-compose exec -T postgres psql -U fbg freeboardgames < backup.sql
```

### Access Database Shell

```bash
docker-compose exec postgres psql -U fbg freeboardgames
```

### Clean Rebuild (removes all data)

```bash
# Development
docker-compose down -v
docker-compose up --build

# Production
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d --build
```

## Troubleshooting

### Port Already in Use

If you get an error about ports already in use, either stop the conflicting service or modify the port mappings in docker-compose.yml:

```yaml
ports:
  - "8080:3000"  # Change 3000 to 8080 for external access
```

### SSL Certificate Issues

If SSL certificates fail to generate:

1. Ensure your domain points to your server
2. Ensure ports 80 and 443 are accessible from the internet
3. Check Traefik logs: `docker-compose -f docker-compose.prod.yml logs traefik`
4. For testing, uncomment the staging CA server line in `docker-compose.prod.yml` to avoid rate limits

### Build Failures

If the build fails:

1. Ensure you have enough disk space (builds need ~5GB)
2. Check Docker logs for specific errors
3. Try cleaning Docker cache: `docker system prune -a`

### Game Not Loading

The games are built into the Docker images during the build process. If games aren't loading:

1. Ensure the full repository was cloned (including `web/src/games/`)
2. Rebuild the images: `docker-compose up --build`
3. Check web service logs for errors

## Performance Tips

### For Production

1. **Use `--build` only when needed** - after code changes, not on every restart
2. **Monitor resources**: `docker stats`
3. **Regular backups**: Set up automated database backups
4. **Update images periodically**: Pull latest Node.js base images

### Resource Limits

To limit resource usage, add to your service definitions:

```yaml
services:
  web:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
```

## Development vs Production

| Feature | Development | Production |
|---------|-------------|------------|
| SSL/HTTPS | ❌ No | ✅ Yes (automatic) |
| Exposed Ports | All services | Only 80, 443 |
| Reverse Proxy | ❌ No | ✅ Traefik |
| Auto-restart | ❌ No | ✅ Yes |
| Certificate Renewal | N/A | ✅ Automatic |

## Next Steps

- Review and customize `.env` for your needs
- Set up automated backups for production
- Configure monitoring (Prometheus/Grafana)
- Review Traefik dashboard for traffic insights

## Need Help?

- Check the [main README](README.md) for project information
- Visit the [issue tracker](https://github.com/freeboardgames/FreeBoardGames.org/issues)
- Join the [Discord community](https://discord.gg/AaE6n3n)
