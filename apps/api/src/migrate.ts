import process from 'node:process'
import { runMigrations } from '@repo/db/migrate'

function main() {
  runMigrations()
    .then(() => {
      process.exit(0)
    })
    .catch((error) => {
      console.error('Migration failed:', error)
      process.exit(1)
    })
}

main()
