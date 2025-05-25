import { Suspense } from "react"
import AuctionDetails from "@/components/auction-details"
import BiddingSection from "@/components/bidding-section"
import BidHistory from "@/components/bid-history"

interface AuctionPageProps {
  params: {
    id: string
  }
}

// Mock auction data - in real app, this would come from your API
const mockAuction = {
  _id: "1",
  item: "Vintage Rolex Submariner",
  description:
    "This rare 1960s Rolex Submariner is in excellent condition with original box and papers. The watch has been serviced and is in perfect working order. A true collector's piece that represents the golden age of luxury timepieces.",
  startTime: new Date("2024-01-20T10:00:00Z"),
  endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
  currentHighestBid: 15000,
  startingBid: 10000,
  status: "active",
  imageUrl: "/placeholder.svg?height=500&width=600",
  category: "Watches",
  seller: {
    name: "John Smith",
    rating: 4.8,
    totalSales: 156,
  },
  specifications: {
    Brand: "Rolex",
    Model: "Submariner",
    Year: "1960s",
    Condition: "Excellent",
    Movement: "Automatic",
    "Case Material": "Stainless Steel",
  },
}

export default function AuctionPage({ params }: AuctionPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Suspense fallback={<div className="bg-gray-200 animate-pulse rounded-lg h-96"></div>}>
              <AuctionDetails auction={mockAuction} />
            </Suspense>
          </div>

          <div className="space-y-6">
            <Suspense fallback={<div className="bg-gray-200 animate-pulse rounded-lg h-64"></div>}>
              <BiddingSection auction={mockAuction} />
            </Suspense>

            <Suspense fallback={<div className="bg-gray-200 animate-pulse rounded-lg h-64"></div>}>
              <BidHistory auctionId={params.id} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
