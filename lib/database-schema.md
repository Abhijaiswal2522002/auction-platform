# Database Schema for AuctionHub

## Collections

### 1. auctions
\`\`\`javascript
{
  _id: ObjectId,
  item: String, // Item name/title
  description: String, // Detailed description
  startTime: Date, // When auction starts
  endTime: Date, // When auction ends
  currentHighestBid: Number, // Current highest bid amount
  startingBid: Number, // Minimum starting bid
  status: String, // 'active', 'ended', 'pending'
  imageUrl: String, // URL to item image
  category: String, // Item category
  sellerId: ObjectId, // Reference to users collection
  createdAt: Date,
  updatedAt: Date,
  
  // Additional fields for enhanced functionality
  reservePrice: Number, // Optional reserve price
  buyNowPrice: Number, // Optional buy-it-now price
  shippingCost: Number,
  location: String,
  condition: String, // 'new', 'used', 'refurbished'
  specifications: Object, // Key-value pairs for item specs
  tags: [String], // Search tags
  viewCount: Number,
  watchlistCount: Number
}
\`\`\`

### 2. bids
\`\`\`javascript
{
  _id: ObjectId,
  auctionId: ObjectId, // Reference to auctions collection
  userId: ObjectId, // Reference to users collection
  amount: Number, // Bid amount
  timestamp: Date, // When bid was placed
  isWinning: Boolean, // Is this the current winning bid
  isAutoBid: Boolean, // Was this an automatic bid
  maxBidAmount: Number, // For proxy bidding
  
  // Additional fields
  ipAddress: String, // For fraud detection
  userAgent: String, // Browser info
  status: String // 'active', 'outbid', 'winning', 'lost'
}
\`\`\`

### 3. users
\`\`\`javascript
{
  _id: ObjectId,
  email: String, // Unique email address
  username: String, // Unique username
  name: String, // Full name
  avatar: String, // Profile picture URL
  createdAt: Date,
  updatedAt: Date,
  
  // Authentication
  passwordHash: String, // Hashed password
  emailVerified: Boolean,
  emailVerificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // Profile information
  bio: String,
  location: String,
  phone: String,
  dateOfBirth: Date,
  
  // Auction-related
  rating: Number, // Average rating from other users
  totalSales: Number, // Number of successful sales
  totalPurchases: Number, // Number of successful purchases
  memberSince: Date,
  
  // Preferences
  notifications: {
    email: Boolean,
    sms: Boolean,
    push: Boolean,
    bidUpdates: Boolean,
    auctionReminders: Boolean,
    marketingEmails: Boolean
  },
  
  // Security
  twoFactorEnabled: Boolean,
  twoFactorSecret: String,
  loginAttempts: Number,
  lockUntil: Date,
  
  // Payment information (encrypted)
  paymentMethods: [{
    type: String, // 'credit_card', 'paypal', 'bank_account'
    last4: String,
    expiryMonth: Number,
    expiryYear: Number,
    isDefault: Boolean
  }],
  
  // Address information
  addresses: [{
    type: String, // 'billing', 'shipping'
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: Boolean
  }]
}
\`\`\`

### 4. categories
\`\`\`javascript
{
  _id: ObjectId,
  name: String, // Category name
  slug: String, // URL-friendly name
  description: String,
  parentId: ObjectId, // For subcategories
  imageUrl: String,
  isActive: Boolean,
  sortOrder: Number,
  createdAt: Date
}
\`\`\`

### 5. watchlist
\`\`\`javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to users collection
  auctionId: ObjectId, // Reference to auctions collection
  createdAt: Date
}
\`\`\`

### 6. notifications
\`\`\`javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to users collection
  type: String, // 'bid_placed', 'outbid', 'auction_won', 'auction_ended'
  title: String,
  message: String,
  data: Object, // Additional data (auction ID, bid amount, etc.)
  isRead: Boolean,
  createdAt: Date
}
\`\`\`

### 7. transactions
\`\`\`javascript
{
  _id: ObjectId,
  auctionId: ObjectId, // Reference to auctions collection
  buyerId: ObjectId, // Reference to users collection
  sellerId: ObjectId, // Reference to users collection
  amount: Number, // Final sale amount
  fees: {
    buyerFee: Number,
    sellerFee: Number,
    paymentProcessingFee: Number
  },
  status: String, // 'pending', 'paid', 'shipped', 'delivered', 'completed', 'disputed'
  paymentMethod: String,
  paymentId: String, // External payment processor ID
  shippingAddress: Object,
  trackingNumber: String,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## Indexes

### auctions collection
\`\`\`javascript
// Compound index for active auctions by category
db.auctions.createIndex({ status: 1, category: 1, endTime: 1 })

// Index for ending soon auctions
db.auctions.createIndex({ endTime: 1, status: 1 })

// Text index for search
db.auctions.createIndex({ 
  item: "text", 
  description: "text", 
  category: "text" 
})

// Index for seller's auctions
db.auctions.createIndex({ sellerId: 1, status: 1 })
\`\`\`

### bids collection
\`\`\`javascript
// Compound index for auction bids
db.bids.createIndex({ auctionId: 1, timestamp: -1 })

// Index for user's bids
db.bids.createIndex({ userId: 1, timestamp: -1 })

// Index for winning bids
db.bids.createIndex({ auctionId: 1, isWinning: 1 })
\`\`\`

### users collection
\`\`\`javascript
// Unique indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })

// Index for authentication
db.users.createIndex({ email: 1, passwordHash: 1 })
\`\`\`

## Sample Queries

### Get active auctions ending soon
\`\`\`javascript
db.auctions.find({
  status: "active",
  endTime: { $gte: new Date(), $lte: new Date(Date.now() + 24*60*60*1000) }
}).sort({ endTime: 1 })
\`\`\`

### Get bid history for an auction
\`\`\`javascript
db.bids.find({ auctionId: ObjectId("...") }).sort({ timestamp: -1 })
\`\`\`

### Get user's active bids
\`\`\`javascript
db.bids.aggregate([
  { $match: { userId: ObjectId("...") } },
  { $lookup: {
      from: "auctions",
      localField: "auctionId",
      foreignField: "_id",
      as: "auction"
  }},
  { $match: { "auction.status": "active" } },
  { $sort: { timestamp: -1 } }
])
