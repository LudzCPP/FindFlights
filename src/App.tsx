import { AnimatePresence, motion } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { MobileNav } from '@/components/layout/MobileNav'
import { Footer } from '@/components/layout/Footer'
import { SearchHero } from '@/components/hero/SearchHero'
import { FlightResults } from '@/components/flights/FlightResults'
import { DealsGrid } from '@/components/deals/DealsGrid'
import { TrackerPage } from '@/components/tracker/TrackerPage'
import { PriceTrackerDrawer } from '@/components/tracker/PriceTrackerDrawer'
import { useSearchStore } from '@/store/searchStore'

const sectionTransition = {
  initial:  { opacity: 0, y: 10 },
  animate:  { opacity: 1, y: 0 },
  exit:     { opacity: 0, y: -8 },
  transition: { duration: 0.22, ease: 'easeOut' },
}

export default function App() {
  const { activeSection, hasSearched } = useSearchStore()

  return (
    <div className="min-h-screen bg-background text-white">
      <Header />

      <main className="pb-20 md:pb-0">
        <AnimatePresence mode="wait">
          {activeSection === 'search' && (
            <motion.div key="search" {...sectionTransition}>
              <SearchHero />
              {hasSearched && <FlightResults />}
              <DealsGrid />
            </motion.div>
          )}

          {activeSection === 'deals' && (
            <motion.div key="deals" {...sectionTransition} className="pt-8">
              <DealsGrid />
            </motion.div>
          )}

          {activeSection === 'tracker' && (
            <motion.div key="tracker" {...sectionTransition}>
              <TrackerPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
      <MobileNav />
      <PriceTrackerDrawer />
    </div>
  )
}
