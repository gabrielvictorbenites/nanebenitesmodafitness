import { createFileRoute } from "@tanstack/react-router";

const ADMIN_EMAIL = "nanebenites@yahoo.com";
const ADMIN_PASSWORD = "nanebenitesadm";

export const Route = createFileRoute("/api/public/admin-bootstrap")({
  server: {
    handlers: {
      GET: async () => handle(),
      POST: async () => handle(),
    },
  },
});

async function handle(): Promise<Response> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Try to find existing user by email via listUsers (email filter).
    let userId: string | null = null;
    const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (listErr) throw listErr;
    const existing = list.users.find((u) => (u.email ?? "").toLowerCase() === ADMIN_EMAIL);
    if (existing) {
      userId = existing.id;
    } else {
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
      });
      if (createErr) throw createErr;
      userId = created.user?.id ?? null;
    }

    if (!userId) throw new Error("no user id");

    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
    if (roleErr) throw roleErr;

    return Response.json({ ok: true, userId });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}