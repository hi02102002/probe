import { baseConfig } from './base.js'

/**
 * Create the shared React ESLint config.
 *
 * @param {Parameters<typeof baseConfig>[0]} options
 * @param {...Parameters<typeof baseConfig>[1]} configs
 */
export function reactConfig(options = {}, ...configs) {
  return baseConfig(
    {
      react: true,
      ...options,
    },
    ...configs,
  )
}

export default reactConfig
