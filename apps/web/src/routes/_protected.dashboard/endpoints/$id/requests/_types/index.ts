import type { ContractOutputs } from '@repo/api-contracts'

export type InspectorTab = 'body' | 'headers' | 'query' | 'response'

export type RequestSummary = ContractOutputs['request']['list']['items'][number]

export type RequestDetail = ContractOutputs['request']['getById']

export interface ConnectionStatus {
  readonly label: string
  readonly tone: string
}
