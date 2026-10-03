import { os } from '#/orpc/os.js'
import { dashboardRouter } from './dashboard.router.js'
import { endpointRouter } from './endpoint.router.js'
import { forwardRouter } from './forward.router.js'
import { ingestRouter } from './ingest.router.js'
import { replayRouter } from './replay.router.js'
import { requestRouter } from './request.router.js'
import { ruleRouter } from './rule.router.js'
import { systemRouter } from './system.router.js'

export const router = os.router({
  dashboard: dashboardRouter,
  endpoint: endpointRouter,
  forward: forwardRouter,
  ingest: ingestRouter,
  replay: replayRouter,
  request: requestRouter,
  rule: ruleRouter,
  system: systemRouter,
})
