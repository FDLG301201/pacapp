"use client"

import { useState } from "react"
import Image from "next/image"

interface ProductImage {
  url: string
  position: number
}

interface ProductGalleryProps {
  images: ProductImage[]
  title: string
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const sortedImages = images.sort((a, b) => a.position - b.position)
  const mainImage = sortedImages[selectedIndex]

  if (sortedImages.length === 0) {
    return (
      <div className="space-y-4">
        <div className="relative aspect-[3/4] bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">Sin foto</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={mainImage.url}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {sortedImages.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-square rounded-md overflow-hidden ring-2 transition-all ${
                selectedIndex === idx
                  ? "ring-emerald-600"
                  : "ring-gray-200 hover:ring-gray-300"
              }`}
            >
              <Image
                src={image.url}
                alt={`${title} ${idx + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
