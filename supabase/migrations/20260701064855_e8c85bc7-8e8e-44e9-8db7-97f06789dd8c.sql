
-- 1. Extend builders table with contact-management columns
ALTER TABLE public.builders
  ADD COLUMN IF NOT EXISTS contact_type text NOT NULL DEFAULT 'builder',
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS primary_phone text,
  ADD COLUMN IF NOT EXISTS whatsapp_number text,
  ADD COLUMN IF NOT EXISTS alternative_phone text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS alternative_email text,
  ADD COLUMN IF NOT EXISTS office_address text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS locality text,
  ADD COLUMN IF NOT EXISTS preferred_contact_method text,
  ADD COLUMN IF NOT EXISTS contact_person_name text,
  ADD COLUMN IF NOT EXISTS designation text,
  ADD COLUMN IF NOT EXISTS show_on_website boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS created_by uuid,
  ADD COLUMN IF NOT EXISTS updated_by uuid;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'builders_contact_type_check') THEN
    ALTER TABLE public.builders
      ADD CONSTRAINT builders_contact_type_check
      CHECK (contact_type IN ('builder','developer','agent','owner','channel_partner','land_owner','individual_seller'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS builders_contact_type_idx ON public.builders(contact_type);

-- 2. Extend properties with additional contact references
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS agent_id uuid REFERENCES public.builders(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES public.builders(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS channel_partner_id uuid REFERENCES public.builders(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS properties_agent_id_idx ON public.properties(agent_id);
CREATE INDEX IF NOT EXISTS properties_owner_id_idx ON public.properties(owner_id);
CREATE INDEX IF NOT EXISTS properties_channel_partner_id_idx ON public.properties(channel_partner_id);

-- 3. contact_notes table (admin-only)
CREATE TABLE IF NOT EXISTS public.contact_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid NOT NULL REFERENCES public.builders(id) ON DELETE CASCADE,
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  note_title text,
  note_description text NOT NULL,
  note_type text,
  follow_up_date date,
  follow_up_time time,
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'open',
  created_by uuid,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_notes TO authenticated;
GRANT ALL ON public.contact_notes TO service_role;

ALTER TABLE public.contact_notes ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS contact_notes_contact_id_idx ON public.contact_notes(contact_id);
CREATE INDEX IF NOT EXISTS contact_notes_property_id_idx ON public.contact_notes(property_id);
CREATE INDEX IF NOT EXISTS contact_notes_status_idx ON public.contact_notes(status);

DROP POLICY IF EXISTS "contact_notes_admin_all" ON public.contact_notes;
CREATE POLICY "contact_notes_admin_all" ON public.contact_notes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_staff_permission('builders','view'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_staff_permission('builders','add') OR public.has_staff_permission('builders','edit'));

CREATE TRIGGER contact_notes_set_updated_at
  BEFORE UPDATE ON public.contact_notes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
