DROP POLICY IF EXISTS "enquiries public insert" ON public.enquiries;

CREATE POLICY "enquiries public insert" ON public.enquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(trim(name)) >= 2
    AND phone ~ '^[0-9+() -]{7,20}$'
    AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
    AND jsonb_typeof(images) = 'array'
    AND jsonb_array_length(images) <= 15
  );

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;