# FreeBoardGames.org - Quick Start Guide

## Prerequisites

- **Node.js 24.12.0** (use `nvm use` to switch)
- **Yarn** (package manager)
- **Docker & Docker Compose** (for production deployment)

## Local Development Setup

### 1. Install Node.js 24

```bash
nvm install 24.12.0
nvm use 24.12.0
```

### 2. Install Dependencies

```bash
yarn install
```

This will install dependencies for:
- Root workspace
- `fbg-server/` (backend)
- `web/` (frontend)
- `misc/e2e/` (end-to-end tests)

### 3. Start Development Environment

```bash
yarn run dev
```

This starts:
- **Web server**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **BGIO server**: http://localhost:8001

### 4. Development Commands

```bash
# Run all tests
yarn run test

# Run linter
yarn run lint

# Auto-fix linting issues
yarn run fix

# Work on specific game (replace GAME_NAME)
yarn run dev GAME_NAME
yarn run test GAME_NAME
yarn run lint GAME_NAME
```

## Docker Deployment

### 1. Set Up Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and set your configuration
# IMPORTANT: Change POSTGRES_PASSWORD and JWT_SECRET!
nano .env
```

### 2. Build Common Image

```bash
docker build -t fbg-common:latest ./common
```

### 3. Start All Services

```bash
docker-compose up -d
```

This starts:
- **PostgreSQL** (port 5432) - Database
- **Redis** (port 6379) - Pub/sub and caching
- **Backend** (port 3001) - GraphQL API
- **BGIO** (port 8001) - Game server
- **Web** (port 3000) - Frontend application

### 4. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f web
docker-compose logs -f backend
```

### 5. Stop Services

```bash
docker-compose down

# Stop and remove volumes (WARNING: This deletes all data!)
docker-compose down -v
```

## Service URLs

When running locally:
- **Web**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **BGIO Server**: http://localhost:8001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Common Issues & Solutions

### Port Already in Use

If you see "port already in use" errors:

```bash
# Find process using the port (replace 3000 with your port)
lsof -i :3000

# Kill the process (replace PID)
kill -9 PID
```

### Node Version Mismatch

Make sure you're using Node 24:

```bash
node --version  # Should show v24.12.0
nvm use         # Automatically uses version from .nvmrc
```

### Dependencies Issues

If you encounter dependency errors:

```bash
# Clean and reinstall
rm -rf node_modules web/node_modules fbg-server/node_modules
rm yarn.lock web/yarn.lock fbg-server/yarn.lock
yarn install
```

### Docker Build Fails

Common issues:
1. **fbg-common not built**: Run `docker build -t fbg-common:latest ./common` first
2. **Out of disk space**: Run `docker system prune` to clean up
3. **Network issues**: Check your internet connection

## Next Steps

1. **Read the Upgrade Guide**: Check [UPGRADE_GUIDE.md](./UPGRADE_GUIDE.md) for breaking changes
2. **Update your code**: Material-UI → MUI, Apollo Client, React 18 changes
3. **Run tests**: Make sure everything works with `yarn run test`
4. **Check documentation**: Visit http://localhost:3000/docs (when running)

## Getting Help

- **Issues**: https://github.com/freeboardgames/FreeBoardGames.org/issues
- **Discord**: https://discord.gg/AaE6n3n
- **Documentation**: https://www.freeboardgames.org/docs/

## Development Tips

### Hot Reload

The development server supports hot reload. Changes to:
- React components → instant browser update
- Server code → automatic restart
- Games → automatic rebuild

### Environment Variables

Create a `.env` file in the root for local development:

```bash
# Example .env for local development
DATABASE_URL=postgres://fbg:changeme@localhost:5432/freeboardgames
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=local-development-secret
```

### Debugging

1. **Chrome DevTools**: Available in browser for frontend
2. **Node Inspector**: Use `--inspect` flag for backend debugging
3. **Console logs**: Check terminal output for server logs

## Production Checklist

Before deploying to production:

- [ ] Change `POSTGRES_PASSWORD` in `.env`
- [ ] Change `JWT_SECRET` in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper domain/SSL
- [ ] Set up database backups
- [ ] Configure logging/monitoring
- [ ] Review security settings
- [ ] Test Docker deployment locally first

---

Happy coding! 🎮
