export const statusConfig = {
  active: {
    dotColor: 'bg-emerald-500',
    label: 'Active',
    variant: 'success' as const,
  },
  inactive: {
    dotColor: 'bg-muted-foreground/64',
    label: 'Inactive',
    variant: 'outline' as const,
  },
  paused: {
    dotColor: 'bg-amber-500',
    label: 'Paused',
    variant: 'warning' as const,
  },
} as const
