// Flight search adapter layer.
// Set VITE_USE_MOCK=false in .env.local to route through a real provider.
//
// Amadeus sandbox setup:
//   1. Register at developers.amadeus.com (free)
//   2. Create an app → get client_id / client_secret
//   3. Exchange credentials for a bearer token (POST /v1/security/oauth2/token)
//   4. Set VITE_API_BASE_URL=https://test.api.amadeus.com
//      and VITE_API_KEY=<bearer token>
//
// Kiwi.com Tequila alternative:
//   VITE_API_BASE_URL=https://tequila.kiwi.com/v2
//   VITE_API_KEY=<your Tequila API key>

import type { Flight, SearchQuery } from '@/types'
import { MOCK_FLIGHTS } from '@/data/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export async function searchFlights(query: SearchQuery): Promise<Flight[]> {
  if (USE_MOCK) {
    return simulateMockSearch(query)
  }

  // TODO: map SearchQuery → provider-specific params, call apiGet(), map response → Flight[]
  throw new Error('Real API integration not yet implemented. Set VITE_USE_MOCK=false only after wiring the adapter.')
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
    }, 1400)
  })
}
