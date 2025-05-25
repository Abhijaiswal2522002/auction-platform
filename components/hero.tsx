import { Button } from "@/components/ui/button"
import { ArrowRight, Gavel, Users, Clock } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 py-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            AuctionHub
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Experience the thrill of real-time bidding on unique items from around the world
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auctions">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                Start Bidding <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-900"
              >
                Join Now
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Gavel className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Bidding</h3>
              <p className="text-blue-200">Experience live auctions with instant updates</p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Global Community</h3>
              <p className="text-blue-200">Connect with bidders worldwide</p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Timed Auctions</h3>
              <p className="text-blue-200">Secure and transparent bidding process</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
