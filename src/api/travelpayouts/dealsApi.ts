import type { Deal, DealRating, VibeTag } from '@/types'
import type { TpLatestResponse, TpLatestPrice } from './types'
import { resolveAirport } from './adapter'

const TP_BASE = '/tp-api'

const DEST_VIBES: Record<string, VibeTag[]> = {
  BCN: ['beach', 'city-break'], MAD: ['city-break'], PMI: ['beach'],
  AGP: ['beach'], TFS: ['beach'], VLC: ['city-break'],
  LIS: ['city-break'], OPO: ['city-break'], FAO: ['beach'],
  CDG: ['city-break'], AMS: ['city-break'], LHR: ['city-break'], MAN: ['city-break'],
  EDI: ['city-break'], BHX: ['city-break'],
  FCO: ['city-break'], MXP: ['city-break'], VCE: ['city-break'],
  NAP: ['city-break', 'beach'], BGY: ['city-break'],
  ATH: ['beach', 'city-break'], HER: ['beach'], SKG: ['beach'],
  RHO: ['beach'], CFU: ['beach'],
  DXB: ['exotic', 'city-break'], AUH: ['exotic'],
  BKK: ['exotic', 'beach'], HKT: ['exotic', 'beach'],
  NRT: ['exotic'], HND: ['exotic'], KIX: ['exotic'],
  SIN: ['exotic'], DEL: ['exotic'], BOM: ['exotic'],
  CAI: ['exotic'], SSH: ['beach', 'exotic'],
  AYT: ['beach'], IST: ['exotic', 'city-break'], SAW: ['exotic'],
  VIE: ['city-break'], PRG: ['city-break'], BUD: ['city-break'],
  CPH: ['city-break'], ARN: ['city-break'], OSL: ['city-break'], HEL: ['city-break'],
  RAK: ['exotic'], CMN: ['exotic'], TUN: ['exotic', 'beach'],
  MUC: ['city-break'], FRA: ['city-break'], BER: ['city-break'],
  DUB: ['city-break'], SYD: ['exotic'], MEL: ['exotic'],
}

const DEST_GRADIENT: Record<string, string> = {
  BCN: 'from-orange-500 via-rose-500 to-pink-600',
  MAD: 'from-red-600 via-orange-500 to-yellow-500',
  PMI: 'from-sky-400 via-blue-500 to-cyan-400',
  AGP: 'from-yellow-400 via-orange-400 to-red-500',
  TFS: 'from-amber-400 via-orange-400 to-red-500',
  LIS: 'from-emerald-500 via-teal-500 to-cyan-600',
  OPO: 'from-teal-500 via-cyan-500 to-blue-600',
  CDG: 'from-blue-600 via-indigo-600 to-violet-700',
  AMS: 'from-orange-400 via-amber-400 to-yellow-300',
  LHR: 'from-slate-600 via-blue-700 to-indigo-800',
  FCO: 'from-amber-500 via-orange-500 to-red-600',
  VCE: 'from-rose-400 via-pink-500 to-purple-600',
  ATH: 'from-sky-400 via-blue-500 to-cyan-600',
  HER: 'from-blue-400 via-sky-400 to-cyan-300',
  RHO: 'from-sky-500 via-blue-600 to-indigo-700',
  CFU: 'from-teal-400 via-cyan-400 to-sky-500',
  DXB: 'from-yellow-400 via-amber-500 to-orange-600',
  BKK: 'from-purple-500 via-pink-500 to-rose-600',
  HKT: 'from-teal-400 via-emerald-400 to-cyan-500',
  NRT: 'from-rose-400 via-pink-500 to-purple-600',
  IST: 'from-red-500 via-rose-600 to-pink-700',
  RAK: 'from-orange-600 via-red-600 to-rose-700',
  CMN: 'from-amber-600 via-orange-600 to-red-700',
  VIE: 'from-slate-500 via-zinc-600 to-stone-700',
  PRG: 'from-amber-600 via-orange-600 to-red-700',
  BUD: 'from-red-600 via-rose-600 to-pink-700',
  SIN: 'from-red-500 via-rose-500 to-pink-600',
  DEL: 'from-orange-500 via-yellow-500 to-amber-600',
  SSH: 'from-cyan-400 via-sky-400 to-blue-500',
  AYT: 'from-red-500 via-orange-500 to-yellow-500',
  CPH: 'from-blue-700 via-indigo-600 to-violet-700',
  DUB: 'from-emerald-600 via-green-600 to-teal-700',
  MUC: 'from-blue-600 via-sky-600 to-cyan-700',
}

const DEFAULT_GRADIENT = 'from-zinc-600 via-slate-600 to-gray-700'

const KNOWN_AVGS: Record<string, number> = {
  'WAW-BCN': 520, 'WAW-LIS': 580, 'WAW-ATH': 490, 'WAW-DXB': 2200,
  'WAW-CDG': 620, 'WAW-BKK': 3200, 'WAW-FCO': 480, 'WAW-NRT': 5100,
  'WAW-MAD': 600, 'WAW-VIE': 350, 'WAW-PRG': 300, 'WAW-AMS': 400,
  'WAW-MUC': 350, 'WAW-LHR': 500, 'WAW-IST': 800, 'WAW-DUB': 600,
  'WAW-HER': 550, 'WAW-RHO': 600, 'WAW-PMI': 490, 'WAW-TFS': 700,
  'WAW-CPH': 450, 'WAW-ARN': 480, 'WAW-BUD': 320, 'WAW-OSL': 520,
  'KRK-LHR': 380, 'KRK-BCN': 450, 'KRK-FCO': 420, 'KRK-CDG': 550,
  'KRK-AMS': 480, 'KRK-VIE': 300, 'KRK-ATH': 500, 'KRK-DXB': 2000,
  'GDN-AMS': 510, 'GDN-LHR': 400, 'GDN-CDG': 520, 'GDN-BCN': 480,
  'WRO-BCN': 480, 'WRO-LHR': 430, 'WRO-FCO': 440, 'WRO-CDG': 530,
}

function computeRating(price: number, origin: string, dest: string): DealRating {
  const avg = KNOWN_AVGS[`${origin}-${dest}`]
  if (!avg) return price < 200 ? 'good' : 'average'
  const r = price / avg
  if (r < 0.65) return 'super'
  if (r < 0.85) return 'good'
  if (r < 1.12) return 'average'
  return 'overpriced'
}

async function fetchLatestForOrigin(origin: string, token: string): Promise<TpLatestPrice[]> {
  const params = new URLSearchParams({
    origin,
    currency:    'pln',
    period_type: 'year',
    limit:       '30',
    token,
  })
  try {
    const res = await fetch(`${TP_BASE}/v2/prices/latest?${params}`)
    if (!res.ok) return []
    const json: TpLatestResponse = await res.json()
    return json.success ? json.data : []
  } catch {
    return []
  }
}

function toDeal(item: TpLatestPrice): Deal | null {
  const { origin, destination: dest, value: price, depart_date, return_date, number_of_changes } = item
  const rating = computeRating(price, origin, dest)
  if (rating === 'average' || rating === 'overpriced') return null

  const avgPrice       = KNOWN_AVGS[`${origin}-${dest}`] ?? Math.round(price * 1.35)
  const dropPln        = Math.max(0, avgPrice - price)
  const discountPercent = Math.round((dropPln / avgPrice) * 100)

  const vibes: VibeTag[] = [...(DEST_VIBES[dest] ?? [])]
  if (price < 250 && !vibes.includes('budget')) vibes.push('budget')

  const isHot      = rating === 'super'
  const isPriceDrop = dropPln > 50

  let dealBadge     = 'Dobra cena'
  let dealBadgeIcon = '✈️'
  if (isHot && discountPercent >= 35) { dealBadge = 'Hot deal!';              dealBadgeIcon = '🔥' }
  else if (isHot)                      { dealBadge = `-${discountPercent}% taniej`; dealBadgeIcon = '🔥' }
  else if (isPriceDrop)                { dealBadge = 'Cena spada!';           dealBadgeIcon = '📉' }

  let durationDays: number | undefined
  if (return_date) {
    durationDays = Math.round(
      (new Date(return_date).getTime() - new Date(depart_date).getTime()) / 86400000,
    )
  }

  const depDay    = new Date(depart_date).getDay()
  const isWeekend = depDay === 5 || depDay === 6 || depDay === 0

  return {
    id:              `live-${origin}-${dest}-${depart_date}`,
    origin:          resolveAirport(origin),
    destination:     resolveAirport(dest),
    airline:         { code: 'TP', name: 'Różne linie', logoColor: '#64748b' },
    price,
    currency:        'PLN',
    originalPrice:   avgPrice,
    discountPercent,
    departureDate:   depart_date,
    returnDate:      return_date,
    durationDays,
    dealBadge,
    dealBadgeIcon,
    vibeTags:        vibes.length > 0 ? vibes : ['city-break'],
    imageGradient:   DEST_GRADIENT[dest] ?? DEFAULT_GRADIENT,
    tripType:        return_date ? 'round-trip' : 'one-way',
    dealRating:      rating,
    averagePrice30d: avgPrice,
    priceDropPln:    dropPln,
    tags:            [number_of_changes === 0 ? 'Bezpośredni' : `${number_of_changes} przesiadka`],
    isHot,
    isWeekend,
    isPriceDrop,
  }
}

export async function fetchLiveDeals(): Promise<Deal[]> {
  const token = import.meta.env.VITE_TRAVELPAYOUTS_TOKEN
  if (!token) throw new Error('Brak VITE_TRAVELPAYOUTS_TOKEN')

  const settled = await Promise.allSettled(
    ['WAW', 'KRK', 'GDN', 'WRO'].map((o) => fetchLatestForOrigin(o, token)),
  )

  const allItems: TpLatestPrice[] = []
  for (const r of settled) {
    if (r.status === 'fulfilled') allItems.push(...r.value)
  }

  const deals = allItems.map(toDeal).filter((d): d is Deal => d !== null)

  // One deal per destination — keep cheapest
  const seen = new Map<string, Deal>()
  for (const d of deals) {
    const existing = seen.get(d.destination.code)
    if (!existing || d.price < existing.price) seen.set(d.destination.code, d)
  }

  const ORDER: Record<string, number> = { super: 0, good: 1, average: 2, overpriced: 3 }
  return [...seen.values()]
    .sort((a, b) => ORDER[a.dealRating] - ORDER[b.dealRating] || a.price - b.price)
    .slice(0, 12)
}
