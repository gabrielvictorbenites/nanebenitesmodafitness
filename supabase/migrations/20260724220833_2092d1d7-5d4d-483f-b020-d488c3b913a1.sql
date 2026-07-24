
-- =========================================================
-- FASE 1 — Fundação de dados do painel admin
-- =========================================================

-- Coluna "destaque" em products (separada de is_bestseller)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;

-- =========================================================
-- SITE_CONTENT (chave/valor JSON por seção)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_content public read" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "site_content admin insert" ON public.site_content FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "site_content admin update" ON public.site_content FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "site_content admin delete" ON public.site_content FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER site_content_updated BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- BANNERS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  eyebrow text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  cta_label text NOT NULL DEFAULT '',
  cta_href text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.banners TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.banners TO authenticated;
GRANT ALL ON public.banners TO service_role;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "banners public read" ON public.banners FOR SELECT USING (true);
CREATE POLICY "banners admin insert" ON public.banners FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "banners admin update" ON public.banners FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "banners admin delete" ON public.banners FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER banners_updated BEFORE UPDATE ON public.banners FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- LEADS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT 'contato',
  status text NOT NULL DEFAULT 'new',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads public insert" ON public.leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "leads auth insert" ON public.leads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "leads admin select" ON public.leads FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "leads admin update" ON public.leads FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "leads admin delete" ON public.leads FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER leads_updated BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX IF NOT EXISTS leads_created_idx ON public.leads(created_at DESC);

-- =========================================================
-- CUSTOM_FIELDS (marcas / categorias / coleções)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.custom_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  field_type text NOT NULL,
  slug text NOT NULL,
  label text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (field_type, slug)
);
GRANT SELECT ON public.custom_fields TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.custom_fields TO authenticated;
GRANT ALL ON public.custom_fields TO service_role;
ALTER TABLE public.custom_fields ENABLE ROW LEVEL SECURITY;
CREATE POLICY "custom_fields public read" ON public.custom_fields FOR SELECT USING (true);
CREATE POLICY "custom_fields admin insert" ON public.custom_fields FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "custom_fields admin update" ON public.custom_fields FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "custom_fields admin delete" ON public.custom_fields FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER custom_fields_updated BEFORE UPDATE ON public.custom_fields FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- WHATSAPP_TEMPLATES
-- =========================================================
CREATE TABLE IF NOT EXISTS public.whatsapp_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  label text NOT NULL,
  body text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.whatsapp_templates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.whatsapp_templates TO authenticated;
GRANT ALL ON public.whatsapp_templates TO service_role;
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "whatsapp_templates public read" ON public.whatsapp_templates FOR SELECT USING (true);
CREATE POLICY "whatsapp_templates admin insert" ON public.whatsapp_templates FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "whatsapp_templates admin update" ON public.whatsapp_templates FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "whatsapp_templates admin delete" ON public.whatsapp_templates FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER whatsapp_templates_updated BEFORE UPDATE ON public.whatsapp_templates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- PRODUCT_MEDIA
-- =========================================================
CREATE TABLE IF NOT EXISTS public.product_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url text NOT NULL,
  media_type text NOT NULL DEFAULT 'image',
  sort_order int NOT NULL DEFAULT 0,
  is_cover boolean NOT NULL DEFAULT false,
  alt text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.product_media TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_media TO authenticated;
GRANT ALL ON public.product_media TO service_role;
ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "product_media public read" ON public.product_media FOR SELECT USING (true);
CREATE POLICY "product_media admin insert" ON public.product_media FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "product_media admin update" ON public.product_media FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "product_media admin delete" ON public.product_media FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER product_media_updated BEFORE UPDATE ON public.product_media FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX IF NOT EXISTS product_media_product_idx ON public.product_media(product_id, sort_order);

-- =========================================================
-- SEED: site_content
-- =========================================================
INSERT INTO public.site_content (key, content) VALUES
  ('home_hero', jsonb_build_object(
    'eyebrow','Coleção 2026',
    'title_line1','Vista sua',
    'title_line2','melhor versão.',
    'subtitle','Moda fitness premium para mulheres que treinam com estilo. Curadoria exclusiva das melhores marcas em peças que unem performance, conforto e sofisticação.',
    'cta_primary_label','Ver Catálogo',
    'cta_primary_href','/catalogo',
    'cta_secondary_label','Chamar no WhatsApp'
  )),
  ('sobre', jsonb_build_object(
    'title','Sobre a Nane Benites',
    'body','Somos uma loja de moda fitness em Curitiba e Campo Largo, com curadoria pessoal da Nane e marcas selecionadas para performance e estilo.'
  )),
  ('contato', jsonb_build_object(
    'title','Fale com a gente',
    'body','Atendimento consultivo pelo WhatsApp e nas duas lojas físicas.'
  )),
  ('footer', jsonb_build_object(
    'about','Nane Benites Moda Fitness — moda fitness premium com curadoria e atendimento pessoal.',
    'creator','Site por Gabriel Benites'
  )),
  ('stores', jsonb_build_array(
    jsonb_build_object('label','Curitiba','street','Rua Major Heitor Guimarães, 1740','neighborhood','Campina do Siqueira','city','Curitiba — PR','hours_weekday','09h às 19h','hours_saturday','09h às 14h'),
    jsonb_build_object('label','Campo Largo','street','Av. Des. Clotário Portugal, 501','neighborhood','Centro','city','Campo Largo — PR','hours_weekday','09h às 19h','hours_saturday','09h às 14h')
  ))
ON CONFLICT (key) DO NOTHING;

-- =========================================================
-- SEED: custom_fields (marcas + categorias)
-- =========================================================
INSERT INTO public.custom_fields (field_type, slug, label, sort_order) VALUES
  ('brand','lanca-perfume','Lança Perfume',1),
  ('brand','run-more','Run More',2),
  ('brand','mulher-elastica','Mulher Elástica',3),
  ('brand','zero-acucar','Zero Açúcar',4),
  ('brand','lets-gym','Let''s Gym',5),
  ('category','leggings','Leggings',1),
  ('category','tops','Tops',2),
  ('category','shorts','Shorts',3),
  ('category','conjuntos','Conjuntos',4),
  ('category','macacoes','Macacões',5),
  ('category','camisetas','Camisetas',6),
  ('category','jaquetas','Jaquetas',7),
  ('category','tenis','Tênis',8),
  ('category','bolsas','Bolsas',9),
  ('category','acessorios','Acessórios',10)
ON CONFLICT (field_type, slug) DO NOTHING;

-- =========================================================
-- SEED: whatsapp_templates
-- =========================================================
INSERT INTO public.whatsapp_templates (key, label, body, description) VALUES
  ('default_product','Interesse em produto','Olá! Tenho interesse no produto *{produto}* ({preco}). Está disponível?','Enviado ao clicar em Chamar no WhatsApp na página do produto.'),
  ('default_general','Contato geral','Olá! Gostaria de conhecer as novidades da Nane Benites.','Botão de WhatsApp do site em geral.'),
  ('default_favorites','Favoritos','Olá! Selecionei alguns favoritos e gostaria de mais informações: {produtos}','Enviado ao pedir orçamento pelos favoritos.')
ON CONFLICT (key) DO NOTHING;

-- =========================================================
-- SEED: product_media (a partir das colunas image + gallery)
-- =========================================================
INSERT INTO public.product_media (product_id, url, sort_order, is_cover)
SELECT id, image, 0, true
FROM public.products
WHERE image IS NOT NULL AND image <> ''
ON CONFLICT DO NOTHING;

INSERT INTO public.product_media (product_id, url, sort_order, is_cover)
SELECT p.id, g.url, g.ord, false
FROM public.products p
CROSS JOIN LATERAL unnest(p.gallery) WITH ORDINALITY AS g(url, ord)
WHERE p.gallery IS NOT NULL AND array_length(p.gallery, 1) > 0;
