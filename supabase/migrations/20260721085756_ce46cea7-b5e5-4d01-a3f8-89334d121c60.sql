
-- Restrict anon column access on builders to non-sensitive fields only.
-- Authenticated users keep table-wide SELECT (still filtered by RLS policies).
REVOKE SELECT ON public.builders FROM anon;
GRANT SELECT (id, name, slug, logo_url, website, description, display_order, active, contact_type, primary_phone, whatsapp_number, email, rera_prefix, city, locality, display_name)
  ON public.builders TO anon;

-- Restrict anon column access on property_assignments: hide identity-document URLs and signatures.
REVOKE SELECT ON public.property_assignments FROM anon;
GRANT SELECT (id, property_id, staff_name, role, phone, whatsapp, email, assigned_area, is_primary, is_active, show_publicly, display_order, photo_url, experience_years, languages, qr_code_url)
  ON public.property_assignments TO anon;
