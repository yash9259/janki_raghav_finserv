ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS pan text;
CREATE INDEX IF NOT EXISTS leads_pan_idx ON public.leads (upper(pan));