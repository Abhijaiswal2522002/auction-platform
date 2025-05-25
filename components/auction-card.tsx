"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign } from "lucide-react"

interface Auction {
  _id: string
  item: string
  description: string
  startTime: Date
  endTime: Date
  currentHighestBid: number
  startingBid: number
  status: string
  imageUrl: string
  category: string
}

interface AuctionCardProps {
  auction: Auction
}

export default function AuctionCard({ auction }: AuctionCardProps) {
  const [timeLeft, setTimeLeft] = useState("")

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
          setTimeLeft(`${days}d ${hours}h ${minutes}m`)
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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative">
          <Image
            src={auction.imageUrl || "/placeholder.svg"}
            alt={auction.item}
            width={400}
            height={300}
            className="w-full h-48 object-cover"
          />
          <Badge className="absolute top-2 left-2 bg-blue-600">{auction.category}</Badge>
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {timeLeft}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{auction.item}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{auction.description}</p>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Current Bid</span>
            <div className="flex items-center text-green-600 font-semibold">
              <DollarSign className="w-4 h-4" />
              {auction.currentHighestBid.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Starting Bid</span>
            <div className="flex items-center text-gray-600">
              <DollarSign className="w-4 h-4" />
              {auction.startingBid.toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/auctions/${auction._id}`} className="w-full">
          <Button className="w-full">View Auction</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
