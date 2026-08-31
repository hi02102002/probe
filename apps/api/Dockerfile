FROM node:22-slim AS base

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

FROM base AS prepare

COPY . .
RUN pnpm dlx turbo@2.10.12 prune @repo/api --docker

FROM base AS builder

COPY --from=prepare /app/out/full/ ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

RUN pnpm turbo run build --filter=@repo/api
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm --ignore-scripts --filter=@repo/api deploy --prod --no-optional /app/deploy

FROM node:22-slim AS runner

ENV NODE_ENV=production
ENV PORT=3001

WORKDIR /app

COPY --from=builder --chown=node:node /app/deploy ./

USER node

EXPOSE 3001

CMD ["node", "dist/index.js"]
