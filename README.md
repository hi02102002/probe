# Probe starter

Clean monorepo starter extracted from the original source.

## Stack

- TanStack Start + React
- Hono API
- oRPC
- Better Auth 1.7
- Drizzle ORM v1 RC + Relational Queries v2 + drizzle-plus + PostgreSQL (`pg`)
- pnpm workspaces + Turborepo

## Apps

- `apps/web` - TanStack Start UI, auth pages, protected dashboard, SEO helpers
- `apps/api` - Hono API, Better Auth handler, oRPC handler

## Packages

- `packages/auth` - Better Auth 1.7 client/server factory
- `packages/db` - Drizzle schema, PostgreSQL client, drizzle-plus extensions, migrations
- `packages/api-contracts` - oRPC contracts
- `packages/env` - validated env helpers
- `packages/utils` - small shared utilities
- `packages/eslint-config` - shared ESLint config
- `packages/typescript-config` - shared TypeScript config

## drizzle-plus

The database package centrally enables PostgreSQL drizzle-plus query extensions, so consumers only import the database from `@repo/db`. Enabled by default: `count`, `create`, `findUnique`, `findManyAndCount`, `$cursor`, `updateMany`, and `upsert`. SQL helpers are available from `@repo/db/plus`.

## Local setup

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
docker compose up -d
pnpm install
pnpm db:push
pnpm dev
```

Web: http://localhost:3000
API: http://localhost:3001

## Drizzle v1 / Better Auth 1.7 note

This starter is already on Drizzle ORM v1 RC and Relational Queries v2. It has no legacy Drizzle migration history, so `drizzle-kit up` is not required for this repository.

For a fresh local database, `pnpm db:push` is enough. If you point this code at an existing Better Auth 1.6 database with account rows, do not apply the new account schema blindly; use the Better Auth 1.7 migration plan/apply flow first because v1.7 adds the required account `issuer` identity.
