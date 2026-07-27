
-- Allow staff with hero_slides permissions to manage banners and banner images

-- Banners table policies
CREATE POLICY "Staff view banners" ON public.banners
  FOR SELECT TO authenticated
  USING (public.has_staff_permission('hero_slides', 'view'));

CREATE POLICY "Staff insert banners" ON public.banners
  FOR INSERT TO authenticated
  WITH CHECK (public.has_staff_permission('hero_slides', 'add'));

CREATE POLICY "Staff update banners" ON public.banners
  FOR UPDATE TO authenticated
  USING (public.has_staff_permission('hero_slides', 'edit'))
  WITH CHECK (public.has_staff_permission('hero_slides', 'edit'));

CREATE POLICY "Staff delete banners" ON public.banners
  FOR DELETE TO authenticated
  USING (public.has_staff_permission('hero_slides', 'delete'));

-- Storage policies for the 'banners' bucket
CREATE POLICY "Staff upload banner images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'banners' AND public.has_staff_permission('hero_slides', 'add'));

CREATE POLICY "Staff update banner images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'banners' AND public.has_staff_permission('hero_slides', 'edit'))
  WITH CHECK (bucket_id = 'banners' AND public.has_staff_permission('hero_slides', 'edit'));

CREATE POLICY "Staff delete banner images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'banners' AND public.has_staff_permission('hero_slides', 'delete'));
