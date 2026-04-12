'use client'

import {
  Shirt,
  PersonStanding,
  Sparkles,
  Scissors,
  Wind,
  Footprints,
  Watch,
  Heart,
  Dumbbell,
  MoreHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProductCategory } from '@/types/database.types'
import { PRODUCT_CATEGORY_LABELS } from '@/lib/validations/product'

const CATEGORY_ICONS: Record<ProductCategory, React.ElementType> = {
  blusa:          Shirt,
  pantalon:       PersonStanding,
  vestido:        Sparkles,
  falda:          Scissors,
  abrigo:         Wind,
  zapatos:        Footprints,
  accesorio:      Watch,
  ropa_interior:  Heart,
  ropa_deportiva: Dumbbell,
  otro:           MoreHorizontal,
}

const ALL_CATEGORIES: ProductCategory[] = [
  'blusa', 'pantalon', 'vestido', 'falda', 'abrigo',
  'zapatos', 'accesorio', 'ropa_interior', 'ropa_deportiva', 'otro',
]

interface CategoryPickerProps {
  value: ProductCategory | null
  onChange: (value: ProductCategory) => void
  className?: string
}

export function CategoryPicker({ value, onChange, className }: CategoryPickerProps) {
  return (
    <div className={cn('grid grid-cols-4 sm:grid-cols-5 gap-2', className)}>
      {ALL_CATEGORIES.map((cat) => {
        const Icon = CATEGORY_ICONS[cat]
        const selected = value === cat
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            className={cn(
              'flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              selected
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted'
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="text-center text-xs font-medium leading-tight">
              {PRODUCT_CATEGORY_LABELS[cat]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
