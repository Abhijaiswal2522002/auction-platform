import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface RecentBidsProps {
  userId: string
}

// Mock data - in real app, fetch from database
const mockBids = [
  {
    id: "1",
    auctionId: "auction1",
    item: "Vintage Rolex Submariner",
    myBid: 15000,
    currentHighestBid: 15500,
    status: "outbid",
    timeLeft: "2h 15m",
    imageUrl: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "2",
    auctionId: "auction2",
    item: "Original Picasso Sketch",
    myBid: 25000,
    currentHighestBid: 25000,
    status: "winning",
    timeLeft: "4h 30m",
    imageUrl: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "3",
    auctionId: "auction3",
    item: "1969 Ford Mustang",
    myBid: 82000,
    currentHighestBid: 85000,
    status: "outbid",
    timeLeft: "1d 6h",
    imageUrl: "/placeholder.svg?height=60&width=60",
  },
]

export default function RecentBids({ userId }: RecentBidsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recent Bids</span>
          <Link href="/dashboard/bids">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockBids.map((bid) => (
            <div key={bid.id} className="flex items-center space-x-4 p-4 border rounded-lg">
              <Image
                src={bid.imageUrl || "/placeholder.svg"}
                alt={bid.item}
                width={60}
                height={60}
                className="rounded-lg object-cover"
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{bid.item}</h3>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                  <span>Your bid: ${bid.myBid.toLocaleString()}</span>
                  <span>Current: ${bid.currentHighestBid.toLocaleString()}</span>
                </div>
                <div className="flex items-center mt-2">
                  <Clock className="h-3 w-3 mr-1 text-gray-400" />
                  <span className="text-xs text-gray-500">{bid.timeLeft} left</span>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <Badge
                  variant={bid.status === "winning" ? "default" : "destructive"}
                  className={bid.status === "winning" ? "bg-green-100 text-green-800" : ""}
                >
                  {bid.status === "winning" ? "Winning" : "Outbid"}
                </Badge>
                <Link href={`/auctions/${bid.auctionId}`}>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
