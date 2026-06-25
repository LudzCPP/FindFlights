import { Search, Flame, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSearchStore, type AppSection } from '@/store/searchStore'
import { cn } from '@/lib/utils'

const TABS: { section: AppSection; icon: React.ElementType; label: string }[] = [
  { section: 'search',  icon: Search,     label: 'Szukaj' },
  { section: 'deals',   icon: Flame,      label: 'Okazje' },
  { section: 'tracker', icon: TrendingUp, label: 'Ceny' },
]

export function MobileNav() {
  const { activeSection, setActiveSection } = useSearchStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-border bg-background/90 backdrop-blur-xl">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {TABS.map(({ section, icon: Icon, label }) => {
          const isActive = activeSection === section
          return (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className="relative flex flex-col items-center gap-1 px-6 py-1.5 rounded-xl transition-colors"
            >
              {isActive && (
                <motion.span
                  layoutId="mobile-nav-indicator"
                  className="absolute inset-0 rounded-xl bg-surface-2"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <Icon
                className={cn(
                  'relative h-5 w-5 transition-colors',
                  isActive ? 'text-cyan-400' : 'text-zinc-500',
                )}
              />
              <span
                className={cn(
                  'relative text-[10px] font-medium transition-colors',
                  isActive ? 'text-cyan-400' : 'text-zinc-600',
                )}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
