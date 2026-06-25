// Raw shapes returned by the Amadeus REST API.
// Only the fields we actually consume are typed; everything else is unknown.

export interface AmadeusTokenResponse {
  access_token: string
  expires_in: number   // seconds
  token_type: string
}

export interface AmadeusSegment {
  departure: { iataCode: string; at: string }  // at = ISO datetime
  arrival:   { iataCode: string; at: string }
  carrierCode: string
  number: string
  duration: string          // ISO 8601 duration, e.g. "PT2H15M"
  numberOfStops: number
}

export interface AmadeusItinerary {
  duration: string
  segments: AmadeusSegment[]
}

export interface AmadeusFlightOffer {
  id: string
  oneWay: boolean
  numberOfBookableSeats: number
  itineraries: AmadeusItinerary[]
  price: {
    currency: string
    grandTotal: string
  }
  travelerPricings: Array<{
    fareDetailsBySegment: Array<{ cabin: string }>
  }>
}

export interface AmadeusLocation {
  cityCode: string
  countryCode: string
}

export interface AmadeusDictionaries {
  locations?: Record<string, AmadeusLocation>
  carriers?: Record<string, string>
}

export interface AmadeusFlightOffersResponse {
  data: AmadeusFlightOffer[]
  dictionaries?: AmadeusDictionaries
}

// /v1/shopping/flight-destinations (inspiration search)
export interface AmadeusFlightDestination {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  price: { total: string }
}

export interface AmadeusFlightDestinationsResponse {
  data: AmadeusFlightDestination[]
}

export interface AmadeusErrorResponse {
  errors: Array<{ status: number; code: number; title: string; detail?: string }>
}
