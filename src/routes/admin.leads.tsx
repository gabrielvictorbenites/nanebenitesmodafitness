import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Download, Mail, MessageCircle, Phone, Search, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/leads")({
  ssr: false,
  component: LeadsPage,
});

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  status: string;
  created_at: string;
};

const STATUSES: { value: string; label: string; className: string }[] = [
  { value: "new", label: "Novo", className: "bg-blue-100 text-blue-800" },
  { value: "contacted", label: "Contatado", className: "bg-amber-100 text-amber-800" },
  { value: "converted", label: "Convertido", className: "bg-emerald-100 text-emerald-800" },
  { value: "archived", label: "Arquivado", className: "bg-neutral-200 text-neutral-700" },
];

function statusMeta(s: string) {
  return STATUSES.find((x) => x.value === s) ?? { value: s, label: s, className: "bg-neutral-100 text-neutral-700" };
}

function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("id,name,email,phone,message,source,status,created_at")
      .order("created_at", { ascending: false });
    if (!error && data) setLeads(data as Lead[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (!term) return true;
      return (
        l.name.toLowerCase().includes(term) ||
        l.email.toLowerCase().includes(term) ||
        l.phone.toLowerCase().includes(term) ||
        l.message.toLowerCase().includes(term)
      );
    });
  }, [leads, q, statusFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length };
    STATUSES.forEach((s) => (c[s.value] = 0));
    leads.forEach((l) => (c[l.status] = (c[l.status] ?? 0) + 1));
    return c;
  }, [leads]);

  async function updateStatus(id: string, status: string) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await supabase.from("leads").update({ status }).eq("id", id);
  }

  async function remove(id: string) {
    if (!confirm("Excluir este lead?")) return;
    setLeads((prev) => prev.filter((l) => l.id !== id));
    await supabase.from("leads").delete().eq("id", id);
  }

  function exportCSV() {
    const header = ["Data", "Nome", "E-mail", "Telefone", "Origem", "Status", "Mensagem"];
    const rows = filtered.map((l) => [
      new Date(l.created_at).toLocaleString("pt-BR"),
      l.name,
      l.email,
      l.phone,
      l.source,
      statusMeta(l.status).label,
      l.message.replace(/\s+/g, " "),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">Leads</h1>
          <p className="mt-1 text-sm text-neutral-500">Contatos recebidos pelo site e WhatsApp.</p>
        </div>
        <button
          onClick={exportCSV}
          disabled={filtered.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" /> Exportar CSV
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <FilterChip active={statusFilter === "all"} onClick={() => setStatusFilter("all")} label={`Todos (${counts.all})`} />
        {STATUSES.map((s) => (
          <FilterChip
            key={s.value}
            active={statusFilter === s.value}
            onClick={() => setStatusFilter(s.value)}
            label={`${s.label} (${counts[s.value] ?? 0})`}
          />
        ))}
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3">
        <Search className="h-4 w-4 text-neutral-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nome, e-mail, telefone ou mensagem…"
          className="h-11 w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        {loading ? (
          <div className="p-8 text-center text-sm text-neutral-500">Carregando…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-neutral-500">Nenhum lead encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
                <th className="px-4 py-3 font-semibold">Contato</th>
                <th className="px-4 py-3 font-semibold">Mensagem</th>
                <th className="px-4 py-3 font-semibold">Origem</th>
                <th className="px-4 py-3 font-semibold">Data</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => {
                const meta = statusMeta(l.status);
                const waPhone = l.phone.replace(/\D/g, "");
                return (
                  <tr key={l.id} className="border-b border-neutral-100 align-top last:border-b-0 hover:bg-neutral-50/50">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-neutral-900">{l.name || "-"}</p>
                      {l.email ? (
                        <a href={`mailto:${l.email}`} className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800">
                          <Mail className="h-3 w-3" /> {l.email}
                        </a>
                      ) : null}
                      {l.phone ? (
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-500">
                          <Phone className="h-3 w-3" /> {l.phone}
                        </p>
                      ) : null}
                    </td>
                    <td className="max-w-md px-4 py-4 text-xs text-neutral-600">
                      <p className="line-clamp-3 whitespace-pre-wrap">{l.message || "-"}</p>
                    </td>
                    <td className="px-4 py-4 text-xs text-neutral-500">{l.source || "site"}</td>
                    <td className="px-4 py-4 text-xs text-neutral-500">{new Date(l.created_at).toLocaleString("pt-BR")}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${meta.className}`}>
                        {meta.label}
                      </span>
                      <select
                        value={l.status}
                        onChange={(e) => updateStatus(l.id, e.target.value)}
                        className="mt-2 block w-full rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-700 focus:border-neutral-900 focus:outline-none"
                      >
                        {STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        {waPhone ? (
                          <a
                            href={`https://wa.me/${waPhone.length <= 11 ? "55" + waPhone : waPhone}`}
                            target="_blank"
                            rel="noreferrer"
                            title="WhatsApp"
                            className="rounded-md p-1.5 text-neutral-500 hover:bg-emerald-50 hover:text-emerald-600"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>
                        ) : null}
                        <button
                          onClick={() => remove(l.id)}
                          title="Excluir"
                          className="rounded-md p-1.5 text-neutral-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-neutral-900 bg-neutral-900 text-white"
          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900"
      }`}
    >
      {label}
    </button>
  );
}