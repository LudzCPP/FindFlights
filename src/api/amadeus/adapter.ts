import type { Flight, Airport, Airline, DealRating, CabinClass } from '@/types'
import { AIRPORTS, AIRLINES } from '@/data/mockData'
import type { AmadeusFlightOffer, AmadeusDictionaries } from './types'

// Approximate EUR → PLN rate. Replace with a live FX call in production.
const EUR_TO_PLN = 4.25

const COUNTRY_FLAGS: Record<string, string> = {
  PL: '🇵🇱', ES: '🇪🇸', PT: '🇵🇹', FR: '🇫🇷', NL: '🇳🇱',
  IT: '🇮🇹', GR: '🇬🇷', AE: '🇦🇪', TH: '🇹🇭', JP: '🇯🇵',
  US: '🇺🇸', GB: '🇬🇧', AT: '🇦🇹', CZ: '🇨🇿', MA: '🇲🇦',
  DE: '🇩🇪', BE: '🇧🇪', CH: '🇨🇭', NO: '🇳🇴', SE: '🇸🇪',
  DK: '🇩🇰', FI: '🇫🇮', HU: '🇭🇺', RO: '🇷🇴', HR: '🇭🇷',
  TR: '🇹🇷', UA: '🇺🇦', IS: '🇮🇸', SK: '🇸🇰', BG: '🇧🇬',
  RS: '🇷🇸', ME: '🇲🇪', AL: '🇦🇱', MK: '🇲🇰', SI: '🇸🇮',
  CY: '🇨🇾', MT: '🇲🇹', IE: '🇮🇪', LU: '🇱🇺', EE: '🇪🇪',
  LV: '🇱🇻', LT: '🇱🇹', EG: '🇪🇬', TN: '🇹🇳', IN: '🇮🇳',
  SG: '🇸🇬', KR: '🇰🇷', CN: '🇨🇳', AU: '🇦🇺', CA: '🇨🇦',
  MX: '🇲🇽', BR: '🇧🇷', ZA: '🇿🇦', KE: '🇰🇪', MU: '🇲🇺',
}

// Airline brand colors for carriers not in our local map
const FALLBACK_AIRLINE_COLORS: Record<string, string> = {
  LO: '#003087', FR: '#073590', W6: '#c6007e', VY: '#f9c300',
  LH: '#05164d', EK: '#d71920', TK: '#c8102e', EZY: '#ff6600',
  BA: '#075aaa', KL: '#009ada', AF: '#002157', U2: '#ff6600',
  SK: '#005691', AY: '#003580', OS: '#000000', SN: '#003399',
  IB: '#cc0000', TP: '#006400', A3: '#001489', BT: '#00205b',
  QR: '#6e0020', EY: '#bd8b13', SQ: '#003b5c', NH: '#13448c',
}

function parseDurationToMinutes(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  return (parseInt(m?.[1] ?? '0') * 60) + parseInt(m?.[2] ?? '0')
}

function extractTime(isoDatetime: string): string {
  return isoDatetime.slice(11, 16)  // "2024-08-12T06:15:00" → "06:15"
}

function resolveAirport(code: string, dicts?: AmadeusDictionaries): Airport {
  if (AIRPORTS[code]) return AIRPORTS[code]
  const loc  = dicts?.locations?.[code]
  const flag = loc ? (COUNTRY_FLAGS[loc.countryCode] ?? '🌍') : '🌍'
  return { code, name: code, city: loc?.cityCode ?? code, country: loc?.countryCode ?? '', flag }
}

function resolveAirline(code: string, dicts?: AmadeusDictionaries): Airline {
  if (AIRLINES[code]) return AIRLINES[code]
  const name  = dicts?.carriers?.[code] ?? code
  const color = FALLBACK_AIRLINE_COLORS[code] ?? '#374151'
  return { code, name, logoColor: color }
}

function parseCabin(offer: AmadeusFlightOffer): CabinClass {
  const raw = offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin?.toLowerCase() ?? 'economy'
  if (raw.includes('business')) return 'business'
  if (raw.includes('first'))    return 'first'
  if (raw.includes('premium'))  return 'premium-economy'
  return 'economy'
}

function computeDealRating(pricePln: number, origin: string, dest: string): DealRating {
  // Compare against our mock average if the route is known, else mark average
  const routeKey = `${origin}-${dest}`
  const MOCK_AVERAGES: Record<string, number> = {
    'WAW-BCN': 520, 'WAW-LIS': 580, 'WAW-ATH': 490, 'WAW-DXB': 2200,
    'WAW-CDG': 620, 'KRK-LHR': 380, 'WAW-BKK': 3200, 'WAW-FCO': 480,
    'GDN-AMS': 510, 'WAW-NRT': 5100,
  }
  const avg = MOCK_AVERAGES[routeKey]
  if (!avg) return 'average'
  const ratio = pricePln / avg
  if (ratio < 0.65) return 'super'
  if (ratio < 0.85) return 'good'
  if (ratio < 1.10) return 'average'
  return 'overpriced'
}

export function adaptFlightOffer(
  offer: AmadeusFlightOffer,
  dicts?: AmadeusDictionaries,
): Flight {
  const outbound  = offer.itineraries[0]
  const firstSeg  = outbound.segments[0]
  const lastSeg   = outbound.segments[outbound.segments.length - 1]

  const originCode = firstSeg.departure.iataCode
  const destCode   = lastSeg.arrival.iataCode
  const stops      = outbound.segments.length - 1

  const priceEur = parseFloat(offer.price.grandTotal)
  const pricePln = Math.round(priceEur * EUR_TO_PLN)

  const dealRating   = computeDealRating(pricePln, originCode, destCode)
  const avgPrice     = Math.round(pricePln * (dealRating === 'average' ? 1 : 1.15))
  const priceDropPln = Math.max(0, avgPrice - pricePln)

  const tags: string[] = []
  if (stops === 0) tags.push('Bezpośredni')
  else tags.push(`${stops} przesiadk${stops === 1 ? 'a' : 'i'}`)

  return {
    id:              offer.id,
    origin:          resolveAirport(originCode, dicts),
    destination:     resolveAirport(destCode, dicts),
    airline:         resolveAirline(firstSeg.carrierCode, dicts),
    flightNumber:    `${firstSeg.carrierCode} ${firstSeg.number}`,
    departureTime:   extractTime(firstSeg.departure.at),
    arrivalTime:     extractTime(lastSeg.arrival.at),
    durationMinutes: parseDurationToMinutes(outbound.duration),
    stops,
    stopoverCities:  outbound.segments.slice(0, -1).map((s) => s.arrival.iataCode),
    price:           pricePln,
    currency:        'PLN',
    cabin:           parseCabin(offer),
    tripType:        offer.itineraries.length > 1 ? 'round-trip' : 'one-way',
    availableSeats:  offer.numberOfBookableSeats,
    dealRating,
    averagePrice30d: avgPrice,
    priceDropPln,
    tags,
    departureDate: firstSeg.departure.at.split('T')[0],
    returnDate:    offer.itineraries.length > 1
      ? offer.itineraries[1].segments[0].departure.at.split('T')[0]
      : undefined,
  }
}
