import { Database } from "@/types/database.types"
import { ProductCard } from "./ProductCard"
import { EmptyState } from "@/components/shared/EmptyState"
import { Package } from "lucide-react"

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  product_images: { url: string; position: number }[]
  stores: { name: string; is_verified: boolean; slug: string } | null
}

interface ProductGridProps {
  products: Product[]
  emptyMessage?: string
  userId?: string | null
  favorites?: string[]
}

export function ProductGrid({
  products,
  emptyMessage = "No encontramos prendas con estos filtros",
  userId,
  favorites = [],
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="Sin resultados"
        description={emptyMessage}
        actionLabel="Limpiar filtros"
        actionHref="/productos"
      />
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product) => {
        const isFavorited = favorites.includes(product.id)
        return (
          <ProductCard
            key={product.id}
            product={product}
            isFavorited={isFavorited}
            userId={userId}
          />
        )
      })}
    </div>
  )
}
