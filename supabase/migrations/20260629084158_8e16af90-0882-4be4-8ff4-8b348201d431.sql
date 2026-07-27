
CREATE TABLE public.property_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  staff_name text NOT NULL,
  role text,
  phone text NOT NULL,
  whatsapp text,
  email text,
  assigned_area text,
  notes text,
  is_primary boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  show_publicly boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.property_assignments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_assignments TO authenticated;
GRANT ALL ON public.property_assignments TO service_role;

ALTER TABLE public.property_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view publicly enabled assignments"
  ON public.property_assignments FOR SELECT
  USING (show_publicly = true AND is_active = true);

CREATE POLICY "Admins can view all assignments"
  ON public.property_assignments FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert assignments"
  ON public.property_assignments FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update assignments"
  ON public.property_assignments FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete assignments"
  ON public.property_assignments FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE UNIQUE INDEX property_assignments_one_primary
  ON public.property_assignments(property_id)
  WHERE is_primary = true;

CREATE INDEX property_assignments_property_idx
  ON public.property_assignments(property_id);

CREATE TRIGGER property_assignments_set_updated_at
  BEFORE UPDATE ON public.property_assignments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
