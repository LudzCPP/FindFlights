import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlaneTakeoff, PlaneLanding, Calendar, Users, Search, ArrowLeftRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSearchStore } from '@/store/searchStore'
import { AIRPORT_LIST } from '@/data/mockData'
import { cn } from '@/lib/utils'
import type { TripType } from '@/types'

const MONTHS = [
  'Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec',
  'Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień',
]

function AirportSelect({
  label, icon: Icon, value, onChange, placeholder,
}: {
  label: string
  icon: React.ElementType
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = AIRPORT_LIST.filter(
    (a) =>
      a.city.toLowerCase().includes(search.toLowerCase()) ||
      a.code.toLowerCase().includes(search.toLowerCase()) ||
      a.country.toLowerCase().includes(search.toLowerCase()),
  ).slice(0, 8)

  const selected = AIRPORT_LIST.find((a) => a.code === value)

  return (
    <div className="relative">
      <label className="mb-1.5 block text-xs font-medium text-zinc-500 uppercase tracking-wider">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex w-full items-center gap-2 rounded-xl border bg-surface-2 px-3.5 py-3 text-left transition-all',
          open ? 'border-cyan-500/50' : 'border-border hover:border-zinc-600',
        )}
      >
        <Icon className="h-4 w-4 text-zinc-500 shrink-0" />
        {selected ? (
          <span className="flex items-center gap-2 text-sm text-white">
            <span>{selected.flag}</span>
            <span className="font-semibold">{selected.code}</span>
            <span className="text-zinc-400">{selected.city}</span>
          </span>
        ) : (
          <span className="text-sm text-zinc-500">{placeholder}</span>
        )}
      </button>

      {open && (
        <div className="absolute top-full z-50 mt-1.5 w-full rounded-xl border border-border bg-surface-2 shadow-glass overflow-hidden">
          <div className="p-2 border-b border-border">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Szukaj lotniska..."
              className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none px-2 py-1"
            />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {value !== 'Gdziekolwiek' && label.includes('Dokąd') && (
              <button
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-surface-3 transition-colors"
                onClick={() => { onChange('ANY'); setOpen(false); setSearch('') }}
              >
                <span className="text-lg">🌍</span>
                <div>
                  <p className="text-sm font-medium text-white">Gdziekolwiek</p>
                  <p className="text-xs text-zinc-500">Pokaż wszystkie kierunki</p>
                </div>
              </button>
            )}
            {filtered.map((airport) => (
              <button
                key={airport.code}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-surface-3 transition-colors"
                onClick={() => { onChange(airport.code); setOpen(false); setSearch('') }}
              >
                <span className="text-lg">{airport.flag}</span>
                <div>
                  <p className="text-sm font-medium text-white">
                    <span className="font-bold">{airport.code}</span> — {airport.city}
                  </p>
                  <p className="text-xs text-zinc-500">{airport.name}, {airport.country}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function ClassicSearchForm() {
  const { query, setQuery, runSearch } = useSearchStore()
  const [flexMode, setFlexMode] = useState(false)

  const handleSwapAirports = () => {
    setQuery({ origin: query.destination, destination: query.origin })
  }

  return (
    <div className="space-y-4">
      {/* Trip type toggle */}
      <div className="flex gap-1 rounded-lg bg-surface-3 p-1 w-fit">
        {(['round-trip', 'one-way'] as TripType[]).map((type) => (
          <button
            key={type}
            onClick={() => setQuery({ tripType: type })}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              query.tripType === type
                ? 'bg-cyan-500 text-background shadow-sm'
                : 'text-zinc-400 hover:text-white',
            )}
          >
            {type === 'round-trip' ? 'W obie strony' : 'W jedną stronę'}
          </button>
        ))}
      </div>

      {/* Airport row */}
      <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AirportSelect
          label="Skąd"
          icon={PlaneTakeoff}
          value={query.origin ?? ''}
          onChange={(v) => setQuery({ origin: v })}
          placeholder="Wybierz lotnisko wylotu"
        />

        <button
          onClick={handleSwapAirports}
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 hidden sm:flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-2 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all hover:rotate-180 duration-300"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
        </button>

        <AirportSelect
          label="Dokąd"
          icon={PlaneLanding}
          value={query.destination ?? ''}
          onChange={(v) => setQuery({ destination: v })}
          placeholder="Gdziekolwiek lub wybierz"
        />
      </div>

      {/* Date + passengers row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Date mode toggle */}
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2 mb-1.5">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Daty
            </label>
            <button
              onClick={() => setFlexMode(!flexMode)}
              className={cn(
                'text-xs px-2 py-0.5 rounded-full border transition-colors',
                flexMode
                  ? 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10'
                  : 'border-border text-zinc-500 hover:text-zinc-300',
              )}
            >
              {flexMode ? 'Elastyczne miesiące' : 'Konkretne daty'}
            </button>
          </div>

          {flexMode ? (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
              {MONTHS.map((month, i) => (
                <button
                  key={i}
                  onClick={() => setQuery({ flexibleMonth: i + 1 })}
                  className={cn(
                    'shrink-0 rounded-lg border px-3 py-2 text-sm transition-all whitespace-nowrap',
                    query.flexibleMonth === i + 1
                      ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400'
                      : 'border-border text-zinc-400 hover:border-zinc-600 hover:text-white',
                  )}
                >
                  {month}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="date"
                  value={query.departureDate ?? ''}
                  onChange={(e) => setQuery({ departureDate: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface-2 pl-9 pr-3 py-3 text-sm text-zinc-300 focus:border-cyan-500/50 focus:outline-none"
                />
              </div>
              {query.tripType === 'round-trip' && (
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="date"
                    value={query.returnDate ?? ''}
                    onChange={(e) => setQuery({ returnDate: e.target.value })}
                    className="w-full rounded-xl border border-border bg-surface-2 pl-9 pr-3 py-3 text-sm text-zinc-300 focus:border-cyan-500/50 focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Passengers */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Pasażerowie
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-3.5 py-3">
            <Users className="h-4 w-4 text-zinc-500" />
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => setQuery({ passengers: Math.max(1, (query.passengers ?? 1) - 1) })}
                className="h-6 w-6 rounded-full border border-border text-zinc-400 hover:border-zinc-500 hover:text-white transition-all flex items-center justify-center text-sm"
              >
                −
              </button>
              <span className="text-sm font-medium text-white flex-1 text-center">
                {query.passengers ?? 1} {(query.passengers ?? 1) === 1 ? 'osoba' : 'osoby'}
              </span>
              <button
                onClick={() => setQuery({ passengers: Math.min(9, (query.passengers ?? 1) + 1) })}
                className="h-6 w-6 rounded-full border border-border text-zinc-400 hover:border-zinc-500 hover:text-white transition-all flex items-center justify-center text-sm"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <motion.div whileTap={{ scale: 0.98 }}>
        <Button size="xl" className="w-full gap-3" onClick={() => runSearch()}>
          <Search className="h-5 w-5" />
          Szukaj lotów
        </Button>
      </motion.div>
    </div>
  )
}
