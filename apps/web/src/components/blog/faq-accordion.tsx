import type { ReactNode } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/cn'

export interface FaqGroupProps {
  children: ReactNode
  className?: string
}

export function FaqGroup({ children, className }: FaqGroupProps) {
  return (
    <div className={cn('not-prose my-8', className)}>
      <Accordion className="divide-y divide-border border-y border-border">
        {children}
      </Accordion>
    </div>
  )
}

export interface FaqItemProps {
  children: ReactNode
  question: string
  value?: string
}

export function FaqItem({ children, question, value }: FaqItemProps) {
  const itemValue = value ?? question.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return (
    <AccordionItem value={itemValue}>
      <AccordionTrigger className="text-left font-medium text-base text-foreground sm:text-lg hover:text-accent-foreground">
        {question}
      </AccordionTrigger>
      <AccordionContent className="text-sm leading-relaxed text-muted-foreground sm:text-base">
        <div className="pt-2 text-sm leading-relaxed sm:text-base [&>p]:m-0">
          {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
