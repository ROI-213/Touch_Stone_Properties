
ALTER TABLE public.success_stories
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS badge_text text,
  ADD COLUMN IF NOT EXISTS client_label text,
  ADD COLUMN IF NOT EXISTS services_provided jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS button_text text,
  ADD COLUMN IF NOT EXISTS contact_button_link text,
  ADD COLUMN IF NOT EXISTS whatsapp_number text,
  ADD COLUMN IF NOT EXISTS whatsapp_link text;

-- Backfill slug for existing rows
UPDATE public.success_stories
SET slug = lower(regexp_replace(coalesce(slug, title), '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL OR slug = '';

CREATE UNIQUE INDEX IF NOT EXISTS success_stories_slug_uidx ON public.success_stories (slug);
