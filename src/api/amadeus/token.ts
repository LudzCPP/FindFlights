import type { AmadeusTokenResponse } from './types'

const BASE = 'https://test.api.amadeus.com'

interface CachedToken {
  value: string
  expiresAt: number
}

let cache: CachedToken | null = null

export async function getAmadeusToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cache && Date.now() < cache.expiresAt - 60_000) {
    return cache.value
  }

  const clientId     = import.meta.env.VITE_AMADEUS_CLIENT_ID
  const clientSecret = import.meta.env.VITE_AMADEUS_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error(
      'Brak konfiguracji Amadeus. Dodaj VITE_AMADEUS_CLIENT_ID i VITE_AMADEUS_CLIENT_SECRET do pliku .env.local',
    )
  }

  const res = await fetch(`${BASE}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'client_credentials',
      client_id:     clientId,
      client_secret: clientSecret,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Amadeus auth error ${res.status}: ${body}`)
  }

  const data: AmadeusTokenResponse = await res.json()
  cache = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 }
  return cache.value
}

export async function amadeusGet<T>(path: string, params: Record<string, string>): Promise<T> {
  const token = await getAmadeusToken()
  const url   = new URL(`${BASE}${path}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Amadeus API ${res.status} on ${path}: ${body}`)
  }

  return res.json() as Promise<T>
}
