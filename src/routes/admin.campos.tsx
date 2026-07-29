import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Trash2, Check, GripVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type FieldType = "category" | "brand" | "color" | "size";

type CustomField = {
  id: string;
  field_type: string;
  slug: string;
  label: string;
  sort_order: number;
  active: boolean;
  metadata: Record<string, any>;
};

const TABS: { key: FieldType; label: string; description: string }[] = [
  { key: "category", label: "Categorias", description: "Categorias de produtos usadas no menu e no catálogo." },
  { key: "brand", label: "Marcas", description: "Marcas parceiras exibidas nos filtros do catálogo." },
  { key: "color", label: "Cores", description: "Cores disponíveis no seletor de produtos." },
  { key: "size", label: "Tamanhos", description: "Tamanhos disponíveis no seletor de produtos." },
];

function slugify(s: string) {
  return s
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const Route = createFileRoute("/admin/campos")({
  ssr: false,
  component: CamposPage,
});

function CamposPage() {
  const [tab, setTab] = useState<FieldType>("category");
  return (
    <div className="mx-auto max-w-5xl p-6 md:p-10">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-neutral-900">Campos personalizados</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Gerencie categorias, marcas, cores e tamanhos disponíveis no cadastro de produtos e nos filtros do site.
        </p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-neutral-200">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={
                "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors " +
                (active
                  ? "border-cyan-500 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-800")
              }
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <FieldsPanel
        key={tab}
        fieldType={tab}
        description={TABS.find((t) => t.key === tab)!.description}
      />
    </div>
  );
}

function FieldsPanel({ fieldType, description }: { fieldType: FieldType; description: string }) {
  const [rows, setRows] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [adding, setAdding] = useState(false);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const { data, error } = await supabase
        .from("custom_fields")
        .select("*")
        .eq("field_type", fieldType)
        .order("sort_order", { ascending: true })
        .order("label", { ascending: true });
      if (error) throw error;
      setRows((data ?? []) as CustomField[]);
    } catch (e: any) {
      setErr(e?.message ?? "Falha ao carregar");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [fieldType]);

  const maxOrder = useMemo(
    () => rows.reduce((m, r) => Math.max(m, r.sort_order), 0),
    [rows],
  );

  async function onAdd() {
    const label = newLabel.trim();
    if (!label) return;
    setAdding(true);
    setErr(null);
    try {
      const baseSlug = slugify(label) || `item-${Date.now()}`;
      let slug = baseSlug;
      let i = 2;
      while (rows.some((r) => r.slug === slug)) slug = `${baseSlug}-${i++}`;
      const { error } = await supabase.from("custom_fields").insert({
        field_type: fieldType,
        slug,
        label,
        sort_order: maxOrder + 1,
        active: true,
        metadata: {},
      });
      if (error) throw error;
      setNewLabel("");
      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Falha ao adicionar");
    } finally {
      setAdding(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Remover este item?")) return;
    const { error } = await supabase.from("custom_fields").delete().eq("id", id);
    if (error) {
      setErr(error.message);
      return;
    }
    await load();
  }

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6">
      <p className="mb-5 text-sm text-neutral-600">{description}</p>

      <div className="mb-5 flex flex-wrap gap-2">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onAdd();
          }}
          placeholder="Novo item (ex: Leggings)"
          className="flex-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
        <button
          type="button"
          onClick={onAdd}
          disabled={!newLabel.trim() || adding}
          className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
        >
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Adicionar
        </button>
      </div>

      {err ? <p className="mb-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</p> : null}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
        </div>
      ) : rows.length === 0 ? (
        <p className="rounded-md bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-500">
          Nenhum item cadastrado ainda. Use o campo acima para adicionar o primeiro.
        </p>
      ) : (
        <ul className="divide-y divide-neutral-100 rounded-md border border-neutral-200">
          {rows.map((row) => (
            <FieldRow key={row.id} row={row} onDelete={() => onDelete(row.id)} onSaved={load} />
          ))}
        </ul>
      )}
    </section>
  );
}

function FieldRow({
  row,
  onDelete,
  onSaved,
}: {
  row: CustomField;
  onDelete: () => void;
  onSaved: () => void;
}) {
  const [label, setLabel] = useState(row.label);
  const [slug, setSlug] = useState(row.slug);
  const [sortOrder, setSortOrder] = useState<number>(row.sort_order);
  const [active, setActive] = useState<boolean>(row.active);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const dirty =
    label !== row.label ||
    slug !== row.slug ||
    sortOrder !== row.sort_order ||
    active !== row.active;

  async function save(partial?: Partial<CustomField>) {
    setSaving(true);
    setErr(null);
    try {
      const payload = {
        label,
        slug: slugify(slug) || slug,
        sort_order: sortOrder,
        active,
        ...partial,
      };
      const { error } = await supabase
        .from("custom_fields")
        .update(payload)
        .eq("id", row.id);
      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
      onSaved();
    } catch (e: any) {
      setErr(e?.message ?? "Falha ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <li className="grid gap-3 p-3 md:grid-cols-[24px,1fr,1fr,90px,110px,auto] md:items-center">
      <GripVertical className="hidden h-4 w-4 text-neutral-300 md:block" />
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Nome</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-sm focus:border-cyan-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 font-mono text-xs text-neutral-700 focus:border-cyan-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Ordem</label>
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
          className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-sm focus:border-cyan-500 focus:outline-none"
        />
      </div>
      <label className="mt-4 flex items-center gap-2 text-xs text-neutral-700 md:mt-6">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="h-4 w-4 rounded border-neutral-300 text-cyan-500 focus:ring-cyan-500"
        />
        Ativo
      </label>
      <div className="flex items-center gap-2 md:justify-end md:pt-4">
        <button
          type="button"
          onClick={() => save()}
          disabled={!dirty || saving}
          className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-cyan-500 to-violet-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm disabled:opacity-40"
        >
          {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : saved ? <Check className="h-3 w-3" /> : null}
          {saved ? "Salvo" : "Salvar"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center rounded-md border border-rose-200 p-1.5 text-rose-600 hover:bg-rose-50"
          title="Remover"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      {err ? <p className="text-xs text-rose-600 md:col-span-6">{err}</p> : null}
    </li>
  );
}