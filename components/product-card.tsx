'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { type Product, formatPrice, getStore } from '@/lib/mock-data'

interface ProductCardProps {
  product: Product
  showStore?: boolean
}

export function ProductCard({ product, showStore = true }: ProductCardProps) {
  const store = getStore(product.storeId)

  return (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/productos/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault()
              // TODO: Add to favorites
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-2 left-2 flex gap-1">
            <Badge variant="secondary" className="text-xs">
              {product.size}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {product.condition}
            </Badge>
          </div>
        </div>
      </Link>
      <CardContent className="p-3">
        <Link href={`/productos/${product.id}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 font-semibold text-primary">
          {formatPrice(product.price)}
        </p>
        {showStore && store && (
          <Link 
            href={`/tiendas/${store.id}`}
            className="mt-2 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Image
              src={store.logo}
              alt={store.name}
              width={16}
              height={16}
              className="rounded-full"
            />
            <span className="truncate">{store.name}</span>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
