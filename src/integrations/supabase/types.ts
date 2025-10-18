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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blockchain_certificates: {
        Row: {
          authenticity_proof: string
          certificate_data: Json
          id: string
          issued_at: string
          product_id: string
          transaction_hash: string
          verified: boolean
        }
        Insert: {
          authenticity_proof: string
          certificate_data: Json
          id?: string
          issued_at?: string
          product_id: string
          transaction_hash: string
          verified?: boolean
        }
        Update: {
          authenticity_proof?: string
          certificate_data?: Json
          id?: string
          issued_at?: string
          product_id?: string
          transaction_hash?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "blockchain_certificates_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      community_events: {
        Row: {
          city: string
          created_at: string
          current_participants: number
          description: string | null
          end_date: string | null
          event_date: string
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          image_url: string | null
          latitude: number | null
          location: string
          longitude: number | null
          max_participants: number | null
          organizer_id: string
          title: string
          updated_at: string
        }
        Insert: {
          city: string
          created_at?: string
          current_participants?: number
          description?: string | null
          end_date?: string | null
          event_date: string
          event_type: Database["public"]["Enums"]["event_type"]
          id?: string
          image_url?: string | null
          latitude?: number | null
          location: string
          longitude?: number | null
          max_participants?: number | null
          organizer_id: string
          title: string
          updated_at?: string
        }
        Update: {
          city?: string
          created_at?: string
          current_participants?: number
          description?: string | null
          end_date?: string | null
          event_date?: string
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          image_url?: string | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          max_participants?: number | null
          organizer_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_participants: {
        Row: {
          checked_in: boolean
          checked_in_at: string | null
          created_at: string
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          checked_in?: boolean
          checked_in_at?: string | null
          created_at?: string
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          checked_in?: boolean
          checked_in_at?: string | null
          created_at?: string
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "community_events"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          agent_id: string | null
          amount: number
          buyer_id: string
          created_at: string
          delivery_address: string
          delivery_verification_photos: string[] | null
          id: string
          pickup_address: string
          pickup_verification_photos: string[] | null
          product_id: string
          seller_id: string
          status: Database["public"]["Enums"]["order_status"]
          tracking_updates: Json[] | null
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          amount: number
          buyer_id: string
          created_at?: string
          delivery_address: string
          delivery_verification_photos?: string[] | null
          id?: string
          pickup_address: string
          pickup_verification_photos?: string[] | null
          product_id: string
          seller_id: string
          status?: Database["public"]["Enums"]["order_status"]
          tracking_updates?: Json[] | null
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          amount?: number
          buyer_id?: string
          created_at?: string
          delivery_address?: string
          delivery_verification_photos?: string[] | null
          id?: string
          pickup_address?: string
          pickup_verification_photos?: string[] | null
          product_id?: string
          seller_id?: string
          status?: Database["public"]["Enums"]["order_status"]
          tracking_updates?: Json[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
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
          care_instructions: string | null
          category: string
          chest_max: number | null
          chest_min: number | null
          color: string | null
          condition: Database["public"]["Enums"]["product_condition"]
          created_at: string
          description: string | null
          gender: string | null
          hips_max: number | null
          hips_min: number | null
          id: string
          images: string[]
          is_available: boolean
          is_donation: boolean
          length: number | null
          material: string | null
          original_price: number | null
          price: number
          seller_id: string
          size: string | null
          sustainability_score: number | null
          title: string
          updated_at: string
          verified: boolean
          waist_max: number | null
          waist_min: number | null
        }
        Insert: {
          brand?: string | null
          care_instructions?: string | null
          category: string
          chest_max?: number | null
          chest_min?: number | null
          color?: string | null
          condition?: Database["public"]["Enums"]["product_condition"]
          created_at?: string
          description?: string | null
          gender?: string | null
          hips_max?: number | null
          hips_min?: number | null
          id?: string
          images?: string[]
          is_available?: boolean
          is_donation?: boolean
          length?: number | null
          material?: string | null
          original_price?: number | null
          price: number
          seller_id: string
          size?: string | null
          sustainability_score?: number | null
          title: string
          updated_at?: string
          verified?: boolean
          waist_max?: number | null
          waist_min?: number | null
        }
        Update: {
          brand?: string | null
          care_instructions?: string | null
          category?: string
          chest_max?: number | null
          chest_min?: number | null
          color?: string | null
          condition?: Database["public"]["Enums"]["product_condition"]
          created_at?: string
          description?: string | null
          gender?: string | null
          hips_max?: number | null
          hips_min?: number | null
          id?: string
          images?: string[]
          is_available?: boolean
          is_donation?: boolean
          length?: number | null
          material?: string | null
          original_price?: number | null
          price?: number
          seller_id?: string
          size?: string | null
          sustainability_score?: number | null
          title?: string
          updated_at?: string
          verified?: boolean
          waist_max?: number | null
          waist_min?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recycling_partners: {
        Row: {
          accepted_materials: string[]
          active: boolean
          city: string
          contact_info: Json | null
          created_at: string
          id: string
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          rating: number | null
          updated_at: string
        }
        Insert: {
          accepted_materials?: string[]
          active?: boolean
          city: string
          contact_info?: Json | null
          created_at?: string
          id?: string
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          rating?: number | null
          updated_at?: string
        }
        Update: {
          accepted_materials?: string[]
          active?: boolean
          city?: string
          contact_info?: Json | null
          created_at?: string
          id?: string
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      sustainability_stats: {
        Row: {
          co2_offset_kg: number
          created_at: string
          id: string
          items_donated: number
          items_recycled: number
          items_sold: number
          total_impact_score: number
          trees_saved: number
          updated_at: string
          user_id: string
          water_saved_liters: number
        }
        Insert: {
          co2_offset_kg?: number
          created_at?: string
          id?: string
          items_donated?: number
          items_recycled?: number
          items_sold?: number
          total_impact_score?: number
          trees_saved?: number
          updated_at?: string
          user_id: string
          water_saved_liters?: number
        }
        Update: {
          co2_offset_kg?: number
          created_at?: string
          id?: string
          items_donated?: number
          items_recycled?: number
          items_sold?: number
          total_impact_score?: number
          trees_saved?: number
          updated_at?: string
          user_id?: string
          water_saved_liters?: number
        }
        Relationships: []
      }
      user_measurements: {
        Row: {
          chest: number | null
          created_at: string
          height: number | null
          hips: number | null
          id: string
          inseam: number | null
          preferred_fit: string | null
          shoulder_width: number | null
          unit_system: string | null
          updated_at: string
          user_id: string
          waist: number | null
          weight: number | null
        }
        Insert: {
          chest?: number | null
          created_at?: string
          height?: number | null
          hips?: number | null
          id?: string
          inseam?: number | null
          preferred_fit?: string | null
          shoulder_width?: number | null
          unit_system?: string | null
          updated_at?: string
          user_id: string
          waist?: number | null
          weight?: number | null
        }
        Update: {
          chest?: number | null
          created_at?: string
          height?: number | null
          hips?: number | null
          id?: string
          inseam?: number | null
          preferred_fit?: string | null
          shoulder_width?: number | null
          unit_system?: string | null
          updated_at?: string
          user_id?: string
          waist?: number | null
          weight?: number | null
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
      user_styles: {
        Row: {
          avoid_materials: string[] | null
          budget_range: Json | null
          color_preferences: string[] | null
          created_at: string
          favorite_brands: string[] | null
          id: string
          occasion_tags: string[] | null
          style_preferences: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avoid_materials?: string[] | null
          budget_range?: Json | null
          color_preferences?: string[] | null
          created_at?: string
          favorite_brands?: string[] | null
          id?: string
          occasion_tags?: string[] | null
          style_preferences?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avoid_materials?: string[] | null
          budget_range?: Json | null
          color_preferences?: string[] | null
          created_at?: string
          favorite_brands?: string[] | null
          id?: string
          occasion_tags?: string[] | null
          style_preferences?: string[] | null
          updated_at?: string
          user_id?: string
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
      app_role: "admin" | "agent" | "user"
      event_type: "swap_meet" | "eco_challenge" | "workshop" | "donation_drive"
      order_status:
        | "pending"
        | "picked_up"
        | "in_transit"
        | "delivered"
        | "completed"
        | "cancelled"
      product_condition: "new" | "like_new" | "good" | "fair" | "damaged"
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
      app_role: ["admin", "agent", "user"],
      event_type: ["swap_meet", "eco_challenge", "workshop", "donation_drive"],
      order_status: [
        "pending",
        "picked_up",
        "in_transit",
        "delivered",
        "completed",
        "cancelled",
      ],
      product_condition: ["new", "like_new", "good", "fair", "damaged"],
    },
  },
} as const
