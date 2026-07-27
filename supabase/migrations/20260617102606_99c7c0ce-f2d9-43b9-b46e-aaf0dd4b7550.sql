DROP POLICY IF EXISTS "Public can view active builders" ON public.builders;
DROP POLICY IF EXISTS "Public can view active locations" ON public.locations;
DROP POLICY IF EXISTS "Public can view active properties" ON public.properties;

CREATE POLICY "Public can view active builders"
  ON public.builders
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Public can view active locations"
  ON public.locations
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Public can view active properties"
  ON public.properties
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);