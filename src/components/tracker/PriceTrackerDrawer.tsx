import { X, TrendingDown, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine,
} from 'recharts'
import { useSearchStore } from '@/store/searchStore'
import { MOCK_PRICE_HISTORIES } from '@/data/mockData'
import { formatPrice } from '@/lib/utils'

function CustomTooltip({ active, payload, label }: {
  active?: boolean; payload?: Array<{ value: number }>; label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-3 shadow-glass">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className="text-base font-bold text-white">{formatPrice(payload[0].value)}</p>
    </div>
  )
}

export function PriceTrackerDrawer() {
  const { priceTrackerFlight, setPriceTrackerFlight } = useSearchStore()

  if (!priceTrackerFlight) return null

  const routeKey = `${priceTrackerFlight.origin.code}-${priceTrackerFlight.destination.code}`
  const history = MOCK_PRICE_HISTORIES[routeKey]

  const chartData = history?.dataPoints.map((p) => ({
    date: p.date.slice(5),
    price: p.price,
  })) ?? []

  const isPriceDrop = priceTrackerFlight.priceDropPln > 0

  return (
    <AnimatePresence>
      <motion.div
        key="tracker-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={() => setPriceTrackerFlight(null)}
      />
      <motion.div
        key="tracker-drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg border-l border-border bg-surface shadow-glass overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 border-b border-border bg-surface/95 backdrop-blur px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Historia cen</h2>
            <p className="text-xs text-zinc-500">
              {priceTrackerFlight.origin.city} → {priceTrackerFlight.destination.city} · ostatnie 6 miesięcy
            </p>
          </div>
          <button
            onClick={() => setPriceTrackerFlight(null)}
            className="rounded-lg p-1.5 text-zinc-500 hover:text-white hover:bg-surface-2 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats row */}
          {history && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Najniższa', value: history.lowestPrice, color: 'text-emerald-400' },
                { label: 'Średnia (30 dni)', value: history.averagePrice, color: 'text-zinc-300' },
                { label: 'Najwyższa', value: history.highestPrice, color: 'text-rose-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-xl border border-border bg-surface-2 p-3 text-center">
                  <p className={`text-lg font-bold ${color}`}>{formatPrice(value)}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Current price alert */}
          <div className={`flex items-start gap-3 rounded-xl border p-4 ${
            isPriceDrop
              ? 'border-emerald-500/30 bg-emerald-500/5'
              : 'border-amber-500/30 bg-amber-500/5'
          }`}>
            {isPriceDrop ? (
              <TrendingDown className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <TrendingUp className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`text-sm font-semibold ${isPriceDrop ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isPriceDrop
                  ? `Cena o ${formatPrice(priceTrackerFlight.priceDropPln)} niższa niż średnia!`
                  : 'Cena w okolicach średniej'}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                Obecna cena: <strong className="text-white">{formatPrice(priceTrackerFlight.price)}</strong>
              </p>
            </div>
          </div>

          {/* Chart */}
          {chartData.length > 0 ? (
            <div>
              <h3 className="text-sm font-medium text-zinc-400 mb-4">Zmiana ceny w czasie</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#71717a', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    interval={4}
                  />
                  <YAxis
                    tick={{ fill: '#71717a', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => `${v} zł`}
                    width={60}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {history && (
                    <ReferenceLine
                      y={history.averagePrice}
                      stroke="#f59e0b"
                      strokeDasharray="4 4"
                      label={{ value: 'Średnia', position: 'right', fill: '#f59e0b', fontSize: 10 }}
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#22d3ee', stroke: '#0a0a0c', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 rounded-xl border border-dashed border-border">
              <p className="text-sm text-zinc-500">Brak danych historycznych dla tej trasy</p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
