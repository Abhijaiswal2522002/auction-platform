"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface Category {
  _id: string
  name: string
  slug: string
}

const statuses = [
  { value: "active", label: "Active" },
  { value: "ending-soon", label: "Ending Soon" },
]

export default function AuctionFilters() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 100000])
  const router = useRouter()
  const searchParams = useSearchParams()

  // Fetch categories
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

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")

    if (category) {
      setSelectedCategories([category])
    }
    if (status) {
      setSelectedStatuses([status])
    }
    if (minPrice && maxPrice) {
      setPriceRange([Number.parseInt(minPrice), Number.parseInt(maxPrice)])
    }
  }, [searchParams])

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categorySlug])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== categorySlug))
    }
  }

  const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      setSelectedStatuses([...selectedStatuses, status])
    } else {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status))
    }
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    // Preserve existing search query
    const search = searchParams.get("search")
    if (search) {
      params.set("search", search)
    }

    // Add category filters
    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","))
    }

    // Add status filters
    if (selectedStatuses.length > 0) {
      params.set("status", selectedStatuses.join(","))
    }

    // Add price range
    if (priceRange[0] > 0 || priceRange[1] < 100000) {
      params.set("minPrice", priceRange[0].toString())
      params.set("maxPrice", priceRange[1].toString())
    }

    router.push(`/auctions?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedStatuses([])
    setPriceRange([0, 100000])

    // Preserve search query but clear other filters
    const search = searchParams.get("search")
    if (search) {
      router.push(`/auctions?search=${search}`)
    } else {
      router.push("/auctions")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category._id} className="flex items-center space-x-2">
              <Checkbox
                id={category.slug}
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={(checked) => handleCategoryChange(category.slug, checked as boolean)}
              />
              <Label htmlFor={category.slug} className="text-sm font-normal cursor-pointer">
                {category.name}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-600">
                ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
              </Label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={100000}
                min={0}
                step={1000}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {statuses.map((status) => (
            <div key={status.value} className="flex items-center space-x-2">
              <Checkbox
                id={status.value}
                checked={selectedStatuses.includes(status.value)}
                onCheckedChange={(checked) => handleStatusChange(status.value, checked as boolean)}
              />
              <Label htmlFor={status.value} className="text-sm font-normal cursor-pointer">
                {status.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear Filters
        </Button>
      </div>
    </div>
  )
}
