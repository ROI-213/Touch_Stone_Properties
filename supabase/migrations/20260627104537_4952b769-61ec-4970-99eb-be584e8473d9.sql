
CREATE TABLE public.hot_property_settings (
  id text PRIMARY KEY DEFAULT 'default' CHECK (id = 'default'),
  enabled boolean NOT NULL DEFAULT true,
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  badge_text text NOT NULL DEFAULT 'Hot Deal',
  highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  cta_view_url text,
  cta_contact_url text,
  override_image text,
  override_title text,
  override_location text,
  override_price text,
  override_property_type text,
  override_bedrooms int,
  override_bathrooms int,
  override_area text,
  override_description text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.hot_property_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hot_property_settings TO authenticated;
GRANT ALL ON public.hot_property_settings TO service_role;

ALTER TABLE public.hot_property_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read hot property settings"
  ON public.hot_property_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins manage hot property settings"
  ON public.hot_property_settings FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER hot_property_settings_set_updated_at
BEFORE UPDATE ON public.hot_property_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Sync is_hot flag on properties when selection changes
CREATE OR REPLACE FUNCTION public.sync_hot_property_flag()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.property_id IS NOT NULL THEN
    UPDATE public.properties SET is_hot = false WHERE is_hot = true AND id <> NEW.property_id;
    UPDATE public.properties SET is_hot = true WHERE id = NEW.property_id;
  ELSE
    UPDATE public.properties SET is_hot = false WHERE is_hot = true;
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER hot_property_settings_sync_flag
AFTER INSERT OR UPDATE OF property_id ON public.hot_property_settings
FOR EACH ROW EXECUTE FUNCTION public.sync_hot_property_flag();

INSERT INTO public.hot_property_settings (id) VALUES ('default') ON CONFLICT DO NOTHING;

ALTER PUBLICATION supabase_realtime ADD TABLE public.hot_property_settings;
