// Hand-written types — Phase 1 + Phase 5 (Chat).
// Regenerate with the Supabase CLI after running migrations:
//   pnpm dlx supabase gen types typescript --project-id <project-id> > types/database.types.ts

export type UserRole = 'buyer' | 'seller' | 'admin'
export type SubscriptionPlan = 'free' | 'basic' | 'pro'
export type SubscriptionStatus = 'active' | 'expired' | 'pending'
export type StoreStatus = 'active' | 'inactive' | 'suspended'
export type ProductCondition = 'new' | 'like_new' | 'good' | 'fair'
export type ProductGender = 'men' | 'women' | 'unisex' | 'kids'
export type ProductCategory =
  | 'tops'
  | 'bottoms'
  | 'dresses'
  | 'outerwear'
  | 'shoes'
  | 'accessories'
  | 'bags'
  | 'sportswear'
  | 'formal'
  | 'other'

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
      }
      stores: {
        Row: {
          id: string
          owner_id: string
          name: string
          slug: string
          description: string | null
          logo_url: string | null
          banner_url: string | null
          phone: string | null
          whatsapp: string | null
          address: string | null
          province: string | null
          latitude: number | null
          longitude: number | null
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
          address?: string | null
          province?: string | null
          latitude?: number | null
          longitude?: number | null
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
          address?: string | null
          province?: string | null
          latitude?: number | null
          longitude?: number | null
          status?: StoreStatus
          subscription_plan?: SubscriptionPlan
          subscription_status?: SubscriptionStatus
          subscription_ends_at?: string | null
          is_verified?: boolean
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          buyer_id: string
          store_id: string
          product_id: string | null
          last_message: string | null
          last_message_at: string | null
          buyer_unread: number
          seller_unread: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          buyer_id: string
          store_id: string
          product_id?: string | null
          last_message?: string | null
          last_message_at?: string | null
          buyer_unread?: number
          seller_unread?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          buyer_id?: string
          store_id?: string
          product_id?: string | null
          last_message?: string | null
          last_message_at?: string | null
          buyer_unread?: number
          seller_unread?: number
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
        }
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
    }
  }
}
