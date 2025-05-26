import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, User, ShoppingBag } from "lucide-react"
import ImageGallery from "./image-gallery"

interface AuctionDetailsProps {
  auction: {
    _id: string
    item: string
    description: string
    imageUrl: string
    imageUrls?: string[]
    category: string
    seller: {
      name: string
      rating: number
      totalSales: number
    }
    specifications: Record<string, string>
  }
}

export default function AuctionDetails({ auction }: AuctionDetailsProps) {
  // Use imageUrls if available, otherwise fall back to single imageUrl
  const images = auction.imageUrls && auction.imageUrls.length > 0 ? auction.imageUrls : [auction.imageUrl]

  return (
    <div className="space-y-6">
      <ImageGallery images={images} title={auction.item} />

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{auction.item}</CardTitle>
              <Badge variant="secondary">{auction.category}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{auction.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Seller Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="bg-gray-200 rounded-full p-3">
              <User className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold">{auction.seller.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  {auction.seller.rating}
                </div>
                <div className="flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  {auction.seller.totalSales} sales
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(auction.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600">{key}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
