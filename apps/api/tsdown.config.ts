import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/migrate.ts'],
  dts: false,
  fixedExtension: false,
  platform: 'node',
  sourcemap: true,
})
