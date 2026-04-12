import { z } from 'zod'

export const PROVINCES_RD = [
  'Distrito Nacional',
  'Azua',
  'Bahoruco',
  'Barahona',
  'Dajabón',
  'Duarte',
  'Elías Piña',
  'El Seibo',
  'Espaillat',
  'Hato Mayor',
  'Hermanas Mirabal',
  'Independencia',
  'La Altagracia',
  'La Romana',
  'La Vega',
  'María Trinidad Sánchez',
  'Monseñor Nouel',
  'Monte Cristi',
  'Monte Plata',
  'Pedernales',
  'Peravia',
  'Puerto Plata',
  'Samaná',
  'San Cristóbal',
  'San José de Ocoa',
  'San Juan',
  'San Pedro de Macorís',
  'Sánchez Ramírez',
  'Santiago',
  'Santiago Rodríguez',
  'Santo Domingo',
  'Valverde',
] as const

export type Province = (typeof PROVINCES_RD)[number]

export const STORE_CATEGORIES = [
  'ropa_mujer',
  'ropa_hombre',
  'ropa_ninos',
  'calzado',
  'accesorios',
  'ropa_deportiva',
  'otro',
] as const

export const STORE_CATEGORY_LABELS: Record<string, string> = {
  ropa_mujer:    'Ropa de mujer',
  ropa_hombre:   'Ropa de hombre',
  ropa_ninos:    'Ropa de niños',
  calzado:       'Calzado',
  accesorios:    'Accesorios',
  ropa_deportiva:'Ropa deportiva',
  otro:          'Otro',
}

const phoneRegex = /^[\d\s\-+().]{7,20}$/

export const storeSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(60, 'El nombre no puede superar 60 caracteres'),
  description: z
    .string()
    .max(200, 'La descripción no puede superar 200 caracteres')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .min(5, 'La dirección es requerida'),
  province: z.enum(PROVINCES_RD, {
    errorMap: () => ({ message: 'Selecciona una provincia válida' }),
  }),
  phone: z
    .string()
    .min(7, 'El teléfono es requerido')
    .regex(phoneRegex, 'Ingresa un número de teléfono válido'),
  whatsapp: z
    .string()
    .regex(phoneRegex, 'Ingresa un número de WhatsApp válido')
    .optional()
    .or(z.literal('')),
  instagram: z
    .string()
    .max(60, 'Instagram muy largo')
    .optional()
    .or(z.literal('')),
  facebook: z
    .string()
    .max(200, 'Facebook URL muy larga')
    .optional()
    .or(z.literal('')),
  categories: z
    .array(z.string())
    .min(1, 'Selecciona al menos una categoría'),
})

export type StoreInput = z.infer<typeof storeSchema>
