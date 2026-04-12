// Hand-written types for Phase 1 + Phase 2.
// Regenerate with the Supabase CLI once connected:
//   pnpm dlx supabase gen types typescript --project-id nxmfuvypzfckjmainpdr > types/database.types.ts

// ─── Enum types ───────────────────────────────────────────────

export type UserRole = 'buyer' | 'seller' | 'admin'
export type SubscriptionPlan = 'free' | 'basic' | 'pro'
export type SubscriptionStatus = 'active' | 'expired' | 'pending'
export type StoreStatus = 'active' | 'inactive' | 'suspended'

// Phase 2 — Spanish values (replaced Phase 1 English placeholders)
export type ProductCondition = 'nuevo_etiqueta' | 'como_nuevo' | 'buen_estado' | 'usado'
export type ProductGender = 'mujer' | 'hombre' | 'nina' | 'nino' | 'unisex'
export type ProductCategory =
  | 'blusa'
  | 'pantalon'
  | 'vestido'
  | 'falda'
  | 'abrigo'
  | 'zapatos'
  | 'accesorio'
  | 'ropa_interior'
  | 'ropa_deportiva'
  | 'otro'

export type ProductSize =
  | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'unica'
  | 'num_28' | 'num_30' | 'num_32' | 'num_34' | 'num_36'
  | 'num_38' | 'num_40' | 'num_42' | 'num_44'
  | 'talla_35' | 'talla_36' | 'talla_37' | 'talla_38' | 'talla_39'
  | 'talla_40' | 'talla_41' | 'talla_42' | 'talla_43' | 'talla_44' | 'talla_45'

export type ProductStatus = 'active' | 'sold' | 'hidden'

export type StoreCategory =
  | 'ropa_mujer'
  | 'ropa_hombre'
  | 'ropa_ninos'
  | 'calzado'
  | 'accesorios'
  | 'ropa_deportiva'
  | 'otro'

// ─── Database interface ───────────────────────────────────────
// Note: Each table must include Relationships[] to satisfy the GenericTable
// constraint in @supabase/postgrest-js v0.17+. Without it, queries return `never`.

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: UserRole
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: UserRole
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: UserRole
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      stores: {
        Row: {
          id: string
          owner_id: string
          name: string
          slug: string
          description: string | null
          logo_url: string | null
          banner_url: string | null   // used as the primary cover image
          phone: string | null
          whatsapp: string | null
          instagram: string | null
          facebook: string | null
          address: string | null
          province: string | null
          latitude: number | null
          longitude: number | null
          categories: string[]
          status: StoreStatus
          subscription_plan: SubscriptionPlan
          subscription_status: SubscriptionStatus
          subscription_ends_at: string | null
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          slug: string
          description?: string | null
          logo_url?: string | null
          banner_url?: string | null
          phone?: string | null
          whatsapp?: string | null
          instagram?: string | null
          facebook?: string | null
          address?: string | null
          province?: string | null
          latitude?: number | null
          longitude?: number | null
          categories?: string[]
          status?: StoreStatus
          subscription_plan?: SubscriptionPlan
          subscription_status?: SubscriptionStatus
          subscription_ends_at?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          slug?: string
          description?: string | null
          logo_url?: string | null
          banner_url?: string | null
          phone?: string | null
          whatsapp?: string | null
          instagram?: string | null
          facebook?: string | null
          address?: string | null
          province?: string | null
          latitude?: number | null
          longitude?: number | null
          categories?: string[]
          status?: StoreStatus
          subscription_plan?: SubscriptionPlan
          subscription_status?: SubscriptionStatus
          subscription_ends_at?: string | null
          is_verified?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'stores_owner_id_fkey'
            columns: ['owner_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      products: {
        Row: {
          id: string
          store_id: string
          title: string | null
          price: number
          size: ProductSize
          category: ProductCategory
          condition: ProductCondition
          gender: ProductGender
          description: string | null
          brand: string | null
          color: string | null
          material: string | null
          status: ProductStatus
          views_count: number
          is_wholesale: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id: string
          title?: string | null
          price: number
          size: ProductSize
          category: ProductCategory
          condition: ProductCondition
          gender: ProductGender
          description?: string | null
          brand?: string | null
          color?: string | null
          material?: string | null
          status?: ProductStatus
          views_count?: number
          is_wholesale?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          title?: string | null
          price?: number
          size?: ProductSize
          category?: ProductCategory
          condition?: ProductCondition
          gender?: ProductGender
          description?: string | null
          brand?: string | null
          color?: string | null
          material?: string | null
          status?: ProductStatus
          views_count?: number
          is_wholesale?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'products_store_id_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'stores'
            referencedColumns: ['id']
          }
        ]
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          storage_path: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          storage_path: string
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          storage_path?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: 'product_images_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: UserRole
      subscription_plan: SubscriptionPlan
      subscription_status: SubscriptionStatus
      store_status: StoreStatus
      product_condition: ProductCondition
      product_gender: ProductGender
      product_category: ProductCategory
      product_size: ProductSize
      product_status: ProductStatus
      store_category: StoreCategory
    }
    CompositeTypes: Record<string, never>
  }
}
