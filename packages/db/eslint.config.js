import { baseConfig } from '@repo/eslint-config'

export default baseConfig({
  ignores: [
    'drizzle/**',
    'src/postgres/auth-schema.ts',
  ],
})
