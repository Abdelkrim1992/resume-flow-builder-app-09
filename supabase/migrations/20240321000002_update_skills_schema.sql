-- Update skills table to include category
ALTER TABLE skills
DROP COLUMN IF EXISTS level,
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'General'; 