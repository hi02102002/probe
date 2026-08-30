'use client'

import type { ReactNode } from 'react'
import { CheckIcon, CopyIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'

interface CodeBlockProps {
  children: string
  className?: string
  language?: string
}

function highlightHtml(code: string): ReactNode[] {
  const highlighted: ReactNode[] = []
  const tokenPattern = /(<\/?)([a-z][\w-]*)|([\w:-]+)(=)("[^"]*")|([\w:-]+)(?=\s|>)/gi
  let cursor = 0

  for (const match of code.matchAll(tokenPattern)) {
    const index = match.index

    if (index > cursor)
      highlighted.push(code.slice(cursor, index))

    if (match[1] && match[2]) {
      highlighted.push(
        <span key={`${index}-bracket`} className="text-muted-foreground">{match[1]}</span>,
        <span key={`${index}-tag`} className="text-sky-600 dark:text-sky-300">{match[2]}</span>,
      )
    }
    else if (match[3] && match[4] && match[5]) {
      highlighted.push(
        <span key={`${index}-attribute`} className="text-violet-600 dark:text-violet-300">{match[3]}</span>,
        <span key={`${index}-equals`} className="text-muted-foreground">{match[4]}</span>,
        <span key={`${index}-value`} className="text-emerald-600 dark:text-emerald-300">{match[5]}</span>,
      )
    }
    else {
      highlighted.push(
        <span key={`${index}-attribute`} className="text-violet-600 dark:text-violet-300">{match[6]}</span>,
      )
    }

    cursor = index + match[0].length
  }

  if (cursor < code.length)
    highlighted.push(code.slice(cursor))

  return highlighted
}

function highlightCode(code: string, language?: string): ReactNode {
  return language?.toLowerCase() === 'html' ? highlightHtml(code) : code
}

export function CodeBlock({ children, className, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(resetTimeoutRef.current), [])

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
    <div className={cn('overflow-hidden rounded-lg border bg-muted/40', className)}>
      <div className="flex h-10 items-center justify-between border-b px-3">
        <span className="font-mono text-muted-foreground text-xs uppercase">
          {language}
        </span>
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
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-6">
        <code>{highlightCode(children, language)}</code>
      </pre>
    </div>
  )
}
