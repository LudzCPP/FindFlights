import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
        emerald: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        amber: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        rose: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
        ghost: 'bg-surface-2 text-zinc-400 border border-border',
        hot: 'bg-gradient-to-r from-orange-500 to-rose-500 text-white border-0',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
