# Simplified fbg-server Dockerfile for FreeBoardGames.org
FROM node:24.12.0-alpine AS builder
RUN apk add --no-cache python3 py3-setuptools make g++
RUN addgroup -g 938 appuser && adduser -h /appdata -S -u 997 -G appuser appuser && rm /bin/su
USER appuser
WORKDIR /appdata

# Install and cache app dependencies
COPY --chown=appuser fbg-server/package.json fbg-server/yarn.lock /appdata/
RUN yarn install && yarn cache clean

# Copy configuration files
COPY --chown=appuser fbg-server/tsconfig.json fbg-server/tsconfig.build.json fbg-server/nest-cli.json /appdata/

# Copy common files (previously from fbg-common image)
COPY --chown=appuser common/gql /common/
COPY --chown=appuser common/internal /internal/

# Build application
COPY --chown=appuser fbg-server/src /appdata/src/
RUN yarn run build

# Final production image
FROM node:24.12.0-alpine
RUN addgroup -g 938 appuser && adduser -h /appdata -S -u 997 -G appuser appuser && rm /bin/su
USER appuser
WORKDIR /appdata

# Copy package files and pre-built node_modules from builder (avoids rebuilding native modules)
COPY --chown=appuser fbg-server/package.json fbg-server/yarn.lock /appdata/
COPY --chown=appuser --from=builder /appdata/node_modules /appdata/node_modules/

COPY --chown=appuser fbg-server/tsconfig.json fbg-server/tsconfig.build.json fbg-server/nest-cli.json /appdata/
COPY --chown=appuser --from=builder /appdata/dist /appdata/dist/

# Internal configs for FreeBoardGames.org
COPY --chown=appuser --from=builder /internal /internal/
COPY --chown=appuser --from=builder /common /common/

# Run
CMD yarn run start:prod
