
-- Allow staff with 'properties' module permissions to manage properties and related tables.
-- has_staff_permission() already returns true for admin, so admins remain unaffected.

-- properties
CREATE POLICY "Staff can view properties" ON public.properties
  FOR SELECT TO authenticated
  USING (public.has_staff_permission('properties','view'));

CREATE POLICY "Staff can insert properties" ON public.properties
  FOR INSERT TO authenticated
  WITH CHECK (public.has_staff_permission('properties','add'));

CREATE POLICY "Staff can update properties" ON public.properties
  FOR UPDATE TO authenticated
  USING (public.has_staff_permission('properties','edit'))
  WITH CHECK (public.has_staff_permission('properties','edit'));

CREATE POLICY "Staff can delete properties" ON public.properties
  FOR DELETE TO authenticated
  USING (public.has_staff_permission('properties','delete'));

-- property_images
CREATE POLICY "Staff can write property images" ON public.property_images
  FOR ALL TO authenticated
  USING (public.has_staff_permission('properties','edit') OR public.has_staff_permission('properties','add'))
  WITH CHECK (public.has_staff_permission('properties','edit') OR public.has_staff_permission('properties','add'));

-- property_amenities
CREATE POLICY "Staff can write property amenities" ON public.property_amenities
  FOR ALL TO authenticated
  USING (public.has_staff_permission('properties','edit') OR public.has_staff_permission('properties','add'))
  WITH CHECK (public.has_staff_permission('properties','edit') OR public.has_staff_permission('properties','add'));

-- property_configurations
CREATE POLICY "Staff can write configurations" ON public.property_configurations
  FOR ALL TO authenticated
  USING (public.has_staff_permission('properties','edit') OR public.has_staff_permission('properties','add'))
  WITH CHECK (public.has_staff_permission('properties','edit') OR public.has_staff_permission('properties','add'));

-- property_prices
CREATE POLICY "Staff can write prices" ON public.property_prices
  FOR ALL TO authenticated
  USING (public.has_staff_permission('properties','edit') OR public.has_staff_permission('properties','add'))
  WITH CHECK (public.has_staff_permission('properties','edit') OR public.has_staff_permission('properties','add'));

-- property_nearby
CREATE POLICY "Staff can write nearby" ON public.property_nearby
  FOR ALL TO authenticated
  USING (public.has_staff_permission('properties','edit') OR public.has_staff_permission('properties','add'))
  WITH CHECK (public.has_staff_permission('properties','edit') OR public.has_staff_permission('properties','add'));

-- property_assignments
CREATE POLICY "Staff can view assignments" ON public.property_assignments
  FOR SELECT TO authenticated
  USING (public.has_staff_permission('properties','view'));

CREATE POLICY "Staff can insert assignments" ON public.property_assignments
  FOR INSERT TO authenticated
  WITH CHECK (public.has_staff_permission('properties','add') OR public.has_staff_permission('properties','edit'));

CREATE POLICY "Staff can update assignments" ON public.property_assignments
  FOR UPDATE TO authenticated
  USING (public.has_staff_permission('properties','edit'))
  WITH CHECK (public.has_staff_permission('properties','edit'));

CREATE POLICY "Staff can delete assignments" ON public.property_assignments
  FOR DELETE TO authenticated
  USING (public.has_staff_permission('properties','delete') OR public.has_staff_permission('properties','edit'));
