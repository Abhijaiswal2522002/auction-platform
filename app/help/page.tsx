import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  Shield,
  CreditCard,
  Truck,
  Search,
  Book,
  Users,
} from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  const helpCategories = [
    {
      title: "Getting Started",
      icon: HelpCircle,
      color: "bg-blue-100 text-blue-600",
      topics: [
        "How to create an account",
        "Setting up your profile",
        "Understanding auction basics",
        "First-time bidding guide",
      ],
    },
    {
      title: "Bidding & Buying",
      icon: CreditCard,
      color: "bg-green-100 text-green-600",
      topics: ["How to place a bid", "Understanding proxy bidding", "Payment methods", "Winning an auction"],
    },
    {
      title: "Selling",
      icon: Truck,
      color: "bg-purple-100 text-purple-600",
      topics: [
        "Creating your first listing",
        "Setting reserve prices",
        "Managing your auctions",
        "Shipping guidelines",
      ],
    },
    {
      title: "Safety & Security",
      icon: Shield,
      color: "bg-orange-100 text-orange-600",
      topics: ["Account security tips", "Avoiding scams", "Dispute resolution", "Buyer protection"],
    },
  ]

  const quickLinks = [
    { title: "Account Settings", href: "/dashboard/settings" },
    { title: "Payment Methods", href: "/dashboard/payments" },
    { title: "Order History", href: "/dashboard/orders" },
    { title: "Watchlist", href: "/dashboard/watchlist" },
    { title: "Selling Dashboard", href: "/dashboard/selling" },
    { title: "Community Guidelines", href: "/guidelines" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-xl mb-8 text-blue-100">Find answers to your questions and get the support you need</p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for help articles..."
                className="pl-12 pr-4 py-3 text-lg bg-white text-gray-900"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse Help Topics</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <category.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.topics.map((topic, idx) => (
                      <li key={idx} className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer">
                        • {topic}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Quick Links</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <Link key={index} href={link.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{link.title}</span>
                      <span className="text-blue-600">→</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Contact Support</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Methods */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Get in Touch</h3>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <MessageCircle className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Live Chat</h4>
                        <p className="text-gray-600">Available 24/7</p>
                      </div>
                    </div>
                    <Button className="w-full">Start Live Chat</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-100 p-3 rounded-full mr-4">
                        <Mail className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Email Support</h4>
                        <p className="text-gray-600">Response within 24 hours</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">support@auctionhub.com</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-purple-100 p-3 rounded-full mr-4">
                        <Phone className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Phone Support</h4>
                        <p className="text-gray-600">Mon-Fri 9AM-6PM EST</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">1-800-AUCTION</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Send us a Message</h3>

              <Card>
                <CardContent className="p-6">
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Subject</label>
                      <Input placeholder="What can we help you with?" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input type="email" placeholder="your@email.com" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <Textarea placeholder="Please describe your issue or question in detail..." rows={6} />
                    </div>

                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Status & Updates */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">System Status & Updates</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">System Status</h3>
                <p className="text-green-600 font-medium">All Systems Operational</p>
                <Link href="/status">
                  <Button variant="outline" size="sm" className="mt-2">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Book className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Documentation</h3>
                <p className="text-gray-600">Complete guides and tutorials</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Browse Docs
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Community</h3>
                <p className="text-gray-600">Connect with other users</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Join Forum
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
