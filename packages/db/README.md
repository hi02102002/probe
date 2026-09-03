# @repo/db

PostgreSQL setup using Drizzle ORM v1 RC, `pg` (node-postgres), and `drizzle-plus`.

The package uses Drizzle Relational Queries v2 via `defineRelations()` and passes `relations` to the database instance. Add application tables to `src/postgres/schema.ts` and extend `src/postgres/relations.ts` as the product grows.

## drizzle-plus

`drizzle-plus` is initialized once inside `@repo/db`. Consumers do not need to repeat its side-effect imports.

Enabled PostgreSQL relational-query extensions:

- `count()`
- `create()`
- `findUnique()`
- `findManyAndCount()`
- `$cursor()`
- `updateMany()`
- `upsert()`

Example:

```ts
const page = await db.query.user.findManyAndCount({
  orderBy: { createdAt: 'desc' },
  limit: 20,
  offset: 0,
})

const user = await db.query.user.findUnique({
  where: { email: 'hello@example.com' },
})
```

Shared SQL helpers are re-exported from `@repo/db/plus`:

```ts
import { pg, upper } from '@repo/db/plus'

const query = db.query.user.findMany({
  extras: {
    upperName: user => upper(user.name),
  },
})

// PostgreSQL-only helpers are available through `pg`, for example pg.jsonAgg.
```

If a new drizzle-plus extension is needed later, add its PostgreSQL side-effect import to `src/postgres/drizzle-plus.ts` so the setup stays centralized.

## Commands

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:push
pnpm db:studio
```

`drizzle-kit up` is only needed when converting an existing pre-v1 migration folder. This starter has no legacy migration history yet, so there is nothing to convert.
