import { NextResponse } from "next/server"
import { database } from "@/lib/database"

export async function GET() {
  try {
    // Test database connection
    const collections = await database.getCollections()
    await collections.users.findOne({}, { projection: { _id: 1 } })

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      environment: process.env.NODE_ENV,
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
