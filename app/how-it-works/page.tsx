
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  UserPlus,
  Search,
  Gavel,
  CreditCard,
  Shield,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  DollarSign,
} from "lucide-react"
import Link from "next/link"

export default function HowItWorksPage() {
  const steps = [
    {
      step: 1,
      title: "Create Your Account",
      description: "Sign up with email, Google, or GitHub. It's quick, free, and secure.",
      icon: UserPlus,
      color: "bg-blue-100 text-blue-600",
      details: [
        "Free registration in under 2 minutes",
        "Multiple sign-in options available",
        "Secure profile with verification",
        "Instant access to all features",
      ],
    },
    {
      step: 2,
      title: "Browse & Search",
      description: "Explore thousands of auctions across multiple categories.",
      icon: Search,
      color: "bg-green-100 text-green-600",
      details: [
        "Advanced search and filtering",
        "Browse by categories",
        "Save items to watchlist",
        "Get notifications for ending auctions",
      ],
    },
    {
      step: 3,
      title: "Place Your Bids",
      description: "Bid on items you love with real-time updates and notifications.",
      icon: Gavel,
      color: "bg-purple-100 text-purple-600",
      details: [
        "Real-time bidding system",
        "Instant outbid notifications",
        "Proxy bidding available",
        "Secure bid validation",
      ],
    },
    {
      step: 4,
      title: "Win & Pay",
      description: "Complete your purchase securely and receive your items.",
      icon: CreditCard,
      color: "bg-orange-100 text-orange-600",
      details: [
        "Secure payment processing",
        "Multiple payment methods",
        "Buyer protection included",
        "Fast shipping coordination",
      ],
    },
  ]

  const features = [
    {
      title: "Real-time Bidding",
      description: "Experience live auctions with instant updates and notifications",
      icon: Clock,
      stats: "Updates in <100ms",
    },
    {
      title: "Global Community",
      description: "Connect with buyers and sellers from around the world",
      icon: Users,
      stats: "50+ Countries",
    },
    {
      title: "Secure Transactions",
      description: "Protected payments and verified seller ratings",
      icon: Shield,
      stats: "99.9% Secure",
    },
    {
      title: "Growing Platform",
      description: "Join thousands of successful auctions every month",
      icon: TrendingUp,
      stats: "1000+ Auctions",
    },
  ]

  const sellerSteps = [
    {
      title: "List Your Item",
      description: "Create detailed listings with photos and descriptions",
      icon: "📝",
    },
    {
      title: "Set Your Terms",
      description: "Choose starting bid, reserve price, and auction duration",
      icon: "⚙️",
    },
    {
      title: "Manage Bids",
      description: "Monitor bidding activity and communicate with bidders",
      icon: "📊",
    },
    {
      title: "Complete Sale",
      description: "Finalize the transaction and ship to the winning bidder",
      icon: "📦",
    },
  ]

  const faqs = [
    {
      question: "How do I place a bid?",
      answer:
        "Simply enter your bid amount on the auction page and click 'Place Bid'. You'll receive instant confirmation and notifications if you're outbid.",
    },
    {
      question: "What happens if I win an auction?",
      answer:
        "You'll receive an email notification and can complete payment through our secure checkout process. The seller will then ship your item.",
    },
    {
      question: "How are payments processed?",
      answer:
        "We use industry-standard encryption and work with trusted payment processors to ensure your financial information is always secure.",
    },
    {
      question: "Can I cancel a bid?",
      answer:
        "Bids are binding commitments. However, you can contact our support team in exceptional circumstances within the first hour of placing a bid.",
    },
    {
      question: "What if there's a problem with my item?",
      answer:
        "We offer buyer protection and dispute resolution services. Contact our support team within 48 hours of receiving your item.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">How AuctionHub Works</h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Join thousands of buyers and sellers in the world's most exciting real-time auction platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auctions">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-900"
              >
                Browse Auctions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How to Buy Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How to Buy</h2>
            <p className="text-xl text-gray-600">Start bidding in 4 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 relative">
                    <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center mx-auto`}>
                      <step.icon className="h-8 w-8" />
                    </div>
                    <Badge className="absolute -top-2 -right-2 bg-blue-600">{step.step}</Badge>
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-left">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose AuctionHub?</h2>
            <p className="text-xl text-gray-600">The most advanced auction platform with cutting-edge features</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                    {feature.stats}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to Sell Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How to Sell</h2>
            <p className="text-xl text-gray-600">Turn your items into cash with our seller-friendly platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {sellerSteps.map((step, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/sell">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Start Selling Today
                <DollarSign className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">See what our community has achieved</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "I sold my vintage watch collection for 40% more than I expected. The real-time bidding created
                  amazing competition!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">JS</span>
                  </div>
                  <div>
                    <div className="font-semibold">John Smith</div>
                    <div className="text-sm text-gray-500">Watch Collector</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Found rare art pieces I couldn't find anywhere else. The authentication process gave me complete
                  confidence."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-semibold">MJ</span>
                  </div>
                  <div>
                    <div className="font-semibold">Maria Johnson</div>
                    <div className="text-sm text-gray-500">Art Enthusiast</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The mobile app made it easy to bid on the go. Won my dream car while traveling!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-semibold">RB</span>
                  </div>
                  <div>
                    <div className="font-semibold">Robert Brown</div>
                    <div className="text-sm text-gray-500">Car Collector</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Get answers to common questions about using AuctionHub</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Auction Journey?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of satisfied buyers and sellers on the world's most exciting auction platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Create Free Account
                <UserPlus className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auctions">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Browse Auctions
                <Search className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
