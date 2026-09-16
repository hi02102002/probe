import { useMemo } from 'react'
import { CopyButton } from '@/components/ui/copy-button'
import { detectLanguage, highlighter } from '@/lib/highlighter'
import { formatCapturedValue } from '../../_utils/request-utils'

interface CapturedBlockProps {
  readonly label: string
  readonly value: unknown
}

export function CapturedBlock({ label, value }: CapturedBlockProps) {
  const text = value === null || value === undefined ? 'Not captured' : formatCapturedValue(value)
  const isAvailable = value !== null && value !== undefined

  const lang = useMemo(() => detectLanguage(text, label), [text, label])

  const highlightedHtml = useMemo(() => {
    if (!isAvailable) {
      return null
    }

    return highlighter.highlight(text, {
      lang,
      lineNumbers: true,
    }).html
  }, [isAvailable, lang, text])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-muted-foreground text-xs">
        <span className="font-medium">{label}</span>
        {isAvailable && <CopyButton size="xs" text={text} variant="ghost" />}
      </div>
      {highlightedHtml
        ? (
            <div
              className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed"
              // eslint-disable-next-line react/dom-no-dangerously-set-innerhtml
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          )
        : (
            <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-muted/40 p-4 font-mono text-muted-foreground text-xs leading-relaxed">
              {text}
            </pre>
          )}
    </div>
  )
}
