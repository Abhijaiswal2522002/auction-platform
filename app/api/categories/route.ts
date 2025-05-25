import { NextResponse } from "next/server"
import { database } from "@/lib/database"

export async function GET() {
  try {
    const collections = await database.getCollections()

    const categories = await collections.categories.find({ isActive: true }).sort({ sortOrder: 1 }).toArray()

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
