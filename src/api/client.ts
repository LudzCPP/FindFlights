// Base HTTP client — swap the baseURL for real provider when ready.
// Current candidates: Amadeus for Developers (free sandbox), kiwi.com Tequila API.

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const API_KEY  = import.meta.env.VITE_API_KEY ?? ''

export async function apiGet<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  }

  const res = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`)
  }

  return res.json() as Promise<T>
}
