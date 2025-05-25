"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

interface AuctionTimerProps {
  endTime: Date
  onEnd?: () => void
  className?: string
}

export default function AuctionTimer({ endTime, onEnd, className = "" }: AuctionTimerProps) {
  const [timeLeft, setTimeLeft] = useState("")
  const [isEnded, setIsEnded] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const end = new Date(endTime).getTime()
      const distance = end - now

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m`)
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
        } else if (minutes > 0) {
          setTimeLeft(`${minutes}m ${seconds}s`)
        } else {
          setTimeLeft(`${seconds}s`)
        }
        setIsEnded(false)
      } else {
        setTimeLeft("Ended")
        setIsEnded(true)
        if (onEnd && !isEnded) {
          onEnd()
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime, onEnd, isEnded])

  return (
    <div className={`flex items-center ${className}`}>
      <Clock className={`h-4 w-4 mr-1 ${isEnded ? "text-red-500" : "text-gray-500"}`} />
      <span className={`font-mono ${isEnded ? "text-red-500" : "text-gray-700"}`}>{timeLeft}</span>
    </div>
  )
}
