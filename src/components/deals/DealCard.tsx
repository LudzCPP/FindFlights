import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { FlightModal } from '@/components/flights/FlightModal'
import { formatPrice } from '@/lib/utils'
import { MOCK_FLIGHTS } from '@/data/mockData'
import type { Deal } from '@/types'

// Stagger item variant — initial/animate inherited from parent DealsGrid container
const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.35 } },
}

interface DealCardProps {
  deal: Deal
}

export function DealCard({ deal }: DealCardProps) {
  const [modalOpen, setModalOpen] = useState(false)

  const relatedFlight =
    MOCK_FLIGHTS.find(
      (f) => f.origin.code === deal.origin.code && f.destination.code === deal.destination.code,
    ) ?? MOCK_FLIGHTS[0]

  return (
    <>
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -6, transition: { duration: 0.15 } }}
        whileTap={{ scale: 0.97 }}
        className="group relative overflow-hidden rounded-2xl border border-border bg-surface cursor-pointer hover:border-zinc-600 hover:shadow-glass transition-colors duration-200"
        onClick={() => setModalOpen(true)}
      >
        {/* Gradient header */}
        <div className={`relative h-28 bg-gradient-to-br ${deal.imageGradient} overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-white drop-shadow">
                {deal.origin.flag} → {deal.destination.flag}
              </p>
              <p className="text-xs text-white/80">
                {deal.origin.city} → {deal.destination.city}
              </p>
            </div>
            <Badge variant={deal.isHot ? 'hot' : 'emerald'} className="shadow-sm shrink-0">
              {deal.dealBadgeIcon} {deal.dealBadge}
            </Badge>
          </div>
        </div>

        {/* Card body */}
        <div className="p-4 space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-zinc-500 line-through">{formatPrice(deal.originalPrice)}</p>
              <p className="text-2xl font-bold text-white">{formatPrice(deal.price)}</p>
              <p className="text-xs text-zinc-500">
                {deal.tripType === 'round-trip' ? 'w obie strony' : 'w jedną stronę'}
                {deal.durationDays ? ` · ${deal.durationDays} dni` : ''}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold px-2.5 py-1">
                -{deal.discountPercent}%
              </span>
              {deal.isPriceDrop && (
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                  <TrendingDown className="h-3 w-3" />
                  <span>-{formatPrice(deal.priceDropPln)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {deal.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-surface-2 border border-border text-zinc-500 text-xs px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="flex items-center gap-1 text-xs text-cyan-400 group-hover:gap-2 transition-all duration-150">
              Sprawdź <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </motion.div>

      <FlightModal
        flight={relatedFlight}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}
