
REVOKE EXECUTE ON FUNCTION public.current_staff_user_id() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_staff_permission(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_staff_user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_staff_permission(text, text) TO authenticated;
