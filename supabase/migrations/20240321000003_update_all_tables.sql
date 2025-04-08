-- Update resumes table
ALTER TABLE resumes
ADD COLUMN IF NOT EXISTS template_id INTEGER REFERENCES templates(id),
ADD COLUMN IF NOT EXISTS personal_data JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS summary TEXT DEFAULT '';

-- Update experiences table
ALTER TABLE experiences
ADD COLUMN IF NOT EXISTS location TEXT DEFAULT '',
ALTER COLUMN current SET DEFAULT false,
ALTER COLUMN description SET DEFAULT '',
ALTER COLUMN end_date DROP NOT NULL,
ALTER COLUMN start_date DROP NOT NULL;

-- Update educations table
ALTER TABLE educations
RENAME COLUMN institution TO school;

ALTER TABLE educations
ADD COLUMN IF NOT EXISTS location TEXT DEFAULT '',
ALTER COLUMN description SET DEFAULT '',
ALTER COLUMN end_date DROP NOT NULL,
ALTER COLUMN start_date DROP NOT NULL,
ALTER COLUMN field_of_study SET DEFAULT '';

-- Update skills table
ALTER TABLE skills
DROP COLUMN IF EXISTS level,
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'General'; 