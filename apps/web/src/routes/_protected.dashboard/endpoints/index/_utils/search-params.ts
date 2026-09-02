import type { inferParserType } from 'nuqs'
import {
  createStandardSchemaV1,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs'
import { dataTableSearchParams } from '@/components/ui/data-table'

export const VALID_SORT_KEYS = ['name', 'createdAt', 'lastRequestAt'] as const

export type SortKey = (typeof VALID_SORT_KEYS)[number]

export const endpointSearchParams = {
  ...dataTableSearchParams,
  sortBy: parseAsStringEnum<SortKey>(VALID_SORT_KEYS as any).withOptions({
    clearOnDefault: true,
  }),
  query: parseAsString.withDefault('').withOptions({
    clearOnDefault: true,
    throttleMs: 300,
  }),
  status: parseAsStringEnum(['active', 'inactive', 'paused'] as const).withOptions({
    clearOnDefault: true,
  }),
}

export const endpointSearchSchema = createStandardSchemaV1(
  endpointSearchParams,
  {
    partialOutput: true,
  },
)

export type EndpointSearchParams = {
  [K in keyof typeof endpointSearchParams]: inferParserType<(typeof endpointSearchParams)[K]>
}
