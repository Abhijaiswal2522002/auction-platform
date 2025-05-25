import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { database } from "@/lib/database"
import { getAuthSession } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const page = Number.parseInt(searchParams.get("page") || "1")

    const collections = await database.getCollections()

    // Build query
    const query: any = {}

    if (category && category !== "all") {
      query.category = category
    }

    if (status && status !== "all") {
      query.status = status
    } else {
      query.status = "active"
    }

    if (search) {
      query.$text = { $search: search }
    }

    // Get auctions with pagination
    const auctions = await collections.auctions
      .find(query)
      .sort({ endTime: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    // Get total count for pagination
    const total = await collections.auctions.countDocuments(query)

    return NextResponse.json({
      auctions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching auctions:", error)
    return NextResponse.json({ error: "Failed to fetch auctions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      item,
      description,
      startingBid,
      endTime,
      category,
      condition,
      reservePrice,
      buyNowPrice,
      shippingCost,
      location,
    } = body

    // Validation
    if (!item || !description || !startingBid || !endTime || !category || !condition || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (startingBid <= 0) {
      return NextResponse.json({ error: "Starting bid must be greater than 0" }, { status: 400 })
    }

    const collections = await database.getCollections()

    const newAuction = {
      item,
      description,
      startTime: new Date(),
      endTime: new Date(endTime),
      currentHighestBid: startingBid,
      startingBid,
      status: "active",
      category,
      condition,
      reservePrice: reservePrice || null,
      buyNowPrice: buyNowPrice || null,
      shippingCost: shippingCost || 0,
      location,
      sellerId: new ObjectId(session.user.id),
      imageUrl: "/placeholder.svg?height=400&width=600",
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0,
      watchlistCount: 0,
      bidCount: 0,
    }

    const result = await collections.auctions.insertOne(newAuction)

    return NextResponse.json(
      {
        ...newAuction,
        _id: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating auction:", error)
    return NextResponse.json({ error: "Failed to create auction" }, { status: 500 })
  }
}
