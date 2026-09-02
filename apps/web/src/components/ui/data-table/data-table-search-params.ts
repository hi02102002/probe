import type { inferParserType } from 'nuqs'
import {
  createStandardSchemaV1,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs'

export const dataTableSearchParams = {
  page: parseAsInteger.withDefault(1).withOptions({
    clearOnDefault: true,
  }),
  limit: parseAsInteger.withDefault(10).withOptions({
    clearOnDefault: true,
  }),
  sortBy: parseAsString.withOptions({
    clearOnDefault: true,
  }),
  sortOrder: parseAsStringEnum(['asc', 'desc'] as const).withDefault('asc').withOptions({
    clearOnDefault: true,
  }),
}

export const dataTableSearchSchema = createStandardSchemaV1(
  dataTableSearchParams,
  {
    partialOutput: true,
  },
)

export type DataTableSearchParams = {
  [K in keyof typeof dataTableSearchParams]: inferParserType<(typeof dataTableSearchParams)[K]>
}
