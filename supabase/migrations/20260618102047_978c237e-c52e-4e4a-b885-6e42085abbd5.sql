CREATE TABLE public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  requirement_type TEXT NOT NULL DEFAULT 'General Enquiry',
  location TEXT DEFAULT '',
  budget TEXT DEFAULT '',
  message TEXT DEFAULT '',
  source TEXT DEFAULT '',
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  property_title TEXT DEFAULT '',
  page_url TEXT DEFAULT '',
  user_agent TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'New',
  notes TEXT DEFAULT '',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.enquiries TO authenticated;
GRANT INSERT ON public.enquiries TO anon;
GRANT ALL ON public.enquiries TO service_role;

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "enquiries public insert" ON public.enquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "enquiries admin read" ON public.enquiries
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "enquiries admin update" ON public.enquiries
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "enquiries admin delete" ON public.enquiries
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "enquiries owner read" ON public.enquiries
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE INDEX idx_enquiries_created ON public.enquiries(created_at DESC);
CREATE INDEX idx_enquiries_status ON public.enquiries(status);

CREATE TRIGGER trg_enquiries_updated
  BEFORE UPDATE ON public.enquiries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();