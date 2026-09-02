import type {
  InferContractRouterInputs,
  InferContractRouterOutputs,
} from '@orpc/contract'
import { endpointContract } from './endpoint.js'
import { systemContract } from './system.js'

export { endpointContract } from './endpoint.js'
export { systemContract } from './system.js'

export const contract = {
  endpoint: endpointContract,
  system: systemContract,
}

export type Contract = typeof contract
export type ContractInputs = InferContractRouterInputs<Contract>
export type ContractOutputs = InferContractRouterOutputs<Contract>
