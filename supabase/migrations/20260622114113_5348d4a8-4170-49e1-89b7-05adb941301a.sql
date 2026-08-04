
CREATE TABLE public.form_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_key text NOT NULL,
  field_key text NOT NULL,
  label text NOT NULL,
  value text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX form_options_lookup_idx ON public.form_options (form_key, field_key, display_order);

GRANT SELECT ON public.form_options TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.form_options TO authenticated;
GRANT ALL ON public.form_options TO service_role;

ALTER TABLE public.form_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active form options"
  ON public.form_options FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage form options"
  ON public.form_options FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_form_options_updated_at
  BEFORE UPDATE ON public.form_options
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed default search-panel dropdowns
INSERT INTO public.form_options (form_key, field_key, label, value, display_order) VALUES
  ('search','city','Bangalore','Bangalore',10),
  ('search','city','Hyderabad','Hyderabad',20),
  ('search','city','Chennai','Chennai',30),
  ('search','city','Mumbai','Mumbai',40),
  ('search','city','Delhi','Delhi',50),
  ('search','locality','Whitefield','Whitefield',10),
  ('search','locality','Koramangala','Koramangala',20),
  ('search','locality','HSR Layout','HSR Layout',30),
  ('search','locality','Indiranagar','Indiranagar',40),
  ('search','locality','JP Nagar','JP Nagar',50),
  ('search','locality','Electronic City','Electronic City',60),
  ('search','budget_min','₹ 10 L','₹ 10 L',10),
  ('search','budget_min','₹ 25 L','₹ 25 L',20),
  ('search','budget_min','₹ 50 L','₹ 50 L',30),
  ('search','budget_min','₹ 75 L','₹ 75 L',40),
  ('search','budget_min','₹ 1 Cr','₹ 1 Cr',50),
  ('search','budget_min','₹ 2 Cr','₹ 2 Cr',60),
  ('search','budget_min','₹ 5 Cr+','₹ 5 Cr+',70),
  ('search','budget_max','₹ 25 L','₹ 25 L',10),
  ('search','budget_max','₹ 50 L','₹ 50 L',20),
  ('search','budget_max','₹ 1 Cr','₹ 1 Cr',30),
  ('search','budget_max','₹ 2 Cr','₹ 2 Cr',40),
  ('search','budget_max','₹ 5 Cr+','₹ 5 Cr+',50);
