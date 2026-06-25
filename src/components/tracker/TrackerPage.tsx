import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, Minus, TrendingUpIcon } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { MOCK_PRICE_HISTORIES, MOCK_FLIGHTS } from '@/data/mockData'
import { useSearchStore } from '@/store/searchStore'
import { AIRPORTS } from '@/data/mockData'
import { formatPrice, cn } from '@/lib/utils'
import type { PriceHistory } from '@/types'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

function getFlightForRoute(routeKey: string) {
  const [originCode, destCode] = routeKey.split('-')
  return MOCK_FLIGHTS.find(
    (f) => f.origin.code === originCode && f.destination.code === destCode,
  )
}

function PriceTrendIndicator({ history }: { history: PriceHistory }) {
  const diff = history.currentPrice - history.averagePrice
  const pct = Math.round((Math.abs(diff) / history.averagePrice) * 100)

  if (Math.abs(diff) < 20)
    return (
      <span className="flex items-center gap-1 text-xs text-zinc-400">
        <Minus className="h-3 w-3" /> Średnia
      </span>
    )
  if (diff < 0)
    return (
      <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
        <TrendingDown className="h-3 w-3" /> -{pct}% poniżej średniej
      </span>
    )
  return (
    <span className="flex items-center gap-1 text-xs text-rose-400 font-medium">
      <TrendingUp className="h-3 w-3" /> +{pct}% powyżej średniej
    </span>
  )
}

function RouteTrackerCard({ routeKey, history }: { routeKey: string; history: PriceHistory }) {
  const { setPriceTrackerFlight } = useSearchStore()
  const flight = getFlightForRoute(routeKey)

  const originAirport = AIRPORTS[history.origin]
  const destAirport = AIRPORTS[history.destination]
  if (!originAirport || !destAirport) return null

  const chartData = history.dataPoints.slice(-12).map((p) => ({ price: p.price }))
  const isPriceDrop = history.currentPrice < history.averagePrice - 20

  const handleClick = () => {
    if (flight) setPriceTrackerFlight(flight)
  }

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={cn(
        'group cursor-pointer rounded-2xl border bg-surface p-4 transition-colors hover:border-zinc-600',
        isPriceDrop ? 'border-emerald-500/30' : 'border-border',
      )}
    >
      {/* Route header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{originAirport.flag}</span>
          <div>
            <p className="text-sm font-semibold text-white">
              {originAirport.code}
              <span className="mx-1.5 text-zinc-600">→</span>
              {destAirport.code}
            </p>
            <p className="text-xs text-zinc-500">
              {originAirport.city} — {destAirport.city}
            </p>
          </div>
          <span className="text-xl">{destAirport.flag}</span>
        </div>

        {isPriceDrop && (
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5">
            OKAZJA
          </span>
        )}
      </div>

      {/* Sparkline */}
      <div className="h-14 w-full mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="price"
              stroke={isPriceDrop ? '#34d399' : '#22d3ee'}
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Price row */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-zinc-500">Teraz</p>
          <p className={cn(
            'text-lg font-bold',
            isPriceDrop ? 'text-emerald-400' : 'text-white',
          )}>
            {formatPrice(history.currentPrice)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500">Średnia 30 dni</p>
          <p className="text-sm font-medium text-zinc-400">
            {formatPrice(history.averagePrice)}
          </p>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-border">
        <PriceTrendIndicator history={history} />
      </div>
    </motion.div>
  )
}

export function TrackerPage() {
  const entries = Object.entries(MOCK_PRICE_HISTORIES)

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="py-12 sm:py-16 text-center"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5">
          <TrendingUpIcon className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-xs font-medium text-cyan-400">
            {entries.length} tras śledzonych w czasie rzeczywistym
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Śledzenie cen
        </h1>
        <p className="mt-3 text-zinc-500 max-w-lg mx-auto text-sm">
          Kliknij trasę, żeby zobaczyć pełną historię i wykres cen z ostatnich 6 miesięcy.
          Zielone karty oznaczają aktualną cenę poniżej 30-dniowej średniej.
        </p>
      </motion.div>

      {/* Route grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {entries.map(([key, history]) => (
          <RouteTrackerCard key={key} routeKey={key} history={history} />
        ))}
      </motion.div>

      {/* Empty hint when flight not found */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 rounded-2xl border border-dashed border-border p-6 text-center"
      >
        <p className="text-sm text-zinc-600">
          Więcej tras pojawi się po zintegrowaniu z prawdziwym API.{' '}
          <span className="text-zinc-500">
            Planujemy wsparcie dla Amadeus, Skyscanner i kiwi.com.
          </span>
        </p>
      </motion.div>
    </section>
  )
}
