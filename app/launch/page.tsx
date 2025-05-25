import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ExternalLink, Rocket, Database, Wifi, Shield } from "lucide-react"
import Link from "next/link"

export default function LaunchPage() {
  const launchSteps = [
    {
      title: "Database Initialized",
      description: "MongoDB collections and indexes created",
      status: "complete",
      icon: Database,
      action: { text: "View Health", href: "/api/health" },
    },
    {
      title: "Environment Variables",
      description: "All required environment variables configured",
      status: "complete",
      icon: Shield,
      action: { text: "Check Status", href: "/status" },
    },
    {
      title: "Real-time Services",
      description: "Pusher WebSocket connection active",
      status: "complete",
      icon: Wifi,
      action: { text: "Test Bidding", href: "/auctions" },
    },
    {
      title: "Authentication",
      description: "Google and GitHub OAuth configured",
      status: "complete",
      icon: CheckCircle,
      action: { text: "Try Login", href: "/auth/login" },
    },
  ]

  const features = [
    "Real-time bidding with instant updates",
    "User authentication with multiple providers",
    "Responsive design for all devices",
    "Secure payment processing ready",
    "Advanced search and filtering",
    "Professional dashboard and analytics",
    "Mobile-optimized interface",
    "Production-ready monitoring",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <Rocket className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🎉 AuctionHub is Ready to Launch!</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your complete real-time auction platform is configured and ready for users. All systems are operational and
            ready to handle live auctions.
          </p>
        </div>

        {/* Launch Checklist */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Launch Checklist</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {launchSteps.map((step, index) => (
              <Card key={index} className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800">
                    <step.icon className="h-5 w-5 mr-2" />
                    {step.title}
                    <CheckCircle className="h-4 w-4 ml-auto text-green-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700 mb-4">{step.description}</p>
                  <Link href={step.action.href}>
                    <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-100">
                      {step.action.text}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Platform Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Platform Features</h2>
          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">Start Using Platform</h3>
              <p className="text-gray-600 mb-4">Begin creating auctions and accepting bids</p>
              <Link href="/dashboard">
                <Button className="w-full">Go to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">Monitor System</h3>
              <p className="text-gray-600 mb-4">Check platform health and performance</p>
              <Link href="/status">
                <Button variant="outline" className="w-full">
                  System Status
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">View Documentation</h3>
              <p className="text-gray-600 mb-4">Learn about features and configuration</p>
              <Link href="/admin">
                <Button variant="outline" className="w-full">
                  Platform Overview
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Success Message */}
        <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">🚀 Congratulations!</h2>
            <p className="text-lg mb-6">
              Your AuctionHub platform is now live and ready to host real-time auctions. Users can register, create
              auctions, and bid in real-time with instant notifications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" variant="secondary">
                  Visit Homepage
                </Button>
              </Link>
              <Link href="/auctions">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Browse Auctions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Need help? Check the{" "}
            <Link href="/status" className="text-blue-600 hover:underline">
              system status
            </Link>{" "}
            or review the deployment documentation.
          </p>
        </div>
      </div>
    </div>
  )
}
