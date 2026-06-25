import { motion, AnimatePresence } from 'framer-motion'
import { Flame } from 'lucide-react'
import { DealCard } from './DealCard'
import { VibeFilters } from './VibeFilters'
import { useSearchStore } from '@/store/searchStore'
import { MOCK_DEALS } from '@/data/mockData'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

export function DealsGrid() {
  const { selectedVibeTag } = useSearchStore()

  const filtered =
    selectedVibeTag === 'all'
      ? MOCK_DEALS
      : MOCK_DEALS.filter((d) => d.vibeTags.includes(selectedVibeTag))

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

        <div className="flex items-center gap-2 text-xs text-zinc-500 rounded-full border border-border bg-surface-2 px-3 py-1.5 w-fit">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
          {filtered.length} aktywnych okazji
        </div>
      </motion.div>

      {/* Vibe filters */}
      <div className="mb-6">
        <VibeFilters />
      </div>

      {/* Grid with AnimatePresence so filter changes re-stagger */}
      <AnimatePresence mode="wait">
        {filtered.length > 0 ? (
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
