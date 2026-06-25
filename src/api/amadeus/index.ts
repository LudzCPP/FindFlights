import type { Flight, SearchQuery } from '@/types'
import { amadeusGet } from './token'
import { adaptFlightOffer } from './adapter'
import type { AmadeusFlightOffersResponse } from './types'

function getFutureDate(daysFromNow = 30): string {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  return d.toISOString().split('T')[0]
}

function resolveDepartureDate(query: SearchQuery): string {
  if (query.departureDate && query.departureDate >= new Date().toISOString().split('T')[0]) {
    return query.departureDate
  }
  if (query.flexibleMonth) {
    const now   = new Date()
    const year  = query.flexibleMonth <= now.getMonth() + 1 ? now.getFullYear() + 1 : now.getFullYear()
    const month = String(query.flexibleMonth).padStart(2, '0')
    return `${year}-${month}-15`
  }
  return getFutureDate(30)
}

export async function searchFlightsAmadeus(query: SearchQuery): Promise<Flight[]> {
  const origin = query.origin ?? 'WAW'

  // "Anywhere" searches aren't directly supported by /flight-offers.
  // In that case we search the 5 most popular destinations from the origin in parallel.
  const destinations =
    !query.destination || query.destination === 'ANY'
      ? ['BCN', 'LIS', 'ATH', 'CDG', 'FCO', 'AMS', 'LHR']
      : [query.destination]

  const departureDate = resolveDepartureDate(query)
  const adults        = String(query.passengers ?? 1)
  const isRoundTrip   = query.tripType !== 'one-way'

  const params: Record<string, string> = {
    originLocationCode:      origin,
    departureDate,
    adults,
    max:                     '20',
    currencyCode:            'EUR',
    nonStop:                 'false',
  }

  if (isRoundTrip && query.returnDate && query.returnDate > departureDate) {
    params.returnDate = query.returnDate
  }

  const requests = destinations.map((dest) =>
    amadeusGet<AmadeusFlightOffersResponse>('/v2/shopping/flight-offers', {
      ...params,
      destinationLocationCode: dest,
    }).catch(() => null),     // swallow per-destination failures gracefully
  )

  const responses = await Promise.all(requests)

  const flights: Flight[] = responses
    .filter((r): r is AmadeusFlightOffersResponse => r !== null)
    .flatMap((r) => r.data.map((offer) => adaptFlightOffer(offer, r.dictionaries)))

  if (flights.length === 0) {
    throw new Error('Amadeus nie zwrócił wyników dla tych parametrów. Spróbuj zmienić daty lub trasę.')
  }

  if (query.maxPrice) {
    return flights
      .filter((f) => f.price <= query.maxPrice!)
      .sort((a, b) => a.price - b.price)
  }

  return flights.sort((a, b) => a.price - b.price)
}
