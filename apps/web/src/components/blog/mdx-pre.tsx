import type { ComponentProps } from 'react'
import { CheckIcon, CopyIcon } from '@phosphor-icons/react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/ui/code-block'
import { cn } from '@/lib/cn'
import { normalizeLanguage } from '@/lib/highlighter'

export interface MdxPreProps extends ComponentProps<'pre'> {
  'data-language'?: string
  'data-title'?: string
}

export function MdxPre({
  children,
  className,
  'data-language': dataLanguage,
  'data-title': dataTitle,
  ...props
}: MdxPreProps) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  const handleCopy = async () => {
    if (!preRef.current)
      return
    const text = preRef.current.textContent ?? ''
    try {
      await navigator.clipboard.writeText(text.trim())
      setCopied(true)
      setTimeout(setCopied, 2000, false)
    }
    catch {
      // ignore
    }
  }

  // Handle un-highlighted raw code child if present
  const firstChild = Array.isArray(children) ? children[0] : children
  const isCodeChild = firstChild && typeof firstChild === 'object' && 'props' in firstChild
  const codeProps = isCodeChild
    ? (firstChild as { props: Record<string, unknown> }).props
    : undefined
  const rawCode = codeProps && typeof codeProps.children === 'string'
    ? codeProps.children
    : undefined
  const codeClassName = (codeProps?.className as string) || ''
  const langMatch = /language-(\w+)/.exec(codeClassName)

  const rawLang = dataTitle || dataLanguage || (langMatch ? langMatch[1] : '')
  const displayLang = normalizeLanguage(rawLang)

  // If raw un-highlighted code is passed, use CodeBlock
  if (rawCode && !className?.includes('rehype-highlight')) {
    return (
      <CodeBlock
        className="not-prose my-6 border-border bg-code shadow-xs"
        language={displayLang}
        lineNumbers={false}
        showCopy
        showHeader
      >
        {rawCode.trim()}
      </CodeBlock>
    )
  }

  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border border-border bg-code shadow-xs">
      <div className="flex h-9 items-center justify-between border-b border-border/80 bg-muted/25 px-3.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {displayLang || 'text'}
        </span>
        <Button
          aria-label={copied ? 'Code copied' : 'Copy code'}
          className="h-6 gap-1 px-2 text-xs"
          onClick={handleCopy}
          size="xs"
          type="button"
          variant="ghost"
        >
          {copied ? <CheckIcon className="size-3.5 text-success" /> : <CopyIcon className="size-3.5" />}
          <span className="text-[11px] text-muted-foreground font-sans">
            {copied ? 'Copied' : 'Copy'}
          </span>
        </Button>
      </div>
      <pre
        ref={preRef}
        className={cn(
          'overflow-x-auto p-4 font-mono text-xs leading-relaxed text-foreground',
          className,
        )}
        data-language={dataLanguage}
        {...props}
      >
        {children}
      </pre>
    </div>
  )
}
