import { env } from '@/env/client'

export function getIngestUrl(token: string) {
  return `${env.VITE_API_URL}/api/e/${token}`
}
