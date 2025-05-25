export interface Auction {
  _id: string
  item: string
  description: string
  startTime: Date
  endTime: Date
  currentHighestBid: number
  startingBid: number
  status: "active" | "ended" | "pending"
  imageUrl: string
  category: string
  sellerId: string
}

export interface Bid {
  _id: string
  auctionId: string
  userId: string
  amount: number
  timestamp: Date
}

export interface User {
  _id: string
  email: string
  username: string
  name: string
  avatar?: string
  createdAt: Date
}

export interface AuctionWithBids extends Auction {
  bids: Bid[]
  bidCount: number
}
