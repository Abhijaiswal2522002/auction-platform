import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Gavel, Eye, DollarSign } from "lucide-react"

interface DashboardStatsProps {
  userId: string
}

export default function DashboardStats({ userId }: DashboardStatsProps) {
  // In a real app, you would fetch these stats from your database
  const stats = [
    {
      title: "Active Bids",
      value: "12",
      change: "+2 from last week",
      icon: Gavel,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Watched Items",
      value: "28",
      change: "+5 from last week",
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Spent",
      value: "$2,450",
      change: "+12% from last month",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Win Rate",
      value: "68%",
      change: "+5% from last month",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Stats</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
