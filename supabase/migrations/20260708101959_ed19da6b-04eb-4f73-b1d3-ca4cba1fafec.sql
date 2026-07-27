-- Backfill missing profiles + user_roles for existing auth users, and (re)create trigger

INSERT INTO public.profiles (id, email, full_name, phone, city, avatar_url)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', ''),
  COALESCE(u.raw_user_meta_data->>'phone', ''),
  COALESCE(u.raw_user_meta_data->>'city', ''),
  COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture', '')
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'customer'::app_role
FROM auth.users u
LEFT JOIN public.user_roles r ON r.user_id = u.id
WHERE r.user_id IS NULL;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();