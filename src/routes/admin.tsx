import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin — Nane Benites" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminApp,
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
};

function resolveImg(ref: string | null | undefined): string {
  if (!ref) return "";
  if (ref.startsWith("storage:")) {
    const { data } = supabase.storage.from("product-images").getPublicUrl(ref.slice(8));
    return data.publicUrl;
  }
  if (ref.startsWith("local:") || ref.startsWith("http")) return ref;
  return ref;
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

function AdminApp() {
  const [session, setSession] = useState<{ userId: string } | null>(null);
  const [checking, setChecking] = useState(true);
  const [bootstrapping, setBootstrapping] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ? { userId: data.session.user.id } : null);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s ? { userId: s.user.id } : null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Ensure the admin user + role exist. Idempotent.
    setBootstrapping(true);
    fetch("/api/public/admin-bootstrap", { method: "POST" })
      .catch(() => {})
      .finally(() => setBootstrapping(false));
  }, []);

  if (checking || bootstrapping) {
    return <div className="grid min-h-screen place-items-center bg-neutral-50 text-sm text-neutral-500">Carregando…</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      {session ? <Dashboard onSignOut={() => supabase.auth.signOut()} /> : <Login />}
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("nanebenites@yahoo.com");
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

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const [items, setItems] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProductRow | "new" | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("sort_order", { ascending: true });
    if (!error && data) setItems(data as ProductRow[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(row: ProductRow) {
    if (!confirm(`Excluir "${row.name}"?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", row.id);
    if (error) alert("Erro ao excluir: " + error.message);
    else load();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Produtos</h1>
          <p className="text-xs text-neutral-500">{items.length} cadastrados</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditing("new")}
            className="h-10 rounded-lg bg-neutral-900 px-4 text-xs font-semibold uppercase tracking-wider text-white hover:opacity-90"
          >
            + Adicionar produto
          </button>
          <button onClick={onSignOut} className="h-10 rounded-lg border border-neutral-300 bg-white px-4 text-xs font-medium text-neutral-700 hover:bg-neutral-100">
            Sair
          </button>
        </div>
      </header>

      <div className="mt-8 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
        {loading ? (
          <p className="p-6 text-sm text-neutral-500">Carregando…</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-neutral-500">Nenhum produto ainda.</p>
        ) : (
          items.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                {p.image ? <img src={resolveImg(p.image)} alt="" className="h-full w-full object-cover" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  R$ {Number(p.price).toFixed(2)}
                  {p.on_sale && p.sale_price ? ` · Promo R$ ${Number(p.sale_price).toFixed(2)}` : ""}
                </p>
              </div>
              <button onClick={() => setEditing(p)} className="h-9 rounded-md border border-neutral-300 px-3 text-xs font-medium hover:bg-neutral-100">
                Editar
              </button>
              <button onClick={() => onDelete(p)} className="h-9 rounded-md border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-700 hover:bg-red-100">
                Excluir
              </button>
            </div>
          ))
        )}
      </div>

      {editing ? (
        <ProductForm
          initial={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      ) : null}
    </div>
  );
}

type FormState = {
  name: string;
  slug: string;
  description: string;
  category: string;
  brand: string;
  price: string;
  on_sale: boolean;
  sale_price: string;
  sizes: string[];
  colors: string[];
  imageRef: string;
  stock: string;
  sku: string;
  is_new: boolean;
  is_bestseller: boolean;
};

function ProductForm({ initial, onClose, onSaved }: { initial: ProductRow | null; onClose: () => void; onSaved: () => void }) {
  const [state, setState] = useState<FormState>(() => ({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    category: initial?.category ?? "leggings",
    brand: initial?.brand ?? "",
    price: initial ? String(initial.price) : "",
    on_sale: initial?.on_sale ?? false,
    sale_price: initial?.sale_price != null ? String(initial.sale_price) : "",
    sizes: initial?.sizes ?? [],
    colors: initial?.colors ?? [],
    imageRef: initial?.image ?? "",
    stock: initial ? String(initial.stock) : "0",
    sku: initial?.sku ?? "",
    is_new: initial?.is_new ?? false,
    is_bestseller: initial?.is_bestseller ?? false,
  }));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setState((s) => ({ ...s, [k]: v }));
  }

  async function onUpload(file: File) {
    setUploading(true);
    setErr(null);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: false });
    setUploading(false);
    if (error) {
      setErr("Falha no upload: " + error.message);
      return;
    }
    set("imageRef", `storage:${path}`);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setSaving(true);

    const slug = state.slug.trim() || slugify(state.name);
    const payload = {
      name: state.name.trim(),
      slug,
      description: state.description.trim() || null,
      category: state.category.trim(),
      brand: state.brand.trim(),
      price: Number(state.price) || 0,
      on_sale: state.on_sale,
      sale_price: state.on_sale && state.sale_price ? Number(state.sale_price) : null,
      sizes: state.sizes,
      colors: state.colors,
      image: state.imageRef || null,
      gallery: state.imageRef ? [state.imageRef] : [],
      stock: Number(state.stock) || 0,
      sku: state.sku.trim() || null,
      is_new: state.is_new,
      is_bestseller: state.is_bestseller,
    };

    const q = initial
      ? supabase.from("products").update(payload).eq("id", initial.id)
      : supabase.from("products").insert(payload);
    const { error } = await q;
    setSaving(false);
    if (error) {
      setErr("Erro ao salvar: " + error.message);
      return;
    }
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10">
      <form onSubmit={onSubmit} className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{initial ? "Editar produto" : "Novo produto"}</h2>
          <button type="button" onClick={onClose} className="text-sm text-neutral-500 hover:text-neutral-900">Fechar</button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Nome" value={state.name} onChange={(v) => set("name", v)} required />
          <Field label="Slug (URL)" value={state.slug} onChange={(v) => set("slug", v)} placeholder="deixe vazio para gerar" />
          <Field label="Categoria" value={state.category} onChange={(v) => set("category", v)} required />
          <Field label="Marca" value={state.brand} onChange={(v) => set("brand", v)} required />
          <Field label="Preço" value={state.price} onChange={(v) => set("price", v)} type="number" required />
          <Field label="SKU" value={state.sku} onChange={(v) => set("sku", v)} />
          <Field label="Estoque" value={state.stock} onChange={(v) => set("stock", v)} type="number" />
        </div>

        <div className="mt-4">
          <label className="text-xs font-medium text-neutral-600">Descrição</label>
          <textarea
            value={state.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
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
              type="number"
              value={state.sale_price}
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
            <input type="checkbox" checked={state.is_bestseller} onChange={(e) => set("is_bestseller", e.target.checked)} /> Mais vendido
          </label>
        </div>

        <div className="mt-6">
          <label className="text-xs font-medium text-neutral-600">Foto do produto</label>
          <div className="mt-2 flex items-center gap-4">
            <div className="h-24 w-24 overflow-hidden rounded-lg bg-neutral-100">
              {state.imageRef ? <img src={resolveImg(state.imageRef)} alt="" className="h-full w-full object-cover" /> : null}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(f);
              }}
              className="text-sm"
            />
            {uploading ? <span className="text-xs text-neutral-500">Enviando…</span> : null}
          </div>
        </div>

        {err ? <p className="mt-4 text-xs text-red-600">{err}</p> : null}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="h-10 rounded-lg border border-neutral-300 px-4 text-sm font-medium">Cancelar</button>
          <button type="submit" disabled={saving || uploading} className="h-10 rounded-lg bg-neutral-900 px-5 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", placeholder, required,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-neutral-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-1 h-10 w-full rounded-lg border border-neutral-300 px-3 text-sm focus:border-neutral-900 focus:outline-none"
      />
    </div>
  );
}

function TagList({
  label, values, onChange, placeholder,
}: {
  label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string;
}) {
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
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); add(); }
          }}
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