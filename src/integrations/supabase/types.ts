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
      ai_context: {
        Row: {
          context_data: Json
          context_type: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          context_data: Json
          context_type: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          context_data?: Json
          context_type?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
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
      breadcrumb_trails: {
        Row: {
          accuracy: number | null
          alert_id: string | null
          altitude: number | null
          created_at: string | null
          heading: number | null
          id: string
          is_synced: boolean | null
          latitude: number
          longitude: number
          speed: number | null
          timestamp: string | null
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          alert_id?: string | null
          altitude?: number | null
          created_at?: string | null
          heading?: number | null
          id?: string
          is_synced?: boolean | null
          latitude: number
          longitude: number
          speed?: number | null
          timestamp?: string | null
          user_id: string
        }
        Update: {
          accuracy?: number | null
          alert_id?: string | null
          altitude?: number | null
          created_at?: string | null
          heading?: number | null
          id?: string
          is_synced?: boolean | null
          latitude?: number
          longitude?: number
          speed?: number | null
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
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
      emergency_broadcasts: {
        Row: {
          active: boolean | null
          contacts_notified: Json | null
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          medical_info: Json | null
          message: string
          resolved_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          contacts_notified?: Json | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          medical_info?: Json | null
          message: string
          resolved_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          contacts_notified?: Json | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          medical_info?: Json | null
          message?: string
          resolved_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string
          priority: number
          relationship: string | null
          updated_at: string | null
          user_id: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone: string
          priority?: number
          relationship?: string | null
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string
          priority?: number
          relationship?: string | null
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
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
      location_pings: {
        Row: {
          alert_id: string
          id: string
          latitude: number
          longitude: number
          timestamp: string | null
        }
        Insert: {
          alert_id: string
          id?: string
          latitude: number
          longitude: number
          timestamp?: string | null
        }
        Update: {
          alert_id?: string
          id?: string
          latitude?: number
          longitude?: number
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_pings_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "sos_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      map_pins: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          latitude: number
          longitude: number
          pin_type: string
          shared_with: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          latitude: number
          longitude: number
          pin_type: string
          shared_with?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          latitude?: number
          longitude?: number
          pin_type?: string
          shared_with?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachment_url: string | null
          auto_delete_at: string | null
          content: string
          created_at: string | null
          delivery_status: string | null
          encrypted: boolean | null
          id: string
          message_type: string
          read_at: string | null
          receiver_id: string | null
          sender_id: string
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          attachment_url?: string | null
          auto_delete_at?: string | null
          content: string
          created_at?: string | null
          delivery_status?: string | null
          encrypted?: boolean | null
          id?: string
          message_type?: string
          read_at?: string | null
          receiver_id?: string | null
          sender_id: string
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          attachment_url?: string | null
          auto_delete_at?: string | null
          content?: string
          created_at?: string | null
          delivery_status?: string | null
          encrypted?: boolean | null
          id?: string
          message_type?: string
          read_at?: string | null
          receiver_id?: string | null
          sender_id?: string
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
      paired_devices: {
        Row: {
          battery_level: number | null
          created_at: string | null
          device_id: string
          device_name: string
          device_type: string
          id: string
          is_active: boolean | null
          last_connected: string | null
          paired_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          battery_level?: number | null
          created_at?: string | null
          device_id: string
          device_name: string
          device_type: string
          id?: string
          is_active?: boolean | null
          last_connected?: string | null
          paired_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          battery_level?: number | null
          created_at?: string | null
          device_id?: string
          device_name?: string
          device_type?: string
          id?: string
          is_active?: boolean | null
          last_connected?: string | null
          paired_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      routes: {
        Row: {
          created_at: string | null
          distance: number | null
          duration: number | null
          id: string
          name: string
          shared: boolean | null
          shared_with: string[] | null
          updated_at: string | null
          user_id: string
          waypoints: Json
        }
        Insert: {
          created_at?: string | null
          distance?: number | null
          duration?: number | null
          id?: string
          name: string
          shared?: boolean | null
          shared_with?: string[] | null
          updated_at?: string | null
          user_id: string
          waypoints?: Json
        }
        Update: {
          created_at?: string | null
          distance?: number | null
          duration?: number | null
          id?: string
          name?: string
          shared?: boolean | null
          shared_with?: string[] | null
          updated_at?: string | null
          user_id?: string
          waypoints?: Json
        }
        Relationships: []
      }
      sensor_data: {
        Row: {
          created_at: string | null
          data_type: string
          id: string
          timestamp: string | null
          user_id: string
          value: Json
        }
        Insert: {
          created_at?: string | null
          data_type: string
          id?: string
          timestamp?: string | null
          user_id: string
          value: Json
        }
        Update: {
          created_at?: string | null
          data_type?: string
          id?: string
          timestamp?: string | null
          user_id?: string
          value?: Json
        }
        Relationships: []
      }
      sos_alerts: {
        Row: {
          contacts_notified: Json | null
          created_at: string | null
          id: string
          location_lat: number | null
          location_lng: number | null
          message: string
          resolved_at: string | null
          status: string | null
          triggered_at: string | null
          user_id: string
        }
        Insert: {
          contacts_notified?: Json | null
          created_at?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          message: string
          resolved_at?: string | null
          status?: string | null
          triggered_at?: string | null
          user_id: string
        }
        Update: {
          contacts_notified?: Json | null
          created_at?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          message?: string
          resolved_at?: string | null
          status?: string | null
          triggered_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sos_settings: {
        Row: {
          auto_share_location: boolean | null
          countdown_seconds: number | null
          created_at: string | null
          default_message: string | null
          id: string
          silent_mode: boolean | null
          updated_at: string | null
          user_id: string
          voice_trigger_enabled: boolean | null
          voice_trigger_phrases: string[] | null
        }
        Insert: {
          auto_share_location?: boolean | null
          countdown_seconds?: number | null
          created_at?: string | null
          default_message?: string | null
          id?: string
          silent_mode?: boolean | null
          updated_at?: string | null
          user_id: string
          voice_trigger_enabled?: boolean | null
          voice_trigger_phrases?: string[] | null
        }
        Update: {
          auto_share_location?: boolean | null
          countdown_seconds?: number | null
          created_at?: string | null
          default_message?: string | null
          id?: string
          silent_mode?: boolean | null
          updated_at?: string | null
          user_id?: string
          voice_trigger_enabled?: boolean | null
          voice_trigger_phrases?: string[] | null
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
      sync_queue: {
        Row: {
          created_at: string | null
          data: Json | null
          entity_id: string
          entity_type: string
          id: string
          operation: string
          synced: boolean | null
          synced_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          entity_id: string
          entity_type: string
          id?: string
          operation: string
          synced?: boolean | null
          synced_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          entity_id?: string
          entity_type?: string
          id?: string
          operation?: string
          synced?: boolean | null
          synced_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          joined_at: string | null
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          role?: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          role?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          owner_id: string
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          owner_id: string
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          settings?: Json | null
          updated_at?: string | null
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
      volunteers: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          max_distance_km: number | null
          notification_preferences: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          max_distance_km?: number | null
          notification_preferences?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          max_distance_km?: number | null
          notification_preferences?: Json | null
          updated_at?: string | null
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
