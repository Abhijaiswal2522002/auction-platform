import { redirect } from "next/navigation"
import { getAuthSession } from "@/lib/auth"
import PlatformStats from "@/components/platform-stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminPage() {
  const session = await getAuthSession()

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
          <p className="text-gray-600 mt-2">Monitor your auction platform performance</p>
        </div>

        <div className="space-y-8">
          <PlatformStats />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <span className="text-green-600 font-medium">Connected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Real-time Services</span>
                    <span className="text-green-600 font-medium">Operational</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Authentication</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Response</span>
                    <span className="text-green-600 font-medium">Fast</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <a href="/status" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="font-medium">System Status</div>
                    <div className="text-sm text-gray-600">View detailed system health</div>
                  </a>
                  <a href="/api/health" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="font-medium">Health Check</div>
                    <div className="text-sm text-gray-600">API health endpoint</div>
                  </a>
                  <a href="/auctions" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="font-medium">View Auctions</div>
                    <div className="text-sm text-gray-600">Browse all active auctions</div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
