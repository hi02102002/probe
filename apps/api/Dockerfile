FROM node:22-slim AS base

WORKDIR /app

ENV PATH="/app/node_modules/.bin:$PATH"

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

FROM base AS prepare

COPY . .
RUN pnpm dlx turbo@2.10.12 prune @repo/api --docker

FROM base AS installer

COPY --from=prepare /app/out/json/ ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prod=false

FROM base AS builder

COPY --from=prepare /app/out/full/ ./
COPY --from=installer /app/ ./

RUN --mount=type=cache,target=/app/.turbo \
    ./node_modules/.bin/turbo run build --filter=@repo/api
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm --ignore-scripts --filter=@repo/api deploy --prod /app/deploy

FROM node:22-slim AS runner

ENV NODE_ENV=production
ENV PORT=3001

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder --chown=node:node /app/deploy ./
COPY --from=builder --chown=node:node /app/packages/db/drizzle ./drizzle

USER node

EXPOSE 3001

CMD ["sh", "-c", "echo '[startup] Running database migrations...' && node dist/migrate.js && echo '[startup] Database migrations complete. Starting API...' && exec node dist/index.js"]
