import { Suspense } from "react"
import AuctionGrid from "@/components/auction-grid"
import AuctionFilters from "@/components/auction-filters"

export default function AuctionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Auctions</h1>
          <p className="text-gray-600">Discover amazing items up for auction</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64">
            <AuctionFilters />
          </aside>

          <main className="flex-1">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
                  ))}
                </div>
              }
            >
              <AuctionGrid />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}
