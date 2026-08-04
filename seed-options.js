import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function seed() {
  const types = ["Apartment", "Villa", "Plot", "Commercial", "Residential"];
  const bhks = ["1BHK", "2BHK", "3BHK", "4BHK", "4+BHK"];

  let displayOrder = 10;
  for (const t of types) {
    await supabase.from("form_options").insert({
      form_key: "search",
      field_key: "property_type",
      label: t,
      value: t,
      display_order: displayOrder,
      is_active: true
    });
    displayOrder += 10;
  }

  displayOrder = 10;
  for (const b of bhks) {
    await supabase.from("form_options").insert({
      form_key: "search",
      field_key: "bhk",
      label: b,
      value: b,
      display_order: displayOrder,
      is_active: true
    });
    displayOrder += 10;
  }

  console.log("Seeded successfully!");
}

seed().catch(console.error);
