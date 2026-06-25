import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Wifi } from 'lucide-react'
import { DealCard } from './DealCard'
import { VibeFilters } from './VibeFilters'
import { useSearchStore } from '@/store/searchStore'
import { MOCK_DEALS } from '@/data/mockData'
import { IS_LIVE } from '@/api/flights'
import { fetchLiveDeals } from '@/api/travelpayouts/dealsApi'
import type { Deal } from '@/types'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

function SkeletonDealCard() {
  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="h-28 bg-surface-3 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <div className="h-2.5 w-16 rounded bg-surface-3 animate-pulse" />
            <div className="h-7 w-24 rounded bg-surface-3 animate-pulse" />
            <div className="h-2.5 w-20 rounded bg-surface-3 animate-pulse" />
          </div>
          <div className="h-7 w-12 rounded-full bg-surface-3 animate-pulse" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <div className="h-5 w-16 rounded-full bg-surface-3 animate-pulse" />
            <div className="h-5 w-12 rounded-full bg-surface-3 animate-pulse" />
          </div>
          <div className="h-4 w-14 rounded bg-surface-3 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export function DealsGrid() {
  const { selectedVibeTag } = useSearchStore()

  const [deals, setDeals]       = useState<Deal[]>([])
  const [loading, setLoading]   = useState(IS_LIVE)
  const [usingLive, setUsingLive] = useState(false)

  useEffect(() => {
    if (!IS_LIVE) {
      setDeals(MOCK_DEALS)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    fetchLiveDeals()
      .then((live) => {
        if (!cancelled) {
          setDeals(live.length > 0 ? live : MOCK_DEALS)
          setUsingLive(live.length > 0)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDeals(MOCK_DEALS)
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [])

  const filtered =
    selectedVibeTag === 'all'
      ? deals
      : deals.filter((d) => d.vibeTags.includes(selectedVibeTag))

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-24">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="h-5 w-5 text-orange-400" />
            <h2 className="text-2xl font-bold text-white">Okazje dnia</h2>
          </div>
          <p className="text-sm text-zinc-500">
            Wyjątkowe oferty — tylko przez ograniczony czas. Aktualizowane co 15 minut.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {usingLive && (
            <div className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-3 py-1">
              <Wifi className="h-3 w-3 text-cyan-400" />
              <span className="text-xs font-medium text-cyan-400">Live</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-zinc-500 rounded-full border border-border bg-surface-2 px-3 py-1.5 w-fit">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
            {loading ? '…' : `${filtered.length} aktywnych okazji`}
          </div>
        </div>
      </motion.div>

      {/* Vibe filters */}
      <div className="mb-6">
        <VibeFilters />
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonDealCard key={i} />
            ))}
          </motion.div>
        ) : filtered.length > 0 ? (
          <motion.div
            key={selectedVibeTag}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filtered.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center"
          >
            <p className="text-2xl">🔍</p>
            <p className="text-base font-semibold text-white">Brak okazji w tej kategorii</p>
            <p className="text-sm text-zinc-500">Spróbuj innego filtra lub wróć później.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
