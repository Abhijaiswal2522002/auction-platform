import Link from "next/link"
import { Gavel, Facebook, Twitter, Instagram, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Gavel className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">AuctionHub</span>
            </div>
            <p className="text-gray-400 text-sm">
              The world's leading real-time auction platform. Discover unique items and bid with confidence.
            </p>
           <div className="flex space-x-4">
  <a href="https://www.facebook.com/yourprofile" target="_blank" rel="noopener noreferrer">
    <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
  </a>
  <a href="https://www.twitter.com/yourprofile" target="_blank" rel="noopener noreferrer">
    <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
  </a>
  <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
    <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
  </a>
  <a href="mailto:abhijaiswal2503@gmail.com">
    <Mail className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
  </a>
</div>

          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auctions" className="text-gray-400 hover:text-white">
                  Browse Auctions
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-white">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-white">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-gray-400 hover:text-white">
                  Sell with Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-gray-400 hover:text-white">
                  Safety & Security
                </Link>
              </li>
              <li>
                <Link href="/disputes" className="text-gray-400 hover:text-white">
                  Dispute Resolution
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-white">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-gray-400 hover:text-white">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 AuctionHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
