import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface WatchedAuctionsProps {
  userId: string
}

// Mock data - in real app, fetch from database
const mockWatchedAuctions = [
  {
    id: "1",
    item: "Antique Persian Rug",
    currentBid: 12000,
    timeLeft: "8h 45m",
    imageUrl: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "2",
    item: "Signed Michael Jordan Jersey",
    currentBid: 8000,
    timeLeft: "3h 20m",
    imageUrl: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "3",
    item: "Rare Pokemon Cards",
    currentBid: 5000,
    timeLeft: "1h 10m",
    imageUrl: "/placeholder.svg?height=50&width=50",
  },
]

export default function WatchedAuctions({ userId }: WatchedAuctionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Watched Items</span>
          <Link href="/dashboard/watchlist">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockWatchedAuctions.map((auction) => (
            <div key={auction.id} className="flex items-center space-x-3 p-3 border rounded-lg">
              <Image
                src={auction.imageUrl || "/placeholder.svg"}
                alt={auction.item}
                width={50}
                height={50}
                className="rounded object-cover"
              />

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900 truncate">{auction.item}</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-semibold text-green-600">${auction.currentBid.toLocaleString()}</span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {auction.timeLeft}
                  </div>
                </div>
              </div>

              <Link href={`/auctions/${auction.id}`}>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
