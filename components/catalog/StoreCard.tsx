// @ts-nocheck - Image component type narrowing issue (FIXME: resolve Image type strictness)
import Link from "next/link"
import Image from "next/image"
import { Database } from "@/types/database.types"
import { CheckCircle, MapPin, Star } from "lucide-react"
import { FavoriteButton } from "./FavoriteButton"

type Store = Database["public"]["Tables"]["stores"]["Row"]

interface StoreCardProps {
  store: Store
  isFavorited?: boolean
  userId?: string | null
}

export function StoreCard({
  store,
  isFavorited = false,
  userId,
}: StoreCardProps) {
  const hasImage = !!(store.logo_url || store.banner_url)
  const imageUrl = store.logo_url || store.banner_url || ""

  return (
    <Link href={`/tiendas/${store.id}`}>
      <div className="group cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
          {hasImage ? (
            <Image
              // @ts-ignore - Image type narrowing issue, but src will always be a string here
              src={imageUrl}
              alt={store.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Tienda</span>
            </div>
          )}

          {/* Favorite Button */}
          <div className="absolute top-2 right-2 z-10">
            <FavoriteButton
              storeId={store.id}
              initialFavorited={isFavorited}
              userId={userId}
            />
          </div>

          {/* Verified Badge */}
          {store.is_verified && (
            <div className="absolute top-2 left-2 bg-emerald-600 text-white rounded-full p-1">
              <CheckCircle className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
            {store.name}
          </h3>

          {/* Rating Placeholder */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Star className="w-3 h-3" />
            <span>Sin reseñas</span>
          </div>

          {/* Province */}
          {store.province ? (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{store.province}</span>
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  )
}
