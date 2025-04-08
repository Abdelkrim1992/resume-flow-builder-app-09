import { supabase } from '@/integrations/supabase/client';

export interface Template {
  id: number;
  name: string;
  category: string;
  description?: string;
  color: string;
  layout: string;
  preview_image_url?: string;
  created_at: string;
  updated_at: string;
}

export const getTemplates = async (): Promise<Template[]> => {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getTemplateById = async (templateId: number): Promise<Template> => {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('id', templateId)
    .single();

  if (error) throw error;
  return data;
};

export const getTemplatesByCategory = async (category: string): Promise<Template[]> => {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}; 