import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Shield, UserPlus, Trash2, KeyRound, Loader2, Mail, Clock, Crown } from "lucide-react";
import { toast } from "sonner";
import {
  listAdmins,
  grantAdmin,
  revokeAdmin,
  sendAdminPasswordReset,
  type AdminUser,
} from "@/lib/admin-users.functions";

export const Route = createFileRoute("/admin/usuarios")({
  ssr: false,
  component: UsuariosAdmin,
});

function UsuariosAdmin() {
  const fetchAdmins = useServerFn(listAdmins);
  const doGrant = useServerFn(grantAdmin);
  const doRevoke = useServerFn(revokeAdmin);
  const doReset = useServerFn(sendAdminPasswordReset);

  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const rows = await fetchAdmins();
      setAdmins(rows);
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao carregar administradores");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void refresh(); }, []);

  async function handleGrant(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    try {
      await doGrant({ data: { email: email.trim() } });
      toast.success("Administrador adicionado.");
      setEmail("");
      await refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Falha ao adicionar administrador");
    } finally {
      setBusy(false);
    }
  }

  async function handleRevoke(u: AdminUser) {
    if (!confirm(`Remover acesso admin de ${u.email}?`)) return;
    try {
      await doRevoke({ data: { userId: u.id } });
      toast.success("Acesso removido.");
      await refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Falha ao remover");
    }
  }

  async function handleReset(u: AdminUser) {
    try {
      await doReset({ data: { email: u.email } });
      toast.success(`Link de redefinição gerado para ${u.email}.`);
    } catch (e: any) {
      toast.error(e.message ?? "Falha ao gerar link");
    }
  }

  return (
    <div className="px-8 py-10">
      <header className="flex items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-neutral-900">Administradores</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Controle quem pode acessar o painel e gerenciar o site.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1FB6B6] to-[#8B5CF6] px-4 py-2 text-xs font-semibold text-white shadow-sm">
          <Shield className="h-4 w-4" /> {admins.length} ativo{admins.length === 1 ? "" : "s"}
        </div>
      </header>

      <form
        onSubmit={handleGrant}
        className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5"
      >
        <div className="flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-[#8B5CF6]" />
          <h2 className="font-display text-lg font-semibold text-neutral-900">Adicionar administrador</h2>
        </div>
        <p className="mt-1 text-xs text-neutral-500">
          O usuário precisa já ter criado uma conta no site. Digite o e-mail cadastrado para promovê-lo.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemplo@nanebenites.com"
            className="flex-1 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
          />
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1FB6B6] to-[#8B5CF6] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            Promover
          </button>
        </div>
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-neutral-900">Equipe atual</h2>
          <p className="text-xs text-neutral-500">Cada administrador tem acesso total ao painel.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-sm text-neutral-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Carregando...
          </div>
        ) : admins.length === 0 ? (
          <div className="py-12 text-center text-sm text-neutral-500">Nenhum administrador encontrado.</div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {admins.map((u) => (
              <li key={u.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1FB6B6] to-[#8B5CF6] text-sm font-semibold text-white">
                  {(u.email[0] ?? "?").toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-neutral-900">{u.email}</p>
                    {u.is_self && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                        <Crown className="h-3 w-3" /> Você
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-neutral-500">
                    <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {u.email}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Último acesso: {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString("pt-BR") : "nunca"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleReset(u)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-neutral-400"
                    title="Enviar redefinição de senha"
                  >
                    <KeyRound className="h-3.5 w-3.5" /> Redefinir senha
                  </button>
                  <button
                    type="button"
                    disabled={u.is_self}
                    onClick={() => handleRevoke(u)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    title={u.is_self ? "Você não pode remover a si mesmo" : "Remover acesso"}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-6 text-xs text-neutral-500">
        Segurança: acesso restrito. Apenas administradores autenticados podem ver, promover ou remover outros
        administradores. É preciso manter ao menos um administrador ativo.
      </p>
    </div>
  );
}