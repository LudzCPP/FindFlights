import { create } from 'zustand'
import type { SearchQuery, Flight, Deal, VibeTag } from '@/types'
import { MOCK_FLIGHTS, MOCK_DEALS } from '@/data/mockData'

interface SearchState {
  query: SearchQuery
  results: Flight[]
  isSearching: boolean
  hasSearched: boolean
  activeTab: 'search' | 'deals'
  selectedVibeTag: VibeTag
  selectedFlight: Flight | null
  priceTrackerFlight: Flight | null

  setQuery: (patch: Partial<SearchQuery>) => void
  runSearch: () => void
  setActiveTab: (tab: 'search' | 'deals') => void
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
  activeTab: 'search',
  selectedVibeTag: 'all',
  selectedFlight: null,
  priceTrackerFlight: null,

  setQuery: (patch) =>
    set((s) => ({ query: { ...s.query, ...patch } })),

  runSearch: () => {
    set({ isSearching: true, hasSearched: false })
    const { query } = get()

    setTimeout(() => {
      let results = [...MOCK_FLIGHTS]

      if (query.origin) {
        results = results.filter(
          (f) => f.origin.code === query.origin || query.origin === 'ANY',
        )
      }
      if (query.destination && query.destination !== 'ANY') {
        results = results.filter((f) => f.destination.code === query.destination)
      }
      if (query.maxPrice) {
        results = results.filter((f) => f.price <= query.maxPrice!)
      }
      if (query.tripType) {
        results = results.filter((f) => f.tripType === query.tripType)
      }

      // If no filters produced results, show all (graceful fallback)
      if (results.length === 0) results = MOCK_FLIGHTS

      results.sort((a, b) => a.price - b.price)
      set({ results, isSearching: false, hasSearched: true, activeTab: 'search' })
    }, 1400)
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setVibeTag: (tag) => set({ selectedVibeTag: tag }),
  setSelectedFlight: (flight) => set({ selectedFlight: flight }),
  setPriceTrackerFlight: (flight) => set({ priceTrackerFlight: flight }),
  resetSearch: () => set({ query: DEFAULT_QUERY, results: [], hasSearched: false }),
}))

export function useFilteredDeals(): Deal[] {
  return MOCK_DEALS
}
