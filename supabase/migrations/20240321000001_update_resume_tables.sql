-- Update resumes table
ALTER TABLE resumes
ADD COLUMN IF NOT EXISTS personal_data JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS summary TEXT DEFAULT '';

-- Drop and recreate experiences table
DROP TABLE IF EXISTS experiences;
CREATE TABLE experiences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date TEXT,
  end_date TEXT,
  current BOOLEAN DEFAULT false,
  description TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Drop and recreate educations table
DROP TABLE IF EXISTS educations;
CREATE TABLE educations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  school TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_date TEXT,
  end_date TEXT,
  description TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Drop and recreate skills table
DROP TABLE IF EXISTS skills;
CREATE TABLE skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Add RLS policies
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE educations ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Experiences policies
CREATE POLICY "Users can view their own experiences"
  ON experiences FOR SELECT
  USING (resume_id IN (
    SELECT id FROM resumes WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create experiences for their own resumes"
  ON experiences FOR INSERT
  WITH CHECK (resume_id IN (
    SELECT id FROM resumes WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own experiences"
  ON experiences FOR UPDATE
  USING (resume_id IN (
    SELECT id FROM resumes WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own experiences"
  ON experiences FOR DELETE
  USING (resume_id IN (
    SELECT id FROM resumes WHERE user_id = auth.uid()
  ));

-- Education policies
CREATE POLICY "Users can view their own education entries"
  ON educations FOR SELECT
  USING (resume_id IN (
    SELECT id FROM resumes WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create education entries for their own resumes"
  ON educations FOR INSERT
  WITH CHECK (resume_id IN (
    SELECT id FROM resumes WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own education entries"
  ON educations FOR UPDATE
  USING (resume_id IN (
    SELECT id FROM resumes WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own education entries"
  ON educations FOR DELETE
  USING (resume_id IN (
    SELECT id FROM resumes WHERE user_id = auth.uid()
  ));

-- Skills policies
CREATE POLICY "Users can view their own skills"
  ON skills FOR SELECT
  USING (resume_id IN (
    SELECT id FROM resumes WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create skills for their own resumes"
  ON skills FOR INSERT
  WITH CHECK (resume_id IN (
    SELECT id FROM resumes WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own skills"
  ON skills FOR UPDATE
  USING (resume_id IN (
    SELECT id FROM resumes WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own skills"
  ON skills FOR DELETE
  USING (resume_id IN (
    SELECT id FROM resumes WHERE user_id = auth.uid()
  )); 