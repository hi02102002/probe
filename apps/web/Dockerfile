FROM node:22-slim AS base

WORKDIR /app

ENV PATH="/app/node_modules/.bin:$PATH"

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

FROM base AS prepare

COPY . .
RUN pnpm dlx turbo@2.10.12 prune @repo/web --docker

FROM base AS installer

COPY --from=prepare /app/out/json/ ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prod=false

FROM base AS builder

ARG SERVER_URL
ARG WEB_URL

COPY --from=prepare /app/out/full/ ./
COPY --from=installer /app/ ./

RUN SERVER_URL="$SERVER_URL" \
    WEB_URL="$WEB_URL" \
    ./node_modules/.bin/turbo run build --filter=@repo/web

FROM node:22-slim AS runner

ENV HOST=0.0.0.0
ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY --from=builder --chown=node:node /app/apps/web/.output ./

USER node

EXPOSE 3000

CMD ["node", "server/index.mjs"]
