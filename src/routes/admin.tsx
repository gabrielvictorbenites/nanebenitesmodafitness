import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/lib/admin-auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin - Nane Benites" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { checking, userId, email, isAdmin, signOut } = useAdminAuth();

  if (checking) {
    return <div className="grid min-h-screen place-items-center bg-neutral-50 text-sm text-neutral-500">Carregando…</div>;
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
        <Login />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-neutral-50 px-4 text-center font-sans">
        <div className="max-w-sm">
          <h1 className="font-display text-2xl font-bold text-neutral-900">Acesso restrito</h1>
          <p className="mt-2 text-sm text-neutral-500">Sua conta não tem permissão de administrador.</p>
          <button
            onClick={signOut}
            className="mt-6 h-10 rounded-lg border border-neutral-300 bg-white px-4 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

  return <AdminShell email={email} signOut={signOut} />;
}

function AdminShell({ email, signOut }: { email: string | null; signOut: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      <AdminSidebar email={email} onSignOut={signOut} open={open} onClose={() => setOpen(false)} />
      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            className="rounded-lg border border-neutral-200 p-2 text-neutral-700"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display text-sm font-bold tracking-widest">NANE BENITES</span>
        </header>
        <main className="min-h-screen overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setErr("E-mail ou senha inválidos.");
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-lg font-semibold">Painel</h1>
        <p className="mt-1 text-xs text-neutral-500">Acesso restrito</p>
        <label className="mt-6 block text-xs font-medium text-neutral-600">E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm focus:border-neutral-900 focus:outline-none"
          required
        />
        <label className="mt-4 block text-xs font-medium text-neutral-600">Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm focus:border-neutral-900 focus:outline-none"
          required
        />
        {err ? <p className="mt-3 text-xs text-red-600">{err}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 h-11 w-full rounded-lg bg-neutral-900 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
