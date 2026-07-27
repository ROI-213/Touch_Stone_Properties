import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupAutoConfirm() {
  console.log("Setting up auto-confirm trigger...");

  // Execute SQL to create the trigger
  const sql = `
    CREATE OR REPLACE FUNCTION public.auto_confirm_user()
    RETURNS trigger AS $$
    BEGIN
      NEW.email_confirmed_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    DROP TRIGGER IF EXISTS on_auth_user_created_auto_confirm ON auth.users;
    CREATE TRIGGER on_auth_user_created_auto_confirm
      BEFORE INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.auto_confirm_user();
  `;

  // We can't execute raw SQL directly via the JS client easily,
  // but we can try to call a stored procedure if one exists, 
  // or we can just ask the user to turn it off in the dashboard.
}

setupAutoConfirm().catch(console.error);
