import { useSearchStore } from '@/store/searchStore'
import { cn } from '@/lib/utils'
import type { VibeTag } from '@/types'

const FILTERS: { tag: VibeTag; label: string; icon: string }[] = [
  { tag: 'all',        label: 'Wszystkie',       icon: '✈️' },
  { tag: 'city-break', label: 'City Break',       icon: '🏙️' },
  { tag: 'beach',      label: 'Plaża & słońce',   icon: '🏖️' },
  { tag: 'exotic',     label: 'Egzotyka',         icon: '🌴' },
  { tag: 'budget',     label: 'Tanio i szybko',   icon: '💨' },
]

export function VibeFilters() {
  const { selectedVibeTag, setVibeTag } = useSearchStore()

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map(({ tag, label, icon }) => (
        <button
          key={tag}
          onClick={() => setVibeTag(tag)}
          className={cn(
            'flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200',
            selectedVibeTag === tag
              ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400'
              : 'border-border text-zinc-400 hover:border-zinc-600 hover:text-white bg-surface-2',
          )}
        >
          <span>{icon}</span>
          {label}
        </button>
      ))}
    </div>
  )
}
