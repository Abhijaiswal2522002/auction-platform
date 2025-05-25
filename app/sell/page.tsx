"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, DollarSign } from "lucide-react"

const categories = [
  "Art",
  "Watches",
  "Vehicles",
  "Collectibles",
  "Home & Garden",
  "Sports",
  "Electronics",
  "Jewelry",
  "Books",
  "Fashion",
]

export default function SellPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    item: "",
    description: "",
    category: "",
    startingBid: "",
    reservePrice: "",
    buyNowPrice: "",
    duration: "7", // days
    condition: "",
    shippingCost: "",
    location: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!session) {
      setError("You must be logged in to create an auction")
      setIsLoading(false)
      return
    }

    try {
      const endTime = new Date()
      endTime.setDate(endTime.getDate() + Number.parseInt(formData.duration))

      const response = await fetch("/api/auctions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          startingBid: Number.parseFloat(formData.startingBid),
          reservePrice: formData.reservePrice ? Number.parseFloat(formData.reservePrice) : null,
          buyNowPrice: formData.buyNowPrice ? Number.parseFloat(formData.buyNowPrice) : null,
          shippingCost: formData.shippingCost ? Number.parseFloat(formData.shippingCost) : 0,
          endTime: endTime.toISOString(),
          sellerId: session.user.id,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/auctions/${data._id}`)
      } else {
        setError(data.error || "Failed to create auction")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Login Required</h2>
            <p className="text-gray-600 mb-4">You need to be logged in to create an auction.</p>
            <Button onClick={() => router.push("/auth/login")}>Login</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Auction</h1>
          <p className="text-gray-600 mt-2">List your item and start receiving bids</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="item">Item Title *</Label>
                <Input
                  id="item"
                  name="item"
                  value={formData.item}
                  onChange={handleInputChange}
                  placeholder="Enter a descriptive title for your item"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide detailed information about your item, including condition, history, and any relevant details"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select onValueChange={(value) => handleSelectChange("category", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="condition">Condition *</Label>
                  <Select onValueChange={(value) => handleSelectChange("condition", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="like-new">Like New</SelectItem>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Pricing & Auction Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="startingBid">Starting Bid * ($)</Label>
                  <Input
                    id="startingBid"
                    name="startingBid"
                    type="number"
                    min="1"
                    step="0.01"
                    value={formData.startingBid}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="reservePrice">Reserve Price ($)</Label>
                  <Input
                    id="reservePrice"
                    name="reservePrice"
                    type="number"
                    min="1"
                    step="0.01"
                    value={formData.reservePrice}
                    onChange={handleInputChange}
                    placeholder="Optional"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum price you'll accept</p>
                </div>

                <div>
                  <Label htmlFor="buyNowPrice">Buy It Now Price ($)</Label>
                  <Input
                    id="buyNowPrice"
                    name="buyNowPrice"
                    type="number"
                    min="1"
                    step="0.01"
                    value={formData.buyNowPrice}
                    onChange={handleInputChange}
                    placeholder="Optional"
                  />
                  <p className="text-xs text-gray-500 mt-1">Instant purchase price</p>
                </div>
              </div>

              <div>
                <Label htmlFor="duration">Auction Duration *</Label>
                <Select onValueChange={(value) => handleSelectChange("duration", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Day</SelectItem>
                    <SelectItem value="3">3 Days</SelectItem>
                    <SelectItem value="5">5 Days</SelectItem>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="10">10 Days</SelectItem>
                    <SelectItem value="14">14 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Shipping & Location */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping & Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Item Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, State, Country"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="shippingCost">Shipping Cost ($)</Label>
                  <Input
                    id="shippingCost"
                    name="shippingCost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.shippingCost}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave blank for free shipping</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Images</h3>
                <p className="text-gray-600 mb-4">Add up to 10 high-quality images of your item</p>
                <Button type="button" variant="outline">
                  Choose Files
                </Button>
                <p className="text-xs text-gray-500 mt-2">Supported formats: JPG, PNG, GIF (max 5MB each)</p>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating Auction..." : "Create Auction"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
