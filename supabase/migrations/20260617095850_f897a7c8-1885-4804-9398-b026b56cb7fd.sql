
-- BUILDERS
CREATE TABLE public.builders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  website text,
  rera_prefix text,
  description text,
  display_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.builders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.builders TO authenticated;
GRANT ALL ON public.builders TO service_role;
ALTER TABLE public.builders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active builders" ON public.builders FOR SELECT USING (active = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage builders" ON public.builders FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER builders_updated_at BEFORE UPDATE ON public.builders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- LOCATIONS
CREATE TABLE public.locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL DEFAULT 'Bangalore',
  zone text NOT NULL CHECK (zone IN ('East','West','North','South','Central')),
  locality text NOT NULL,
  slug text UNIQUE NOT NULL,
  active boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.locations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.locations TO authenticated;
GRANT ALL ON public.locations TO service_role;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active locations" ON public.locations FOR SELECT USING (active = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage locations" ON public.locations FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER locations_updated_at BEFORE UPDATE ON public.locations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- AMENITIES
CREATE TABLE public.amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  icon text,
  category text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.amenities TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.amenities TO authenticated;
GRANT ALL ON public.amenities TO service_role;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view amenities" ON public.amenities FOR SELECT USING (true);
CREATE POLICY "Admins manage amenities" ON public.amenities FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- PROPERTIES
CREATE TABLE public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  project_name text NOT NULL,
  builder_id uuid REFERENCES public.builders(id) ON DELETE SET NULL,
  rera_number text,
  property_type text NOT NULL CHECK (property_type IN ('Apartment','Villa','Plot','Commercial','Residential')),
  property_category text,
  listing_type text NOT NULL DEFAULT 'Buy' CHECK (listing_type IN ('Buy','Rent','Sell')),
  location_id uuid REFERENCES public.locations(id) ON DELETE SET NULL,
  address text,
  map_link text,
  directions_link text,
  price_min numeric,
  price_max numeric,
  starting_price numeric,
  price_per_sqft numeric,
  bhk_options text[] DEFAULT '{}'::text[],
  unit_sizes text,
  carpet_area text,
  land_parcel text,
  towers int,
  floors int,
  total_units int,
  open_space_pct numeric,
  clubhouse_size text,
  amenities_count int,
  possession_date text,
  project_status text,
  highlights text,
  overview text,
  location_advantages text,
  hero_image text,
  brochure_url text,
  contact_phone text,
  whatsapp text,
  seo_title text,
  seo_description text,
  seo_keywords text,
  is_active boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  is_top_featured boolean NOT NULL DEFAULT false,
  is_hot boolean NOT NULL DEFAULT false,
  is_trending boolean NOT NULL DEFAULT false,
  is_new_launch boolean NOT NULL DEFAULT false,
  is_pre_launch boolean NOT NULL DEFAULT false,
  is_ready_to_move boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.properties TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT ALL ON public.properties TO service_role;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active properties" ON public.properties FOR SELECT USING (is_active = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage properties" ON public.properties FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX properties_listing_type_idx ON public.properties(listing_type);
CREATE INDEX properties_property_type_idx ON public.properties(property_type);
CREATE INDEX properties_location_idx ON public.properties(location_id);
CREATE INDEX properties_flags_idx ON public.properties(is_featured, is_top_featured, is_hot);

-- PROPERTY IMAGES
CREATE TABLE public.property_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  url text NOT NULL,
  image_type text NOT NULL DEFAULT 'gallery' CHECK (image_type IN ('gallery','floor_plan','hero')),
  caption text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.property_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_images TO authenticated;
GRANT ALL ON public.property_images TO service_role;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view property images" ON public.property_images FOR SELECT USING (true);
CREATE POLICY "Admins manage property images" ON public.property_images FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- PROPERTY CONFIGURATIONS
CREATE TABLE public.property_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  bhk text,
  carpet_area text,
  super_area text,
  price numeric,
  display_order int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.property_configurations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_configurations TO authenticated;
GRANT ALL ON public.property_configurations TO service_role;
ALTER TABLE public.property_configurations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view configurations" ON public.property_configurations FOR SELECT USING (true);
CREATE POLICY "Admins manage configurations" ON public.property_configurations FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- PROPERTY PRICES
CREATE TABLE public.property_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  unit_type text,
  price_from numeric,
  price_to numeric,
  display_order int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.property_prices TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_prices TO authenticated;
GRANT ALL ON public.property_prices TO service_role;
ALTER TABLE public.property_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view prices" ON public.property_prices FOR SELECT USING (true);
CREATE POLICY "Admins manage prices" ON public.property_prices FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- PROPERTY AMENITIES LINK
CREATE TABLE public.property_amenities (
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  amenity_id uuid NOT NULL REFERENCES public.amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (property_id, amenity_id)
);
GRANT SELECT ON public.property_amenities TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_amenities TO authenticated;
GRANT ALL ON public.property_amenities TO service_role;
ALTER TABLE public.property_amenities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view property amenities" ON public.property_amenities FOR SELECT USING (true);
CREATE POLICY "Admins manage property amenities" ON public.property_amenities FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- PROPERTY NEARBY
CREATE TABLE public.property_nearby (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  name text NOT NULL,
  distance text,
  category text,
  display_order int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.property_nearby TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_nearby TO authenticated;
GRANT ALL ON public.property_nearby TO service_role;
ALTER TABLE public.property_nearby ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view nearby" ON public.property_nearby FOR SELECT USING (true);
CREATE POLICY "Admins manage nearby" ON public.property_nearby FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
