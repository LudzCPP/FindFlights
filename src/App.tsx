import { Header } from '@/components/layout/Header'
import { SearchHero } from '@/components/hero/SearchHero'
import { FlightResults } from '@/components/flights/FlightResults'
import { DealsGrid } from '@/components/deals/DealsGrid'
import { PriceTrackerDrawer } from '@/components/tracker/PriceTrackerDrawer'
import { useSearchStore } from '@/store/searchStore'

export default function App() {
  const { hasSearched } = useSearchStore()

  return (
    <div className="min-h-screen bg-background text-white">
      <Header />
      <main>
        <SearchHero />
        {hasSearched && <FlightResults />}
        <DealsGrid />
      </main>
      <PriceTrackerDrawer />
    </div>
  )
}
