"use client"

import { useEffect, useState } from "react"

export function useAuctionTimer(endTime: Date) {
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
        } else {
          setTimeLeft(`${minutes}m ${seconds}s`)
        }
        setIsEnded(false)
      } else {
        setTimeLeft("Ended")
        setIsEnded(true)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  return { timeLeft, isEnded }
}
