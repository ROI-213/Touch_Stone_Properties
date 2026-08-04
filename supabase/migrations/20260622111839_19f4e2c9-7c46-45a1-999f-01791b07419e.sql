
-- content_sections
CREATE TABLE public.content_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  title text,
  subtitle text,
  body text,
  image_url text,
  cta_text text,
  cta_link text,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.content_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_sections TO authenticated;
GRANT ALL ON public.content_sections TO service_role;
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active sections" ON public.content_sections FOR SELECT USING (is_active = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage sections" ON public.content_sections FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_content_sections_updated BEFORE UPDATE ON public.content_sections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- contact_info (singleton via fixed id)
CREATE TABLE public.contact_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text,
  whatsapp text,
  email text,
  address text,
  map_url text,
  facebook text,
  instagram text,
  twitter text,
  linkedin text,
  youtube text,
  business_hours text,
  copyright text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contact_info TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_info TO authenticated;
GRANT ALL ON public.contact_info TO service_role;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view contact info" ON public.contact_info FOR SELECT USING (true);
CREATE POLICY "Admins manage contact info" ON public.contact_info FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_contact_info_updated BEFORE UPDATE ON public.contact_info FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed content sections
INSERT INTO public.content_sections (key, title, subtitle, body, image_url, cta_text, cta_link, display_order) VALUES
  ('hero.main', 'Find Your Dream Home in Bangalore', 'Curated apartments, villas, plots and commercial properties from Bangalore''s most trusted broker.', NULL, NULL, NULL, NULL, 1),
  ('hero.sell_panel', 'Sell Your Property with Confidence', 'Get the best price with our expert valuation and wide buyer network.', NULL, '/src/assets/images/hero/sell-property-confidence.png', 'List Your Property', '/sell-property', 2),
  ('footer.tagline', 'Touch Stone Properties', 'Bangalore''s most trusted luxury real estate broker', NULL, NULL, NULL, NULL, 1),
  ('navbar.cta', NULL, NULL, NULL, NULL, 'Call Now', 'tel:+919900000000', 1);

-- Seed contact info
INSERT INTO public.contact_info (phone, whatsapp, email, address, business_hours, copyright)
VALUES ('+91 99000 00000', '+919900000000', 'info@touchstoneproperties.in', 'Bangalore, Karnataka, India', 'Mon-Sat 9:00 AM - 7:00 PM', '© 2026 Touch Stone Properties. All rights reserved.');
