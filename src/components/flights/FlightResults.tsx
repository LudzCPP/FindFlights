import { motion, AnimatePresence } from 'framer-motion'
import { SearchX, Plane } from 'lucide-react'
import { FlightCard } from './FlightCard'
import { useSearchStore } from '@/store/searchStore'

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-surface-3" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-32 rounded bg-surface-3" />
          <div className="h-2 w-20 rounded bg-surface-3" />
        </div>
        <div className="h-8 w-24 rounded-lg bg-surface-3" />
        <div className="h-10 w-28 rounded-lg bg-surface-3" />
      </div>
      <div className="mt-4 h-1.5 w-full rounded-full bg-surface-3" />
    </div>
  )
}

export function FlightResults() {
  const { results, isSearching, hasSearched, query } = useSearchStore()

  if (!hasSearched && !isSearching) return null

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-20">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            {isSearching ? 'Szukam najlepszych lotów...' : `Znaleziono ${results.length} lotów`}
          </h2>
          {!isSearching && hasSearched && (
            <p className="text-sm text-zinc-500 mt-0.5">
              {query.origin && query.destination
                ? `${query.origin} → ${query.destination}`
                : 'Wszystkie trasy'}
              {query.maxPrice ? ` · do ${query.maxPrice} PLN` : ''}
            </p>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div
            key="skeletons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </motion.div>
        ) : results.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {results.map((flight, i) => (
              <FlightCard key={flight.id} flight={flight} index={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-16 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 border border-border">
              <SearchX className="h-7 w-7 text-zinc-500" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">
                Nie znaleźliśmy tak taniego lotu
              </p>
              <p className="text-sm text-zinc-500 mt-1 max-w-sm">
                Ale sprawdź te alternatywy — obniż budżet lub wybierz elastyczne daty.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Plane className="h-4 w-4" />
              <span>Spróbuj też zakładki <strong className="text-zinc-300">Okazje</strong></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
