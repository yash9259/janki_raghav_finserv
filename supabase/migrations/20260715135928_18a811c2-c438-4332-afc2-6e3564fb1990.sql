REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

DROP POLICY IF EXISTS "Public read published" ON public.brochures;
CREATE POLICY "Public read published brochures"
  ON public.brochures FOR SELECT
  TO anon, authenticated
  USING (status = 'Published');

CREATE POLICY "Admins read all brochures"
  ON public.brochures FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));