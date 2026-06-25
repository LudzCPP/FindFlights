import { Plane, Github, Twitter, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSearchStore } from '@/store/searchStore'

const STATS = [
  { value: '12 400+', label: 'aktywnych tras' },
  { value: '284',     label: 'okazji dzisiaj' },
  { value: '3.2M zł', label: 'zaoszczędzono' },
  { value: '15 min',  label: 'czas odświeżenia' },
]

const LINKS = {
  Produkt: ['Jak to działa', 'API', 'Cennik', 'Changelog'],
  Wsparcie: ['Centrum pomocy', 'Kontakt', 'Status systemu', 'FAQ'],
  Prawne:   ['Regulamin', 'Polityka prywatności', 'Cookies'],
}

export function Footer() {
  const { setActiveSection } = useSearchStore()

  return (
    <footer className="border-t border-border bg-surface mt-20">
      {/* Alert CTA strip */}
      <div className="border-b border-border bg-gradient-to-r from-cyan-500/5 via-transparent to-emerald-500/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-base font-semibold text-white flex items-center gap-2 justify-center sm:justify-start">
                <Bell className="h-4 w-4 text-cyan-400" />
                Nie przegap kolejnej okazji
              </h3>
              <p className="text-sm text-zinc-500 mt-0.5">
                Śledź trasy i dostaj alert gdy cena spadnie o więcej niż 20%.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setActiveSection('tracker')}
              className="shrink-0"
            >
              Zacznij śledzić trasy
            </Button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand col */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600">
                <Plane className="h-3.5 w-3.5 text-background" strokeWidth={2.5} />
              </div>
              <span className="text-base font-bold text-white">
                Sky<span className="text-cyan-400">Sniffer</span>
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-[220px]">
              Inteligentny łowca tanich lotów dla elastycznych podróżników. Poluj na okazje zanim zrobi to ktoś inny.
            </p>
            <div className="flex gap-2 mt-4">
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-zinc-500 hover:text-white hover:border-zinc-600 transition-colors">
                <Github className="h-3.5 w-3.5" />
              </a>
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-zinc-500 hover:text-white hover:border-zinc-600 transition-colors">
                <Twitter className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">{heading}</p>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-600">
            © 2026 SkySniffer. Dane lotowe są poglądowe i służą celom demonstracyjnym.
          </p>
          <p className="text-xs text-zinc-600">
            Zbudowano z ❤️ i TypeScript
          </p>
        </div>
      </div>
    </footer>
  )
}
