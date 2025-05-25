import { Suspense } from "react"
import AuctionGrid from "@/components/auction-grid"
import Hero from "@/components/hero"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Live Auctions</h2>
              <p className="text-gray-600 mt-2">Bid on amazing items from around the world</p>
            </div>
            <Link href="/auctions">
              <Button variant="outline">View All Auctions</Button>
            </Link>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
                ))}
              </div>
            }
          >
            <AuctionGrid limit={6} />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
