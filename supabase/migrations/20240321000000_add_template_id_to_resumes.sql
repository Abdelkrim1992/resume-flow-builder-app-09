-- Add template_id column to resumes table
ALTER TABLE resumes
ADD COLUMN IF NOT EXISTS template_id INTEGER;

-- Add foreign key constraint to templates table
ALTER TABLE resumes
ADD CONSTRAINT fk_template
FOREIGN KEY (template_id) 
REFERENCES templates(id)
ON DELETE SET NULL; 