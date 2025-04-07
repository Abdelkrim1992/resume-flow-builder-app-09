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
      educations: {
        Row: {
          created_at: string
          current: boolean | null
          degree: string
          description: string | null
          end_date: string | null
          field_of_study: string | null
          id: string
          institution: string
          resume_id: string
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current?: boolean | null
          degree: string
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          institution: string
          resume_id: string
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current?: boolean | null
          degree?: string
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          institution?: string
          resume_id?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "educations_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          company: string
          created_at: string
          current: boolean | null
          description: string | null
          end_date: string | null
          id: string
          position: string
          resume_id: string
          start_date: string
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          current?: boolean | null
          description?: string | null
          end_date?: string | null
          id?: string
          position: string
          resume_id: string
          start_date: string
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          current?: boolean | null
          description?: string | null
          end_date?: string | null
          id?: string
          position?: string
          resume_id?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiences_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          birth_date: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          location: string | null
          updated_at: string
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          location?: string | null
          updated_at?: string
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      resumes: {
        Row: {
          created_at: string
          id: string
          summary: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          summary?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          summary?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          created_at: string
          id: string
          level: string | null
          name: string
          resume_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          level?: string | null
          name: string
          resume_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          level?: string | null
          name?: string
          resume_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
