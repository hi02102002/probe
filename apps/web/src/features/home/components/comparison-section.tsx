import { useIntlayer } from 'react-intlayer'

export function ComparisonSection() {
  const content = useIntlayer('home')
  const rows = [
    [content.captureLabel, content.allTraffic, content.manualOnly, content.sampled, content.sampled],
    [content.payloadLabel, content.fullPayloads, content.rawText, content.limited, content.limited],
    [content.searchLabel, content.instantSearch, content.none, content.basic, content.advanced],
    [content.setupLabel, content.twoMinutes, content.manual, content.hours, content.days],
    [content.priceLabel, '$0', '$0', '$25+', '$99+'],
  ]
  const columnKeys = ['console', 'proxy', 'apm']

  return (
    <section id="compare" className="scroll-mt-24 border-b border-border">
      <div className="border-b border-border px-6 py-10 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-foreground">{content.compareEyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">{content.compareTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{content.compareDescription}</p>
      </div>
      <div className="overflow-x-auto" role="region" aria-label="Product comparison">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="w-44 px-6 py-5 text-left font-normal text-muted-foreground sm:px-10">{content.featureLabel}</th>
              <th className="bg-accent/40 px-5 py-5 text-left font-semibold text-accent-foreground">Probe</th>
              <th className="px-5 py-5 text-left font-medium text-muted-foreground">{content.consoleLogs}</th>
              <th className="px-5 py-5 text-left font-medium text-muted-foreground">{content.proxyTools}</th>
              <th className="px-5 py-5 text-left font-medium text-muted-foreground">{content.apmSuites}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map(row => (
              <tr key={String(row[0])}>
                <th className="px-6 py-4 text-left font-normal text-muted-foreground sm:px-10">{row[0]}</th>
                <td className="bg-accent/40 px-5 py-4 font-semibold text-accent-foreground">{row[1]}</td>
                {row.slice(2).map((cell, index) => (
                  <td key={columnKeys[index]} className="px-5 py-4 text-muted-foreground">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
