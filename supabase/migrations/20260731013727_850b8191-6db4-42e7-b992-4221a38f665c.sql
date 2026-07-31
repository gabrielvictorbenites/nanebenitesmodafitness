-- Tighten table privileges: visitors (anon) get read-only where public, writes only for signed-in users gated by admin role policies.
REVOKE INSERT, UPDATE, DELETE ON public.products, public.product_media, public.banners, public.site_content, public.custom_fields, public.whatsapp_templates, public.user_roles FROM anon;
REVOKE SELECT, UPDATE, DELETE ON public.leads FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.whatsapp_templates FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM authenticated;

GRANT SELECT ON public.products, public.product_media, public.banners, public.site_content, public.custom_fields TO anon;
GRANT INSERT ON public.leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products, public.product_media, public.banners, public.site_content, public.custom_fields, public.whatsapp_templates, public.leads TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.products, public.product_media, public.banners, public.site_content, public.custom_fields, public.whatsapp_templates, public.leads, public.user_roles TO service_role;

-- WhatsApp message templates are an admin tool: no public read.
DROP POLICY IF EXISTS "whatsapp_templates public read" ON public.whatsapp_templates;
CREATE POLICY "whatsapp_templates admin select" ON public.whatsapp_templates
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Public catalog reads stay open to visitors, but explicitly scoped to anon+authenticated.
DROP POLICY IF EXISTS "product_media public read" ON public.product_media;
CREATE POLICY "product_media public read" ON public.product_media FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "banners public read" ON public.banners;
CREATE POLICY "banners public read" ON public.banners FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "site_content public read" ON public.site_content;
CREATE POLICY "site_content public read" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "custom_fields public read" ON public.custom_fields;
CREATE POLICY "custom_fields public read" ON public.custom_fields FOR SELECT TO anon, authenticated USING (true);