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
import { DollarSign, Loader2, Upload } from "lucide-react"
import ImageUpload from "@/components/image-upload"

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
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [images, setImages] = useState<File[]>([])
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

  const handleImagesChange = (newImages: File[]) => {
    setImages(newImages)
    console.log("Images updated:", newImages.length)
  }

  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) {
      return ["/placeholder.svg?height=400&width=600"] // Default placeholder
    }

    setIsUploadingImages(true)
    try {
      console.log("Starting image upload for", images.length, "files")

      const formData = new FormData()
      images.forEach((image, index) => {
        formData.append("files", image)
        console.log(`Added file ${index + 1}:`, image.name, image.size, "bytes")
      })

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      console.log("Upload response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Upload error response:", errorData)
        throw new Error(errorData.error || "Failed to upload images")
      }

      const data = await response.json()
      console.log("Upload successful:", data)

      const imageUrls = data.files.map((file: any) => file.url)
      console.log("Image URLs:", imageUrls)

      return imageUrls
    } catch (error) {
      console.error("Image upload error:", error)
      throw new Error(error instanceof Error ? error.message : "Failed to upload images")
    } finally {
      setIsUploadingImages(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!session) {
      setError("You must be logged in to create an auction")
      setIsLoading(false)
      return
    }

    // Validate required fields
    if (!formData.item.trim()) {
      setError("Item title is required")
      setIsLoading(false)
      return
    }

    if (!formData.description.trim()) {
      setError("Item description is required")
      setIsLoading(false)
      return
    }

    if (!formData.category) {
      setError("Please select a category")
      setIsLoading(false)
      return
    }

    if (!formData.condition) {
      setError("Please select item condition")
      setIsLoading(false)
      return
    }

    if (!formData.location.trim()) {
      setError("Item location is required")
      setIsLoading(false)
      return
    }

    if (!formData.startingBid || Number.parseFloat(formData.startingBid) <= 0) {
      setError("Please enter a valid starting bid")
      setIsLoading(false)
      return
    }

    try {
      console.log("Starting auction creation process...")

      // Upload images first
      const imageUrls = await uploadImages()
      console.log("Images uploaded successfully:", imageUrls)

      const endTime = new Date()
      endTime.setDate(endTime.getDate() + Number.parseInt(formData.duration))

      const auctionData = {
        ...formData,
        startingBid: Number.parseFloat(formData.startingBid),
        reservePrice: formData.reservePrice ? Number.parseFloat(formData.reservePrice) : null,
        buyNowPrice: formData.buyNowPrice ? Number.parseFloat(formData.buyNowPrice) : null,
        shippingCost: formData.shippingCost ? Number.parseFloat(formData.shippingCost) : 0,
        endTime: endTime.toISOString(),
        sellerId: session.user.id,
        imageUrl: imageUrls[0], // Primary image
        imageUrls: imageUrls, // All images
      }

      console.log("Creating auction with data:", auctionData)

      const response = await fetch("/api/auctions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(auctionData),
      })

      console.log("Auction creation response status:", response.status)

      const data = await response.json()

      if (response.ok) {
        console.log("Auction created successfully:", data)
        setSuccess("Auction created successfully! Redirecting...")
        setTimeout(() => {
          router.push(`/auctions/${data._id}`)
        }, 1500)
      } else {
        console.error("Auction creation failed:", data)
        setError(data.error || "Failed to create auction")
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error)
      setError(error instanceof Error ? error.message : "An error occurred. Please try again.")
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

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
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

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload onImagesChange={handleImagesChange} maxImages={10} maxSizePerImage={5} />
              <p className="text-sm text-gray-600 mt-2">
                Add high-quality images to attract more bidders. The first image will be the main image.
              </p>
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

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isUploadingImages} className="min-w-[140px]">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isUploadingImages ? "Uploading..." : "Creating..."}
                </>
              ) : (
                "Create Auction"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
