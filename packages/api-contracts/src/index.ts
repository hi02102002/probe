import type {
  InferContractRouterInputs,
  InferContractRouterOutputs,
} from '@orpc/contract'
import { endpointContract } from './endpoint.js'
import { forwardContract } from './forward.js'
import { ingestContract } from './ingest.js'
import { replayContract } from './replay.js'
import { requestContract } from './request.js'
import { ruleContract } from './rule.js'
import { systemContract } from './system.js'

export { endpointContract } from './endpoint.js'
export { forwardContract } from './forward.js'
export { ingestContract, type IngestEvent } from './ingest.js'
export { replayContract } from './replay.js'
export { requestContract } from './request.js'
export { ruleContract } from './rule.js'
export { systemContract } from './system.js'

export const contract = {
  endpoint: endpointContract,
  forward: forwardContract,
  ingest: ingestContract,
  replay: replayContract,
  request: requestContract,
  rule: ruleContract,
  system: systemContract,
}

export type Contract = typeof contract
export type ContractInputs = InferContractRouterInputs<Contract>
export type ContractOutputs = InferContractRouterOutputs<Contract>
