import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { database } from "@/lib/database"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid auction ID" }, { status: 400 })
    }

    const collections = await database.getCollections()

    // Get auction details
    const auction = await collections.auctions.findOne({
      _id: new ObjectId(id),
    })

    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 })
    }

    // Get seller information
    const seller = await collections.users.findOne(
      { _id: auction.sellerId },
      { projection: { name: 1, username: 1, rating: 1, totalSales: 1 } },
    )

    // Get bid history
    const bids = await collections.bids
      .find({ auctionId: new ObjectId(id) })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray()

    // Increment view count
    await collections.auctions.updateOne({ _id: new ObjectId(id) }, { $inc: { viewCount: 1 } })

    return NextResponse.json({
      ...auction,
      seller,
      bids,
      specifications: {
        Brand: "Example Brand",
        Model: "Example Model",
        Year: "2024",
        Condition: auction.condition,
        Location: auction.location,
      },
    })
  } catch (error) {
    console.error("Error fetching auction:", error)
    return NextResponse.json({ error: "Failed to fetch auction" }, { status: 500 })
  }
}
