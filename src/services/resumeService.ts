
import { supabase } from '@/integrations/supabase/client';
import { Resume, Experience, Education, Skill } from '@/types/supabase';

export const createResume = async (title: string, userId: string, summary?: string): Promise<Resume> => {
  const { data, error } = await supabase
    .from('resumes')
    .insert({
      title,
      user_id: userId,
      summary
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getResumes = async (userId: string): Promise<Resume[]> => {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getResumeById = async (resumeId: string): Promise<Resume> => {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', resumeId)
    .single();

  if (error) throw error;
  return data;
};

export const updateResume = async (resumeId: string, updates: Partial<Resume>): Promise<Resume> => {
  const { data, error } = await supabase
    .from('resumes')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', resumeId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteResume = async (resumeId: string): Promise<void> => {
  const { error } = await supabase
    .from('resumes')
    .delete()
    .eq('id', resumeId);

  if (error) throw error;
};

// Experience methods
export const addExperience = async (experience: Omit<Experience, 'id' | 'created_at' | 'updated_at'>): Promise<Experience> => {
  const { data, error } = await supabase
    .from('experiences')
    .insert(experience)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateExperience = async (experienceId: string, updates: Partial<Experience>): Promise<Experience> => {
  const { data, error } = await supabase
    .from('experiences')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', experienceId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteExperience = async (experienceId: string): Promise<void> => {
  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', experienceId);

  if (error) throw error;
};

export const getExperiences = async (resumeId: string): Promise<Experience[]> => {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('resume_id', resumeId)
    .order('start_date', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Education methods
export const addEducation = async (education: Omit<Education, 'id' | 'created_at' | 'updated_at'>): Promise<Education> => {
  const { data, error } = await supabase
    .from('educations')
    .insert(education)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateEducation = async (educationId: string, updates: Partial<Education>): Promise<Education> => {
  const { data, error } = await supabase
    .from('educations')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', educationId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteEducation = async (educationId: string): Promise<void> => {
  const { error } = await supabase
    .from('educations')
    .delete()
    .eq('id', educationId);

  if (error) throw error;
};

export const getEducations = async (resumeId: string): Promise<Education[]> => {
  const { data, error } = await supabase
    .from('educations')
    .select('*')
    .eq('resume_id', resumeId)
    .order('start_date', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Skills methods
export const addSkill = async (skill: Omit<Skill, 'id' | 'created_at' | 'updated_at'>): Promise<Skill> => {
  const { data, error } = await supabase
    .from('skills')
    .insert(skill)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateSkill = async (skillId: string, updates: Partial<Skill>): Promise<Skill> => {
  const { data, error } = await supabase
    .from('skills')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', skillId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteSkill = async (skillId: string): Promise<void> => {
  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', skillId);

  if (error) throw error;
};

export const getSkills = async (resumeId: string): Promise<Skill[]> => {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('resume_id', resumeId)
    .order('name');

  if (error) throw error;
  return data || [];
};
