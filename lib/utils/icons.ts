import {
  Shirt,
  TrendingUp,
  Gift,
  Zap,
  Flame,
  Footprints,
  Sparkles,
  Heart,
  Dumbbell,
  Package,
  type LucideIcon,
} from "lucide-react"
import { ProductCategory } from "@/types/database.types"

export function getCategoryIcon(category: ProductCategory): LucideIcon {
  const iconMap: Record<ProductCategory, LucideIcon> = {
    blusa: Shirt,
    pantalon: TrendingUp,
    vestido: Gift,
    falda: Zap,
    abrigo: Flame,
    zapatos: Footprints,
    accesorio: Sparkles,
    ropa_interior: Heart,
    ropa_deportiva: Dumbbell,
    otro: Package,
  }

  return iconMap[category] || Package
}
