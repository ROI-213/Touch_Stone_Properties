
-- Staff RLS for builders table and site-media storage (builders folder)

DROP POLICY IF EXISTS "Staff can insert builders" ON public.builders;
DROP POLICY IF EXISTS "Staff can update builders" ON public.builders;
DROP POLICY IF EXISTS "Staff can delete builders" ON public.builders;

CREATE POLICY "Staff can insert builders" ON public.builders
  FOR INSERT TO authenticated
  WITH CHECK (public.has_staff_permission('builders','add') OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "Staff can update builders" ON public.builders
  FOR UPDATE TO authenticated
  USING (public.has_staff_permission('builders','edit') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_staff_permission('builders','edit') OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "Staff can delete builders" ON public.builders
  FOR DELETE TO authenticated
  USING (public.has_staff_permission('builders','delete') OR public.has_role(auth.uid(),'admin'));

-- Storage policies for site-media bucket, builders/ folder
DROP POLICY IF EXISTS "Staff can upload builder logos" ON storage.objects;
DROP POLICY IF EXISTS "Staff can update builder logos" ON storage.objects;
DROP POLICY IF EXISTS "Staff can delete builder logos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone authenticated can read site-media" ON storage.objects;

CREATE POLICY "Staff can upload builder logos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'site-media'
    AND (storage.foldername(name))[1] = 'builders'
    AND (public.has_staff_permission('builders','add')
         OR public.has_staff_permission('builders','edit')
         OR public.has_role(auth.uid(),'admin'))
  );

CREATE POLICY "Staff can update builder logos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'site-media'
    AND (storage.foldername(name))[1] = 'builders'
    AND (public.has_staff_permission('builders','edit') OR public.has_role(auth.uid(),'admin'))
  );

CREATE POLICY "Staff can delete builder logos" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'site-media'
    AND (storage.foldername(name))[1] = 'builders'
    AND (public.has_staff_permission('builders','delete') OR public.has_role(auth.uid(),'admin'))
  );

CREATE POLICY "Authenticated can read site-media" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'site-media');
