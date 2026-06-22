-- Initialize jobs table for Supabase backend
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create public read access policy
CREATE POLICY "Allow public read access" 
ON public.jobs FOR SELECT 
TO public 
USING (true);

-- Create authenticated insert policy (e.g. for scrapers or backend processes)
CREATE POLICY "Allow authenticated insert access" 
ON public.jobs FOR INSERT 
TO authenticated 
WITH CHECK (true);
