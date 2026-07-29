-- Tighten leads insert policies: remove permissive 'auth insert' with no ownership, and add validation to anon insert
DROP POLICY IF EXISTS "leads auth insert" ON public.leads;
DROP POLICY IF EXISTS "leads public insert" ON public.leads;

CREATE POLICY "leads public insert validated" ON public.leads
  FOR INSERT TO anon
  WITH CHECK (
    length(name) BETWEEN 1 AND 200
    AND length(coalesce(message, '')) <= 5000
    AND length(coalesce(phone, '')) <= 50
    AND length(coalesce(email, '')) <= 320
    AND length(coalesce(source, '')) <= 100
    AND status = 'new'
  );

-- Restrict SECURITY DEFINER function execution: anon cannot call has_role.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
