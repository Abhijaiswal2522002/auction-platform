import type { MongoClient, Db, Collection } from "mongodb"
import clientPromise from "./mongodb"

export interface DatabaseCollections {
  auctions: Collection
  bids: Collection
  users: Collection
  categories: Collection
  watchlist: Collection
  notifications: Collection
  transactions: Collection
}

class Database {
  private client: MongoClient | null = null
  private db: Db | null = null

  async connect(): Promise<Db> {
    if (this.db) {
      return this.db
    }

    this.client = await clientPromise
    this.db = this.client.db("auctionhub")
    return this.db
  }

  async getCollections(): Promise<DatabaseCollections> {
    const db = await this.connect()

    return {
      auctions: db.collection("auctions"),
      bids: db.collection("bids"),
      users: db.collection("users"),
      categories: db.collection("categories"),
      watchlist: db.collection("watchlist"),
      notifications: db.collection("notifications"),
      transactions: db.collection("transactions"),
    }
  }

  async createIndexes() {
    const collections = await this.getCollections()

    // Auctions indexes
    await collections.auctions.createIndex({ status: 1, category: 1, endTime: 1 })
    await collections.auctions.createIndex({ endTime: 1, status: 1 })
    await collections.auctions.createIndex({
      item: "text",
      description: "text",
      category: "text",
    })
    await collections.auctions.createIndex({ sellerId: 1, status: 1 })

    // Bids indexes
    await collections.bids.createIndex({ auctionId: 1, timestamp: -1 })
    await collections.bids.createIndex({ userId: 1, timestamp: -1 })
    await collections.bids.createIndex({ auctionId: 1, isWinning: 1 })

    // Users indexes
    await collections.users.createIndex({ email: 1 }, { unique: true })
    await collections.users.createIndex({ username: 1 }, { unique: true })
    await collections.users.createIndex({ email: 1, passwordHash: 1 })

    // Watchlist indexes
    await collections.watchlist.createIndex({ userId: 1, auctionId: 1 }, { unique: true })
    await collections.watchlist.createIndex({ userId: 1, createdAt: -1 })

    // Notifications indexes
    await collections.notifications.createIndex({ userId: 1, createdAt: -1 })
    await collections.notifications.createIndex({ userId: 1, isRead: 1 })

    // Transactions indexes
    await collections.transactions.createIndex({ auctionId: 1 })
    await collections.transactions.createIndex({ buyerId: 1, createdAt: -1 })
    await collections.transactions.createIndex({ sellerId: 1, createdAt: -1 })

    console.log("Database indexes created successfully")
  }
}

export const database = new Database()
