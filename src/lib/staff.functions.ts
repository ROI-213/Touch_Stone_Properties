import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) throw new Error(error.message);
  if (data !== true) throw new Error("Forbidden: admin role required");
}

const createSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  mobile: z.string().max(40).optional().nullable(),
  designation: z.string().max(120).optional().nullable(),
  employee_code: z.string().max(40).optional().nullable(),
  username: z.string().max(40).optional().nullable(),
  department: z.string().max(120).optional().nullable(),
  branch: z.string().max(120).optional().nullable(),
  territory: z.string().max(120).optional().nullable(),
  joining_date: z.string().optional().nullable(),
  password: z.string().min(10),
  status: z.enum(["active", "inactive"]).default("active"),
  permissions: z.array(z.object({
    module_name: z.string(),
    can_view: z.boolean(),
    can_add: z.boolean(),
    can_edit: z.boolean(),
    can_delete: z.boolean(),
    can_publish: z.boolean(),
    can_export: z.boolean(),
  })).default([]),
});

export const createStaffUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => createSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/admin.server");

    // Check for duplicates before creating auth user
    if (data.employee_code) {
      const { count } = await (supabaseAdmin.from("staff_users") as any)
        .select("*", { count: "exact", head: true })
        .eq("employee_code", data.employee_code);
      if (count && count > 0) throw new Error("Employee code already in use");
    }
    if (data.username) {
      const { count } = await (supabaseAdmin.from("staff_users") as any)
        .select("*", { count: "exact", head: true })
        .eq("username", data.username);
      if (count && count > 0) throw new Error("Username already in use");
    }

    // Create auth user (auto-confirmed)
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.name, phone: data.mobile ?? "" },
    });

    if (createErr || !created.user) {
      console.error("[CreateStaff Auth Error]:", createErr);
      throw new Error(createErr?.message ?? "Failed to create auth user");
    }

    const authUserId = created.user.id;

    try {
      // Insert staff_users row
      const { data: staffRow, error: insertErr } = await supabaseAdmin
        .from("staff_users")
        .insert({
          auth_user_id: authUserId,
          name: data.name,
          email: data.email,
          mobile: data.mobile ?? null,
          designation: data.designation ?? null,
          employee_code: data.employee_code ?? null,
          username: data.username ?? null,
          department: data.department ?? null,
          branch: data.branch ?? null,
          territory: data.territory ?? null,
          joining_date: data.joining_date ?? null,
          status: data.status,
          created_by: context.userId,
        } as any)
        .select("id")
        .single();

      if (insertErr || !staffRow) {
        console.error("[CreateStaff DB Insert Error]:", insertErr);
        throw new Error(insertErr?.message ?? "Failed to insert staff record");
      }

      // Assign 'staff' role
      await supabaseAdmin.from("user_roles").insert({ user_id: authUserId, role: "staff" }).select();

      if (data.permissions.length > 0) {
        const rows = data.permissions.map((p) => ({ ...p, staff_user_id: staffRow.id }));
        const { error: permErr } = await supabaseAdmin.from("staff_permissions").insert(rows);
        if (permErr) {
          console.error("[CreateStaff Permissions Error]:", permErr);
          throw new Error(permErr.message);
        }
      }

      return { staffUserId: staffRow.id, authUserId };
    } catch (e: any) {
      // Rollback created Auth user on failure
      try {
        await supabaseAdmin.auth.admin.deleteUser(authUserId);
      } catch (rollbackErr) {
        console.error("[CreateStaff Rollback Error]:", rollbackErr);
      }
      throw e;
    }
  });

export const resetStaffPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ auth_user_id: z.string().uuid(), password: z.string().min(10) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/admin.server");
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.auth_user_id, { password: data.password });
    if (error) {
      console.error("[ResetPassword Auth Error]:", error);
      throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteStaffUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ staffId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/admin.server");
    
    // Load staff record
    const { data: staff, error: staffError } = await supabaseAdmin
      .from("staff_users")
      .select("*")
      .eq("id", data.staffId)
      .maybeSingle();

    if (staffError) throw new Error(staffError.message);
    if (!staff) throw new Error("Staff record not found in database.");

    const authUserId = staff.auth_user_id;

    if (context.userId === authUserId) {
      throw new Error("You cannot delete your own account.");
    }

    const { data: adminRoles, error: adminRolesErr } = await supabaseAdmin.from("user_roles").select("user_id").eq("role", "admin");
    if (adminRolesErr) throw new Error(adminRolesErr.message);
    if (adminRoles.length <= 1 && adminRoles.some((r) => r.user_id === authUserId)) {
      throw new Error("Cannot delete the last remaining administrator.");
    }

    let authUserAlreadyMissing = false;
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(authUserId);
    
    if (authError) {
      if (authError.message.toLowerCase().includes("user not found")) {
        authUserAlreadyMissing = true;
      } else {
        console.error("[DeleteStaff Auth Error]:", authError);
        throw new Error(`Auth deletion failed: ${authError.message}`);
      }
    }

    const { error: dbDeleteErr } = await supabaseAdmin.from("staff_users").delete().eq("id", data.staffId);
    if (dbDeleteErr) throw new Error(`Database cleanup failed: ${dbDeleteErr.message}`);

    return { 
      success: true, 
      staffDeleted: true, 
      authUserDeleted: !authUserAlreadyMissing, 
      authUserAlreadyMissing,
      message: authUserAlreadyMissing 
        ? "Staff member deleted successfully. The staff login was already missing from Supabase Authentication." 
        : "Staff member deleted successfully."
    };
  });
