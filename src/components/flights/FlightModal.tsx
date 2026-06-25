import { ExternalLink, TrendingDown, Calendar, Clock, Users, Plane } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DealMeter } from './DealMeter'
import { useSearchStore } from '@/store/searchStore'
import { formatDuration, formatPrice, formatShortDate } from '@/lib/utils'
import type { Flight } from '@/types'

interface FlightModalProps {
  flight: Flight
  open: boolean
  onClose: () => void
}

function buildBookingLinks(flight: Flight) {
  const from = flight.origin.code
  const to   = flight.destination.code
  const dep  = flight.departureDate ?? ''
  const ret  = flight.returnDate    ?? ''

  // Kiwi: IATA codes, dates as YYYY-MM-DD, /en/ locale.
  // Round-trip: .../DEP/RET — one-way: .../DEP (no return segment)
  const kiwiBase = `https://www.kiwi.com/en/search/results/${from}/${to}`
  const kiwiUrl  = dep
    ? `${kiwiBase}/${dep}${ret ? `/${ret}` : ''}`
    : kiwiBase

  // Kayak: /flights/FROM-TO/DEP/RET with YYYY-MM-DD dates
  const kayakBase = `https://www.kayak.pl/flights/${from}-${to}`
  const kayakUrl  = dep
    ? `${kayakBase}/${dep}${ret ? `/${ret}` : ''}?sort=bestflight_a`
    : kayakBase

  // Google Flights: anchor-based deep link, widely supported
  const gfBase = `https://www.google.com/flights#search;f=${from};t=${to}`
  const gfUrl  = dep
    ? `${gfBase};d=${dep}${ret ? `;r=${ret}` : ''};tt=${ret ? 'r' : 'o'};lang=pl`
    : gfBase

  return [
    { name: 'Kiwi.com',        url: kiwiUrl,  color: 'text-orange-400' },
    { name: 'Kayak.pl',        url: kayakUrl, color: 'text-rose-400'   },
    { name: 'Google Flights',  url: gfUrl,    color: 'text-sky-400'    },
  ]
}

export function FlightModal({ flight, open, onClose }: FlightModalProps) {
  const { setPriceTrackerFlight } = useSearchStore()

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white text-sm font-bold"
              style={{ background: flight.airline.logoColor }}
            >
              {flight.airline.code}
            </div>
            <div>
              <span className="text-white">{flight.origin.city}</span>
              <span className="mx-2 text-zinc-500">→</span>
              <span className="text-white">{flight.destination.city}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Route & time info */}
        <div className="rounded-xl border border-border bg-surface-2 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-center">
              {flight.departureTime ? (
                <p className="text-2xl font-bold text-white">{flight.departureTime}</p>
              ) : flight.departureDate ? (
                <p className="text-base font-semibold text-white">{formatShortDate(flight.departureDate)}</p>
              ) : null}
              <p className="text-sm font-medium text-zinc-400">{flight.origin.code}</p>
              <p className="text-xs text-zinc-600">{flight.origin.city}</p>
            </div>

            <div className="flex flex-col items-center gap-1 flex-1 px-4">
              <p className="text-xs text-zinc-500">
                {flight.durationMinutes > 0 ? formatDuration(flight.durationMinutes) : '—'}
              </p>
              <div className="relative w-full flex items-center gap-1">
                <div className="h-px flex-1 bg-border" />
                <Plane className="h-3.5 w-3.5 text-zinc-500 rotate-90" />
                <div className="h-px flex-1 bg-border" />
              </div>
              <p className="text-xs text-zinc-500">
                {flight.stops === 0 ? 'Bezpośredni' : `${flight.stops} przesiadka${flight.stops > 1 ? 'i' : ''} · ${flight.stopoverCities.join(', ')}`}
              </p>
            </div>

            <div className="text-center">
              {flight.arrivalTime ? (
                <p className="text-2xl font-bold text-white">{flight.arrivalTime}</p>
              ) : (
                <p className="text-2xl font-bold text-zinc-600">—</p>
              )}
              <p className="text-sm font-medium text-zinc-400">{flight.destination.code}</p>
              <p className="text-xs text-zinc-600">{flight.destination.city}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-zinc-500 border-t border-border pt-3">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {flight.departureDate}
              {flight.returnDate && ` – ${flight.returnDate}`}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {flight.flightNumber}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {flight.availableSeats} miejsc
            </span>
          </div>
        </div>

        {/* Price section */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-white">{formatPrice(flight.price)}</p>
            {flight.priceDropPln > 0 && (
              <div className="flex items-center gap-1.5 mt-1">
                <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-xs text-emerald-400">
                  o {formatPrice(flight.priceDropPln)} taniej niż średnia z 30 dni
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {flight.tags.map((tag) => (
              <Badge key={tag} variant="ghost" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <DealMeter rating={flight.dealRating} />

        {/* Price tracker */}
        <button
          onClick={() => {
            onClose()
            setPriceTrackerFlight(flight)
          }}
          className="w-full rounded-xl border border-dashed border-border py-2.5 text-sm text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
        >
          📈 Zobacz historię cen dla tej trasy
        </button>

        {/* Booking links */}
        <div className="space-y-2">
          <p className="text-xs text-zinc-500 font-medium">Rezerwuj przez:</p>
          {buildBookingLinks(flight).map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-border bg-surface-2 px-4 py-3 hover:border-zinc-600 hover:bg-surface-3 transition-all group"
            >
              <span className={`text-sm font-medium ${link.color}`}>{link.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">od</span>
                <span className="text-sm font-bold text-white">{formatPrice(flight.price)}</span>
                <ExternalLink className="h-3.5 w-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
              </div>
            </a>
          ))}
        </div>

        <Button size="lg" className="w-full" onClick={onClose}>
          Zamknij
        </Button>
      </DialogContent>
    </Dialog>
  )
}
