-- Enable RLS on staff_users
ALTER TABLE "public"."staff_users" ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users for their own staff profile
CREATE POLICY "Users can read own staff profile"
ON "public"."staff_users"
FOR SELECT
TO authenticated
USING (auth_user_id = auth.uid());

-- Allow admins to do everything
CREATE POLICY "Admins have full access to staff_users"
ON "public"."staff_users"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);
