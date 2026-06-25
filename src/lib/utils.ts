import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}g ${m.toString().padStart(2, '0')}min`
}

export function formatPrice(price: number, currency = 'PLN'): string {
  return `${price.toLocaleString('pl-PL')} ${currency}`
}
