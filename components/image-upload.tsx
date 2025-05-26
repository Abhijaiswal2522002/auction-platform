"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, ImageIcon, AlertCircle, Plus } from "lucide-react"
import Image from "next/image"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UploadedImage {
  file: File
  preview: string
  id: string
}

interface ImageUploadProps {
  onImagesChange: (images: File[]) => void
  maxImages?: number
  maxSizePerImage?: number // in MB
}

export default function ImageUpload({ onImagesChange, maxImages = 10, maxSizePerImage = 5 }: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      return "Please select only image files"
    }

    // Check file size (convert MB to bytes)
    const maxSizeBytes = maxSizePerImage * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return `Image size must be less than ${maxSizePerImage}MB`
    }

    // Check supported formats
    const supportedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
    if (!supportedFormats.includes(file.type)) {
      return "Supported formats: JPG, PNG, WebP, GIF"
    }

    return null
  }

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      setError(null)
      const fileArray = Array.from(files)

      // Check if adding these files would exceed the limit
      if (images.length + fileArray.length > maxImages) {
        setError(`You can only upload up to ${maxImages} images`)
        return
      }

      const newImages: UploadedImage[] = []

      for (const file of fileArray) {
        const validationError = validateFile(file)

        if (validationError) {
          setError(validationError)
          return
        }

        // Create preview URL
        const preview = URL.createObjectURL(file)
        const id = Math.random().toString(36).substring(2, 15)

        newImages.push({
          file,
          preview,
          id,
        })
      }

      const updatedImages = [...images, ...newImages]
      setImages(updatedImages)

      // Extract files for parent component
      const allFiles = updatedImages.map((img) => img.file)
      onImagesChange(allFiles)
    },
    [images, maxImages, onImagesChange],
  )

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      processFiles(files)
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      setIsDragging(false)

      const files = event.dataTransfer.files
      if (files && files.length > 0) {
        processFiles(files)
      }
    },
    [processFiles],
  )

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(false)
  }, [])

  const removeImage = (id: string) => {
    const imageToRemove = images.find((img) => img.id === id)
    if (imageToRemove) {
      // Revoke the preview URL to free memory
      URL.revokeObjectURL(imageToRemove.preview)
    }

    const updatedImages = images.filter((img) => img.id !== id)
    setImages(updatedImages)

    // Extract files for parent component
    const allFiles = updatedImages.map((img) => img.file)
    onImagesChange(allFiles)
    setError(null)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...images]
    const [movedImage] = updatedImages.splice(fromIndex, 1)
    updatedImages.splice(toIndex, 0, movedImage)

    setImages(updatedImages)

    // Extract files for parent component
    const allFiles = updatedImages.map((img) => img.file)
    onImagesChange(allFiles)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />

      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragging
            ? "border-blue-400 bg-blue-50"
            : images.length === 0
              ? "border-gray-300 hover:border-gray-400"
              : "border-gray-200"
        }`}
        onClick={openFileDialog}
      >
        <CardContent
          className="p-8 text-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className={`p-4 rounded-full ${isDragging ? "bg-blue-100" : "bg-gray-100"}`}>
              {images.length === 0 ? (
                <Upload className={`h-8 w-8 ${isDragging ? "text-blue-600" : "text-gray-400"}`} />
              ) : (
                <Plus className={`h-8 w-8 ${isDragging ? "text-blue-600" : "text-gray-400"}`} />
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isDragging ? "Drop images here" : images.length === 0 ? "Upload Images" : "Add More Images"}
              </h3>
              <p className="text-gray-600 mb-2">
                {images.length === 0
                  ? "Drag and drop images here, or click to select files"
                  : "Click to add more images or drag and drop"}
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: JPG, PNG, WebP, GIF (max {maxSizePerImage}MB each)
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                openFileDialog()
              }}
            >
              {images.length === 0 ? "Choose Files" : "Add More"}
            </Button>

            <p className="text-xs text-gray-500">
              {images.length} of {maxImages} images uploaded
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Image Previews */}
      {images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Uploaded Images ({images.length}/{maxImages})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <Card key={image.id} className="relative group overflow-hidden">
                <CardContent className="p-2">
                  <div className="relative aspect-square">
                    <Image
                      src={image.preview || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover rounded"
                    />

                    {/* Remove button */}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeImage(image.id)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>

                    {/* Primary image indicator */}
                    {index === 0 && (
                      <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </div>
                    )}

                    {/* Move buttons */}
                    {images.length > 1 && (
                      <div className="absolute bottom-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="secondary"
                            size="icon"
                            className="h-6 w-6 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              moveImage(index, index - 1)
                            }}
                          >
                            ←
                          </Button>
                        )}
                        {index < images.length - 1 && (
                          <Button
                            type="button"
                            variant="secondary"
                            size="icon"
                            className="h-6 w-6 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              moveImage(index, index + 1)
                            }}
                          >
                            →
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-2">
                    <p className="text-xs text-gray-600 truncate">{image.file.name}</p>
                    <p className="text-xs text-gray-500">{(image.file.size / 1024 / 1024).toFixed(1)}MB</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {images.length > 0 && (
            <p className="text-sm text-gray-600 mt-3 flex items-center">
              <ImageIcon className="h-4 w-4 inline mr-1" />
              The first image will be used as the primary image for your auction
            </p>
          )}
        </div>
      )}
    </div>
  )
}
