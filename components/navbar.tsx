"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Gavel, Search, Menu, X, ChevronDown } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Category {
  _id: string
  name: string
  slug: string
  description: string
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const { data: session } = useSession()
  const router = useRouter()

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/auctions?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsMenuOpen(false)
    }
  }

  const handleCategoryClick = (categorySlug: string) => {
    router.push(`/auctions?category=${categorySlug}`)
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Gavel className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">AuctionHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/auctions" className="text-gray-700 hover:text-blue-600 transition-colors">
               Auctions
            </Link>

            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Categories
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/auctions" className="w-full">
                    All Categories
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {categories.map((category) => (
                  <DropdownMenuItem key={category._id} asChild>
                    <button onClick={() => handleCategoryClick(category.slug)} className="w-full text-left">
                      {category.name}
                    </button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">
              How it Works
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search auctions..."
                className="pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/sell">
                  <Button variant="outline" size="sm">
                    Sell Item
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={(session?.user?.image as string) || "/placeholder.svg"}
                          alt={session?.user?.name as string}
                        />
                        <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{session?.user?.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">{session?.user?.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/bids">My Bids</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/watchlist">Watchlist</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="mb-4">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search auctions..."
                    className="pl-10 pr-4"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>

              {/* Mobile Navigation Links */}
              <Link
                href="/auctions"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                 Auctions
              </Link>

              {/* Mobile Categories */}
              <div className="px-3 py-2">
                <div className="text-gray-700 font-medium mb-2">Categories</div>
                <div className="pl-4 space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => handleCategoryClick(category.slug)}
                      className="block w-full text-left px-2 py-1 text-gray-600 hover:text-blue-600 text-sm"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <Link
                href="/how-it-works"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                How it Works
              </Link>

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t">
                {session ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 border-b">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={(session?.user?.image as string) || "/placeholder.svg"}
                            alt={session?.user?.name as string}
                          />
                          <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{session?.user?.name}</div>
                          <div className="text-xs text-gray-500">{session?.user?.email}</div>
                        </div>
                      </div>
                    </div>
                    <Link href="/sell" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        Sell Item
                      </Button>
                    </Link>
                    <Link href="/dashboard" className="block">
                      <Button variant="ghost" className="w-full justify-start">
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/dashboard/bids" className="block">
                      <Button variant="ghost" className="w-full justify-start">
                        My Bids
                      </Button>
                    </Link>
                    <Link href="/dashboard/watchlist" className="block">
                      <Button variant="ghost" className="w-full justify-start">
                        Watchlist
                      </Button>
                    </Link>
                    <Link href="/dashboard/settings" className="block">
                      <Button variant="ghost" className="w-full justify-start">
                        Settings
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600"
                      onClick={() => {
                        signOut()
                        setIsMenuOpen(false)
                      }}
                    >
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/auth/login" className="block">
                      <Button variant="ghost" className="w-full justify-start">
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/register" className="block">
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
