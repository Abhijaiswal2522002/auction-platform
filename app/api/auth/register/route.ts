import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import clientPromise from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { name, username, email, password } = await request.json()

    // Validation
    if (!name || !username || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("auctionhub")

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return NextResponse.json(
        { error: existingUser.email === email ? "Email already exists" : "Username already exists" },
        { status: 400 },
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const newUser = {
      name,
      username,
      email,
      passwordHash: hashedPassword,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: false,
      rating: 0,
      totalSales: 0,
      totalPurchases: 0,
      memberSince: new Date(),
      notifications: {
        email: true,
        sms: false,
        push: true,
        bidUpdates: true,
        auctionReminders: true,
        marketingEmails: false,
      },
      twoFactorEnabled: false,
      loginAttempts: 0,
      paymentMethods: [],
      addresses: [],
    }

    const result = await db.collection("users").insertOne(newUser)

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
