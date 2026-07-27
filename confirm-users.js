import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use the service role key to bypass RLS and use Admin API
);

async function confirmUsers() {
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error("Error listing users:", error);
    return;
  }

  for (const user of users) {
    if (!user.email_confirmed_at) {
      console.log(`Confirming email for ${user.email}...`);
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { email_confirm: true }
      );
      if (updateError) {
        console.error(`Failed to confirm ${user.email}:`, updateError);
      } else {
        console.log(`Successfully confirmed ${user.email}.`);
      }
    }
  }
  console.log("Done confirming users.");
}

confirmUsers().catch(console.error);
