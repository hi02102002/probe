import { reactConfig } from '@repo/eslint-config/react'
import { plugin as shadcn } from '@shadcn/lint'

export default reactConfig({
  ignores: [
    'README.md',
    'src/routeTree.gen.ts',
  ],
  plugins: {
    shadcn,
  },
}, {
  name: 'repo/web/react-refresh',
  files: ['src/**/*.tsx'],
  rules: {
    'react-refresh/only-export-components': ['error', {
      allowConstantExport: true,
      allowExportNames: ['getContext'],
    }],
  },
}, {
  name: 'repo/web/ui-registry',
  files: ['src/components/ui/**/*.tsx'],
  rules: {
    'react-refresh/only-export-components': 'off',
    'react/no-context-provider': 'off',
    'react/no-nested-component-definitions': 'off',
    'react/no-use-context': 'off',
    'react/use-state': 'off',
    'ts/no-use-before-define': 'off',
  },
}, {
  name: 'repo/web/tanstack-routes',
  files: ['src/routes/**/*.tsx'],
  rules: {
    'react-refresh/only-export-components': 'off',
  },
})
