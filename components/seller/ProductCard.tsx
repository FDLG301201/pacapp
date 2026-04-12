'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MoreVertical, Pencil, Eye, EyeOff, ShoppingBag, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ProductStatus } from '@/types/database.types'
import { PRODUCT_STATUS_LABELS } from '@/lib/validations/product'

const STATUS_VARIANTS: Record<ProductStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  active: 'default',
  sold:   'secondary',
  hidden: 'outline',
}

interface SellerProduct {
  id: string
  title: string | null
  price: number
  status: ProductStatus
  views_count: number
  product_images: { url: string }[]
}

interface ProductCardProps {
  product: SellerProduct
  onMarkSold: (id: string) => void
  onToggleHide: (id: string, currentStatus: ProductStatus) => void
  onDelete: (id: string) => void
}

export function ProductCard({ product, onMarkSold, onToggleHide, onDelete }: ProductCardProps) {
  const coverUrl = product.product_images?.[0]?.url
  const displayTitle = product.title ?? 'Producto sin título'
  const isHidden = product.status === 'hidden'

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-square bg-muted">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={displayTitle}
            fill
            sizes="(max-width: 640px) 50vw, 200px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
            Sin foto
          </div>
        )}
        {/* Status badge */}
        <div className="absolute left-2 top-2">
          <Badge variant={STATUS_VARIANTS[product.status]} className="text-xs">
            {PRODUCT_STATUS_LABELS[product.status]}
          </Badge>
        </div>
        {/* Kebab menu */}
        <div className="absolute right-1 top-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full bg-black/40 text-white hover:bg-black/60"
                aria-label="Acciones del producto"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/seller/productos/${product.id}/editar`}>
                  <Pencil className="mr-2 h-4 w-4" /> Editar
                </Link>
              </DropdownMenuItem>
              {product.status !== 'sold' && (
                <DropdownMenuItem onClick={() => onMarkSold(product.id)}>
                  <ShoppingBag className="mr-2 h-4 w-4" /> Marcar como vendido
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onToggleHide(product.id, product.status)}>
                {isHidden ? (
                  <><Eye className="mr-2 h-4 w-4" /> Mostrar</>
                ) : (
                  <><EyeOff className="mr-2 h-4 w-4" /> Esconder</>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(product.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Info */}
      <div className="p-3">
        <p className="truncate text-sm font-medium">{displayTitle}</p>
        <p className="mt-0.5 text-base font-bold text-primary">
          RD${product.price.toLocaleString('es-DO', { minimumFractionDigits: 0 })}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {product.views_count} {product.views_count === 1 ? 'vista' : 'vistas'}
        </p>
      </div>
    </div>
  )
}
