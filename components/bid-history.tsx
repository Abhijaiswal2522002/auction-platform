"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DollarSign, Clock } from "lucide-react"

interface Bid {
  _id: string
  userId: string
  username: string
  userAvatar?: string
  amount: number
  timestamp: Date
  isWinning: boolean
}

interface BidHistoryProps {
  auctionId: string
}

export default function BidHistory({ auctionId }: BidHistoryProps) {
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await fetch(`/api/bids/${auctionId}`)
        const data = await response.json()
        setBids(data)
      } catch (error) {
        console.error("Error fetching bids:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBids()
  }, [auctionId])

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - new Date(timestamp).getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Bid History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-16"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Bid History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {bids.map((bid, index) => (
            <div
              key={bid._id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                index === 0 ? "bg-green-50 border border-green-200" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={bid.userAvatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">{bid.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{bid.username}</p>
                  <p className="text-xs text-gray-500">{formatTimeAgo(bid.timestamp)}</p>
                </div>
              </div>
              <div className={`flex items-center font-semibold ${index === 0 ? "text-green-600" : "text-gray-700"}`}>
                <DollarSign className="h-4 w-4" />
                {bid.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {bids.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No bids yet. Be the first to bid!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
