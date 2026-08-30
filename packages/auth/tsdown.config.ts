import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/**/*.ts'],
  dts: true,
  fixedExtension: false,
  platform: 'neutral',
  sourcemap: true,
})
