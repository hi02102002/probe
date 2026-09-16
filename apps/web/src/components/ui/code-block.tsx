'use client'

import { CheckIcon, CopyIcon } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { detectLanguage, highlighter } from '@/lib/highlighter'

export interface CodeBlockProps {
  children: string
  className?: string
  language?: string
  lineNumbers?: boolean
  showCopy?: boolean
  showHeader?: boolean
}

export function CodeBlock({
  children,
  className,
  language,
  lineNumbers = false,
  showCopy = true,
  showHeader = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(resetTimeoutRef.current), [])

  const lang = language ?? detectLanguage(children)

  const highlightedHtml = useMemo(() => {
    return highlighter.highlight(children, {
      lang,
      lineNumbers,
    }).html
  }, [children, lang, lineNumbers])

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(children)
    }
    catch {
      return
    }

    setCopied(true)
    clearTimeout(resetTimeoutRef.current)
    resetTimeoutRef.current = setTimeout(setCopied, 2000, false)
  }

  return (
    <div className={cn('overflow-hidden rounded-lg border border-border bg-muted/40', className)}>
      {showHeader && (
        <div className="flex h-10 items-center justify-between border-b border-border px-3">
          <span className="font-mono text-muted-foreground text-xs uppercase">
            {lang}
          </span>
          {showCopy && (
            <Button
              aria-label={copied ? 'Code copied' : 'Copy code'}
              onClick={copyCode}
              size="xs"
              type="button"
              variant="ghost"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          )}
        </div>
      )}
      <div
        className="overflow-x-auto p-4 font-mono text-xs leading-relaxed"
        // eslint-disable-next-line react/dom-no-dangerously-set-innerhtml
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
    </div>
  )
}
