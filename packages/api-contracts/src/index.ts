import type {
  InferContractRouterInputs,
  InferContractRouterOutputs,
} from '@orpc/contract'
import { systemContract } from './system.js'

export { systemContract } from './system.js'

export const contract = {
  system: systemContract,
}

export type Contract = typeof contract
export type ContractInputs = InferContractRouterInputs<Contract>
export type ContractOutputs = InferContractRouterOutputs<Contract>
