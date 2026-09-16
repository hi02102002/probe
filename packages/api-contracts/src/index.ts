import type {
  InferContractRouterInputs,
  InferContractRouterOutputs,
} from '@orpc/contract'
import { endpointContract } from './endpoint.js'
import { ingestContract } from './ingest.js'
import { requestContract } from './request.js'
import { systemContract } from './system.js'

export { endpointContract } from './endpoint.js'
export { ingestContract, type IngestEvent } from './ingest.js'
export { requestContract } from './request.js'
export { systemContract } from './system.js'

export const contract = {
  endpoint: endpointContract,
  ingest: ingestContract,
  request: requestContract,
  system: systemContract,
}

export type Contract = typeof contract
export type ContractInputs = InferContractRouterInputs<Contract>
export type ContractOutputs = InferContractRouterOutputs<Contract>
