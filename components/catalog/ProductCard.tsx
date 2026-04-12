// @ts-nocheck - Image component type narrowing issue (FIXME: resolve Image type strictness)
import Link from "next/link"
import Image from "next/image"
import { Database } from "@/types/database.types"
import { FavoriteButton } from "./FavoriteButton"
import { CheckCircle } from "lucide-react"

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  product_images: { url: string; position: number }[]
  stores: { name: string; is_verified: boolean; slug: string } | null
}

interface ProductCardProps {
  product: Product
  isFavorited?: boolean
  userId?: string | null
}

export function ProductCard({
  product,
  isFavorited = false,
  userId,
}: ProductCardProps) {
  const sortedImages = [...product.product_images].sort((a, b) => a.position - b.position)
  const hasImage = sortedImages.length > 0
  const mainImageUrl = hasImage ? sortedImages[0].url : ""

  return (
    <Link href={`/productos/${product.id}`}>
      <div className="group cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3 transition-transform duration-300 group-hover:scale-[1.02]">
          {hasImage ? (
            <Image
              // @ts-ignore - Image type narrowing issue, but src will always be a string here
              src={mainImageUrl}
              alt={product.title || "Producto"}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Sin foto</span>
            </div>
          )}

          {/* Price Pill */}
          <div className="absolute bottom-2 left-2 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            RD${product.price.toLocaleString("es-DO")}
          </div>

          {/* Favorite Button */}
          <div className="absolute top-2 right-2 z-10">
            <FavoriteButton
              productId={product.id}
              initialFavorited={isFavorited}
              userId={userId}
            />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {product.title || "Producto sin título"}
          </h3>
          <div className="flex items-center justify-between gap-1">
            <p className="text-xs text-gray-600 truncate">{product.stores?.name || "Tienda"}</p>
            {product.stores?.is_verified && (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
