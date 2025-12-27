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
COPY --chown=appuser common/gql /common

# Run GraphQL and i18n codegen from web directory where node_modules binaries are available
WORKDIR /appdata/web
RUN yarn run apollo:codegen && yarn run i18n:copy

# Copy web configuration files
COPY --chown=appuser web/tsconfig.server.json web/webpack.server.config.js /appdata/web/

# Copy common files (previously from fbg-common image)
COPY --chown=appuser common/gql /common
COPY --chown=appuser common/internal /internal

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
COPY --chown=appuser --from=builder /internal /internal
COPY --chown=appuser --from=builder /common /common

# Run
CMD ./docker_run.sh
