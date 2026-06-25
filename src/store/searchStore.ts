import { create } from 'zustand'
import type { SearchQuery, Flight, VibeTag } from '@/types'
import { searchFlights } from '@/api/flights'

export type AppSection = 'search' | 'deals' | 'tracker'

interface SearchState {
  query: SearchQuery
  results: Flight[]
  isSearching: boolean
  hasSearched: boolean
  searchError: string | null
  activeSection: AppSection
  selectedVibeTag: VibeTag
  selectedFlight: Flight | null
  priceTrackerFlight: Flight | null

  setQuery: (patch: Partial<SearchQuery>) => void
  runSearch: () => Promise<void>
  setActiveSection: (section: AppSection) => void
  setVibeTag: (tag: VibeTag) => void
  setSelectedFlight: (flight: Flight | null) => void
  setPriceTrackerFlight: (flight: Flight | null) => void
  resetSearch: () => void
}

const DEFAULT_QUERY: SearchQuery = {
  passengers: 1,
  cabin: 'economy',
  tripType: 'round-trip',
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: DEFAULT_QUERY,
  results: [],
  isSearching: false,
  hasSearched: false,
  searchError: null,
  activeSection: 'search',
  selectedVibeTag: 'all',
  selectedFlight: null,
  priceTrackerFlight: null,

  setQuery: (patch) =>
    set((s) => ({ query: { ...s.query, ...patch } })),

  runSearch: async () => {
    set({ isSearching: true, hasSearched: false, searchError: null, activeSection: 'search' })
    const { query } = get()

    try {
      const results = await searchFlights(query)
      set({ results, isSearching: false, hasSearched: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Wystąpił nieznany błąd'
      console.error('[searchFlights]', err)
      set({ results: [], isSearching: false, hasSearched: true, searchError: message })
    }
  },

  setActiveSection: (section) => set({ activeSection: section }),
  setVibeTag:       (tag)     => set({ selectedVibeTag: tag }),
  setSelectedFlight: (flight) => set({ selectedFlight: flight }),
  setPriceTrackerFlight: (flight) => set({ priceTrackerFlight: flight }),
  resetSearch: () =>
    set({ query: DEFAULT_QUERY, results: [], hasSearched: false, searchError: null }),
}))
