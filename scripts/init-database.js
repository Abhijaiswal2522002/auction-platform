const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI

async function initializeDatabase() {
  if (!uri) {
    console.error("❌ MONGODB_URI environment variable is not set")
    process.exit(1)
  }

  const client = new MongoClient(uri)

  try {
    console.log("🔗 Connecting to MongoDB...")
    await client.connect()

    const db = client.db("auctionhub")
    console.log("✅ Connected to MongoDB successfully")

    // Test the connection
    await db.admin().ping()
    console.log("🏓 Database ping successful")

    // Create collections if they don't exist
    const collections = ["users", "auctions", "bids", "categories", "watchlist", "notifications", "transactions"]

    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName)
        console.log(`📁 Created collection: ${collectionName}`)
      } catch (error) {
        if (error.code === 48) {
          console.log(`📁 Collection already exists: ${collectionName}`)
        } else {
          console.error(`❌ Error creating collection ${collectionName}:`, error.message)
        }
      }
    }

    // Create indexes
    console.log("🔍 Creating database indexes...")

    // Users indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("users").createIndex({ username: 1 }, { unique: true })

    // Auctions indexes
    await db.collection("auctions").createIndex({ status: 1, endTime: 1 })
    await db.collection("auctions").createIndex({ category: 1, status: 1 })
    await db.collection("auctions").createIndex({ sellerId: 1 })

    // Bids indexes
    await db.collection("bids").createIndex({ auctionId: 1, timestamp: -1 })
    await db.collection("bids").createIndex({ userId: 1, timestamp: -1 })

    console.log("✅ Database indexes created successfully")

    // Insert default categories if they don't exist
    const categoriesCount = await db.collection("categories").countDocuments()
    if (categoriesCount === 0) {
      const defaultCategories = [
        {
          name: "Art",
          slug: "art",
          description: "Paintings, sculptures, and fine art",
          isActive: true,
          sortOrder: 1,
          createdAt: new Date(),
        },
        {
          name: "Watches",
          slug: "watches",
          description: "Luxury and vintage timepieces",
          isActive: true,
          sortOrder: 2,
          createdAt: new Date(),
        },
        {
          name: "Vehicles",
          slug: "vehicles",
          description: "Cars, motorcycles, and boats",
          isActive: true,
          sortOrder: 3,
          createdAt: new Date(),
        },
        {
          name: "Collectibles",
          slug: "collectibles",
          description: "Trading cards, coins, and memorabilia",
          isActive: true,
          sortOrder: 4,
          createdAt: new Date(),
        },
        {
          name: "Home & Garden",
          slug: "home-garden",
          description: "Furniture, decor, and garden items",
          isActive: true,
          sortOrder: 5,
          createdAt: new Date(),
        },
        {
          name: "Sports",
          slug: "sports",
          description: "Sports memorabilia and equipment",
          isActive: true,
          sortOrder: 6,
          createdAt: new Date(),
        },
        {
          name: "Electronics",
          slug: "electronics",
          description: "Gadgets, computers, and tech items",
          isActive: true,
          sortOrder: 7,
          createdAt: new Date(),
        },
        {
          name: "Jewelry",
          slug: "jewelry",
          description: "Fine jewelry and precious stones",
          isActive: true,
          sortOrder: 8,
          createdAt: new Date(),
        },
      ]

      await db.collection("categories").insertMany(defaultCategories)
      console.log("📂 Default categories created")
    }

    console.log("🎉 Database initialization completed successfully!")
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    process.exit(1)
  } finally {
    await client.close()
    console.log("🔌 Database connection closed")
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
}

module.exports = { initializeDatabase }
