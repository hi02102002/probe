import type { ContractInputs } from '@repo/api-contracts'
import type { inferParserType } from 'nuqs'
import type { InspectorTab } from '../_types'
import {
  createStandardSchemaV1,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs'

export type RequestMethod = NonNullable<ContractInputs['request']['list']['query']['method']>

export const REQUEST_METHODS: readonly RequestMethod[] = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
]

export const INSPECTOR_TABS: readonly InspectorTab[] = [
  'body',
  'headers',
  'query',
  'response',
]

export const requestSearchParams = {
  method: parseAsStringEnum<RequestMethod>([...REQUEST_METHODS]).withOptions({
    clearOnDefault: true,
  }),
  query: parseAsString.withDefault('').withOptions({
    clearOnDefault: true,
    throttleMs: 300,
  }),
  requestId: parseAsString.withOptions({
    clearOnDefault: true,
  }),
  tab: parseAsStringEnum<InspectorTab>([...INSPECTOR_TABS]).withDefault('body').withOptions({
    clearOnDefault: true,
  }),
}

export const requestSearchSchema = createStandardSchemaV1(requestSearchParams, {
  partialOutput: true,
})

export type RequestSearchParams = {
  [K in keyof typeof requestSearchParams]: inferParserType<(typeof requestSearchParams)[K]>
}
