
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS top_featured_rank smallint;

CREATE UNIQUE INDEX IF NOT EXISTS properties_top_featured_rank_uniq
  ON public.properties (top_featured_rank)
  WHERE is_top_featured = true AND top_featured_rank IS NOT NULL;

CREATE OR REPLACE FUNCTION public.enforce_top_featured_limit()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  active_count int;
BEGIN
  IF NEW.is_top_featured = true
     AND (TG_OP = 'INSERT' OR COALESCE(OLD.is_top_featured, false) = false) THEN
    SELECT count(*) INTO active_count
    FROM public.properties
    WHERE is_top_featured = true
      AND id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);
    IF active_count >= 10 THEN
      RAISE EXCEPTION 'You can add only 10 properties in the Top 10 Featured Properties section. Please remove or disable one property before adding a new one.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_top_featured_limit_trg ON public.properties;
CREATE TRIGGER enforce_top_featured_limit_trg
  BEFORE INSERT OR UPDATE OF is_top_featured ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.enforce_top_featured_limit();
