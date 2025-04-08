import { supabase } from '@/integrations/supabase/client';

interface PersonalData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postal_code: string;
}

interface ResumeExperience {
  id?: string;
  resume_id?: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  current: boolean;
  description: string;
  location: string;
  created_at?: string;
  updated_at?: string;
}

interface ResumeEducation {
  id?: string;
  resume_id?: string;
  school: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  description: string;
  location: string;
  created_at?: string;
  updated_at?: string;
}

interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Resume {
  id: string;
  user_id: string;
  template_id: number;
  title: string;
  personal_data: PersonalData;
  summary: string;
  experiences: ResumeExperience[];
  education: ResumeEducation[];
  skills: SkillCategory[];
  created_at: string;
  updated_at: string;
}

export interface CreateResumeInput {
  user_id: string;
  template_id: number;
  title: string;
  personal_data: PersonalData;
  summary: string;
  experiences: ResumeExperience[];
  education: ResumeEducation[];
  skills: SkillCategory[];
}

export const getResumes = async (userId?: string): Promise<Resume[]> => {
  const query = supabase
    .from('resumes')
    .select('*')
    .order('created_at', { ascending: false });

  if (userId) {
    query.eq('user_id', userId);
  }

  const { data: resumes, error } = await query;

  if (error) throw error;
  return (resumes as Resume[]) || [];
};

export const getResumeById = async (id: string): Promise<Resume | null> => {
  try {
    // Get the resume
    const { data: resume, error: resumeError } = await supabase
    .from('resumes')
    .select('*')
      .eq('id', id)
      .single();

    if (resumeError) throw resumeError;
    if (!resume) return null;

    // Get experiences
    const { data: experiences, error: experiencesError } = await supabase
      .from('experiences')
      .select('*')
      .eq('resume_id', id)
      .order('start_date', { ascending: false });

    if (experiencesError) throw experiencesError;

    // Get education
    const { data: education, error: educationError } = await supabase
      .from('educations')
      .select('*')
      .eq('resume_id', id)
      .order('start_date', { ascending: false });

    if (educationError) throw educationError;

    // Get skills
    const { data: skills, error: skillsError } = await supabase
      .from('skills')
      .select('*')
      .eq('resume_id', id);

    if (skillsError) throw skillsError;

    // Group skills by category
    const skillsByCategory = (skills || []).reduce((acc: SkillCategory[], skill) => {
      const existingCategory = acc.find(cat => cat.category === skill.category);
      if (existingCategory) {
        existingCategory.skills.push(skill.name);
      } else {
        acc.push({ category: skill.category || 'General', skills: [skill.name] });
      }
      return acc;
    }, []);

    // Map experiences to our interface
    const mappedExperiences = (experiences || []).map(exp => ({
      id: exp.id,
      resume_id: exp.resume_id,
      company: exp.company,
      position: exp.position,
      start_date: exp.start_date,
      end_date: exp.end_date,
      current: exp.current || false,
      description: exp.description || '',
      location: exp.location || '',
      created_at: exp.created_at,
      updated_at: exp.updated_at
    }));

    // Map education to our interface
    const mappedEducation = (education || []).map(edu => ({
      id: edu.id,
      resume_id: edu.resume_id,
      school: edu.school || edu.institution || '',
      degree: edu.degree || '',
      field_of_study: edu.field_of_study || '',
      start_date: edu.start_date,
      end_date: edu.end_date,
      description: edu.description || '',
      location: edu.location || '',
      created_at: edu.created_at,
      updated_at: edu.updated_at
    }));

    // Return complete resume with all related data
    return {
      id: resume.id,
      user_id: resume.user_id,
      template_id: resume.template_id,
      title: resume.title || 'Untitled Resume',
      personal_data: resume.personal_data || {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        postal_code: ''
      },
      summary: resume.summary || '',
      experiences: mappedExperiences,
      education: mappedEducation,
      skills: skillsByCategory,
      created_at: resume.created_at,
      updated_at: resume.updated_at
    };
  } catch (error) {
    console.error('Error fetching resume:', error);
    throw error;
  }
};

export const createResume = async (input: CreateResumeInput): Promise<Resume> => {
  try {
    // First create the resume
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .insert({
        user_id: input.user_id,
        template_id: input.template_id,
        title: input.title,
        personal_data: input.personal_data,
        summary: input.summary,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
    .single();

    if (resumeError) throw resumeError;

    // Then create experiences
    if (input.experiences.length > 0) {
      const { error: experiencesError } = await supabase
        .from('experiences')
        .insert(
          input.experiences.map(exp => ({
            resume_id: resume.id,
            company: exp.company,
            position: exp.position,
            start_date: exp.start_date,
            end_date: exp.end_date,
            current: exp.current,
            description: exp.description,
            location: exp.location,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }))
        );
      if (experiencesError) throw experiencesError;
    }

    // Create education entries
    if (input.education.length > 0) {
      const { error: educationError } = await supabase
        .from('educations')
        .insert(
          input.education.map(edu => ({
            resume_id: resume.id,
            school: edu.school,
            degree: edu.degree,
            field_of_study: edu.field_of_study,
            start_date: edu.start_date,
            end_date: edu.end_date,
            description: edu.description,
            location: edu.location,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }))
        );
      if (educationError) throw educationError;
    }

    // Create skills
    if (input.skills.length > 0) {
      const { error: skillsError } = await supabase
        .from('skills')
        .insert(
          input.skills.flatMap(category => 
            category.skills.map(skill => ({
              resume_id: resume.id,
              category: category.category,
              name: skill,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }))
          )
        );
      if (skillsError) throw skillsError;
    }

    // Return the complete resume with all related data
    return {
      ...resume,
      experiences: input.experiences,
      education: input.education,
      skills: input.skills
    } as Resume;
  } catch (error) {
    console.error('Error creating resume:', error);
    throw error;
  }
};

export const updateResume = async (id: string, updates: Partial<Resume>): Promise<Resume> => {
  const { data: resume, error } = await supabase
    .from('resumes')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return resume as Resume;
};

export const deleteResume = async (id: string): Promise<void> => {
  try {
    // Delete related data first
    const relatedTables = [
      { name: 'experiences', field: 'resume_id' },
      { name: 'educations', field: 'resume_id' },
      { name: 'skills', field: 'resume_id' }
    ] as const;
    
    for (const table of relatedTables) {
      const { error } = await supabase
        .from(table.name)
        .delete()
        .eq(table.field, id);
      
      if (error) {
        console.error(`Error deleting ${table.name}:`, error);
        throw error;
      }
    }

    // Then delete the resume
  const { error } = await supabase
    .from('resumes')
    .delete()
      .eq('id', id);

  if (error) throw error;
  } catch (error) {
    console.error('Error in delete operation:', error);
    throw error;
  }
};

export const deleteAllResumes = async (userId: string): Promise<void> => {
  try {
    // Get all resumes for the user
    const { data: resumes } = await supabase
      .from('resumes')
      .select('id')
      .eq('user_id', userId);

    if (!resumes || resumes.length === 0) return;

    // Delete related data for all resumes
    const relatedTables = [
      { name: 'experiences', field: 'resume_id' },
      { name: 'educations', field: 'resume_id' },
      { name: 'skills', field: 'resume_id' }
    ] as const;
    
    // Delete related data from each table
    for (const table of relatedTables) {
      const { error } = await supabase
        .from(table.name)
        .delete()
        .in('resume_id', resumes.map(r => r.id));
      
      if (error) {
        console.error(`Error deleting ${table.name}:`, error);
        throw error;
      }
    }

    // Delete all resumes for the user
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error in bulk delete operation:', error);
    throw error;
  }
};

// Experience methods
export const addExperience = async (experience: Omit<ResumeExperience, 'id' | 'created_at' | 'updated_at'>): Promise<ResumeExperience> => {
  const { data, error } = await supabase
    .from('experiences')
    .insert(experience)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateExperience = async (experienceId: string, updates: Partial<ResumeExperience>): Promise<ResumeExperience> => {
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

export const getExperiences = async (resumeId: string): Promise<ResumeExperience[]> => {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('resume_id', resumeId)
    .order('start_date', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Education methods
export const addEducation = async (education: Omit<ResumeEducation, 'id' | 'created_at' | 'updated_at'>): Promise<ResumeEducation> => {
  const { data, error } = await supabase
    .from('educations')
    .insert(education)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateEducation = async (educationId: string, updates: Partial<ResumeEducation>): Promise<ResumeEducation> => {
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

export const getEducations = async (resumeId: string): Promise<ResumeEducation[]> => {
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
