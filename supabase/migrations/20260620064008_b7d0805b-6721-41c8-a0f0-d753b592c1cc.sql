DROP POLICY IF EXISTS "property-media sell submission insert" ON storage.objects;

CREATE POLICY "property-media sell submission insert" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    bucket_id = 'property-media'
    AND (storage.foldername(name))[1] = 'sell-submissions'
    AND lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp', 'gif')
  );