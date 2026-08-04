
CREATE POLICY "property-media public read" ON storage.objects FOR SELECT USING (bucket_id = 'property-media');
CREATE POLICY "property-media admin insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'property-media' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "property-media admin update" ON storage.objects FOR UPDATE USING (bucket_id = 'property-media' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "property-media admin delete" ON storage.objects FOR DELETE USING (bucket_id = 'property-media' AND has_role(auth.uid(), 'admin'::app_role));
