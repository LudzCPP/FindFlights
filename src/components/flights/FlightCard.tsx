import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, Plane } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DealMeter } from './DealMeter'
import { FlightModal } from './FlightModal'
import { formatDuration, formatPrice, cn } from '@/lib/utils'
import type { Flight } from '@/types'

// Stagger item variant — initial/animate inherited from FlightResults container
export const flightItemVariants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

interface FlightCardProps {
  flight: Flight
}

export function FlightCard({ flight }: FlightCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const isSuperDeal = flight.dealRating === 'super'

  return (
    <>
      <motion.div
        variants={flightItemVariants}
        whileHover={{ y: -3, transition: { duration: 0.15 } }}
        whileTap={{ scale: 0.99 }}
        className={cn(
          'group relative rounded-2xl border bg-surface hover:border-zinc-600 hover:shadow-glass transition-colors duration-200',
          isSuperDeal ? 'border-emerald-500/30' : 'border-border',
        )}
      >
        {isSuperDeal && (
          <div className="absolute inset-0 rounded-2xl bg-emerald-500/3 pointer-events-none" />
        )}

        {/* Price drop banner */}
        {flight.priceDropPln > 0 && (
          <div className="flex items-center gap-1.5 rounded-t-2xl bg-gradient-to-r from-emerald-500/10 to-transparent border-b border-emerald-500/20 px-4 py-2">
            <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">
              Cena o {formatPrice(flight.priceDropPln)} niższa niż średnia z ostatnich 30 dni
            </span>
          </div>
        )}

        <div className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Airline */}
            <div className="flex items-center gap-3 sm:w-36 shrink-0">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white text-xs font-bold shadow-sm shrink-0"
                style={{ background: flight.airline.logoColor }}
              >
                {flight.airline.code}
              </div>
              <div className="hidden sm:block min-w-0">
                <p className="text-xs font-medium text-white leading-tight truncate">{flight.airline.name}</p>
                <p className="text-xs text-zinc-500">{flight.flightNumber}</p>
              </div>
            </div>

            {/* Route & times */}
            <div className="flex flex-1 items-center gap-3 min-w-0">
              <div className="text-center min-w-[52px]">
                <p className="text-lg font-bold text-white">{flight.departureTime}</p>
                <p className="text-xs text-zinc-400 font-medium">{flight.origin.code}</p>
              </div>

              <div className="flex flex-col items-center gap-0.5 flex-1 min-w-0">
                <span className="text-xs text-zinc-600">{formatDuration(flight.durationMinutes)}</span>
                <div className="relative w-full flex items-center">
                  <div className="h-px flex-1 bg-border" />
                  {flight.stops === 0 ? (
                    <Plane className="h-3 w-3 text-zinc-600 rotate-90 mx-1 shrink-0" />
                  ) : (
                    <div className="flex gap-0.5 mx-1">
                      {Array.from({ length: flight.stops }).map((_, i) => (
                        <div key={i} className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      ))}
                    </div>
                  )}
                  <div className="h-px flex-1 bg-border" />
                </div>
                <span className="text-xs text-zinc-600 text-center">
                  {flight.stops === 0 ? 'bezpośredni' : `${flight.stops} przesiadka`}
                </span>
              </div>

              <div className="text-center min-w-[52px]">
                <p className="text-lg font-bold text-white">{flight.arrivalTime}</p>
                <p className="text-xs text-zinc-400 font-medium">{flight.destination.code}</p>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:w-36 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-border">
              <div className="text-right">
                {flight.priceDropPln > 0 && (
                  <p className="text-xs text-zinc-500 line-through">
                    {formatPrice(flight.averagePrice30d)}
                  </p>
                )}
                <p className={cn('text-2xl font-bold', isSuperDeal ? 'text-emerald-400' : 'text-white')}>
                  {formatPrice(flight.price)}
                </p>
                <p className="text-xs text-zinc-500">
                  {flight.tripType === 'round-trip' ? 'w obie strony' : 'w jedną stronę'}
                </p>
              </div>
              <Button
                size="sm"
                onClick={(e) => { e.stopPropagation(); setModalOpen(true) }}
                className="shrink-0"
              >
                Sprawdź lot
              </Button>
            </div>
          </div>

          {/* Bottom row: deal meter + tags */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <DealMeter rating={flight.dealRating} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {flight.availableSeats <= 5 && (
                <Badge variant="amber" className="text-xs">
                  Tylko {flight.availableSeats} {flight.availableSeats === 1 ? 'miejsce' : 'miejsca'}!
                </Badge>
              )}
              {flight.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="ghost" className="text-xs">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <FlightModal flight={flight} open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
