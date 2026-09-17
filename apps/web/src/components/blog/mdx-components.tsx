import type { ComponentProps } from 'react'
import { FaqGroup, FaqItem } from '@/components/blog/faq-accordion'
import { KeyTakeaways } from '@/components/blog/key-takeaways'
import { MdxPre } from '@/components/blog/mdx-pre'
import { ProbeCallout } from '@/components/blog/probe-callout'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { CodeBlock } from '@/components/ui/code-block'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/cn'

export const mdxComponents = {
  h1: () => null,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  CodeBlock,
  FaqGroup,
  FaqItem,
  KeyTakeaways,
  ProbeCallout,
  Callout: ProbeCallout,
  pre: MdxPre,
  blockquote: ({ children, className, ...props }: ComponentProps<'blockquote'>) => (
    <blockquote
      className={cn(
        'my-6 border-l-2 border-primary/50 pl-4 italic text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: () => <Separator className="my-10" />,
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  table: ({ children, className, ...props }: ComponentProps<'table'>) => (
    <div className="not-prose my-8">
      <Table variant="card" className={className} {...props}>
        {children}
      </Table>
    </div>
  ),
  thead: TableHeader,
  tbody: TableBody,
  tfoot: TableFooter,
  tr: TableRow,
  th: ({ className, ...props }: ComponentProps<'th'>) => (
    <TableHead
      className={cn(
        'text-xs font-semibold text-foreground',
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: ComponentProps<'td'>) => (
    <TableCell
      className={cn(
        'text-xs leading-relaxed text-muted-foreground',
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: ComponentProps<'a'>) => (
    <a
      className={cn(
        'font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground',
        className,
      )}
      {...props}
    />
  ),
}
