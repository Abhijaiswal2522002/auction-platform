import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { database } from "@/lib/database"
import { getAuthSession } from "@/lib/auth"
import { pusherServer } from "@/lib/pusher"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid auction ID" }, { status: 400 })
    }

    const auctionObjectId = new ObjectId(id)
    const { amount } = await request.json()

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Invalid bid amount" }, { status: 400 })
    }

    const collections = await database.getCollections()

    // Get current auction
    const auction = await collections.auctions.findOne({ _id: auctionObjectId })

    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 })
    }

    if (auction.status !== "active") {
      return NextResponse.json({ error: "Auction is not active" }, { status: 400 })
    }

    if (new Date() > new Date(auction.endTime)) {
      return NextResponse.json({ error: "Auction has ended" }, { status: 400 })
    }

    if (amount <= auction.currentHighestBid) {
      return NextResponse.json({
        error: `Bid must be higher than current highest bid of $${auction.currentHighestBid}`,
      }, { status: 400 })
    }

    if (auction.sellerId.toString() === session.user.id) {
      return NextResponse.json({ error: "You cannot bid on your own auction" }, { status: 400 })
    }

    // Get user info
    const user = await collections.users.findOne({ _id: new ObjectId(session.user.id) })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Mark previous winning bids as outbid
    await collections.bids.updateMany(
      { auctionId: auctionObjectId, isWinning: true },
      { $set: { isWinning: false, status: "outbid" } },
    )

    // Create new bid
    const timestamp = new Date()
    const newBid = {
      auctionId: auctionObjectId,
      userId: new ObjectId(session.user.id),
      username: user.username,
      amount,
      timestamp,
      isWinning: true,
      isAutoBid: false,
      status: "winning",
    }

    const bidResult = await collections.bids.insertOne(newBid)

    // Update auction
    await collections.auctions.updateOne(
      { _id: auctionObjectId },
      {
        $set: {
          currentHighestBid: amount,
          updatedAt: timestamp,
        },
        $inc: { bidCount: 1 },
      },
    )

    // Get previous highest bidder for notification
    const previousHighestBid = await collections.bids.findOne(
      { auctionId: auctionObjectId, status: "outbid" },
      { sort: { timestamp: -1 } },
    )

    // Send real-time bid event
    await pusherServer.trigger(`auction-${id}`, "new-bid", {
      _id: bidResult.insertedId,
      auctionId: id,
      userId: session.user.id,
      username: user.username,
      amount,
      timestamp,
    })

    // Notify previous bidder
    if (previousHighestBid && previousHighestBid.userId.toString() !== session.user.id) {
      await pusherServer.trigger(`user-${previousHighestBid.userId}`, "outbid", {
        auctionId: id,
        auctionTitle: auction.item,
        newHighestBid: amount,
        yourBid: previousHighestBid.amount,
      })

      await collections.notifications.insertOne({
        userId: previousHighestBid.userId,
        type: "outbid",
        title: "You've been outbid!",
        message: `Someone placed a higher bid of $${amount.toLocaleString()} on "${auction.item}"`,
        data: {
          auctionId: id,
          auctionTitle: auction.item,
          newHighestBid: amount,
          yourBid: previousHighestBid.amount,
        },
        isRead: false,
        createdAt: timestamp,
      })
    }

    return NextResponse.json(
      {
        ...newBid,
        _id: bidResult.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error placing bid:", error)
    return NextResponse.json({ error: "Failed to place bid" }, { status: 500 })
  }
}
