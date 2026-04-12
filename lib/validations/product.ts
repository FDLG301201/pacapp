import { z } from 'zod'
import type {
  ProductCategory,
  ProductCondition,
  ProductGender,
  ProductSize,
  ProductStatus,
} from '@/types/database.types'

// ─── Enum value arrays (used in forms) ───────────────────────

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'blusa', 'pantalon', 'vestido', 'falda', 'abrigo',
  'zapatos', 'accesorio', 'ropa_interior', 'ropa_deportiva', 'otro',
]

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  blusa:          'Blusa',
  pantalon:       'Pantalón',
  vestido:        'Vestido',
  falda:          'Falda',
  abrigo:         'Abrigo',
  zapatos:        'Zapatos',
  accesorio:      'Accesorio',
  ropa_interior:  'Ropa interior',
  ropa_deportiva: 'Ropa deportiva',
  otro:           'Otro',
}

export const PRODUCT_CONDITIONS: ProductCondition[] = [
  'nuevo_etiqueta', 'como_nuevo', 'buen_estado', 'usado',
]

export const PRODUCT_CONDITION_LABELS: Record<ProductCondition, string> = {
  nuevo_etiqueta: 'Nuevo con etiqueta',
  como_nuevo:     'Como nuevo',
  buen_estado:    'Buen estado',
  usado:          'Usado',
}

export const PRODUCT_CONDITION_DESCRIPTIONS: Record<ProductCondition, string> = {
  nuevo_etiqueta: 'Sin usar, con etiqueta original',
  como_nuevo:     'Usado muy poco, sin defectos visibles',
  buen_estado:    'Algunos signos de uso menores',
  usado:          'Desgaste visible, buen precio',
}

export const PRODUCT_GENDERS: ProductGender[] = [
  'mujer', 'hombre', 'nina', 'nino', 'unisex',
]

export const PRODUCT_GENDER_LABELS: Record<ProductGender, string> = {
  mujer:   'Mujer',
  hombre:  'Hombre',
  nina:    'Niña',
  nino:    'Niño',
  unisex:  'Unisex',
}

// Default sizes (clothing)
export const SIZES_DEFAULT: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'unica']
export const SIZE_LABELS_DEFAULT: Record<string, string> = {
  XS: 'XS', S: 'S', M: 'M', L: 'L', XL: 'XL', XXL: 'XXL', unica: 'Única',
}

// Pants sizes
export const SIZES_PANTS: ProductSize[] = [
  'num_28', 'num_30', 'num_32', 'num_34', 'num_36',
  'num_38', 'num_40', 'num_42', 'num_44',
]
export const SIZE_LABELS_PANTS: Record<string, string> = {
  num_28: '28', num_30: '30', num_32: '32', num_34: '34', num_36: '36',
  num_38: '38', num_40: '40', num_42: '42', num_44: '44',
}

// Shoe sizes
export const SIZES_SHOES: ProductSize[] = [
  'talla_35', 'talla_36', 'talla_37', 'talla_38', 'talla_39',
  'talla_40', 'talla_41', 'talla_42', 'talla_43', 'talla_44', 'talla_45',
]
export const SIZE_LABELS_SHOES: Record<string, string> = {
  talla_35: '35', talla_36: '36', talla_37: '37', talla_38: '38', talla_39: '39',
  talla_40: '40', talla_41: '41', talla_42: '42', talla_43: '43',
  talla_44: '44', talla_45: '45',
}

/** Returns the correct size set for the given category */
export function getSizesForCategory(category: ProductCategory | null): {
  sizes: ProductSize[]
  labels: Record<string, string>
} {
  if (category === 'pantalon') return { sizes: SIZES_PANTS, labels: SIZE_LABELS_PANTS }
  if (category === 'zapatos') return { sizes: SIZES_SHOES, labels: SIZE_LABELS_SHOES }
  return { sizes: SIZES_DEFAULT, labels: SIZE_LABELS_DEFAULT }
}

/** Human-readable label for any size value */
export function getSizeLabel(size: ProductSize): string {
  return (
    SIZE_LABELS_DEFAULT[size] ??
    SIZE_LABELS_PANTS[size] ??
    SIZE_LABELS_SHOES[size] ??
    size
  )
}

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  active: 'Activo',
  sold:   'Vendido',
  hidden: 'Escondido',
}

// ─── Zod schema ───────────────────────────────────────────────

export const productSchema = z.object({
  price: z
    .number({ invalid_type_error: 'Ingresa un precio válido' })
    .positive('El precio debe ser mayor a 0')
    .max(999_999, 'El precio parece muy alto'),
  size: z.enum(
    ['XS','S','M','L','XL','XXL','unica',
     'num_28','num_30','num_32','num_34','num_36','num_38','num_40','num_42','num_44',
     'talla_35','talla_36','talla_37','talla_38','talla_39','talla_40',
     'talla_41','talla_42','talla_43','talla_44','talla_45'],
    { errorMap: () => ({ message: 'Selecciona una talla' }) }
  ),
  category: z.enum(
    ['blusa','pantalon','vestido','falda','abrigo','zapatos','accesorio','ropa_interior','ropa_deportiva','otro'],
    { errorMap: () => ({ message: 'Selecciona una categoría' }) }
  ),
  condition: z.enum(
    ['nuevo_etiqueta','como_nuevo','buen_estado','usado'],
    { errorMap: () => ({ message: 'Selecciona el estado' }) }
  ),
  gender: z.enum(
    ['mujer','hombre','nina','nino','unisex'],
    { errorMap: () => ({ message: 'Selecciona el género' }) }
  ),
  title: z.string().max(120, 'Título muy largo').optional().or(z.literal('')),
  description: z.string().max(1000, 'Descripción muy larga').optional().or(z.literal('')),
  brand: z.string().max(60, 'Marca muy larga').optional().or(z.literal('')),
  color: z.string().max(40, 'Color muy largo').optional().or(z.literal('')),
  material: z.string().max(60, 'Material muy largo').optional().or(z.literal('')),
})

export type ProductInput = z.infer<typeof productSchema>
