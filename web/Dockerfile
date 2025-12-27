# Simplified web/bgio Dockerfile for FreeBoardGames.org
FROM node:24.12.0-alpine AS builder
RUN apk add --no-cache python3 py3-setuptools autoconf automake file g++ libtool make nasm libpng-dev libc6-compat
RUN addgroup -g 938 appuser && adduser -h /appdata -S -u 997 -G appuser appuser && rm /bin/su
USER appuser
WORKDIR /appdata

# Copy web dependencies and install them at /appdata/web (maintain structure for Next.js)
COPY --chown=appuser web/package.json web/yarn.lock /appdata/web/
WORKDIR /appdata/web
RUN yarn install && yarn cache clean

# Copy necessary files for codegen (CLI scripts now use only Node.js built-ins)
COPY --chown=appuser cli /appdata/cli/
COPY --chown=appuser web/src/games /appdata/web/src/games/
COPY --chown=appuser web/tsconfig.json /appdata/web/

# Run codegen to generate game index (only generates games, skip GraphQL/i18n for now)
WORKDIR /appdata
RUN node -e "import('./cli/codegen/genGames.js').then(m => m.genGames())"

# Copy files needed for GraphQL codegen
COPY --chown=appuser web/codegen.ts /appdata/web/
COPY --chown=appuser common/gql /appdata/common/gql

# Copy server files and config needed for i18n:copy script
COPY --chown=appuser web/server /appdata/web/server
COPY --chown=appuser web/tsconfig.server.json /appdata/web/

# Run GraphQL codegen from web directory where node_modules binaries are available
WORKDIR /appdata/web
RUN yarn run apollo:codegen

# Copy remaining web configuration files
COPY --chown=appuser web/webpack.server.config.js /appdata/web/

# Copy common files (previously from fbg-common image)
COPY --chown=appuser common/gql /appdata/common/gql
COPY --chown=appuser common/internal /appdata/internal

# Build server
COPY --chown=appuser web/src /appdata/web/src
COPY --chown=appuser web/server /appdata/web/server
WORKDIR /appdata/web
RUN yarn run build:server

# Build website
ARG GIT_REV
COPY --chown=appuser web/.babelrc web/next.config.js /appdata/web/
COPY --chown=appuser web/public /appdata/web/public/
COPY --chown=appuser web/.storybook /appdata/web/.storybook/
COPY --chown=appuser web/docs /appdata/web/docs/

# Run i18n:copy after public directory exists
RUN yarn run i18n:copy

RUN yarn run build

# Final production image
FROM node:24.12.0-alpine
RUN apk add --no-cache bash
RUN addgroup -g 938 appuser && adduser -h /appdata -S -u 997 -G appuser appuser && rm /bin/su
USER appuser
WORKDIR /appdata

# Copy package files and pre-built node_modules from builder (avoids rebuilding native modules)
COPY --chown=appuser web/package.json /appdata/
COPY --chown=appuser --from=builder /appdata/web/node_modules /appdata/node_modules/

COPY --chown=appuser web/docker_run.sh /appdata/
COPY --chown=appuser --from=builder /appdata/web/public /appdata/public
COPY --chown=appuser --from=builder /appdata/web/.next /appdata/.next
COPY --chown=appuser --from=builder /appdata/web/server /appdata/server

# Internal configs for FreeBoardGames.org
COPY --chown=appuser --from=builder /appdata/internal /internal
COPY --chown=appuser --from=builder /appdata/common /common

# Run
CMD ./docker_run.sh
