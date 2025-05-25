import { redirect } from "next/navigation"
import { getAuthSession } from "@/lib/auth"
import DashboardStats from "@/components/dashboard-stats"
import RecentBids from "@/components/recent-bids"
import WatchedAuctions from "@/components/watched-auctions"
import QuickActions from "@/components/quick-actions"

export default async function DashboardPage() {
  const session = await getAuthSession()

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {session.user.name}!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your auctions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <DashboardStats userId={session.user.id} />
            <RecentBids userId={session.user.id} />
          </div>

          <div className="space-y-8">
            <QuickActions />
            <WatchedAuctions userId={session.user.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
