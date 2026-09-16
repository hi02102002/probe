import { EntriesTable } from '../entries-table'

interface HeadersTabProps {
  readonly headers: readonly (readonly [string, string])[]
}

export function HeadersTab({ headers }: HeadersTabProps) {
  return <EntriesTable empty="No request headers captured." entries={headers} />
}
