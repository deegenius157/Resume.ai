-- Alter jobs table to add new columns for African market pivot
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS job_id TEXT,
ADD COLUMN IF NOT EXISTS requirements TEXT,
ADD COLUMN IF NOT EXISTS benefits TEXT,
ADD COLUMN IF NOT EXISTS deadline DATE,
ADD COLUMN IF NOT EXISTS source_url TEXT;

-- Make job_id unique to support upsert constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'jobs_job_id_key'
  ) THEN
    ALTER TABLE public.jobs ADD CONSTRAINT jobs_job_id_key UNIQUE (job_id);
  END IF;
END $$;
