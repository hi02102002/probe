import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/**/*.ts', 'src/**/*.tsx'],
  dts: true,
  fixedExtension: false,
  platform: 'node',
  sourcemap: true,
})
