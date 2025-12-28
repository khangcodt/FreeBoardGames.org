# ==========================================
# Builder Stage - Build the application
# ==========================================
FROM node:24.12.0-alpine AS builder

# Install build dependencies for native modules (e.g., sqlite3)
RUN apk add --no-cache python3 py3-setuptools make g++

# Create non-root user for security
RUN addgroup -g 938 appuser && \
    adduser -h /appdata -S -u 997 -G appuser appuser && \
    rm /bin/su

USER appuser
WORKDIR /appdata

# Copy package files first for better layer caching
COPY --chown=appuser fbg-server/package.json fbg-server/yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean

# Copy common files needed for build
COPY --chown=appuser common/gql /common/
COPY --chown=appuser common/internal /internal/

# Copy build configuration
COPY --chown=appuser fbg-server/tsconfig.json \
                      fbg-server/tsconfig.build.json \
                      fbg-server/nest-cli.json ./

# Copy and build application source
COPY --chown=appuser fbg-server/src ./src/
RUN yarn run build

# ==========================================
# Production Stage - Minimal runtime image
# ==========================================
FROM node:24.12.0-alpine

# Install build dependencies for native modules (e.g., sqlite3)
RUN apk add --no-cache python3 py3-setuptools make g++

# Create non-root user for security
RUN addgroup -g 938 appuser && \
    adduser -h /appdata -S -u 997 -G appuser appuser && \
    rm /bin/su

USER appuser
WORKDIR /appdata

# Copy package files and install production-only dependencies
COPY --chown=appuser fbg-server/package.json fbg-server/yarn.lock ./
RUN yarn install --production --frozen-lockfile && yarn cache clean

# Copy built application from builder
COPY --chown=appuser --from=builder /appdata/dist ./dist/

# Copy common files needed at runtime
COPY --chown=appuser --from=builder /common /common/
COPY --chown=appuser --from=builder /internal /internal/

# Expose application port
EXPOSE 3001

# Start the application
CMD ["yarn", "run", "start:prod"]
