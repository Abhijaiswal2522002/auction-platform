"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import AuctionCard from "./auction-card"

interface AuctionGridProps {
  limit?: number
}

export default function AuctionGrid({ limit }: AuctionGridProps) {
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()

        // Add limit if specified
        if (limit) {
          params.append("limit", limit.toString())
        }

        // Add search parameters from URL
        const search = searchParams.get("search")
        const category = searchParams.get("category")
        const status = searchParams.get("status")
        const minPrice = searchParams.get("minPrice")
        const maxPrice = searchParams.get("maxPrice")

        if (search) params.append("search", search)
        if (category) params.append("category", category)
        if (status) params.append("status", status)
        if (minPrice) params.append("minPrice", minPrice)
        if (maxPrice) params.append("maxPrice", maxPrice)

        const response = await fetch(`/api/auctions?${params}`)

        if (!response.ok) {
          throw new Error("Failed to fetch auctions")
        }

        const data = await response.json()
        setAuctions(data.auctions || [])
      } catch (error) {
        console.error("Error fetching auctions:", error)
        setError("Failed to load auctions. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchAuctions()
  }, [limit, searchParams])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(limit || 6)].map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button onClick={() => window.location.reload()} className="text-blue-600 hover:text-blue-800 underline">
          Try again
        </button>
      </div>
    )
  }

  if (auctions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">No auctions found matching your criteria.</div>
        <a href="/auctions" className="text-blue-600 hover:text-blue-800 underline">
          View all auctions
        </a>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {auctions.map((auction) => (
        <AuctionCard key={auction._id} auction={auction} />
      ))}
    </div>
  )
}
