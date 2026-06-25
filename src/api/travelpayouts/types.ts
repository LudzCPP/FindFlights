// Raw shapes from the Travelpayouts Data API.
// Docs: https://travelpayouts.github.io/slate/

// GET /v1/prices/cheap — specific route, grouped by destination → transfer count
export interface TpCheapPrice {
  price: number
  airline: string
  flight_number: number
  departure_at: string   // "2024-08-12T06:15:00.000Z"
  return_at?: string
  expires_at: string
}

export interface TpCheapResponse {
  success: boolean
  data: Record<string, Record<string, TpCheapPrice>>  // { BCN: { "0": {...} } }
  currency: string
}

// GET /v2/prices/latest — inspiration / "anywhere" search, flat array
export interface TpLatestPrice {
  show_to_affiliates: boolean
  trip_class: number
  origin: string
  destination: string
  depart_date: string    // "2024-08-12"
  return_date?: string
  number_of_changes: number
  value: number          // price in requested currency
  found_at: string
  distance: number
  actual: boolean
}

export interface TpLatestResponse {
  success: boolean
  data: TpLatestPrice[]
}
