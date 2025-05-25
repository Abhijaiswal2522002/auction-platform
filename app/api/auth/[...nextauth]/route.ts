import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import bcrypt from "bcryptjs"
import clientPromise from "@/lib/mongodb"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const client = await clientPromise
          const db = client.db("auctionhub")

          const user = await db.collection("users").findOne({
            email: credentials.email,
          })

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            username: user.username,
            avatar: user.avatar,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username
        token.avatar = user.avatar
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.username = token.username as string
        session.user.avatar = token.avatar as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          const client = await clientPromise
          const db = client.db("auctionhub")

          const existingUser = await db.collection("users").findOne({
            email: user.email,
          })

          if (!existingUser) {
            // Create new user for OAuth
            const newUser = {
              name: user.name,
              username: user.email?.split("@")[0] + "_" + Math.random().toString(36).substr(2, 5),
              email: user.email,
              avatar:
                user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || "")}`,
              createdAt: new Date(),
              updatedAt: new Date(),
              emailVerified: true,
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

            await db.collection("users").insertOne(newUser)
          }
        } catch (error) {
          console.error("OAuth sign in error:", error)
          return false
        }
      }
      return true
    },
  },
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/register",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
