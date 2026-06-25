import { cn } from '@/lib/utils'
import type { DealRating } from '@/types'

const CONFIG: Record<DealRating, { label: string; color: string; bg: string; width: string }> = {
  super:      { label: 'Super okazja',  color: 'text-emerald-400', bg: 'bg-emerald-400', width: 'w-[95%]' },
  good:       { label: 'Dobra cena',    color: 'text-cyan-400',    bg: 'bg-cyan-400',    width: 'w-[70%]' },
  average:    { label: 'Średnia cena',  color: 'text-amber-400',   bg: 'bg-amber-400',   width: 'w-[45%]' },
  overpriced: { label: 'Drogi lot',     color: 'text-rose-400',    bg: 'bg-rose-400',    width: 'w-[20%]' },
}

interface DealMeterProps {
  rating: DealRating
  className?: string
}

export function DealMeter({ rating, className }: DealMeterProps) {
  const cfg = CONFIG[rating]
  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between">
        <span className={cn('text-xs font-medium', cfg.color)}>{cfg.label}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-surface-3 overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700', cfg.bg, cfg.width)}
        />
      </div>
    </div>
  )
}
