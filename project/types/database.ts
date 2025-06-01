export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agencies: {
        Row: {
          agency_name: string
          created_at: string
          id: string
          specialization: string
          updated_at: string
        }
        Insert: {
          agency_name: string
          created_at?: string
          id: string
          specialization: string
          updated_at?: string
        }
        Update: {
          agency_name?: string
          created_at?: string
          id?: string
          specialization?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agencies_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_profiles: {
        Row: {
          agency_description: string | null
          contact_info: Json | null
          created_at: string
          id: string
          logo_url: string | null
          social_links: Json | null
          updated_at: string
          website: string | null
        }
        Insert: {
          agency_description?: string | null
          contact_info?: Json | null
          created_at?: string
          id: string
          logo_url?: string | null
          social_links?: Json | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          agency_description?: string | null
          contact_info?: Json | null
          created_at?: string
          id?: string
          logo_url?: string | null
          social_links?: Json | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agency_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          campaign_id: string | null
          created_at: string
          creator_id: string | null
          id: string
          proposal: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          creator_id?: string | null
          id?: string
          proposal?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          creator_id?: string | null
          id?: string
          proposal?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      brand_profiles: {
        Row: {
          company_description: string | null
          contact_info: Json | null
          created_at: string
          id: string
          logo_url: string | null
          social_links: Json | null
          updated_at: string
          website: string | null
        }
        Insert: {
          company_description?: string | null
          contact_info?: Json | null
          created_at?: string
          id: string
          logo_url?: string | null
          social_links?: Json | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          company_description?: string | null
          contact_info?: Json | null
          created_at?: string
          id?: string
          logo_url?: string | null
          social_links?: Json | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          company_name: string
          created_at: string
          id: string
          industry: string
          updated_at: string
        }
        Insert: {
          company_name: string
          created_at?: string
          id: string
          industry: string
          updated_at?: string
        }
        Update: {
          company_name?: string
          created_at?: string
          id?: string
          industry?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brands_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          brand_id: string | null
          budget: number | null
          created_at: string
          description: string | null
          id: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          brand_id?: string | null
          budget?: number | null
          created_at?: string
          description?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          brand_id?: string | null
          budget?: number | null
          created_at?: string
          description?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_profiles: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          portfolio_url: string | null
          profile_picture_url: string | null
          skills: string[] | null
          social_links: Json | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id: string
          portfolio_url?: string | null
          profile_picture_url?: string | null
          skills?: string[] | null
          social_links?: Json | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          portfolio_url?: string | null
          profile_picture_url?: string | null
          skills?: string[] | null
          social_links?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
        ]
      }
      creators: {
        Row: {
          created_at: string
          id: string
          niche: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id: string
          niche: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          niche?: string
          updated_at?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "creators_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          company_name: string | null
          created_at: string
          full_name: string | null
          id: string
          social_links: Json | null
          updated_at: string
          website: string | null
        }
        Insert: {
          bio?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          social_links?: Json | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          bio?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          social_links?: Json | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "brand" | "creator" | "agency"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["brand", "creator", "agency"],
    },
  },
} as const 