
CREATE TABLE IF NOT EXISTS public.sell_property_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_name text NOT NULL,
  seller_phone text NOT NULL,
  seller_email text,
  city text,
  zone text,
  locality text,
  full_address text,
  property_type text,
  asking_price numeric,
  built_up_area numeric,
  configuration text,
  furnishing text,
  possession text,
  amenities text[] DEFAULT '{}',
  photos text[] DEFAULT '{}',
  description text,
  coordinates jsonb,
  google_map_link text,
  status text NOT NULL DEFAULT 'New' CHECK (status IN ('New','Contacted','Site Visit Scheduled','Verified','Listed','Rejected')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.sell_property_enquiries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.sell_property_enquiries TO authenticated;
GRANT ALL ON public.sell_property_enquiries TO service_role;

ALTER TABLE public.sell_property_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit seller enquiries"
  ON public.sell_property_enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view seller enquiries"
  ON public.sell_property_enquiries FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update seller enquiries"
  ON public.sell_property_enquiries FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete seller enquiries"
  ON public.sell_property_enquiries FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER sell_property_enquiries_updated_at
  BEFORE UPDATE ON public.sell_property_enquiries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS sell_property_enquiries_created_at_idx
  ON public.sell_property_enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS sell_property_enquiries_status_idx
  ON public.sell_property_enquiries (status);
