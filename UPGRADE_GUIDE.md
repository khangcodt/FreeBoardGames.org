# FreeBoardGames.org - Modernization Upgrade Guide

This guide covers the major updates made to modernize FreeBoardGames.org to run on Node v24 with current, maintained dependencies.

## Major Changes

### Node.js Version
- **Before**: Node 14.13.0
- **After**: Node 24.12.0

### Web Application (web/)

#### Framework Updates
- **Next.js**: 9.5.5 → 14.2.25
- **React**: 16.14.0 → 18.3.1
- **React DOM**: 16.14.0 → 18.3.1

#### UI Library
- **Material-UI v4** → **MUI v6**
  - `@material-ui/core` → `@mui/material`
  - `@material-ui/icons` → `@mui/icons-material`
  - `@material-ui/lab` → `@mui/lab`

#### State Management & Data Fetching
- **Apollo Client**: Old apollo-boost packages → `@apollo/client@3.11.11`
- **Redux**: 4.0.0 → 5.0.1
- **React-Redux**: 8.0.1 → 9.2.0

#### Other Key Updates
- **TypeScript**: 4.5.2 → 5.7.2
- **Webpack**: 4.44.2 → 5.97.1
- **Jest**: 26.5.3 → 29.7.0
- **ESLint**: 7.11.0 → 9.17.0
- **Storybook**: 6.x → 8.4.7
- **GraphQL**: 15.3.0 → 16.9.0
- **Socket.io**: Mixed versions → 4.8.1
- **Three.js**: 0.139.2 → 0.171.0
- **Redis Client**: 3.1.2 → 4.7.0

### Backend (fbg-server/)

#### Framework Updates
- **NestJS**: 8.4.7 → 10.4.15
- **TypeScript**: 4.9.5 → 5.7.2
- **Jest**: 27.5.1 → 29.7.0
- **ESLint**: 8.56.0 → 9.17.0

#### Dependencies
- **GraphQL**: 16.8.1 → 16.9.0
- **IORedis**: 5.3.2 → 5.4.2
- **PostgreSQL**: 8.11.3 → 8.13.1
- **Webpack**: 5.90.1 → 5.97.1

### Docker
- **Base Image**: `node:16.14-alpine3.14` → `node:24.12.0-alpine3.21`

## Breaking Changes & Migration Steps

### 1. React 18 Changes

React 18 introduces automatic batching and new APIs. You may need to:

```typescript
// Old (React 16)
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));

// New (React 18)
import ReactDOM from 'react-dom/client';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

### 2. Material-UI to MUI Migration

Component imports need updating:

```typescript
// Old
import { Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

// New
import { Button } from '@mui/material';
import { Alert } from '@mui/lab';
```

Theme structure has changed - check MUI v5 migration guide.

### 3. Next.js 14 Changes

- Image component now uses `next/image` with different API
- `next.config.js` may need updates for new features
- App directory is available but not required (we're still using pages)
- Built-in TypeScript plugin support

### 4. Apollo Client Migration

```typescript
// Old
import { ApolloProvider } from '@apollo/react-hooks';
import { useQuery } from '@apollo/react-hooks';

// New
import { ApolloProvider, useQuery } from '@apollo/client';
```

### 5. Node.js 24 Considerations

- Native fetch is available (no need for node-fetch in many cases)
- Better ESM support
- Performance improvements
- Updated crypto APIs

### 6. Redis Client v4

The API has changed significantly:

```typescript
// Old (v3)
client.get('key', (err, value) => {});

// New (v4) - Promise-based
const value = await client.get('key');
```

## Installation & Setup

### Prerequisites

1. **Install Node 24.12.0**:
   ```bash
   nvm install 24.12.0
   nvm use 24.12.0
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

### Local Development

Run the development environment:
```bash
yarn run dev
```

This will start:
- Web server on http://localhost:3000
- Backend API on http://localhost:3001
- Board Game IO server on http://localhost:8001

### Docker Deployment

1. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Build and run with Docker Compose**:
   ```bash
   # Build the fbg-common image first
   docker build -t fbg-common:latest ./common
   
   # Start all services
   docker-compose up -d
   ```

3. **View logs**:
   ```bash
   docker-compose logs -f
   ```

4. **Stop services**:
   ```bash
   docker-compose down
   ```

## Services

The application consists of:

- **Web (Port 3000)**: Next.js frontend
- **BGIO (Port 8001)**: Board Game IO game server
- **Backend (Port 3001)**: NestJS GraphQL API
- **PostgreSQL (Port 5432)**: Database
- **Redis (Port 6379)**: Pub/sub and caching

## Known Issues & TODO

1. **Code Updates Needed**:
   - Apollo Client usage needs to be updated throughout the codebase
   - Material-UI components need migration to MUI syntax
   - Redux Toolkit could be adopted for better DX
   - Image optimization code may need updates for Next.js 14

2. **Testing**:
   - Jest configuration may need updates for all tests to pass
   - E2E tests may need Puppeteer updates
   - Storybook stories may need updates

3. **Build Configuration**:
   - Webpack 5 may have breaking changes in custom configs
   - ESLint 9 has new flat config format (not yet adopted)
   - Babel configuration may need updates

## Rollback

If you need to rollback:

1. Revert to the commit before modernization
2. Switch to Node 14: `nvm use 14.13.0`
3. Run `yarn install`

## Resources

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [React 18 Upgrade Guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
- [MUI Migration Guide](https://mui.com/material-ui/migration/migration-v4/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Node.js 24 Release Notes](https://nodejs.org/en/blog/release/)

## Support

For issues or questions:
- Check the GitHub issue tracker
- Join the Discord community
- Review the documentation at FreeBoardGames.org/docs
