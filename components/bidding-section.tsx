"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign, TrendingUp } from "lucide-react"
import { useSession } from "next-auth/react"
import RealTimeBidding from "./real-time-bidding"

interface BiddingSectionProps {
  auction: {
    _id: string
    endTime: Date
    currentHighestBid: number
    startingBid: number
    status: string
  }
}

export default function BiddingSection({ auction }: BiddingSectionProps) {
  const [timeLeft, setTimeLeft] = useState("")
  const [bidAmount, setBidAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: session } = useSession()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const endTime = new Date(auction.endTime).getTime()
      const distance = endTime - now

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
        } else {
          setTimeLeft(`${minutes}m ${seconds}s`)
        }
      } else {
        setTimeLeft("Ended")
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [auction.endTime])

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!session) {
      setError("Please log in to place a bid")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch(`/api/auctions/${auction._id}/bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number.parseFloat(bidAmount),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setBidAmount("")
        // Success feedback will come through real-time updates
      } else {
        setError(data.error || "Failed to place bid")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const suggestedBid = auction.currentHighestBid + 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Place Your Bid</span>
          <Badge variant={timeLeft === "Ended" ? "destructive" : "default"}>{auction.status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RealTimeBidding
          auctionId={auction._id}
          currentHighestBid={auction.currentHighestBid}
          onBidUpdate={(newBid) => {
            // Update the current highest bid in real-time
            console.log("New bid received:", newBid)
          }}
        />
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center text-red-600 mb-2">
            <Clock className="h-5 w-5 mr-2" />
            <span className="font-mono text-lg">{timeLeft}</span>
          </div>
          <p className="text-sm text-gray-600">Time Remaining</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-sm text-gray-600">Current Highest Bid</span>
            <div className="flex items-center text-green-600 font-bold text-lg">
              <DollarSign className="h-5 w-5" />
              {auction.currentHighestBid.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Starting Bid</span>
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-5 w-5" />
              {auction.startingBid.toLocaleString()}
            </div>
          </div>
        </div>

        {timeLeft !== "Ended" && (
          <form onSubmit={handleBidSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Bid Amount</label>
              <Input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`Minimum: $${suggestedBid.toLocaleString()}`}
                min={suggestedBid}
                required
              />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setBidAmount(suggestedBid.toString())}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Quick Bid: ${suggestedBid.toLocaleString()}
            </Button>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !bidAmount || Number.parseInt(bidAmount) < suggestedBid}
            >
              {isSubmitting ? "Placing Bid..." : "Place Bid"}
            </Button>
          </form>
        )}

        {timeLeft === "Ended" && (
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-red-600 font-semibold">Auction Ended</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
