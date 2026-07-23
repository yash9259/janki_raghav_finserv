
CREATE POLICY "Public read brochures bucket" ON storage.objects
FOR SELECT TO anon, authenticated USING (bucket_id = 'brochures');

CREATE POLICY "Admin upload brochures" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'brochures' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin update brochures" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'brochures' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin delete brochures" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'brochures' AND public.has_role(auth.uid(), 'admin'));
