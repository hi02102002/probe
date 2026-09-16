import { EntriesTable } from '../entries-table'

interface QueryTabProps {
  readonly query: readonly (readonly [string, string])[]
}

export function QueryTab({ query }: QueryTabProps) {
  return <EntriesTable empty="No query parameters in this request." entries={query} />
}
