import type { DotenvConfigOptions } from 'dotenv'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'

const workspaceRoot = new URL('../../../', import.meta.url)

const defaultEnvPaths = [
  fileURLToPath(new URL('apps/api/.env', workspaceRoot)),
  fileURLToPath(new URL('.env', workspaceRoot)),
]

export function loadEnv(
  options: DotenvConfigOptions = {},
): Record<string, string | undefined> {
  const runtimeEnv = options.processEnv ?? process.env

  config({
    path: defaultEnvPaths,
    quiet: true,
    ...options,
    processEnv: runtimeEnv,
  })

  return { ...runtimeEnv }
}

export type { DotenvConfigOptions } from 'dotenv'
