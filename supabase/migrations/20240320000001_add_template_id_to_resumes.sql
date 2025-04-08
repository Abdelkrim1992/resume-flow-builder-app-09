-- Add template_id column to resumes table
ALTER TABLE public.resumes 
ADD COLUMN IF NOT EXISTS template_id INTEGER REFERENCES public.templates(id);

-- Update existing resumes to use a default template (optional)
UPDATE public.resumes 
SET template_id = (SELECT id FROM public.templates WHERE layout = 'standard' LIMIT 1)
WHERE template_id IS NULL; 