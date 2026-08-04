
CREATE POLICY "success-stories read" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'success-stories');
CREATE POLICY "success-stories admin write" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'success-stories' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'success-stories' AND public.has_role(auth.uid(), 'admin'));
