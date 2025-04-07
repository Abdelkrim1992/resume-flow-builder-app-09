
import { Database } from "@/integrations/supabase/types";

export type Tables = Database['public']['Tables'];

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  location: string | null;
  birth_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  resume_id: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  resume_id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  resume_id: string;
  name: string;
  level: string | null;
  created_at: string;
  updated_at: string;
}
