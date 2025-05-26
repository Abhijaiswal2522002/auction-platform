import { NextResponse } from "next/server"
import { getAuthSession } from "@/lib/auth"
import { database } from "@/lib/database"

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const collections = await database.getCollections()

    // Get platform statistics
    const [totalUsers, totalAuctions, activeAuctions, totalBids, endingSoonAuctions] = await Promise.all([
      collections.users.countDocuments(),
      collections.auctions.countDocuments(),
      collections.auctions.countDocuments({ status: "active" }),
      collections.bids.countDocuments(),
      collections.auctions.countDocuments({
        status: "active",
        endTime: { $lte: new Date(Date.now() + 24 * 60 * 60 * 1000) },
      }),
    ])

    // Get recent activity
    const recentAuctions = await collections.auctions.find({}).sort({ createdAt: -1 }).limit(5).toArray()

    const recentBids = await collections.bids.find({}).sort({ timestamp: -1 }).limit(10).toArray()

    return NextResponse.json({
      stats: {
        totalUsers,
        totalAuctions,
        activeAuctions,
        totalBids,
        endingSoonAuctions,
      },
      recentActivity: {
        auctions: recentAuctions,
        bids: recentBids,
      },
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
