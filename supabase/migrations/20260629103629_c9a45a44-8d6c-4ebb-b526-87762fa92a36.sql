
ALTER TABLE public.property_assignments
  ADD COLUMN IF NOT EXISTS photo_url text,
  ADD COLUMN IF NOT EXISTS signature_url text,
  ADD COLUMN IF NOT EXISTS id_url text,
  ADD COLUMN IF NOT EXISTS qr_code_url text,
  ADD COLUMN IF NOT EXISTS experience_years integer,
  ADD COLUMN IF NOT EXISTS languages text[] NOT NULL DEFAULT '{}'::text[];

ALTER TABLE public.enquiries
  ADD COLUMN IF NOT EXISTS assigned_staff_id uuid REFERENCES public.property_assignments(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS assigned_staff_name text;

CREATE INDEX IF NOT EXISTS idx_enquiries_assigned_staff ON public.enquiries(assigned_staff_id);
