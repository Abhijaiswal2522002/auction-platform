"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { pusherClient } from "@/lib/pusher"
import { toast } from "sonner"

interface Bid {
  _id: string
  auctionId: string
  userId: string
  username: string
  amount: number
  timestamp: Date
}

interface RealTimeBiddingProps {
  auctionId: string
  currentHighestBid: number
  onBidUpdate: (newBid: Bid) => void
}

export default function RealTimeBidding({ auctionId, currentHighestBid, onBidUpdate }: RealTimeBiddingProps) {
  const { data: session } = useSession()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Subscribe to auction channel
    const channel = pusherClient.subscribe(`auction-${auctionId}`)

    // Connection status
    pusherClient.connection.bind("connected", () => {
      setIsConnected(true)
      console.log("Connected to Pusher")
    })

    pusherClient.connection.bind("disconnected", () => {
      setIsConnected(false)
      console.log("Disconnected from Pusher")
    })

    // Listen for new bids
    channel.bind("new-bid", (data: Bid) => {
      console.log("New bid received:", data)
      onBidUpdate(data)

      // Show notification if it's not the current user's bid
      if (session?.user?.id !== data.userId) {
        toast.info(`New bid: $${data.amount.toLocaleString()} by ${data.username}`)
      }
    })

    // Listen for auction end
    channel.bind("auction-ended", (data: { auctionId: string; winnerId: string; winningBid: number }) => {
      console.log("Auction ended:", data)

      if (session?.user?.id === data.winnerId) {
        toast.success(`Congratulations! You won the auction with a bid of $${data.winningBid.toLocaleString()}`)
      } else {
        toast.info("Auction has ended")
      }
    })

    // Listen for outbid notifications
    channel.bind("outbid", (data: { userId: string; newHighestBid: number }) => {
      if (session?.user?.id === data.userId) {
        toast.warning(`You've been outbid! New highest bid: $${data.newHighestBid.toLocaleString()}`)
      }
    })

    return () => {
      channel.unbind_all()
      pusherClient.unsubscribe(`auction-${auctionId}`)
    }
  }, [auctionId, session?.user?.id, onBidUpdate])

  return (
    <div className="flex items-center space-x-2 text-xs text-gray-500">
      <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
      <span>{isConnected ? "Live updates active" : "Connecting..."}</span>
    </div>
  )
}
