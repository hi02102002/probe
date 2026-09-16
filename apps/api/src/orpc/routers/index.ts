import { os } from '#/orpc/os.js'
import { endpointRouter } from './endpoint.router.js'
import { ingestRouter } from './ingest.router.js'
import { requestRouter } from './request.router.js'
import { systemRouter } from './system.router.js'

export const router = os.router({
  endpoint: endpointRouter,
  ingest: ingestRouter,
  request: requestRouter,
  system: systemRouter,
})
