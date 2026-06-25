export type TripType = 'one-way' | 'round-trip'
export type CabinClass = 'economy' | 'premium-economy' | 'business' | 'first'
export type DealRating = 'super' | 'good' | 'average' | 'overpriced'
export type VibeTag = 'all' | 'city-break' | 'beach' | 'exotic' | 'budget'

export interface Airport {
  code: string
  name: string
  city: string
  country: string
  flag: string
}

export interface Airline {
  code: string
  name: string
  logoColor: string
}

export interface Flight {
  id: string
  origin: Airport
  destination: Airport
  airline: Airline
  flightNumber: string
  departureTime: string
  arrivalTime: string
  durationMinutes: number
  stops: number
  stopoverCities: string[]
  price: number
  currency: string
  cabin: CabinClass
  tripType: TripType
  availableSeats: number
  dealRating: DealRating
  averagePrice30d: number
  priceDropPln: number
  tags: string[]
  departureDate: string
  returnDate?: string
}

export interface Deal {
  id: string
  origin: Airport
  destination: Airport
  airline: Airline
  price: number
  currency: string
  originalPrice: number
  discountPercent: number
  departureDate: string
  returnDate?: string
  durationDays?: number
  dealBadge: string
  dealBadgeIcon: string
  vibeTags: VibeTag[]
  imageGradient: string
  tripType: TripType
  dealRating: DealRating
  averagePrice30d: number
  priceDropPln: number
  tags: string[]
  isHot: boolean
  isWeekend: boolean
  isPriceDrop: boolean
}

export interface PricePoint {
  date: string
  price: number
}

export interface PriceHistory {
  routeKey: string
  origin: string
  destination: string
  dataPoints: PricePoint[]
  averagePrice: number
  lowestPrice: number
  highestPrice: number
  currentPrice: number
}

export interface SearchQuery {
  origin?: string
  destination?: string
  departureDate?: string
  returnDate?: string
  flexibleMonth?: number
  passengers: number
  cabin: CabinClass
  tripType: TripType
  maxPrice?: number
  vibeTag?: VibeTag
  rawPrompt?: string
}

export interface ParsedPrompt {
  origin?: string
  destination?: string
  flexibleMonth?: number
  maxPrice?: number
  passengers?: number
  vibe?: string
  confidence: number
  extractedTokens: string[]
}
