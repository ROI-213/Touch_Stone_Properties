-- Add new columns requested for enterprise Staff Management
ALTER TABLE public.staff_users
ADD COLUMN IF NOT EXISTS employee_code text UNIQUE,
ADD COLUMN IF NOT EXISTS username text UNIQUE,
ADD COLUMN IF NOT EXISTS department text,
ADD COLUMN IF NOT EXISTS branch text,
ADD COLUMN IF NOT EXISTS territory text,
ADD COLUMN IF NOT EXISTS joining_date date,
ADD COLUMN IF NOT EXISTS deactivated_at timestamptz;
