import { CopyButton } from '@/components/ui/copy-button'

interface EntriesTableProps {
  readonly empty: string
  readonly entries: readonly (readonly [string, string])[]
}

export function EntriesTable({ empty, entries }: EntriesTableProps) {
  if (!entries.length) {
    return (
      <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground text-sm">
        {empty}
      </p>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full table-fixed text-left font-mono text-xs">
        <thead className="border-b border-border bg-muted/40 text-muted-foreground">
          <tr>
            <th className="w-2/5 px-4 py-2.5 font-medium">Key</th>
            <th className="px-4 py-2.5 font-medium">Value</th>
            <th className="w-10 px-2 py-2.5">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {entries.map(([key, value]) => (
            <tr className="hover:bg-muted/20" key={key}>
              <td className="break-words px-4 py-2.5 font-semibold text-primary">{key}</td>
              <td className="break-words px-4 py-2.5 text-foreground">{value}</td>
              <td className="px-2 py-2.5">
                <CopyButton size="icon-xs" text={value} variant="ghost" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
