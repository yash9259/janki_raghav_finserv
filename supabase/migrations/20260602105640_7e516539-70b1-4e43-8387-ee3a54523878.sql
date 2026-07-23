
-- Enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles self select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Profiles self update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- has_role helper
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Auto-create profile and make first user admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE user_count INT;
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));

  SELECT COUNT(*) INTO user_count FROM auth.users;
  IF user_count <= 1 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Interest rates
CREATE TABLE public.interest_rates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  min_roi NUMERIC(5,2) NOT NULL,
  max_roi NUMERIC(5,2) NOT NULL,
  processing TEXT NOT NULL,
  tenure TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.interest_rates TO anon, authenticated;
GRANT ALL ON public.interest_rates TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.interest_rates TO authenticated;
ALTER TABLE public.interest_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read rates" ON public.interest_rates FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin write rates" ON public.interest_rates FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update rates" ON public.interest_rates FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete rates" ON public.interest_rates FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Brochures
CREATE TABLE public.brochures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  builder TEXT NOT NULL,
  location TEXT NOT NULL,
  project_type TEXT NOT NULL DEFAULT 'Residential',
  price TEXT,
  configs TEXT,
  possession TEXT,
  rera TEXT,
  pdf_url TEXT,
  image_url TEXT,
  views INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.brochures TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.brochures TO authenticated;
GRANT ALL ON public.brochures TO service_role;
ALTER TABLE public.brochures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published" ON public.brochures FOR SELECT TO anon, authenticated USING (status = 'Published' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin insert brochures" ON public.brochures FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update brochures" ON public.brochures FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete brochures" ON public.brochures FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Leads
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  product TEXT,
  amount TEXT,
  message TEXT,
  source TEXT NOT NULL DEFAULT 'Website',
  stage TEXT NOT NULL DEFAULT 'New',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert leads" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admin read leads" ON public.leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update leads" ON public.leads FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete leads" ON public.leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- updated_at triggers
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER touch_brochures BEFORE UPDATE ON public.brochures FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_rates BEFORE UPDATE ON public.interest_rates FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed interest rates
INSERT INTO public.interest_rates (id, name, min_roi, max_roi, processing, tenure, sort_order) VALUES
  ('home','Home Loan',8.40,9.75,'0.50%','Up to 30 yrs',1),
  ('car','Car Loan',8.75,11.50,'1.00%','Up to 7 yrs',2),
  ('business','Business Loan',11.99,18.00,'1.50%','Up to 5 yrs',3),
  ('personal','Personal Loan',10.50,16.00,'1.25%','Up to 6 yrs',4),
  ('lap','Loan Against Property',9.25,12.50,'0.75%','Up to 15 yrs',5),
  ('edu','Education Loan',9.50,13.00,'1.00%','Up to 10 yrs',6),
  ('gold','Gold Loan',8.90,14.00,'0.30%','Up to 3 yrs',7);

-- Seed a few sample brochures
INSERT INTO public.brochures (name, builder, location, project_type, price, configs, possession, rera, status) VALUES
  ('Lodha Belmondo','Lodha Group','Pune','Residential','₹2.4 Cr','3, 4 BHK','Dec 2026','P52100012345','Published'),
  ('Prestige Falcon City','Prestige Estates','Bengaluru','Residential','₹1.8 Cr','2, 3, 4 BHK','Jun 2027','PRM/KA/RERA/22345','Published'),
  ('DLF Camellias','DLF Limited','Gurugram','Luxury','₹12 Cr','4, 5 BHK','Ready to move','RC/REP/HARERA/445','Published');
