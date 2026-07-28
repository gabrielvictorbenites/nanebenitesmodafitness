import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Plus, Save, Send, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/templates")({
  ssr: false,
  component: TemplatesPage,
});

type Template = {
  id: string;
  key: string;
  label: string;
  body: string;
  description: string;
};

const VARIABLES = [
  { key: "{{nome}}", desc: "Nome do cliente" },
  { key: "{{produto}}", desc: "Nome do produto" },
  { key: "{{codigo}}", desc: "Código / SKU" },
  { key: "{{preco}}", desc: "Preço" },
  { key: "{{loja}}", desc: "Loja" },
  { key: "{{link}}", desc: "Link" },
];

const DEFAULTS: Omit<Template, "id">[] = [
  {
    key: "boas-vindas",
    label: "Boas-vindas",
    description: "Primeiro contato com o cliente",
    body: "Olá {{nome}}! 💜 Aqui é da Nane Benites Moda Fitness. Muito obrigada pelo seu contato! Como posso te ajudar hoje?",
  },
  {
    key: "produto-disponivel",
    label: "Produto disponível",
    description: "Confirmar disponibilidade",
    body: "Oi {{nome}}! O produto *{{produto}}* (código {{codigo}}) está disponível por {{preco}}. Deseja garantir o seu?",
  },
  {
    key: "pos-venda",
    label: "Pós-venda",
    description: "Agradecimento após a compra",
    body: "Olá {{nome}}, obrigada pela sua compra na Nane Benites! 💖 Esperamos que ame a sua nova peça. Qualquer coisa, é só chamar!",
  },
];

function renderBody(body: string, vars: Record<string, string>) {
  return body.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`);
}

function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return digits.length <= 11 ? "55" + digits : digits;
}

function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [vars, setVars] = useState<Record<string, string>>({});

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("whatsapp_templates")
      .select("id,key,label,body,description")
      .order("label");
    let list = (data ?? []) as Template[];
    if (list.length === 0) {
      // seed defaults
      const { data: inserted } = await supabase
        .from("whatsapp_templates")
        .insert(DEFAULTS)
        .select("id,key,label,body,description");
      list = (inserted ?? []) as Template[];
    }
    setTemplates(list);
    setSelectedId((prev) => prev ?? list[0]?.id ?? null);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const selected = useMemo(
    () => templates.find((t) => t.id === selectedId) ?? null,
    [templates, selectedId]
  );

  function update(id: string, patch: Partial<Template>) {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  async function save(t: Template) {
    await supabase
      .from("whatsapp_templates")
      .update({ key: t.key, label: t.label, body: t.body, description: t.description })
      .eq("id", t.id);
  }

  async function addNew() {
    const key = `template-${Date.now()}`;
    const { data } = await supabase
      .from("whatsapp_templates")
      .insert({ key, label: "Novo template", body: "Olá {{nome}}!", description: "" })
      .select("id,key,label,body,description")
      .single();
    if (data) {
      setTemplates((prev) => [...prev, data as Template]);
      setSelectedId((data as Template).id);
    }
  }

  async function remove(id: string) {
    if (!confirm("Excluir este template?")) return;
    await supabase.from("whatsapp_templates").delete().eq("id", id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  const preview = selected ? renderBody(selected.body, vars) : "";

  function openWhatsApp() {
    if (!selected) return;
    const wa = normalizePhone(phone);
    const text = encodeURIComponent(preview);
    const url = wa ? `https://wa.me/${wa}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, "_blank", "noreferrer");
  }

  function insertVariable(v: string) {
    if (!selected) return;
    update(selected.id, { body: selected.body + " " + v });
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">Templates WhatsApp</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Crie mensagens prontas com variáveis e envie personalizadas para os clientes.
          </p>
        </div>
        <button
          onClick={addNew}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-medium text-white hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" /> Novo template
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
          Carregando…
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-2">
            {templates.map((t) => {
              const active = t.id === selectedId;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className={`flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition-colors ${
                    active
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300"
                  }`}
                >
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{t.label || "Sem título"}</p>
                    <p className={`truncate text-[11px] ${active ? "text-white/70" : "text-neutral-500"}`}>
                      {t.description || t.key}
                    </p>
                  </div>
                </button>
              );
            })}
            {templates.length === 0 ? (
              <p className="rounded-xl border border-dashed border-neutral-300 p-4 text-center text-xs text-neutral-500">
                Nenhum template ainda.
              </p>
            ) : null}
          </aside>

          {selected ? (
            <div className="grid gap-6 xl:grid-cols-2">
              <section className="rounded-xl border border-neutral-200 bg-white p-5">
                <h2 className="text-sm font-semibold text-neutral-900">Editar template</h2>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-neutral-600">Nome</label>
                    <input
                      value={selected.label}
                      onChange={(e) => update(selected.id, { label: e.target.value })}
                      className="mt-1 h-10 w-full rounded-lg border border-neutral-300 px-3 text-sm focus:border-neutral-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-600">Descrição</label>
                    <input
                      value={selected.description}
                      onChange={(e) => update(selected.id, { description: e.target.value })}
                      className="mt-1 h-10 w-full rounded-lg border border-neutral-300 px-3 text-sm focus:border-neutral-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-600">Mensagem</label>
                    <textarea
                      value={selected.body}
                      onChange={(e) => update(selected.id, { body: e.target.value })}
                      rows={9}
                      className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-600">Variáveis (clique para inserir)</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {VARIABLES.map((v) => (
                        <button
                          key={v.key}
                          onClick={() => insertVariable(v.key)}
                          title={v.desc}
                          className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-mono text-neutral-700 hover:border-neutral-400"
                        >
                          {v.key}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => remove(selected.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Excluir
                    </button>
                    <button
                      onClick={() => save(selected)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-medium text-white hover:opacity-90"
                    >
                      <Save className="h-3.5 w-3.5" /> Salvar
                    </button>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-neutral-200 bg-white p-5">
                <h2 className="text-sm font-semibold text-neutral-900">Enviar para cliente</h2>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-neutral-600">Telefone (com DDD)</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(45) 99999-9999"
                      className="mt-1 h-10 w-full rounded-lg border border-neutral-300 px-3 text-sm focus:border-neutral-900 focus:outline-none"
                    />
                  </div>
                  {VARIABLES.map((v) => {
                    const key = v.key.replace(/[{}]/g, "");
                    if (!selected.body.includes(v.key)) return null;
                    return (
                      <div key={v.key}>
                        <label className="text-xs font-medium text-neutral-600">
                          {v.desc} <span className="font-mono text-[10px] text-neutral-400">{v.key}</span>
                        </label>
                        <input
                          value={vars[key] ?? ""}
                          onChange={(e) => setVars((p) => ({ ...p, [key]: e.target.value }))}
                          className="mt-1 h-10 w-full rounded-lg border border-neutral-300 px-3 text-sm focus:border-neutral-900 focus:outline-none"
                        />
                      </div>
                    );
                  })}
                  <div>
                    <p className="text-xs font-medium text-neutral-600">Pré-visualização</p>
                    <div className="mt-1 whitespace-pre-wrap rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 text-sm text-neutral-800">
                      {preview || "—"}
                    </div>
                  </div>
                  <button
                    onClick={openWhatsApp}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    <Send className="h-4 w-4" /> Abrir no WhatsApp
                  </button>
                </div>
              </section>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">
              Selecione um template ao lado ou crie um novo.
            </div>
          )}
        </div>
      )}
    </div>
  );
}