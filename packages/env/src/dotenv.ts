import type { DotenvConfigOptions } from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'

/**
 * Locate the workspace root directory by looking for `pnpm-workspace.yaml` or `turbo.json`.
 */
export function findWorkspaceRoot(startDir = process.cwd()): string {
  let current = startDir

  while (true) {
    if (
      fs.existsSync(path.join(current, 'pnpm-workspace.yaml'))
      || fs.existsSync(path.join(current, 'turbo.json'))
    ) {
      return current
    }

    const parent = path.dirname(current)
    if (parent === current) {
      break
    }

    current = parent
  }

  // Fallback to relative path from import.meta.url
  return fileURLToPath(new URL('../../../', import.meta.url))
}

/**
 * Return existing .env paths ordered from highest to lowest priority.
 */
export function getEnvPaths(rootDir?: string): string[] {
  const root = rootDir ?? findWorkspaceRoot()

  return [
    path.join(root, '.env.local'),
    path.join(root, '.env'),
    path.join(root, 'apps/api/.env.local'),
    path.join(root, 'apps/api/.env'),
    path.join(root, 'apps/web/.env.local'),
    path.join(root, 'apps/web/.env'),
  ].filter(p => fs.existsSync(p))
}

/**
 * Load environment variables into process.env from the root workspace and app paths.
 */
export function loadEnv(
  options: DotenvConfigOptions = {},
): Record<string, string | undefined> {
  const runtimeEnv = options.processEnv ?? process.env
  const paths = options.path
    ? (Array.isArray(options.path) ? options.path : [options.path])
    : getEnvPaths()

  for (const envPath of paths) {
    config({
      path: envPath,
      quiet: true,
      ...options,
      processEnv: runtimeEnv,
    })
  }

  return { ...runtimeEnv }
}

export type { DotenvConfigOptions } from 'dotenv'
