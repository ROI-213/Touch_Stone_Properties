ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS assigned_staff_id uuid REFERENCES public.staff_users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_properties_assigned_staff ON public.properties(assigned_staff_id);
GRANT SELECT ON public.staff_users TO anon, authenticated;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='staff_users' AND policyname='Public can read staff for enquiry') THEN
    CREATE POLICY "Public can read staff for enquiry" ON public.staff_users FOR SELECT TO anon, authenticated USING (status = 'active');
  END IF;
END $$;