import { Plane, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-glow-cyan">
              <Plane className="h-4 w-4 text-background" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Sky<span className="text-cyan-400">Sniffer</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <a href="#" className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-surface-2">
              Wyszukaj
            </a>
            <a href="#" className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-surface-2">
              Okazje
            </a>
            <a href="#" className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-surface-2">
              Śledzenie cen
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
              <Zap className="h-3 w-3 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">Ceny na żywo</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
