"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Expand } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface ImageGalleryProps {
  images: string[]
  title: string
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter out any empty or invalid images
  const validImages = images.filter((img) => img && img.trim() !== "")

  if (!validImages || validImages.length === 0) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="No image available"
              width={400}
              height={300}
              className="object-cover rounded-t-lg"
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % validImages.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length)
  }

  const selectImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Card>
        <CardContent className="p-0 relative">
          <div className="relative w-full h-96 group">
            <Image
              src={validImages[currentImageIndex] || "/placeholder.svg?height=400&width=600"}
              alt={`${title} - Image ${currentImageIndex + 1}`}
              fill
              className="object-cover rounded-t-lg"
              priority
            />

            {/* Navigation Arrows */}
            {validImages.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={previousImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Expand Button */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Expand className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-full">
                <DialogHeader>
                  <DialogTitle>
                    {title} - Image {currentImageIndex + 1} of {validImages.length}
                  </DialogTitle>
                </DialogHeader>
                <div className="relative w-full h-[70vh]">
                  <Image
                    src={validImages[currentImageIndex] || "/placeholder.svg?height=400&width=600"}
                    alt={`${title} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-contain"
                  />

                  {/* Modal Navigation */}
                  {validImages.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2"
                        onClick={previousImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Image Counter */}
            {validImages.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                {currentImageIndex + 1} / {validImages.length}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Thumbnail Strip */}
      {validImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => selectImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden transition-all ${
                index === currentImageIndex
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Image
                src={image || "/placeholder.svg?height=80&width=80"}
                alt={`${title} thumbnail ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
