import antfu from '@antfu/eslint-config'

/**
 * Create the shared base ESLint config.
 *
 * @param {Parameters<typeof antfu>[0]} options
 * @param {...Parameters<typeof antfu>[1]} configs
 */
export function baseConfig(options = {}, ...configs) {
  return antfu(
    {
      ignores: [
        '**/.intlayer/**',
        ...(options.ignores ?? []),
      ],
      pnpm: false,
      typescript: true,
      ...options,
    },
    ...configs,
  )
}

export default baseConfig
