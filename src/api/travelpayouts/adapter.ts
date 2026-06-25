import type { Flight, Airport, Airline, DealRating } from '@/types'
import { AIRPORTS, AIRLINES } from '@/data/mockData'
import type { TpCheapPrice, TpLatestPrice } from './types'

const COUNTRY_FLAGS: Record<string, string> = {
  PL: '🇵🇱', ES: '🇪🇸', PT: '🇵🇹', FR: '🇫🇷', NL: '🇳🇱',
  IT: '🇮🇹', GR: '🇬🇷', AE: '🇦🇪', TH: '🇹🇭', JP: '🇯🇵',
  US: '🇺🇸', GB: '🇬🇧', AT: '🇦🇹', CZ: '🇨🇿', MA: '🇲🇦',
  DE: '🇩🇪', BE: '🇧🇪', CH: '🇨🇭', NO: '🇳🇴', SE: '🇸🇪',
  DK: '🇩🇰', FI: '🇫🇮', HU: '🇭🇺', RO: '🇷🇴', HR: '🇭🇷',
  TR: '🇹🇷', UA: '🇺🇦', IS: '🇮🇸', SK: '🇸🇰', BG: '🇧🇬',
  RS: '🇷🇸', CY: '🇨🇾', MT: '🇲🇹', IE: '🇮🇪', EE: '🇪🇪',
  EG: '🇪🇬', TN: '🇹🇳', IN: '🇮🇳', SG: '🇸🇬', AU: '🇦🇺',
}

// IATA code → country code mapping for airports not in our local map
const IATA_COUNTRY: Record<string, string> = {
  MUC: 'DE', FRA: 'DE', BER: 'DE', HAM: 'DE', STR: 'DE', DUS: 'DE',
  LHR: 'GB', LGW: 'GB', MAN: 'GB', EDI: 'GB', BHX: 'GB',
  CDG: 'FR', ORY: 'FR', NCE: 'FR', MRS: 'FR', LYS: 'FR',
  AMS: 'NL', EIN: 'NL',
  MAD: 'ES', BCN: 'ES', PMI: 'ES', AGP: 'ES', VLC: 'ES', TFS: 'ES',
  FCO: 'IT', MXP: 'IT', VCE: 'IT', NAP: 'IT', BGY: 'IT',
  LIS: 'PT', OPO: 'PT', FAO: 'PT',
  ATH: 'GR', HER: 'GR', SKG: 'GR', RHO: 'GR', CFU: 'GR',
  VIE: 'AT', SZG: 'AT',
  PRG: 'CZ', BRQ: 'CZ',
  BUD: 'HU', DEB: 'HU',
  DXB: 'AE', AUH: 'AE', SHJ: 'AE',
  BKK: 'TH', HKT: 'TH', CNX: 'TH',
  NRT: 'JP', HND: 'JP', KIX: 'JP',
  JFK: 'US', LAX: 'US', ORD: 'US', MIA: 'US',
  IST: 'TR', SAW: 'TR', AYT: 'TR',
  DUB: 'IE', BRS: 'GB', NCL: 'GB',
  CPH: 'DK', ARN: 'SE', OSL: 'NO', HEL: 'FI',
  RAK: 'MA', CMN: 'MA', TNG: 'MA',
  CAI: 'EG', SSH: 'EG',
  TUN: 'TN',
  DEL: 'IN', BOM: 'IN',
  SIN: 'SG',
  SYD: 'AU', MEL: 'AU',
  WAW: 'PL', KRK: 'PL', GDN: 'PL', WRO: 'PL', KTW: 'PL', POZ: 'PL',
}

const AIRLINE_COLORS: Record<string, string> = {
  LO: '#003087', FR: '#073590', W6: '#c6007e', VY: '#f9c300',
  LH: '#05164d', EK: '#d71920', TK: '#c8102e', EZY: '#ff6600',
  BA: '#075aaa', KL: '#009ada', AF: '#002157', SK: '#005691',
  AY: '#003580', OS: '#00205b', IB: '#cc0000', TP: '#006400',
  A3: '#001489', BT: '#00205b', QR: '#6e0020', EY: '#bd8b13',
  SQ: '#003b5c', NH: '#13448c', U2: '#ff6600', DL: '#e01933',
  AA: '#0078d2', UA: '#003366', WN: '#304cb2', PC: '#ff6600',
  VU: '#ff6600', RK: '#002060',
}

export function resolveAirport(code: string): Airport {
  if (AIRPORTS[code]) return AIRPORTS[code]
  const country = IATA_COUNTRY[code] ?? ''
  const flag    = COUNTRY_FLAGS[country] ?? '🌍'
  return { code, name: code, city: code, country, flag }
}

function resolveAirline(code: string): Airline {
  if (AIRLINES[code]) return AIRLINES[code]
  return { code, name: code, logoColor: AIRLINE_COLORS[code] ?? '#374151' }
}

function addMinutes(time: string, minutes: number): string {
  if (!time || time === '00:00') return '??:??'
  const [h, m]   = time.split(':').map(Number)
  const total    = h * 60 + m + minutes
  const arrH     = Math.floor((total % 1440) / 60)
  const arrM     = total % 60
  return `${String(arrH).padStart(2, '0')}:${String(arrM).padStart(2, '0')}`
}

function extractTime(iso: string): string {
  if (iso.includes('T')) return iso.slice(11, 16)
  return '06:00'   // TP v2 gives date only; use placeholder
}

function computeDealRating(price: number, origin: string, dest: string): DealRating {
  const KNOWN_AVGS: Record<string, number> = {
    'WAW-BCN': 520, 'WAW-LIS': 580, 'WAW-ATH': 490, 'WAW-DXB': 2200,
    'WAW-CDG': 620, 'KRK-LHR': 380, 'WAW-BKK': 3200, 'WAW-FCO': 480,
    'GDN-AMS': 510, 'WAW-NRT': 5100, 'WAW-MAD': 600, 'WAW-VIE': 350,
    'WAW-PRG': 300, 'WAW-AMS': 400, 'WAW-MUC': 350, 'WAW-LHR': 500,
  }
  const avg = KNOWN_AVGS[`${origin}-${dest}`]
  if (!avg) return 'average'
  const r = price / avg
  if (r < 0.60) return 'super'
  if (r < 0.82) return 'good'
  if (r < 1.12) return 'average'
  return 'overpriced'
}

const EUR_TO_PLN = 4.25

// ── From /v1/prices/cheap ─────────────────────────────────────────────────

export function adaptCheapPrice(
  destCode: string,
  transferCount: string,
  item: TpCheapPrice,
  originCode: string,
  responseCurrency = 'PLN',
): Flight {
  const stops      = parseInt(transferCount, 10)
  const depTime    = extractTime(item.departure_at)
  const depDate    = item.departure_at.split('T')[0]
  const retDate    = item.return_at?.split('T')[0]
  const pricePln   = responseCurrency.toUpperCase() === 'EUR'
    ? Math.round(item.price * EUR_TO_PLN)
    : item.price
  const dealRating = computeDealRating(pricePln, originCode, destCode)
  const avgPrice   = Math.round(pricePln * (dealRating === 'overpriced' ? 0.9 : 1.18))
  const dropPln    = Math.max(0, avgPrice - pricePln)

  const tags: string[] = [stops === 0 ? 'Bezpośredni' : `${stops} przesiadka`]

  return {
    id:              `tp-${originCode}-${destCode}-${item.flight_number}-${depDate}`,
    origin:          resolveAirport(originCode),
    destination:     resolveAirport(destCode),
    airline:         resolveAirline(item.airline),
    flightNumber:    `${item.airline} ${item.flight_number}`,
    departureTime:   depTime,
    arrivalTime:     addMinutes(depTime, 150),  // TP doesn't provide duration; estimate
    durationMinutes: 150,
    stops,
    stopoverCities:  [],
    price:           pricePln,
    currency:        'PLN',
    cabin:           'economy',
    tripType:        retDate ? 'round-trip' : 'one-way',
    availableSeats:  Math.floor(Math.random() * 12) + 2,
    dealRating,
    averagePrice30d: avgPrice,
    priceDropPln:    dropPln,
    tags,
    departureDate:   depDate,
    returnDate:      retDate,
  }
}

// ── From /v2/prices/latest ────────────────────────────────────────────────

export function adaptLatestPrice(item: TpLatestPrice): Flight {
  const stops      = item.number_of_changes
  const pricePln   = item.value
  const dealRating = computeDealRating(pricePln, item.origin, item.destination)
  const avgPrice   = Math.round(pricePln * (dealRating === 'overpriced' ? 0.9 : 1.18))
  const dropPln    = Math.max(0, avgPrice - pricePln)

  return {
    id:              `tp2-${item.origin}-${item.destination}-${item.depart_date}`,
    origin:          resolveAirport(item.origin),
    destination:     resolveAirport(item.destination),
    airline:         { code: 'TP', name: 'Różne linie', logoColor: '#64748b' },
    flightNumber:    '—',
    departureTime:   '',   // v2 API provides date only, no departure time
    arrivalTime:     '',
    durationMinutes: Math.round((item.distance / 900) * 60),
    stops,
    stopoverCities:  [],
    price:           pricePln,
    currency:        'PLN',
    cabin:           'economy',
    tripType:        item.return_date ? 'round-trip' : 'one-way',
    availableSeats:  Math.floor(Math.random() * 12) + 2,
    dealRating,
    averagePrice30d: avgPrice,
    priceDropPln:    dropPln,
    tags:            [stops === 0 ? 'Bezpośredni' : `${stops} przesiadka`],
    departureDate:   item.depart_date,
    returnDate:      item.return_date,
  }
}
