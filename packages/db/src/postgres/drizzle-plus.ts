// drizzle-plus extends Drizzle's relational query builder through side-effect imports.
// Keep these imports centralized so every @repo/db consumer gets the same PostgreSQL extensions.
import 'drizzle-plus/pg/$cursor'
import 'drizzle-plus/pg/count'
import 'drizzle-plus/pg/create'
import 'drizzle-plus/pg/findManyAndCount'
import 'drizzle-plus/pg/findUnique'
import 'drizzle-plus/pg/updateMany'
import 'drizzle-plus/pg/upsert'
