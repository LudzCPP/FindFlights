import type { Flight, SearchQuery } from '@/types'
import { MOCK_FLIGHTS } from '@/data/mockData'
import { searchFlightsAmadeus } from './amadeus'

// Toggle via .env.local:  VITE_USE_MOCK=false  to hit Amadeus.
// Credentials also required: VITE_AMADEUS_CLIENT_ID + VITE_AMADEUS_CLIENT_SECRET
export const IS_LIVE = import.meta.env.VITE_USE_MOCK === 'false'

export async function searchFlights(query: SearchQuery): Promise<Flight[]> {
  if (!IS_LIVE) return simulateMockSearch(query)
  return searchFlightsAmadeus(query)
}

function simulateMockSearch(query: SearchQuery): Promise<Flight[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let results = [...MOCK_FLIGHTS]

      if (query.origin && query.origin !== 'ANY')
        results = results.filter((f) => f.origin.code === query.origin)
      if (query.destination && query.destination !== 'ANY')
        results = results.filter((f) => f.destination.code === query.destination)
      if (query.maxPrice)
        results = results.filter((f) => f.price <= query.maxPrice!)
      if (query.tripType)
        results = results.filter((f) => f.tripType === query.tripType)

      if (results.length === 0) results = MOCK_FLIGHTS
      resolve(results.sort((a, b) => a.price - b.price))
    }, 1200)
  })
}
