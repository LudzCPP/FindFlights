import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Sparkles } from 'lucide-react'
import { ClassicSearchForm } from './ClassicSearchForm'
import { SmartPromptBar } from './SmartPromptBar'
import { cn } from '@/lib/utils'

type HeroTab = 'classic' | 'smart'

const STATS = [
  { label: 'aktywnych tras', value: '12 400+' },
  { label: 'okazji dzisiaj', value: '284' },
  { label: 'zł zaoszczędzono', value: '3.2M' },
]

export function SearchHero() {
  const [activeTab, setTab] = useState<HeroTab>('classic')

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Background glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/3 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse-slow" />
            <span className="text-xs font-medium text-cyan-400">
              AI-powered · Ceny aktualizowane co 15 minut
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Znajdź lot{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              taniej niż wszyscy
            </span>
          </h1>
          <p className="mt-4 text-lg text-zinc-400 max-w-xl mx-auto">
            Poluj na okazje cenowe zanim zrobi to ktoś inny. Wpisz cel lub opisz wymarzony wyjazd po polsku.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 flex justify-center gap-8"
        >
          {STATS.map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-xs text-zinc-500">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Search card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="rounded-2xl border border-border bg-surface/80 backdrop-blur-xl shadow-glass p-6"
        >
          {/* Tab switcher */}
          <div className="mb-6 flex gap-1 rounded-xl bg-surface-3 p-1 w-fit">
            <button
              onClick={() => setTab('classic')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === 'classic'
                  ? 'bg-surface text-white shadow-sm border border-border'
                  : 'text-zinc-500 hover:text-zinc-300',
              )}
            >
              <Search className="h-3.5 w-3.5" />
              Wyszukiwarka
            </button>
            <button
              onClick={() => setTab('smart')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === 'smart'
                  ? 'bg-surface text-white shadow-sm border border-border'
                  : 'text-zinc-500 hover:text-zinc-300',
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Smart Prompt
              <span className="rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] px-1.5 py-0.5 font-semibold">
                AI
              </span>
            </button>
          </div>

          {activeTab === 'classic' ? <ClassicSearchForm /> : <SmartPromptBar />}
        </motion.div>
      </div>
    </section>
  )
}
