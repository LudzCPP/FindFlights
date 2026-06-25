import { motion, AnimatePresence } from 'framer-motion'
import { SearchX, Plane, AlertTriangle, Wifi } from 'lucide-react'
import { FlightCard, flightItemVariants } from './FlightCard'
import { useSearchStore } from '@/store/searchStore'
import { IS_LIVE } from '@/api/flights'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-surface-3 animate-pulse shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-32 rounded bg-surface-3 animate-pulse" />
          <div className="h-2 w-20 rounded bg-surface-3 animate-pulse" />
        </div>
        <div className="hidden sm:block h-8 w-24 rounded-lg bg-surface-3 animate-pulse" />
        <div className="h-10 w-28 rounded-lg bg-surface-3 animate-pulse" />
      </div>
      <div className="mt-4 h-1.5 w-full rounded-full bg-surface-3 animate-pulse" />
    </div>
  )
}

function SkeletonItem() {
  return (
    <motion.div variants={flightItemVariants}>
      <SkeletonCard />
    </motion.div>
  )
}

export function FlightResults() {
  const { results, isSearching, hasSearched, searchError, query } = useSearchStore()

  if (!hasSearched && !isSearching) return null

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-12">
      {/* Header row */}
      <div className="mb-5 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold text-white">
            {isSearching
              ? 'Szukam najlepszych lotów…'
              : searchError
              ? 'Błąd wyszukiwania'
              : `Znaleziono ${results.length} lotów`}
          </h2>
          {!isSearching && hasSearched && !searchError && (
            <p className="text-sm text-zinc-500 mt-0.5">
              {query.origin && query.destination
                ? `${query.origin} → ${query.destination}`
                : 'Wszystkie trasy'}
              {query.maxPrice ? ` · do ${query.maxPrice} PLN` : ''}
            </p>
          )}
        </div>

        {/* Live API badge */}
        {IS_LIVE && (
          <div className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-3 py-1">
            <Wifi className="h-3 w-3 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-400">Travelpayouts Live</span>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div
            key="skeletons"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            className="space-y-3"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonItem key={i} />
            ))}
          </motion.div>

        ) : searchError ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 py-14 text-center px-6"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="h-7 w-7 text-amber-400" />
            </div>
            <div>
              <p className="text-base font-semibold text-white">Nie udało się pobrać wyników</p>
              <p className="text-sm text-amber-300/80 mt-1 max-w-md font-mono">{searchError}</p>
            </div>
            {IS_LIVE && (
              <p className="text-xs text-zinc-500 max-w-xs">
                Sprawdź czy VITE_AMADEUS_CLIENT_ID i VITE_AMADEUS_CLIENT_SECRET są ustawione w .env.local i czy aplikacja jest wczytana od nowa.
              </p>
            )}
          </motion.div>

        ) : results.length > 0 ? (
          <motion.div
            key="results"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            className="space-y-3"
          >
            {results.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
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
              <p className="text-lg font-semibold text-white">Nie znaleźliśmy lotów</p>
              <p className="text-sm text-zinc-500 mt-1 max-w-sm">
                Spróbuj innych dat, lotniska wylotu lub zwiększ budżet.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Plane className="h-4 w-4" />
              <span>Sprawdź też zakładkę <strong className="text-zinc-300">Okazje</strong></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
