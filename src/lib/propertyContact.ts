// Reusable helpers for resolving property contact details (Call / WhatsApp / Email).
// Priority for phone/whatsapp:
//   1. assigned staff whatsapp
//   2. assigned staff phone
//   3. websiteSettings.whatsapp_number
//   4. websiteSettings.phone_number
//   5. contactSettings.whatsapp_number
//   6. contactSettings.phone_number
// Priority for email:
//   1. assigned staff email
//   2. websiteSettings.email
//   3. contactSettings.email

export type AssignedStaff = {
  id?: string | null;
  name?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  active?: boolean | null;
} | null | undefined;

export type ContactSource = "staff" | "company";

export type ResolvedPropertyContact = {
  phone: string | null;
  email: string | null;
  source: ContactSource;
  staffId: string | null;
  staffName: string | null;
};

export interface PropertyLike {
  assigned_staff?: AssignedStaff;
}

export interface SettingsLike {
  phone_number?: string | null;
  whatsapp_number?: string | null;
  email?: string | null;
}

export function getPropertyContact(
  property: PropertyLike | null | undefined,
  websiteSettings?: SettingsLike | null,
  contactSettings?: SettingsLike | null,
): ResolvedPropertyContact {
  // Ignore inactive/missing staff
  const staff =
    property?.assigned_staff && property.assigned_staff.active !== false
      ? property.assigned_staff
      : null;

  const phone =
    staff?.whatsapp ||
    staff?.phone ||
    websiteSettings?.whatsapp_number ||
    websiteSettings?.phone_number ||
    contactSettings?.whatsapp_number ||
    contactSettings?.phone_number ||
    null;

  const email =
    staff?.email || websiteSettings?.email || contactSettings?.email || null;

  const usedStaff = Boolean(staff?.whatsapp || staff?.phone);

  return {
    phone: phone || null,
    email: email || null,
    source: usedStaff ? "staff" : "company",
    staffId: usedStaff ? staff?.id ?? null : null,
    staffName: usedStaff ? staff?.name ?? null : null,
  };
}

// Normalize Indian phone numbers to `91XXXXXXXXXX` (wa.me / tel: friendly).
export function formatIndianPhone(phone?: string | null): string | null {
  if (!phone) return null;
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11 && cleaned.startsWith("0")) cleaned = cleaned.slice(1);
  if (cleaned.startsWith("91") && cleaned.length === 12) return cleaned;
  if (cleaned.length === 10) return `91${cleaned}`;
  return null;
}
