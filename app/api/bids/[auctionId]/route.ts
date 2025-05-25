import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { database } from "@/lib/database"

export async function GET(request: Request, { params }: { params: { auctionId: string } }) {
  try {
    const { auctionId } = params

    if (!ObjectId.isValid(auctionId)) {
      return NextResponse.json({ error: "Invalid auction ID" }, { status: 400 })
    }

    const collections = await database.getCollections()

    // Get bid history with user information
    const bids = await collections.bids
      .aggregate([
        { $match: { auctionId: new ObjectId(auctionId) } },
        { $sort: { timestamp: -1 } },
        { $limit: 20 },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
            pipeline: [{ $project: { username: 1, avatar: 1 } }],
          },
        },
        {
          $addFields: {
            username: { $arrayElemAt: ["$user.username", 0] },
            userAvatar: { $arrayElemAt: ["$user.avatar", 0] },
          },
        },
        { $project: { user: 0 } },
      ])
      .toArray()

    return NextResponse.json(bids)
  } catch (error) {
    console.error("Error fetching bids:", error)
    return NextResponse.json({ error: "Failed to fetch bids" }, { status: 500 })
  }
}
