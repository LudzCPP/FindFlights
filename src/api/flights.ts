import type { Flight, SearchQuery } from '@/types'
import { MOCK_FLIGHTS } from '@/data/mockData'
import { searchFlightsTravelpayouts } from './travelpayouts'

// Set VITE_USE_MOCK=false in .env.local to hit the Travelpayouts live API.
// Also requires VITE_TRAVELPAYOUTS_TOKEN (free — travelpayouts.com/developer/api).
export const IS_LIVE = import.meta.env.VITE_USE_MOCK === 'false'

export async function searchFlights(query: SearchQuery): Promise<Flight[]> {
  if (!IS_LIVE) return simulateMockSearch(query)
  return searchFlightsTravelpayouts(query)
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
