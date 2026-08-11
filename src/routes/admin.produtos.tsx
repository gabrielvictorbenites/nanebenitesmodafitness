import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Copy, Pencil, Trash2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { generateProductDescription } from "@/lib/ai.functions";
import { resolveImageAsync } from "@/lib/product-image";
import { brands } from "@/lib/site-data";

export const Route = createFileRoute("/admin/produtos")({
  ssr: false,
  component: ProductsPage,
});

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  brand: string;
  price: number | string;
  sale_price: number | string | null;
  on_sale: boolean;
  colors: string[] | null;
  sizes: string[] | null;
  image: string | null;
  gallery: string[] | null;
  stock: number;
  sku: string | null;
  is_new: boolean;
  is_bestseller: boolean;
  active?: boolean;
  featured?: boolean;
};

function Thumb({ refValue }: { refValue: string | null | undefined }) {
  const [url, setUrl] = useState<string>("");
  useEffect(() => {
    let alive = true;
    resolveImageAsync(refValue).then((u) => { if (alive) setUrl(u); });
    return () => { alive = false; };
  }, [refValue]);
  if (!url) return null;
  return <img src={url} alt="" className="h-full w-full object-cover" />;
}

function generateSku(name: string): string {
  const prefix = (name || "prod")
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 6) || "PROD";
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  const ts = Date.now().toString(36).slice(-4).toUpperCase();
  return `${prefix}-${ts}${rand}`;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const CATEGORIES: { slug: string; label: string }[] = [
  { slug: "leggings", label: "Leggings" },
  { slug: "shorts", label: "Shorts" },
  { slug: "shorts-saia", label: "Shorts saia" },
  { slug: "tops", label: "Tops" },
  { slug: "regatas", label: "Regatas" },
  { slug: "camisetas", label: "Camisetas" },
  { slug: "conjuntos", label: "Conjuntos" },
  { slug: "body", label: "Body" },
  { slug: "moletons", label: "Moletons" },
  { slug: "casacos-de-ziper", label: "Casacos de zíper" },
  { slug: "tenis", label: "Tênis" },
  { slug: "chinelos", label: "Chinelos" },
  { slug: "bolsas-de-treino", label: "Bolsas de treino" },
  { slug: "mochilas", label: "Mochilas" },
  { slug: "garrafas", label: "Garrafas" },
  { slug: "meias", label: "Meias" },
  { slug: "faixas-de-cabelo", label: "Faixas de cabelo" },
  { slug: "bones", label: "Bonés" },
];

function ProductsPage() {
  const [items, setItems] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProductRow | "new" | null>(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("");

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("sort_order", { ascending: true });
    if (data) setItems(data as ProductRow[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function onDelete(row: ProductRow) {
    if (!confirm(`Excluir "${row.name}"?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", row.id);
    if (error) alert("Erro ao excluir: " + error.message);
    else load();
  }

  async function onDuplicate(row: ProductRow) {
    const newName = `${row.name} (cópia)`;
    const payload = {
      slug: `${slugify(row.name)}-${Math.random().toString(36).slice(2, 6)}`,
      name: newName,
      description: row.description ?? "",
      category: row.category,
      brand: row.brand,
      price: Number(row.price) || 0,
      sale_price: row.sale_price != null ? Number(row.sale_price) : null,
      on_sale: row.on_sale,
      colors: row.colors ?? [],
      sizes: row.sizes ?? [],
      image: row.image ?? "",
      gallery: row.gallery ?? [],
      stock: row.stock,
      sku: generateSku(newName),
      is_new: row.is_new,
      is_bestseller: row.is_bestseller,
      active: row.active ?? true,
      featured: row.featured ?? row.is_bestseller ?? false,
    };
    const { error } = await supabase.from("products").insert(payload);
    if (error) alert("Erro ao duplicar: " + error.message);
    else load();
  }

  async function toggleField(row: ProductRow, field: "active" | "featured", value: boolean) {
    // Optimistic update
    setItems((prev) => prev.map((p) => (p.id === row.id ? { ...p, [field]: value } : p)));
    const patch = { [field]: value } as { active?: boolean; featured?: boolean };
    const { error } = await supabase.from("products").update(patch).eq("id", row.id);
    if (error) {
      alert("Erro ao atualizar: " + error.message);
      load();
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((p) => {
      if (catFilter && p.category !== catFilter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.sku ?? "").toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    });
  }, [items, search, catFilter]);

  return (
    <div className="mx-auto max-w-6xl p-6 md:p-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-neutral-900">Produtos</h1>
          <p className="mt-1 text-sm text-neutral-500">{items.length} cadastrados</p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 px-5 text-xs font-semibold uppercase tracking-wider text-white shadow hover:opacity-90"
        >
          + Novo produto
        </button>
      </header>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, código ou marca…"
            className="h-10 w-full rounded-lg border border-neutral-300 bg-white pl-9 pr-3 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="h-10 rounded-lg border border-neutral-300 bg-white px-3 text-sm sm:w-56"
        >
          <option value="">Todas as categorias</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        {loading ? (
          <p className="p-6 text-sm text-neutral-500">Carregando…</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-neutral-500">Nenhum produto encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-neutral-50 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3">Preço</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Destaque</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/60">
                  <td className="px-4 py-3 font-mono text-[11px] text-neutral-500">{p.sku || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                        <Thumb refValue={p.image} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-neutral-900">{p.name}</p>
                        <p className="mt-0.5 text-[11px] text-neutral-500">
                          {p.category || "-"} {p.brand ? `· ${p.brand}` : ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-neutral-800">
                    R$ {Number(p.price).toFixed(2).replace(".", ",")}
                    {p.on_sale && p.sale_price ? (
                      <span className="ml-1 text-[11px] text-cyan-700">
                        · R$ {Number(p.sale_price).toFixed(2).replace(".", ",")}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={p.active !== false}
                      onChange={(e) => toggleField(p, "active", e.target.checked)}
                      className="h-4 w-4 accent-cyan-600"
                      aria-label="Ativo"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={!!(p.featured ?? p.is_bestseller)}
                      onChange={(e) => toggleField(p, "featured", e.target.checked)}
                      className="h-4 w-4 accent-violet-600"
                      aria-label="Destaque"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onDuplicate(p)}
                        className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                        title="Duplicar"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditing(p)}
                        className="rounded-md p-1.5 text-neutral-500 hover:bg-cyan-50 hover:text-cyan-700"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(p)}
                        className="rounded-md p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {editing ? (
        <ProductForm
          initial={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      ) : null}
    </div>
  );
}

type FormState = {
  name: string; slug: string; description: string; category: string; brand: string;
  price: string; on_sale: boolean; sale_price: string; sizes: string[]; colors: string[];
  media: string[]; coverIndex: number; stock: string; is_new: boolean; is_bestseller: boolean;
};

function ProductForm({ initial, onClose, onSaved }: { initial: ProductRow | null; onClose: () => void; onSaved: () => void }) {
  const initialGallery = (() => {
    const g = initial?.gallery ?? [];
    const list = g.length > 0 ? g : initial?.image ? [initial.image] : [];
    const cover = initial?.image && list.includes(initial.image) ? list.indexOf(initial.image) : 0;
    return { list, cover };
  })();
  const [state, setState] = useState<FormState>(() => ({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    category: initial?.category ?? "",
    brand: initial?.brand ?? "",
    price: initial ? String(initial.price) : "",
    on_sale: initial?.on_sale ?? false,
    sale_price: initial?.sale_price != null ? String(initial.sale_price) : "",
    sizes: initial?.sizes ?? [],
    colors: initial?.colors ?? [],
    media: initialGallery.list,
    coverIndex: initialGallery.cover,
    stock: initial ? String(initial.stock) : "0",
    is_new: initial?.is_new ?? false,
    is_bestseller: initial?.is_bestseller ?? false,
  }));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const genDescription = useServerFn(generateProductDescription);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setState((s) => ({ ...s, [k]: v }));
  }

  async function onGenerateAI() {
    if (!state.name.trim()) {
      setErr("Informe o nome do produto antes de gerar a descrição.");
      return;
    }
    setErr(null);
    setAiLoading(true);
    try {
      const res = await genDescription({
        data: {
          name: state.name,
          category: state.category,
          brand: state.brand,
          sizes: state.sizes,
          colors: state.colors,
        },
      });
      if (res.description) set("description", res.description);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro ao gerar descrição");
    } finally {
      setAiLoading(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setSaving(true);
    const slug = state.slug.trim() || slugify(state.name);
    const cover = state.media[state.coverIndex] ?? state.media[0] ?? "";
    const sku = initial?.sku && initial.sku.trim() ? initial.sku : generateSku(state.name);
    const payload = {
      name: state.name.trim(), slug,
      description: state.description.trim() || undefined,
      category: state.category.trim(), brand: state.brand.trim(),
      price: Number(state.price) || 0,
      on_sale: state.on_sale,
      sale_price: state.on_sale && state.sale_price ? Number(state.sale_price) : undefined,
      sizes: state.sizes, colors: state.colors,
      image: cover || undefined,
      gallery: state.media,
      stock: Number(state.stock) || 0,
      sku,
      is_new: state.is_new, is_bestseller: state.is_bestseller,
    };
    const q = initial
      ? supabase.from("products").update(payload).eq("id", initial.id)
      : supabase.from("products").insert(payload);
    const { error } = await q;
    setSaving(false);
    if (error) { setErr("Erro ao salvar: " + error.message); return; }
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10">
      <form onSubmit={onSubmit} className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">{initial ? "Editar produto" : "Novo produto"}</h2>
          <button type="button" onClick={onClose} className="text-sm text-neutral-500 hover:text-neutral-900">Fechar</button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Nome" value={state.name} onChange={(v) => set("name", v)} required />
          <Field label="Slug (URL)" value={state.slug} onChange={(v) => set("slug", v)} placeholder="deixe vazio para gerar" />
          <SelectField
            label="Categoria"
            value={state.category}
            onChange={(v) => set("category", v)}
            options={CATEGORIES}
            required
          />
          <SelectField
            label="Marca"
            value={state.brand}
            onChange={(v) => set("brand", v)}
            options={brands.map((b) => ({ slug: b.name, label: b.name }))}
            required
          />
          <Field label="Preço" value={state.price} onChange={(v) => set("price", v)} type="number" required />
          <Field label="Estoque" value={state.stock} onChange={(v) => set("stock", v)} type="number" />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-neutral-600">Descrição</label>
            <button
              type="button"
              onClick={onGenerateAI}
              disabled={aiLoading}
              className="rounded-lg bg-[image:linear-gradient(135deg,oklch(0.72_0.13_195),oklch(0.55_0.22_300))] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white disabled:opacity-60"
            >
              {aiLoading ? "Gerando…" : "✨ Gerar com IA"}
            </button>
          </div>
          <textarea
            value={state.description}
            onChange={(e) => set("description", e.target.value)}
            rows={5}
            className="mt-1 w-full rounded-lg border border-neutral-300 p-3 text-sm focus:border-neutral-900 focus:outline-none"
          />
        </div>

        <TagList label="Tamanhos" values={state.sizes} onChange={(v) => set("sizes", v)} placeholder="Ex: P, M, G, 38…" />
        <TagList label="Cores" values={state.colors} onChange={(v) => set("colors", v)} placeholder="Ex: Preto, Bordô…" />

        <div className="mt-4 flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={state.on_sale} onChange={(e) => set("on_sale", e.target.checked)} /> Em promoção
          </label>
          {state.on_sale ? (
            <input
              type="number" value={state.sale_price}
              onChange={(e) => set("sale_price", e.target.value)}
              placeholder="Preço promocional"
              className="h-10 rounded-lg border border-neutral-300 px-3 text-sm focus:border-neutral-900 focus:outline-none"
            />
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={state.is_new} onChange={(e) => set("is_new", e.target.checked)} /> Lançamento
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={state.is_bestseller} onChange={(e) => set("is_bestseller", e.target.checked)} /> Destaque
          </label>
        </div>

        <div className="mt-6">
          <MediaUploader
            values={state.media}
            onChange={(v) => set("media", v)}
            coverIndex={state.coverIndex}
            onCoverChange={(i) => set("coverIndex", i)}
          />
        </div>

        {err ? <p className="mt-4 text-xs text-red-600">{err}</p> : null}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="h-10 rounded-lg border border-neutral-300 px-4 text-sm font-medium">Cancelar</button>
          <button
            type="submit" disabled={saving}
            className="h-10 rounded-lg bg-[image:linear-gradient(135deg,oklch(0.72_0.13_195),oklch(0.55_0.22_300))] px-5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", placeholder, required,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-medium text-neutral-600">{label}</label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className="mt-1 h-10 w-full rounded-lg border border-neutral-300 px-3 text-sm focus:border-neutral-900 focus:outline-none"
      />
    </div>
  );
}

function SelectField({
  label, value, onChange, options, required,
}: { label: string; value: string; onChange: (v: string) => void; options: { slug: string; label: string }[]; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-medium text-neutral-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1 h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm focus:border-neutral-900 focus:outline-none"
      >
        <option value="" disabled>Selecione…</option>
        {options.map((o) => (
          <option key={o.slug} value={o.slug}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function TagList({
  label, values, onChange, placeholder,
}: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("");
  function add() {
    const v = input.trim();
    if (!v) return;
    if (!values.includes(v)) onChange([...values, v]);
    setInput("");
  }
  return (
    <div className="mt-4">
      <label className="text-xs font-medium text-neutral-600">{label}</label>
      <div className="mt-1 flex flex-wrap gap-2">
        {values.map((v) => (
          <span key={v} className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-xs">
            {v}
            <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} className="text-neutral-500 hover:text-red-600">×</button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className="h-10 flex-1 rounded-lg border border-neutral-300 px-3 text-sm focus:border-neutral-900 focus:outline-none"
        />
        <button type="button" onClick={add} className="h-10 rounded-lg border border-neutral-300 px-4 text-xs font-medium hover:bg-neutral-100">
          Adicionar
        </button>
      </div>
    </div>
  );
}