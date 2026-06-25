import { Plane, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSearchStore, type AppSection } from '@/store/searchStore'
import { cn } from '@/lib/utils'

const NAV_ITEMS: { label: string; section: AppSection }[] = [
  { label: 'Wyszukaj', section: 'search' },
  { label: 'Okazje', section: 'deals' },
  { label: 'Śledzenie cen', section: 'tracker' },
]

export function Header() {
  const { activeSection, setActiveSection } = useSearchStore()

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => setActiveSection('search')}
            className="flex items-center gap-2.5 shrink-0"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-glow-cyan">
              <Plane className="h-4 w-4 text-background" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Sky<span className="text-cyan-400">Sniffer</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ label, section }) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={cn(
                  'relative px-3 py-1.5 text-sm font-medium transition-colors rounded-lg',
                  activeSection === section
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-surface-2',
                )}
              >
                {label}
                {activeSection === section && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-surface-2 border border-border -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Live badge */}
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 shrink-0">
            <Zap className="h-3 w-3 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400 hidden sm:inline">Ceny na żywo</span>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
