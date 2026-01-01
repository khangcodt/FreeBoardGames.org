# ==========================================
# Builder Stage - Build the application
# ==========================================
FROM node:24.12.0-alpine AS builder

# Install build tools needed for native dependencies (e.g., jimp and its transitive deps)
RUN apk add --no-cache \
    python3 \
    py3-setuptools \
    autoconf \
    automake \
    file \
    g++ \
    libtool \
    make \
    nasm \
    libpng-dev

# Create non-root user for security
RUN addgroup -g 938 appuser && \
    adduser -h /appdata -S -u 997 -G appuser appuser && \
    rm /bin/su

# Compute git hash for versioning (fallback to 'unknown' if git not available)
RUN git rev-parse --short HEAD > /tmp/git_rev 2>/dev/null || echo "unknown" > /tmp/git_rev

USER appuser
WORKDIR /appdata

# ==========================================
# Install Dependencies
# ==========================================
# Copy package files first for better layer caching
COPY --chown=appuser web/package.json web/yarn.lock ./web/
WORKDIR /appdata/web
# Network timeout is in milliseconds; 120000 ms = 2 minutes
RUN yarn install --frozen-lockfile --network-timeout 120000 && yarn cache clean

# ==========================================
# Code Generation Phase
# ==========================================
WORKDIR /appdata

# Copy CLI scripts for code generation (uses only Node.js built-ins)
COPY --chown=appuser cli ./cli/

# Copy game sources and config needed for game index generation
COPY --chown=appuser web/src/games ./web/src/games/
COPY --chown=appuser web/tsconfig.json ./web/

# Generate game index
RUN node -e "import('./cli/codegen/genGames.js').then(m => m.genGames())"

# ==========================================
# GraphQL Code Generation
# ==========================================
# Copy files needed for GraphQL codegen
COPY --chown=appuser web/codegen.ts ./web/
COPY --chown=appuser common/gql ./common/gql

# Run GraphQL codegen
WORKDIR /appdata/web
RUN yarn run apollo:codegen

# ==========================================
# Server Build Phase
# ==========================================
# Copy server files and configuration
COPY --chown=appuser web/server ./server/
COPY --chown=appuser web/tsconfig.server.json ./
COPY --chown=appuser web/webpack.server.config.js ./

# Copy common files needed for server build
COPY --chown=appuser common/gql /appdata/common/gql
COPY --chown=appuser common/internal /appdata/internal

# Build server
COPY --chown=appuser web/src ./src/
RUN yarn run build:server

# ==========================================
# Web Build Phase
# ==========================================
# Copy web configuration files
COPY --chown=appuser web/.babelrc \
                      web/next.config.js \
                      web/next-i18next.config.js \
                      web/.storybook \
                      ./

# Copy public assets and documentation
COPY --chown=appuser web/public ./public/
COPY --chown=appuser web/docs ./docs/

# Run i18n sync after public directory exists
RUN yarn run i18n:copy

# Build the Next.js application
ARG GIT_REV
RUN yarn run build

# ==========================================
# Production Stage - Minimal runtime image
# ==========================================
FROM node:24.12.0-alpine

# Install bash for docker_run.sh script and curl for health checks
RUN apk add --no-cache bash curl

# Create non-root user for security
RUN addgroup -g 938 appuser && \
    adduser -h /appdata -S -u 997 -G appuser appuser && \
    rm /bin/su

# Copy git revision from builder stage
COPY --from=builder /tmp/git_rev /tmp/git_rev

USER appuser
WORKDIR /appdata

# Copy package files and install production-only dependencies
COPY --chown=appuser web/package.json ./
# Network timeout is in milliseconds; 120000 ms = 2 minutes
RUN yarn install --production --network-timeout 120000 --frozen-lockfile && yarn cache clean

# Copy startup script
COPY --chown=appuser web/docker_run.sh ./

# Copy Next.js and i18n configuration files needed at runtime
COPY --chown=appuser --from=builder /appdata/web/next.config.js ./
COPY --chown=appuser --from=builder /appdata/web/next-i18next.config.js ./

# Copy built assets from builder stage
COPY --chown=appuser --from=builder /appdata/web/public ./public/
COPY --chown=appuser --from=builder /appdata/web/.next ./.next/
COPY --chown=appuser --from=builder /appdata/web/server ./server/

# Copy common files needed at runtime
COPY --chown=appuser --from=builder /appdata/internal /internal/
COPY --chown=appuser --from=builder /appdata/common /common/

# Expose application ports (3000 for web, 8001 for bgio)
EXPOSE 3000 8001

# Start the application (docker_run.sh handles WEB vs BGIO based on SERVER_TYPE env var)
CMD ["./docker_run.sh"]
