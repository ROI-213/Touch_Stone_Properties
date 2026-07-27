
-- Grant staff admins with the appropriate module permission the same
-- add/edit/delete access super admins have on website content tables.
-- has_staff_permission() already returns true for super admins, so these
-- policies do not narrow existing admin access.

-- Helper: single ALL policy per table, checking the module the admin UI uses.
-- partners
DROP POLICY IF EXISTS "Staff can manage partners" ON public.partners;
CREATE POLICY "Staff can manage partners" ON public.partners FOR ALL TO authenticated
  USING (public.has_staff_permission('partners','edit') OR public.has_staff_permission('partners','add') OR public.has_staff_permission('partners','delete'))
  WITH CHECK (public.has_staff_permission('partners','edit') OR public.has_staff_permission('partners','add'));

-- testimonials
DROP POLICY IF EXISTS "Staff can manage testimonials" ON public.testimonials;
CREATE POLICY "Staff can manage testimonials" ON public.testimonials FOR ALL TO authenticated
  USING (public.has_staff_permission('testimonials','edit') OR public.has_staff_permission('testimonials','add') OR public.has_staff_permission('testimonials','delete') OR public.has_staff_permission('testimonials','publish'))
  WITH CHECK (public.has_staff_permission('testimonials','edit') OR public.has_staff_permission('testimonials','add') OR public.has_staff_permission('testimonials','publish'));

-- faqs (site_content module owns this in the admin UI; fall back to site_content perm)
DROP POLICY IF EXISTS "Staff can manage faqs" ON public.faqs;
CREATE POLICY "Staff can manage faqs" ON public.faqs FOR ALL TO authenticated
  USING (public.has_staff_permission('site_content','edit') OR public.has_staff_permission('site_content','add') OR public.has_staff_permission('site_content','delete') OR public.has_staff_permission('site_content','publish'))
  WITH CHECK (public.has_staff_permission('site_content','edit') OR public.has_staff_permission('site_content','add') OR public.has_staff_permission('site_content','publish'));

-- success_stories
DROP POLICY IF EXISTS "Staff can manage success stories" ON public.success_stories;
CREATE POLICY "Staff can manage success stories" ON public.success_stories FOR ALL TO authenticated
  USING (public.has_staff_permission('success_stories','edit') OR public.has_staff_permission('success_stories','add') OR public.has_staff_permission('success_stories','delete') OR public.has_staff_permission('success_stories','publish'))
  WITH CHECK (public.has_staff_permission('success_stories','edit') OR public.has_staff_permission('success_stories','add') OR public.has_staff_permission('success_stories','publish'));

-- amenities
DROP POLICY IF EXISTS "Staff can manage amenities" ON public.amenities;
CREATE POLICY "Staff can manage amenities" ON public.amenities FOR ALL TO authenticated
  USING (public.has_staff_permission('amenities','edit') OR public.has_staff_permission('amenities','add') OR public.has_staff_permission('amenities','delete'))
  WITH CHECK (public.has_staff_permission('amenities','edit') OR public.has_staff_permission('amenities','add'));

-- locations
DROP POLICY IF EXISTS "Staff can manage locations" ON public.locations;
CREATE POLICY "Staff can manage locations" ON public.locations FOR ALL TO authenticated
  USING (public.has_staff_permission('locations','edit') OR public.has_staff_permission('locations','add') OR public.has_staff_permission('locations','delete'))
  WITH CHECK (public.has_staff_permission('locations','edit') OR public.has_staff_permission('locations','add'));

-- form_options
DROP POLICY IF EXISTS "Staff can manage form options" ON public.form_options;
CREATE POLICY "Staff can manage form options" ON public.form_options FOR ALL TO authenticated
  USING (public.has_staff_permission('form_options','edit') OR public.has_staff_permission('form_options','add') OR public.has_staff_permission('form_options','delete'))
  WITH CHECK (public.has_staff_permission('form_options','edit') OR public.has_staff_permission('form_options','add'));

-- content_sections (site_content module)
DROP POLICY IF EXISTS "Staff can manage content sections" ON public.content_sections;
CREATE POLICY "Staff can manage content sections" ON public.content_sections FOR ALL TO authenticated
  USING (public.has_staff_permission('site_content','edit') OR public.has_staff_permission('site_content','add') OR public.has_staff_permission('site_content','delete') OR public.has_staff_permission('site_content','publish') OR public.has_staff_permission('about_us','edit'))
  WITH CHECK (public.has_staff_permission('site_content','edit') OR public.has_staff_permission('site_content','add') OR public.has_staff_permission('site_content','publish') OR public.has_staff_permission('about_us','edit'));

-- site_settings (many modules write here: about, footer, settings, seo, search_filters, hero_slides)
DROP POLICY IF EXISTS "Staff can manage site settings" ON public.site_settings;
CREATE POLICY "Staff can manage site settings" ON public.site_settings FOR ALL TO authenticated
  USING (
    public.has_staff_permission('about_us','edit') OR
    public.has_staff_permission('footer','edit') OR
    public.has_staff_permission('settings','edit') OR
    public.has_staff_permission('seo','edit') OR
    public.has_staff_permission('search_filters','edit') OR
    public.has_staff_permission('hero_slides','edit') OR
    public.has_staff_permission('site_content','edit')
  )
  WITH CHECK (
    public.has_staff_permission('about_us','edit') OR
    public.has_staff_permission('footer','edit') OR
    public.has_staff_permission('settings','edit') OR
    public.has_staff_permission('seo','edit') OR
    public.has_staff_permission('search_filters','edit') OR
    public.has_staff_permission('hero_slides','edit') OR
    public.has_staff_permission('site_content','edit')
  );

-- seo_metadata
DROP POLICY IF EXISTS "Staff can manage seo metadata" ON public.seo_metadata;
CREATE POLICY "Staff can manage seo metadata" ON public.seo_metadata FOR ALL TO authenticated
  USING (public.has_staff_permission('seo','edit'))
  WITH CHECK (public.has_staff_permission('seo','edit'));

-- navigation_items
DROP POLICY IF EXISTS "Staff can manage navigation" ON public.navigation_items;
CREATE POLICY "Staff can manage navigation" ON public.navigation_items FOR ALL TO authenticated
  USING (public.has_staff_permission('navigation','edit') OR public.has_staff_permission('navigation','add') OR public.has_staff_permission('navigation','delete'))
  WITH CHECK (public.has_staff_permission('navigation','edit') OR public.has_staff_permission('navigation','add'));

-- hot_property_settings (featured/top_featured/hot_properties)
DROP POLICY IF EXISTS "Staff can manage hot property settings" ON public.hot_property_settings;
CREATE POLICY "Staff can manage hot property settings" ON public.hot_property_settings FOR ALL TO authenticated
  USING (public.has_staff_permission('hot_properties','edit') OR public.has_staff_permission('featured','edit') OR public.has_staff_permission('top_featured','edit') OR public.has_staff_permission('properties','edit'))
  WITH CHECK (public.has_staff_permission('hot_properties','edit') OR public.has_staff_permission('featured','edit') OR public.has_staff_permission('top_featured','edit') OR public.has_staff_permission('properties','edit'));

-- contact_info
DROP POLICY IF EXISTS "Staff can manage contact info" ON public.contact_info;
CREATE POLICY "Staff can manage contact info" ON public.contact_info FOR ALL TO authenticated
  USING (public.has_staff_permission('site_content','edit') OR public.has_staff_permission('footer','edit') OR public.has_staff_permission('settings','edit'))
  WITH CHECK (public.has_staff_permission('site_content','edit') OR public.has_staff_permission('footer','edit') OR public.has_staff_permission('settings','edit'));

-- Storage buckets: allow staff with matching module perms to upload/manage.
-- site-media covers about, footer, partners, testimonials, stories, settings, seo, forms, navigation, hero content.
DROP POLICY IF EXISTS "Staff can upload site-media" ON storage.objects;
CREATE POLICY "Staff can upload site-media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-media' AND (
    public.has_staff_permission('about_us','edit') OR
    public.has_staff_permission('footer','edit') OR
    public.has_staff_permission('partners','edit') OR public.has_staff_permission('partners','add') OR
    public.has_staff_permission('testimonials','edit') OR public.has_staff_permission('testimonials','add') OR
    public.has_staff_permission('success_stories','edit') OR public.has_staff_permission('success_stories','add') OR
    public.has_staff_permission('site_content','edit') OR
    public.has_staff_permission('seo','edit') OR
    public.has_staff_permission('builders','edit') OR public.has_staff_permission('builders','add') OR
    public.has_staff_permission('settings','edit')
  ));
DROP POLICY IF EXISTS "Staff can update site-media" ON storage.objects;
CREATE POLICY "Staff can update site-media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'site-media') WITH CHECK (bucket_id = 'site-media');
DROP POLICY IF EXISTS "Staff can delete site-media" ON storage.objects;
CREATE POLICY "Staff can delete site-media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'site-media' AND (
    public.has_staff_permission('about_us','delete') OR
    public.has_staff_permission('partners','delete') OR
    public.has_staff_permission('testimonials','delete') OR
    public.has_staff_permission('success_stories','delete') OR
    public.has_staff_permission('site_content','delete') OR
    public.has_staff_permission('builders','delete') OR
    public.has_staff_permission('settings','edit')
  ));
DROP POLICY IF EXISTS "Auth can read site-media" ON storage.objects;
CREATE POLICY "Auth can read site-media" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'site-media');

-- success-stories bucket
DROP POLICY IF EXISTS "Staff can write success-stories bucket" ON storage.objects;
CREATE POLICY "Staff can write success-stories bucket" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'success-stories' AND (public.has_staff_permission('success_stories','edit') OR public.has_staff_permission('success_stories','add')));
DROP POLICY IF EXISTS "Staff can update success-stories bucket" ON storage.objects;
CREATE POLICY "Staff can update success-stories bucket" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'success-stories') WITH CHECK (bucket_id = 'success-stories');
DROP POLICY IF EXISTS "Staff can delete success-stories bucket" ON storage.objects;
CREATE POLICY "Staff can delete success-stories bucket" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'success-stories' AND public.has_staff_permission('success_stories','delete'));
DROP POLICY IF EXISTS "Auth can read success-stories bucket" ON storage.objects;
CREATE POLICY "Auth can read success-stories bucket" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'success-stories');

-- property-media bucket for staff with properties permissions
DROP POLICY IF EXISTS "Staff can write property-media" ON storage.objects;
CREATE POLICY "Staff can write property-media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'property-media' AND (public.has_staff_permission('properties','edit') OR public.has_staff_permission('properties','add')));
DROP POLICY IF EXISTS "Staff can update property-media" ON storage.objects;
CREATE POLICY "Staff can update property-media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'property-media') WITH CHECK (bucket_id = 'property-media');
DROP POLICY IF EXISTS "Staff can delete property-media" ON storage.objects;
CREATE POLICY "Staff can delete property-media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'property-media' AND public.has_staff_permission('properties','delete'));
DROP POLICY IF EXISTS "Auth can read property-media" ON storage.objects;
CREATE POLICY "Auth can read property-media" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'property-media');
