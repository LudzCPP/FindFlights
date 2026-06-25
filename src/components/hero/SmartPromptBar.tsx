import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { parseSmartPrompt } from '@/lib/smartParser'
import { useSearchStore } from '@/store/searchStore'
import { cn } from '@/lib/utils'
import type { ParsedPrompt } from '@/types'

const EXAMPLE_PROMPTS = [
  'Szukam lotu w sierpniu z Warszawy gdziekolwiek, byle było ciepło i do 500 zł w obie strony',
  'Lot z Krakowa do Londynu w październiku, max 400 zł',
  'Najtańszy lot z Gdańska w lipcu, 2 osoby',
  'Chcę do Barcelony we wrześniu, budżet do 600 zł',
]

export function SmartPromptBar() {
  const [value, setValue] = useState('')
  const [parsed, setParsed] = useState<ParsedPrompt | null>(null)
  const [isParsing, setIsParsing] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const { setQuery, runSearch } = useSearchStore()

  const handleSubmit = () => {
    if (!value.trim()) return
    setIsParsing(true)
    setParsed(null)

    setTimeout(() => {
      const result = parseSmartPrompt(value)
      setParsed(result)
      setIsParsing(false)

      setQuery({
        rawPrompt: value,
        origin: result.origin,
        destination: result.destination === 'ANY' ? undefined : result.destination,
        flexibleMonth: result.flexibleMonth,
        maxPrice: result.maxPrice,
        passengers: result.passengers ?? 1,
      })

      setTimeout(() => runSearch(), 300)
    }, 800)
  }

  const handleExample = (prompt: string) => {
    setValue(prompt)
    setParsed(null)
  }

  return (
    <div className="w-full space-y-4">
      {/* Glowing prompt input */}
      <div
        className={cn(
          'relative rounded-2xl border transition-all duration-300',
          isFocused
            ? 'border-cyan-500/60 shadow-glow-cyan'
            : 'border-border hover:border-border/80',
          'bg-surface-2',
        )}
      >
        <div className="flex items-start gap-3 p-4">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 border border-cyan-500/20">
            <Sparkles className="h-4 w-4 text-cyan-400" />
          </div>
          <textarea
            value={value}
            onChange={(e) => { setValue(e.target.value); setParsed(null) }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            placeholder={'Opisz swój wymarzony wyjazd po polsku... np. "Szukam lotu z Warszawy w sierpniu, max 500 zł, ciepłe miejsce"'}
            className="w-full resize-none bg-transparent text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none min-h-[60px] leading-relaxed"
            rows={2}
          />
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
          <span className="text-xs text-zinc-600">
            Enter ↵ aby wyszukać · Shift+Enter nowa linia
          </span>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!value.trim() || isParsing}
            className="gap-2"
          >
            {isParsing ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Analizuję...</>
            ) : (
              <><Sparkles className="h-3.5 w-3.5" /> Szukaj</>
            )}
          </Button>
        </div>
      </div>

      {/* Parsed tokens feedback */}
      <AnimatePresence>
        {parsed && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">
                Wykryłem {parsed.extractedTokens.length} parametrów · pewność: {parsed.confidence}%
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {parsed.extractedTokens.map((token) => (
                <span
                  key={token}
                  className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs text-emerald-300"
                >
                  {token}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Example prompts */}
      <div>
        <p className="text-xs text-zinc-600 mb-2">Spróbuj przykładu:</p>
        <div className="flex flex-col gap-1.5">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleExample(prompt)}
              className="flex items-center gap-2 text-left text-xs text-zinc-500 hover:text-zinc-300 transition-colors group"
            >
              <ArrowRight className="h-3 w-3 text-zinc-600 group-hover:text-cyan-400 transition-colors shrink-0" />
              <span className="line-clamp-1">{prompt}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
