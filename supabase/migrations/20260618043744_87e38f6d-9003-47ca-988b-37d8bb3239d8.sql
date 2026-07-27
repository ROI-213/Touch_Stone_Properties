
-- Banners table
CREATE TABLE IF NOT EXISTS public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  image_url text,
  cta_text text,
  cta_link text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.banners TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.banners TO authenticated;
GRANT ALL ON public.banners TO service_role;

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active banners" ON public.banners;
CREATE POLICY "Public can view active banners" ON public.banners
  FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage banners" ON public.banners;
CREATE POLICY "Admins manage banners" ON public.banners
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS banners_set_updated_at ON public.banners;
CREATE TRIGGER banners_set_updated_at
  BEFORE UPDATE ON public.banners
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Storage policies for the banners bucket (bucket created via tool)
DROP POLICY IF EXISTS "Public can read banner images" ON storage.objects;
CREATE POLICY "Public can read banner images" ON storage.objects
  FOR SELECT USING (bucket_id = 'banners');

DROP POLICY IF EXISTS "Admins manage banner images" ON storage.objects;
CREATE POLICY "Admins manage banner images" ON storage.objects
  FOR ALL USING (bucket_id = 'banners' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'banners' AND public.has_role(auth.uid(), 'admin'));
