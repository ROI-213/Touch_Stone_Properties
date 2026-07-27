GRANT SELECT ON public.properties TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT ALL ON public.properties TO service_role;

GRANT SELECT ON public.builders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.builders TO authenticated;
GRANT ALL ON public.builders TO service_role;

GRANT SELECT ON public.locations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.locations TO authenticated;
GRANT ALL ON public.locations TO service_role;

GRANT SELECT ON public.amenities TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.amenities TO authenticated;
GRANT ALL ON public.amenities TO service_role;

GRANT SELECT ON public.property_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_images TO authenticated;
GRANT ALL ON public.property_images TO service_role;

GRANT SELECT ON public.property_prices TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_prices TO authenticated;
GRANT ALL ON public.property_prices TO service_role;

GRANT SELECT ON public.property_configurations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_configurations TO authenticated;
GRANT ALL ON public.property_configurations TO service_role;

GRANT SELECT ON public.property_amenities TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_amenities TO authenticated;
GRANT ALL ON public.property_amenities TO service_role;