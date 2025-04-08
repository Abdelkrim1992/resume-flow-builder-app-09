-- Create templates table
CREATE TABLE IF NOT EXISTS public.templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(7) NOT NULL,
  layout VARCHAR(50) NOT NULL,
  preview_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default templates
INSERT INTO public.templates (name, category, description, color, layout) VALUES
  ('Classic Professional', 'professional', 'Traditional and clean layout for corporate positions', '#003366', 'standard'),
  ('Modern Executive', 'professional', 'Contemporary design for senior leadership roles', '#1a4d80', 'professional'),
  ('Minimal Elegant', 'minimalist', 'Understated and sophisticated for all industries', '#6c757d', 'simple'),
  ('Creative Portfolio', 'creative', 'Showcase your creative work and skills', '#8e44ad', 'creative'),
  ('Technical Specialist', 'professional', 'Focused on technical skills and experience', '#2c3e50', 'standard'),
  ('Simple Graduate', 'simple', 'Perfect for recent graduates or entry-level positions', '#3498db', 'simple'),
  ('Modern Digital', 'modern', 'Contemporary style for digital professionals', '#16a085', 'modern'),
  ('Startup Innovator', 'modern', 'Forward-thinking design for startup environments', '#e74c3c', 'creative');

-- Create RLS policies
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to templates"
  ON public.templates FOR SELECT
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER handle_templates_updated_at
  BEFORE UPDATE ON public.templates
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at(); 