
-- =========================================================
-- CMS tables: site_settings, testimonials, partners,
-- success_stories, navigation_items, faqs, seo_metadata,
-- activity_logs + storage policies for site-media
-- =========================================================

-- updated_at trigger function reused
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- ---------- site_settings (singleton: key/value JSON) ----------
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_settings public read" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "site_settings admin write" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- seed brand singleton row
INSERT INTO public.site_settings (key, value) VALUES
  ('brand', jsonb_build_object(
    'name','Touch Stone Properties',
    'logo_url','',
    'phone','+91 99029 25519',
    'whatsapp','+91 99029 25519',
    'email','info@touchstoneproperties.in',
    'address','Bengaluru, Karnataka, India',
    'social', jsonb_build_object('instagram','','facebook','','linkedin','','youtube','','twitter',''),
    'hero', jsonb_build_object('headline','Touch Stone Properties','subheadline','Verified apartments, villas, plots and commercial spaces across Bangalore.','cta_label','Explore Properties','cta_href','/buy-properties/all'),
    'footer', jsonb_build_object('tagline','Curating premium real estate across Bengaluru.','copyright','© Touch Stone Properties. All rights reserved.')
  ))
ON CONFLICT (key) DO NOTHING;

-- ---------- testimonials ----------
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  avatar_url text,
  quote text NOT NULL,
  rating int DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "testimonials public read active" ON public.testimonials FOR SELECT TO anon USING (is_active);
CREATE POLICY "testimonials auth read" ON public.testimonials FOR SELECT TO authenticated USING (true);
CREATE POLICY "testimonials admin write" ON public.testimonials FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_testimonials_order ON public.testimonials(display_order);
CREATE TRIGGER trg_testimonials_updated BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------- partners ----------
CREATE TABLE public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  website text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.partners TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partners TO authenticated;
GRANT ALL ON public.partners TO service_role;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "partners public read active" ON public.partners FOR SELECT TO anon USING (is_active);
CREATE POLICY "partners auth read" ON public.partners FOR SELECT TO authenticated USING (true);
CREATE POLICY "partners admin write" ON public.partners FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_partners_order ON public.partners(display_order);
CREATE TRIGGER trg_partners_updated BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------- success_stories ----------
CREATE TABLE public.success_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  client text,
  image_url text,
  summary text,
  body text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.success_stories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.success_stories TO authenticated;
GRANT ALL ON public.success_stories TO service_role;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "success_stories public read active" ON public.success_stories FOR SELECT TO anon USING (is_active);
CREATE POLICY "success_stories auth read" ON public.success_stories FOR SELECT TO authenticated USING (true);
CREATE POLICY "success_stories admin write" ON public.success_stories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_stories_order ON public.success_stories(display_order);
CREATE TRIGGER trg_stories_updated BEFORE UPDATE ON public.success_stories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------- navigation_items ----------
CREATE TABLE public.navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  href text NOT NULL,
  parent_id uuid REFERENCES public.navigation_items(id) ON DELETE CASCADE,
  location text NOT NULL DEFAULT 'header' CHECK (location IN ('header','footer')),
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.navigation_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.navigation_items TO authenticated;
GRANT ALL ON public.navigation_items TO service_role;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "nav public read active" ON public.navigation_items FOR SELECT TO anon USING (is_active);
CREATE POLICY "nav auth read" ON public.navigation_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "nav admin write" ON public.navigation_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_nav_loc_order ON public.navigation_items(location, display_order);
CREATE TRIGGER trg_nav_updated BEFORE UPDATE ON public.navigation_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------- faqs ----------
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "faqs public read active" ON public.faqs FOR SELECT TO anon USING (is_active);
CREATE POLICY "faqs auth read" ON public.faqs FOR SELECT TO authenticated USING (true);
CREATE POLICY "faqs admin write" ON public.faqs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_faqs_order ON public.faqs(display_order);
CREATE TRIGGER trg_faqs_updated BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------- seo_metadata ----------
CREATE TABLE public.seo_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route text NOT NULL UNIQUE,
  title text,
  description text,
  og_image text,
  canonical text,
  keywords text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.seo_metadata TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_metadata TO authenticated;
GRANT ALL ON public.seo_metadata TO service_role;
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;
CREATE POLICY "seo public read" ON public.seo_metadata FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "seo admin write" ON public.seo_metadata FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_seo_updated BEFORE UPDATE ON public.seo_metadata
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------- activity_logs (admin-only) ----------
CREATE TABLE public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity text,
  entity_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.activity_logs TO authenticated;
GRANT ALL ON public.activity_logs TO service_role;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "logs admin read" ON public.activity_logs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "logs admin insert" ON public.activity_logs FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_logs_created ON public.activity_logs(created_at DESC);
CREATE INDEX idx_logs_entity ON public.activity_logs(entity, entity_id);

-- ---------- storage.objects policies for site-media ----------
CREATE POLICY "site-media public read" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'site-media');
CREATE POLICY "site-media admin insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-media' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "site-media admin update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'site-media' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "site-media admin delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'site-media' AND public.has_role(auth.uid(),'admin'));
