import type { ParsedPrompt } from '@/types'

const MONTH_MAP: Record<string, number> = {
  styczeń: 1, stycznia: 1, styczen: 1,
  luty: 2, lutego: 2,
  marzec: 3, marca: 3,
  kwiecień: 4, kwietnia: 4, kwiecien: 4,
  maj: 5, maja: 5,
  czerwiec: 6, czerwca: 6,
  lipiec: 7, lipca: 7,
  sierpień: 8, sierpnia: 8, sierpien: 8,
  wrzesień: 9, września: 9, wrzesien: 9,
  październik: 10, października: 10, pazdziernik: 10,
  listopad: 11, listopada: 11,
  grudzień: 12, grudnia: 12, grudzien: 12,
}

const CITY_TO_IATA: Record<string, string> = {
  warszawa: 'WAW', warszawy: 'WAW', warsaw: 'WAW',
  kraków: 'KRK', krakow: 'KRK', krakowie: 'KRK',
  gdańsk: 'GDN', gdansk: 'GDN', gdańsku: 'GDN',
  wrocław: 'WRO', wroclaw: 'WRO',
  barcelona: 'BCN', barcelony: 'BCN',
  lizbona: 'LIS', lizbony: 'LIS',
  paryż: 'CDG', paryza: 'CDG', paryz: 'CDG',
  amsterdam: 'AMS',
  rzym: 'FCO', rzymu: 'FCO',
  ateny: 'ATH', aten: 'ATH',
  dubaj: 'DXB', dubaju: 'DXB',
  bangkok: 'BKK',
  tokio: 'NRT', tokyo: 'NRT',
  londyn: 'LHR', londynu: 'LHR', london: 'LHR',
  wiedeń: 'VIE', wiedniu: 'VIE', wieden: 'VIE',
  praga: 'PRG', pradze: 'PRG',
}

const VIBE_KEYWORDS: Record<string, string> = {
  ciepło: 'beach', ciepłe: 'beach', plaża: 'beach', morze: 'beach', słońce: 'beach',
  egzotyk: 'exotic', egzotyka: 'exotic', daleko: 'exotic',
  city: 'city-break', break: 'city-break', miasto: 'city-break',
  tanio: 'budget', tanie: 'budget', tani: 'budget', budżet: 'budget',
}

export function parseSmartPrompt(raw: string): ParsedPrompt {
  const text = raw.toLowerCase()
  const tokens = text.split(/\s+/)
  const extracted: string[] = []
  const result: ParsedPrompt = { confidence: 0, extractedTokens: [] }

  // Month detection
  for (const token of tokens) {
    const clean = token.replace(/[,.:;!?]/g, '')
    if (MONTH_MAP[clean]) {
      result.flexibleMonth = MONTH_MAP[clean]
      extracted.push(`miesiąc: ${clean}`)
      break
    }
  }

  // Origin detection — look for "z [miasto]" pattern
  const originMatch = text.match(/\bz\s+([a-ząćęłńóśźż]+)/i)
  if (originMatch) {
    const city = originMatch[1].toLowerCase()
    const iata = CITY_TO_IATA[city]
    if (iata) {
      result.origin = iata
      extracted.push(`skąd: ${city.toUpperCase()} (${iata})`)
    }
  }

  // Destination detection — look for "do [miasto]" or "gdziekolwiek/anywhere"
  if (/gdziekolwiek|anywhere|wszędzie|dowolne/i.test(text)) {
    result.destination = 'ANY'
    extracted.push('dokąd: gdziekolwiek')
  } else {
    const destMatch = text.match(/\bdo\s+([a-ząćęłńóśźż]+)/i)
    if (destMatch) {
      const city = destMatch[1].toLowerCase()
      const iata = CITY_TO_IATA[city]
      if (iata) {
        result.destination = iata
        extracted.push(`dokąd: ${city} (${iata})`)
      }
    }
  }

  // Price detection — "do 500 zł", "max 800", "500 zł", "poniżej 1000"
  const priceMatch = text.match(/(?:do|max|maksymalnie|poniżej|ponizej)?\s*(\d{2,5})\s*(?:zł|pln|złotych)?/i)
  if (priceMatch) {
    const price = parseInt(priceMatch[1], 10)
    if (price >= 50 && price <= 20000) {
      result.maxPrice = price
      extracted.push(`max cena: ${price} PLN`)
    }
  }

  // Passenger detection
  const passMatch = text.match(/(\d)\s*(?:osoby|osób|pasażer|passengers|ludzi)/i)
  if (passMatch) {
    result.passengers = parseInt(passMatch[1], 10)
    extracted.push(`pasażerowie: ${passMatch[1]}`)
  }

  // Vibe detection
  for (const [keyword, vibe] of Object.entries(VIBE_KEYWORDS)) {
    if (text.includes(keyword)) {
      result.vibe = vibe
      extracted.push(`klimat: ${vibe}`)
      break
    }
  }

  // Confidence scoring
  let score = 0
  if (result.origin) score += 30
  if (result.destination) score += 30
  if (result.flexibleMonth) score += 20
  if (result.maxPrice) score += 15
  if (result.vibe) score += 5
  result.confidence = Math.min(score, 100)
  result.extractedTokens = extracted

  return result
}
