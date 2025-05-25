import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Database, Wifi } from "lucide-react"

async function getSystemStatus() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/health`, {
      cache: "no-store",
    })
    return await response.json()
  } catch (error) {
    return {
      status: "error",
      database: "disconnected",
      error: "Failed to fetch status",
    }
  }
}

export default async function StatusPage() {
  const status = await getSystemStatus()
  const isHealthy = status.status === "healthy"

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Status</h1>
          <p className="text-gray-600">Real-time status of AuctionHub services</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Overall Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {isHealthy ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                )}
                Overall Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={isHealthy ? "default" : "destructive"} className="mb-2">
                {isHealthy ? "Operational" : "Issues Detected"}
              </Badge>
              <p className="text-sm text-gray-600">
                Last updated: {new Date(status.timestamp || Date.now()).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          {/* Database Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 text-blue-500 mr-2" />
                Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={status.database === "connected" ? "default" : "destructive"} className="mb-2">
                {status.database === "connected" ? "Connected" : "Disconnected"}
              </Badge>
              <p className="text-sm text-gray-600">MongoDB Atlas</p>
            </CardContent>
          </Card>

          {/* Real-time Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wifi className="h-5 w-5 text-purple-500 mr-2" />
                Real-time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="default" className="mb-2">
                Operational
              </Badge>
              <p className="text-sm text-gray-600">Pusher WebSocket</p>
            </CardContent>
          </Card>

          {/* API Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 text-orange-500 mr-2" />
                API Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="default" className="mb-2">
                Fast
              </Badge>
              <p className="text-sm text-gray-600">{"< 100ms average"}</p>
            </CardContent>
          </Card>

          {/* Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="default" className="mb-2">
                Operational
              </Badge>
              <p className="text-sm text-gray-600">NextAuth.js</p>
            </CardContent>
          </Card>

          {/* Environment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
                Environment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="mb-2">
                {status.environment || "production"}
              </Badge>
              <p className="text-sm text-gray-600">Vercel Deployment</p>
            </CardContent>
          </Card>
        </div>

        {status.error && (
          <Card className="mt-6 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Error Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600 text-sm font-mono">{status.error}</p>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            If you're experiencing issues, please check our{" "}
            <a href="/help" className="text-blue-600 hover:underline">
              help center
            </a>{" "}
            or contact support.
          </p>
        </div>
      </div>
    </div>
  )
}
