export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      conversations: {
        Row: {
          buyer_id: string
          buyer_unread: number
          created_at: string
          id: string
          last_message: string | null
          last_message_at: string | null
          product_id: string | null
          seller_unread: number
          store_id: string
          updated_at: string
        }
        Insert: {
          buyer_id: string
          buyer_unread?: number
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          product_id?: string | null
          seller_unread?: number
          store_id: string
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          buyer_unread?: number
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          product_id?: string | null
          seller_unread?: number
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          store_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          store_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          store_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          id: string
          position: number
          product_id: string
          storage_path: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          position?: number
          product_id: string
          storage_path: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          position?: number
          product_id?: string
          storage_path?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category: Database["public"]["Enums"]["product_category"]
          color: string | null
          condition: Database["public"]["Enums"]["product_condition"]
          created_at: string
          description: string | null
          gender: Database["public"]["Enums"]["product_gender"]
          id: string
          is_wholesale: boolean
          material: string | null
          price: number
          search_vector: unknown
          size: Database["public"]["Enums"]["product_size"]
          status: Database["public"]["Enums"]["product_status"]
          store_id: string
          title: string | null
          updated_at: string
          views_count: number
        }
        Insert: {
          brand?: string | null
          category: Database["public"]["Enums"]["product_category"]
          color?: string | null
          condition: Database["public"]["Enums"]["product_condition"]
          created_at?: string
          description?: string | null
          gender: Database["public"]["Enums"]["product_gender"]
          id?: string
          is_wholesale?: boolean
          material?: string | null
          price: number
          search_vector?: unknown
          size: Database["public"]["Enums"]["product_size"]
          status?: Database["public"]["Enums"]["product_status"]
          store_id: string
          title?: string | null
          updated_at?: string
          views_count?: number
        }
        Update: {
          brand?: string | null
          category?: Database["public"]["Enums"]["product_category"]
          color?: string | null
          condition?: Database["public"]["Enums"]["product_condition"]
          created_at?: string
          description?: string | null
          gender?: Database["public"]["Enums"]["product_gender"]
          id?: string
          is_wholesale?: boolean
          material?: string | null
          price?: number
          search_vector?: unknown
          size?: Database["public"]["Enums"]["product_size"]
          status?: Database["public"]["Enums"]["product_status"]
          store_id?: string
          title?: string | null
          updated_at?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      stores: {
        Row: {
          address: string | null
          banner_url: string | null
          categories: string[]
          created_at: string
          description: string | null
          facebook: string | null
          id: string
          instagram: string | null
          is_verified: boolean
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          name: string
          owner_id: string
          phone: string | null
          province: string | null
          slug: string
          status: Database["public"]["Enums"]["store_status"]
          subscription_ends_at: string | null
          subscription_plan: Database["public"]["Enums"]["subscription_plan"]
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          banner_url?: string | null
          categories?: string[]
          created_at?: string
          description?: string | null
          facebook?: string | null
          id?: string
          instagram?: string | null
          is_verified?: boolean
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name: string
          owner_id: string
          phone?: string | null
          province?: string | null
          slug: string
          status?: Database["public"]["Enums"]["store_status"]
          subscription_ends_at?: string | null
          subscription_plan?: Database["public"]["Enums"]["subscription_plan"]
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          banner_url?: string | null
          categories?: string[]
          created_at?: string
          description?: string | null
          facebook?: string | null
          id?: string
          instagram?: string | null
          is_verified?: boolean
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name?: string
          owner_id?: string
          phone?: string | null
          province?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["store_status"]
          subscription_ends_at?: string | null
          subscription_plan?: Database["public"]["Enums"]["subscription_plan"]
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stores_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_product_title: {
        Args: {
          p_category: Database["public"]["Enums"]["product_category"]
          p_size: Database["public"]["Enums"]["product_size"]
        }
        Returns: string
      }
      increment_product_views: {
        Args: { p_product_id: string }
        Returns: undefined
      }
    }
    Enums: {
      product_category:
        | "blusa"
        | "pantalon"
        | "vestido"
        | "falda"
        | "abrigo"
        | "zapatos"
        | "accesorio"
        | "ropa_interior"
        | "ropa_deportiva"
        | "otro"
      product_condition:
        | "nuevo_etiqueta"
        | "como_nuevo"
        | "buen_estado"
        | "usado"
      product_gender: "mujer" | "hombre" | "nina" | "nino" | "unisex"
      product_size:
        | "XS"
        | "S"
        | "M"
        | "L"
        | "XL"
        | "XXL"
        | "unica"
        | "num_28"
        | "num_30"
        | "num_32"
        | "num_34"
        | "num_36"
        | "num_38"
        | "num_40"
        | "num_42"
        | "num_44"
        | "talla_35"
        | "talla_36"
        | "talla_37"
        | "talla_38"
        | "talla_39"
        | "talla_40"
        | "talla_41"
        | "talla_42"
        | "talla_43"
        | "talla_44"
        | "talla_45"
      product_status: "active" | "sold" | "hidden"
      store_category:
        | "ropa_mujer"
        | "ropa_hombre"
        | "ropa_ninos"
        | "calzado"
        | "accesorios"
        | "ropa_deportiva"
        | "otro"
      store_status: "active" | "inactive" | "suspended"
      subscription_plan: "free" | "basic" | "pro"
      subscription_status: "active" | "expired" | "pending"
      user_role: "buyer" | "seller" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

// Enum type aliases for convenience
export type UserRole = "buyer" | "seller" | "admin"
export type SubscriptionPlan = "free" | "basic" | "pro"
export type SubscriptionStatus = "active" | "expired" | "pending"
export type StoreStatus = "active" | "inactive" | "suspended"
export type StoreCategory = "ropa_mujer" | "ropa_hombre" | "ropa_ninos" | "calzado" | "accesorios" | "ropa_deportiva" | "otro"
export type ProductStatus = "active" | "sold" | "hidden"
export type ProductCategory = "blusa" | "pantalon" | "vestido" | "falda" | "abrigo" | "zapatos" | "accesorio" | "ropa_interior" | "ropa_deportiva" | "otro"
export type ProductCondition = "nuevo_etiqueta" | "como_nuevo" | "buen_estado" | "usado"
export type ProductGender = "mujer" | "hombre" | "nina" | "nino" | "unisex"
export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "unica" | "num_28" | "num_30" | "num_32" | "num_34" | "num_36" | "num_38" | "num_40" | "num_42" | "num_44" | "talla_35" | "talla_36" | "talla_37" | "talla_38" | "talla_39" | "talla_40" | "talla_41" | "talla_42" | "talla_43" | "talla_44" | "talla_45"

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      product_category: [
        "blusa",
        "pantalon",
        "vestido",
        "falda",
        "abrigo",
        "zapatos",
        "accesorio",
        "ropa_interior",
        "ropa_deportiva",
        "otro",
      ],
      product_condition: [
        "nuevo_etiqueta",
        "como_nuevo",
        "buen_estado",
        "usado",
      ],
      product_gender: ["mujer", "hombre", "nina", "nino", "unisex"],
      product_size: [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL",
        "unica",
        "num_28",
        "num_30",
        "num_32",
        "num_34",
        "num_36",
        "num_38",
        "num_40",
        "num_42",
        "num_44",
        "talla_35",
        "talla_36",
        "talla_37",
        "talla_38",
        "talla_39",
        "talla_40",
        "talla_41",
        "talla_42",
        "talla_43",
        "talla_44",
        "talla_45",
      ],
      product_status: ["active", "sold", "hidden"],
      store_category: [
        "ropa_mujer",
        "ropa_hombre",
        "ropa_ninos",
        "calzado",
        "accesorios",
        "ropa_deportiva",
        "otro",
      ],
      store_status: ["active", "inactive", "suspended"],
      subscription_plan: ["free", "basic", "pro"],
      subscription_status: ["active", "expired", "pending"],
      user_role: ["buyer", "seller", "admin"],
    },
  },
} as const
