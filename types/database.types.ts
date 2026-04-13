// Hand-written types — Phase 1 + Phase 2 + Phase 5 (Chat) + Phase 6 (Reviews) + Phase 7 (Subscriptions).
// Regenerate with the Supabase CLI after running migrations:
//   pnpm dlx supabase gen types typescript --project-id <project-id> > types/database.types.ts

export type UserRole = 'buyer' | 'seller' | 'admin'
export type SubscriptionPlan = 'free' | 'basic' | 'pro'
export type SubscriptionStatus = 'active' | 'expired' | 'pending'
export type StoreStatus = 'active' | 'inactive' | 'suspended'
export type ProductCondition = 'new' | 'like_new' | 'good' | 'fair'
export type ProductGender = 'men' | 'women' | 'unisex' | 'kids'
export type ProductStatus = 'active' | 'sold' | 'draft' | 'paused' | 'inactive'
// product_size values — update if the Supabase enum has different values
export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL' | string
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

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: UserRole
          email: string | null
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: UserRole
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: UserRole
          email?: string | null
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
          banner_url: string | null
          phone: string | null
          whatsapp: string | null
          instagram: string | null
          facebook: string | null
          address: string | null
          province: string | null
          latitude: number | null
          longitude: number | null
          status: StoreStatus
          subscription_plan: SubscriptionPlan
          subscription_status: SubscriptionStatus
          subscription_ends_at: string | null
          is_verified: boolean
          categories: string[]
          rating_avg: number
          review_count: number
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
          status?: StoreStatus
          subscription_plan?: SubscriptionPlan
          subscription_status?: SubscriptionStatus
          subscription_ends_at?: string | null
          is_verified?: boolean
          categories?: string[]
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
          status?: StoreStatus
          subscription_plan?: SubscriptionPlan
          subscription_status?: SubscriptionStatus
          subscription_ends_at?: string | null
          is_verified?: boolean
          categories?: string[]
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
          search_vector: string | null
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
      reviews: {
        Row: {
          id: string
          store_id: string
          buyer_id: string
          conversation_id: string | null
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id: string
          buyer_id: string
          conversation_id?: string | null
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          rating?: number
          comment?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'reviews_store_id_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'stores'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reviews_buyer_id_fkey'
            columns: ['buyer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          product_id: string | null
          store_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id?: string | null
          store_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string | null
          store_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'favorites_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'favorites_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'favorites_store_id_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'stores'
            referencedColumns: ['id']
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: 'conversations_buyer_id_fkey'
            columns: ['buyer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'conversations_store_id_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'stores'
            referencedColumns: ['id']
          }
        ]
      }
      subscription_requests: {
        Row: {
          id: string
          store_id: string
          plan: SubscriptionPlan
          proof_url: string
          status: 'pending' | 'approved' | 'rejected'
          notes: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id: string
          plan: SubscriptionPlan
          proof_url: string
          status?: string
          notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: string
          notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'subscription_requests_store_id_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'stores'
            referencedColumns: ['id']
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: 'messages_conversation_id_fkey'
            columns: ['conversation_id']
            isOneToOne: false
            referencedRelation: 'conversations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'messages_sender_id_fkey'
            columns: ['sender_id']
            isOneToOne: false
            referencedRelation: 'profiles'
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
      product_status: ProductStatus
      product_size: ProductSize
    }
    CompositeTypes: Record<string, never>
  }
}
