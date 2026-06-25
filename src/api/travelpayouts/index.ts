import type { Flight, SearchQuery } from '@/types'
import type { TpCheapResponse, TpLatestResponse } from './types'
import { adaptCheapPrice, adaptLatestPrice } from './adapter'

// In dev: requests go through the Vite proxy (/tp-api → https://api.travelpayouts.com).
// In production: replace TP_BASE with your own backend proxy URL.
const TP_BASE = '/tp-api'

function getToken(): string {
  const t = import.meta.env.VITE_TRAVELPAYOUTS_TOKEN
  if (!t) throw new Error(
    'Brak VITE_TRAVELPAYOUTS_TOKEN w pliku .env.local. ' +
    'Zarejestruj się na travelpayouts.com i skopiuj token API.'
  )
  return t
}

function resolveMonth(query: SearchQuery): string {
  if (query.departureDate) {
    const d = new Date(query.departureDate)
    if (d > new Date()) return query.departureDate.slice(0, 7)  // "YYYY-MM"
  }
  if (query.flexibleMonth) {
    const now  = new Date()
    const year = query.flexibleMonth <= now.getMonth() + 1 ? now.getFullYear() + 1 : now.getFullYear()
    return `${year}-${String(query.flexibleMonth).padStart(2, '0')}`
  }
  // Default: 2 months from now
  const d = new Date()
  d.setMonth(d.getMonth() + 2)
  return d.toISOString().slice(0, 7)
}

// /v1/prices/cheap — has airline + flight number, best for specific routes
async function fetchCheapPrices(
  origin: string,
  destination: string | undefined,
  month: string,
  oneWay: boolean,
  token: string,
): Promise<Flight[]> {
  const params = new URLSearchParams({
    origin,
    currency: 'PLN',
    depart_date: month,
    one_way: oneWay ? 'true' : 'false',
    token,
  })
  if (destination && destination !== 'ANY') params.set('destination', destination)

  const res = await fetch(`${TP_BASE}/v1/prices/cheap?${params}`)
  if (!res.ok) throw new Error(`Travelpayouts /cheap error ${res.status}`)

  const json: TpCheapResponse = await res.json()
  if (!json.success) throw new Error('Travelpayouts: zapytanie nie powiodło się')

  const flights: Flight[] = []
  for (const [dest, byTransfer] of Object.entries(json.data)) {
    for (const [transfers, item] of Object.entries(byTransfer)) {
      flights.push(adaptCheapPrice(dest, transfers, item, origin, json.currency))
    }
  }
  return flights
}

// /v2/prices/latest — better for "anywhere"/inspiration (no airline info)
async function fetchLatestPrices(
  origin: string,
  destination: string | undefined,
  oneWay: boolean,
  token: string,
): Promise<Flight[]> {
  const params = new URLSearchParams({
    origin,
    currency:    'pln',
    period_type: 'year',
    one_way:     oneWay ? 'true' : 'false',
    limit:       '30',
    token,
  })
  if (destination && destination !== 'ANY') params.set('destination', destination)

  const res = await fetch(`${TP_BASE}/v2/prices/latest?${params}`)
  if (!res.ok) throw new Error(`Travelpayouts /latest error ${res.status}`)

  const json: TpLatestResponse = await res.json()
  if (!json.success) throw new Error('Travelpayouts: brak wyników')

  return json.data.map(adaptLatestPrice)
}

export async function searchFlightsTravelpayouts(query: SearchQuery): Promise<Flight[]> {
  const token    = getToken()
  const origin   = query.origin ?? 'WAW'
  const dest     = query.destination
  const oneWay   = query.tripType === 'one-way'
  const month    = resolveMonth(query)
  const isAnywhere = !dest || dest === 'ANY'

  // "Anywhere" → use /latest (richer destinations coverage).
  // Specific route → use /cheap (includes airline + flight number).
  let flights: Flight[]

  if (isAnywhere) {
    flights = await fetchLatestPrices(origin, undefined, oneWay, token)
  } else {
    try {
      flights = await fetchCheapPrices(origin, dest, month, oneWay, token)
      // If cheap returns nothing, fall back to latest
      if (flights.length === 0) {
        flights = await fetchLatestPrices(origin, dest, oneWay, token)
      }
    } catch {
      flights = await fetchLatestPrices(origin, dest, oneWay, token)
    }
  }

  if (flights.length === 0) {
    throw new Error('Travelpayouts nie znalazł wyników dla tej trasy. Spróbuj zmienić miesiąc lub lotnisko.')
  }

  if (query.maxPrice) {
    flights = flights.filter((f) => f.price <= query.maxPrice!)
  }

  return flights.sort((a, b) => a.price - b.price)
}
