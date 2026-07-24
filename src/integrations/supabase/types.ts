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
      banners: {
        Row: {
          active: boolean
          created_at: string
          cta_href: string
          cta_label: string
          ends_at: string | null
          eyebrow: string
          id: string
          image_url: string
          sort_order: number
          starts_at: string | null
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          cta_href?: string
          cta_label?: string
          ends_at?: string | null
          eyebrow?: string
          id?: string
          image_url?: string
          sort_order?: number
          starts_at?: string | null
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          cta_href?: string
          cta_label?: string
          ends_at?: string | null
          eyebrow?: string
          id?: string
          image_url?: string
          sort_order?: number
          starts_at?: string | null
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      custom_fields: {
        Row: {
          active: boolean
          created_at: string
          field_type: string
          id: string
          label: string
          metadata: Json
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          field_type: string
          id?: string
          label: string
          metadata?: Json
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          field_type?: string
          id?: string
          label?: string
          metadata?: Json
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          metadata: Json
          name: string
          phone: string
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          metadata?: Json
          name: string
          phone?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          metadata?: Json
          name?: string
          phone?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_media: {
        Row: {
          alt: string
          created_at: string
          id: string
          is_cover: boolean
          media_type: string
          product_id: string
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          alt?: string
          created_at?: string
          id?: string
          is_cover?: boolean
          media_type?: string
          product_id: string
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          alt?: string
          created_at?: string
          id?: string
          is_cover?: boolean
          media_type?: string
          product_id?: string
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_media_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          brand: string
          category: string
          colors: string[]
          created_at: string
          description: string
          featured: boolean
          gallery: string[]
          id: string
          image: string
          is_bestseller: boolean
          is_new: boolean
          name: string
          on_sale: boolean
          price: number
          sale_price: number | null
          sizes: string[]
          sku: string
          slug: string
          sort_order: number
          stock: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          brand?: string
          category?: string
          colors?: string[]
          created_at?: string
          description?: string
          featured?: boolean
          gallery?: string[]
          id?: string
          image?: string
          is_bestseller?: boolean
          is_new?: boolean
          name: string
          on_sale?: boolean
          price?: number
          sale_price?: number | null
          sizes?: string[]
          sku?: string
          slug: string
          sort_order?: number
          stock?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          brand?: string
          category?: string
          colors?: string[]
          created_at?: string
          description?: string
          featured?: boolean
          gallery?: string[]
          id?: string
          image?: string
          is_bestseller?: boolean
          is_new?: boolean
          name?: string
          on_sale?: boolean
          price?: number
          sale_price?: number | null
          sizes?: string[]
          sku?: string
          slug?: string
          sort_order?: number
          stock?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content: Json
          created_at: string
          id: string
          key: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          key: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_templates: {
        Row: {
          body: string
          created_at: string
          description: string
          id: string
          key: string
          label: string
          updated_at: string
        }
        Insert: {
          body?: string
          created_at?: string
          description?: string
          id?: string
          key: string
          label: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          description?: string
          id?: string
          key?: string
          label?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
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
      app_role: ["admin"],
    },
  },
} as const
