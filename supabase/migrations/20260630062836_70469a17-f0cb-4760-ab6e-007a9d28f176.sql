
-- Add 'staff' role
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'staff';

-- Staff users (1:1 with auth.users, holds profile + status + designation)
CREATE TABLE IF NOT EXISTS public.staff_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  mobile text,
  designation text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff_users TO authenticated;
GRANT ALL ON public.staff_users TO service_role;
ALTER TABLE public.staff_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage staff_users" ON public.staff_users FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Staff read own row" ON public.staff_users FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid());
CREATE TRIGGER staff_users_set_updated_at BEFORE UPDATE ON public.staff_users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Permissions per module
CREATE TABLE IF NOT EXISTS public.staff_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_user_id uuid NOT NULL REFERENCES public.staff_users(id) ON DELETE CASCADE,
  module_name text NOT NULL,
  can_view boolean NOT NULL DEFAULT false,
  can_add boolean NOT NULL DEFAULT false,
  can_edit boolean NOT NULL DEFAULT false,
  can_delete boolean NOT NULL DEFAULT false,
  can_publish boolean NOT NULL DEFAULT false,
  can_export boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (staff_user_id, module_name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff_permissions TO authenticated;
GRANT ALL ON public.staff_permissions TO service_role;
ALTER TABLE public.staff_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage staff_permissions" ON public.staff_permissions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Staff read own permissions" ON public.staff_permissions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.staff_users s WHERE s.id = staff_permissions.staff_user_id AND s.auth_user_id = auth.uid()));
CREATE TRIGGER staff_permissions_set_updated_at BEFORE UPDATE ON public.staff_permissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Tasks
CREATE TABLE IF NOT EXISTS public.staff_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  related_module text,
  assigned_to uuid REFERENCES public.staff_users(id) ON DELETE SET NULL,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
  due_date date,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','rejected')),
  admin_remarks text,
  staff_notes text,
  attachment_url text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff_tasks TO authenticated;
GRANT ALL ON public.staff_tasks TO service_role;
ALTER TABLE public.staff_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage all tasks" ON public.staff_tasks FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Staff read own tasks" ON public.staff_tasks FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.staff_users s WHERE s.id = staff_tasks.assigned_to AND s.auth_user_id = auth.uid()));
CREATE POLICY "Staff update own task progress" ON public.staff_tasks FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.staff_users s WHERE s.id = staff_tasks.assigned_to AND s.auth_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.staff_users s WHERE s.id = staff_tasks.assigned_to AND s.auth_user_id = auth.uid()));
CREATE TRIGGER staff_tasks_set_updated_at BEFORE UPDATE ON public.staff_tasks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Helper: get current user's staff_users row id (security definer to avoid recursion)
CREATE OR REPLACE FUNCTION public.current_staff_user_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id FROM public.staff_users WHERE auth_user_id = auth.uid() LIMIT 1;
$$;

-- Helper: has_staff_permission(module, action)
CREATE OR REPLACE FUNCTION public.has_staff_permission(_module text, _action text)
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE r record;
BEGIN
  IF public.has_role(auth.uid(),'admin') THEN RETURN true; END IF;
  SELECT * INTO r FROM public.staff_permissions sp
    JOIN public.staff_users su ON su.id = sp.staff_user_id
    WHERE su.auth_user_id = auth.uid()
      AND su.status = 'active'
      AND sp.module_name = _module;
  IF NOT FOUND THEN RETURN false; END IF;
  RETURN CASE _action
    WHEN 'view' THEN r.can_view
    WHEN 'add' THEN r.can_add
    WHEN 'edit' THEN r.can_edit
    WHEN 'delete' THEN r.can_delete
    WHEN 'publish' THEN r.can_publish
    WHEN 'export' THEN r.can_export
    ELSE false END;
END $$;
