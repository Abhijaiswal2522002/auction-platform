const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/auctionhub"

async function seedDatabase() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db("auctionhub")

    console.log("🌱 Seeding database...")

    // Clear existing data
    await db.collection("users").deleteMany({})
    await db.collection("auctions").deleteMany({})
    await db.collection("bids").deleteMany({})
    await db.collection("categories").deleteMany({})

    // Create categories
    const categories = [
      { name: "Art", slug: "art", description: "Paintings, sculptures, and fine art", isActive: true, sortOrder: 1 },
      { name: "Watches", slug: "watches", description: "Luxury and vintage timepieces", isActive: true, sortOrder: 2 },
      { name: "Vehicles", slug: "vehicles", description: "Cars, motorcycles, and boats", isActive: true, sortOrder: 3 },
      {
        name: "Collectibles",
        slug: "collectibles",
        description: "Trading cards, coins, and memorabilia",
        isActive: true,
        sortOrder: 4,
      },
      {
        name: "Home & Garden",
        slug: "home-garden",
        description: "Furniture, decor, and garden items",
        isActive: true,
        sortOrder: 5,
      },
      { name: "Sports", slug: "sports", description: "Sports memorabilia and equipment", isActive: true, sortOrder: 6 },
      {
        name: "Electronics",
        slug: "electronics",
        description: "Gadgets, computers, and tech items",
        isActive: true,
        sortOrder: 7,
      },
      {
        name: "Jewelry",
        slug: "jewelry",
        description: "Fine jewelry and precious stones",
        isActive: true,
        sortOrder: 8,
      },
    ]

    await db.collection("categories").insertMany(
      categories.map((cat) => ({
        ...cat,
        createdAt: new Date(),
      })),
    )

    // Create sample users
    const hashedPassword = await bcrypt.hash("password123", 12)

    const users = [
      {
        name: "John Smith",
        username: "johnsmith",
        email: "john@example.com",
        passwordHash: hashedPassword,
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=John%20Smith",
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: true,
        rating: 4.8,
        totalSales: 156,
        totalPurchases: 89,
        memberSince: new Date("2020-01-15"),
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
      },
      {
        name: "Sarah Johnson",
        username: "sarahjohnson",
        email: "sarah@example.com",
        passwordHash: hashedPassword,
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Sarah%20Johnson",
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: true,
        rating: 4.9,
        totalSales: 203,
        totalPurchases: 145,
        memberSince: new Date("2019-08-22"),
        notifications: {
          email: true,
          sms: true,
          push: true,
          bidUpdates: true,
          auctionReminders: true,
          marketingEmails: true,
        },
        twoFactorEnabled: false,
        loginAttempts: 0,
        paymentMethods: [],
        addresses: [],
      },
    ]

    const userResult = await db.collection("users").insertMany(users)
    const userIds = Object.values(userResult.insertedIds)

    // Create sample auctions
    const auctions = [
      {
        item: "Vintage Rolex Submariner",
        description:
          "This rare 1960s Rolex Submariner is in excellent condition with original box and papers. The watch has been serviced and is in perfect working order.",
        startTime: new Date("2024-01-20T10:00:00Z"),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        currentHighestBid: 15000,
        startingBid: 10000,
        status: "active",
        category: "Watches",
        condition: "excellent",
        sellerId: userIds[0],
        imageUrl: "/placeholder.svg?height=400&width=600",
        location: "New York, NY, USA",
        shippingCost: 50,
        viewCount: 245,
        watchlistCount: 18,
        bidCount: 12,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        item: "Original Picasso Sketch",
        description:
          "Authenticated original sketch by Pablo Picasso from his Blue Period. Comes with certificate of authenticity.",
        startTime: new Date("2024-01-20T14:00:00Z"),
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
        currentHighestBid: 25000,
        startingBid: 20000,
        status: "active",
        category: "Art",
        condition: "excellent",
        sellerId: userIds[1],
        imageUrl: "/placeholder.svg?height=400&width=600",
        location: "Paris, France",
        shippingCost: 200,
        viewCount: 189,
        watchlistCount: 34,
        bidCount: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        item: "1969 Ford Mustang Boss 429",
        description: "Fully restored classic muscle car with matching numbers. Recent frame-off restoration completed.",
        startTime: new Date("2024-01-20T16:00:00Z"),
        endTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
        currentHighestBid: 85000,
        startingBid: 75000,
        status: "active",
        category: "Vehicles",
        condition: "excellent",
        sellerId: userIds[0],
        imageUrl: "/placeholder.svg?height=400&width=600",
        location: "Detroit, MI, USA",
        shippingCost: 1500,
        viewCount: 567,
        watchlistCount: 89,
        bidCount: 23,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const auctionResult = await db.collection("auctions").insertMany(auctions)
    const auctionIds = Object.values(auctionResult.insertedIds)

    // Create sample bids
    const bids = [
      {
        auctionId: auctionIds[0],
        userId: userIds[1],
        amount: 15000,
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        isWinning: true,
        isAutoBid: false,
        status: "winning",
      },
      {
        auctionId: auctionIds[0],
        userId: userIds[0],
        amount: 14500,
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        isWinning: false,
        isAutoBid: false,
        status: "outbid",
      },
      {
        auctionId: auctionIds[1],
        userId: userIds[0],
        amount: 25000,
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        isWinning: true,
        isAutoBid: false,
        status: "winning",
      },
    ]

    await db.collection("bids").insertMany(bids)

    console.log("✅ Database seeded successfully!")
    console.log(`Created ${users.length} users`)
    console.log(`Created ${categories.length} categories`)
    console.log(`Created ${auctions.length} auctions`)
    console.log(`Created ${bids.length} bids`)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
