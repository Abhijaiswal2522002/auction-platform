import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, Bell, Settings } from "lucide-react"
import Link from "next/link"

export default function QuickActions() {
  const actions = [
    {
      title: "Create Auction",
      description: "List an item for auction",
      icon: Plus,
      href: "/sell",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Browse Auctions",
      description: "Find items to bid on",
      icon: Search,
      href: "/auctions",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Notifications",
      description: "View your alerts",
      icon: Bell,
      href: "/dashboard/notifications",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Settings",
      description: "Manage your account",
      icon: Settings,
      href: "/dashboard/settings",
      color: "bg-gray-600 hover:bg-gray-700",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50">
                <div className={`p-2 rounded-full text-white ${action.color}`}>
                  <action.icon className="h-4 w-4" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
