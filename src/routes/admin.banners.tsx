import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  fetchHeroBanners,
  saveHeroBanner,
  deleteHeroBanner,
  fetchCategoryBanners,
  saveCategoryBanner,
  uploadBannerImage,
  fetchCategoryList,
  type HeroBanner,
  type CategoryBannerMap,
  type CategoryEntry,
} from "@/lib/banners";
import { resolveImageAsync } from "@/lib/product-image";

export const Route = createFileRoute("/admin/banners")({
  ssr: false,
  component: BannersPage,
});

function BannersPage() {
  const [tab, setTab] = useState<"hero" | "categorias">("hero");
  return (
    <div className="mx-auto max-w-6xl p-6 md:p-10">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-neutral-900">Banners</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Gerencie os banners do Hero da home e as imagens de cada categoria do site.
        </p>
      </header>

      <div className="mb-6 flex gap-2 border-b border-neutral-200">
        {(
          [
            { id: "hero", label: "Banners da Home" },
            { id: "categorias", label: "Banners de Categorias" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative px-4 py-3 text-sm font-medium transition ${
              tab === t.id ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {t.label}
            {tab === t.id ? (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded bg-gradient-to-r from-cyan-500 to-violet-500" />
            ) : null}
          </button>
        ))}
      </div>

      {tab === "hero" ? <HeroTab /> : <CategoriesTab />}
    </div>
  );
}

// ============================================================
// HERO TAB
// ============================================================

function HeroTab() {
  const [items, setItems] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<HeroBanner | "new" | null>(null);

  async function load() {
    setLoading(true);
    try {
      setItems(await fetchHeroBanners());
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function onDelete(id: string) {
    if (!confirm("Excluir este banner?")) return;
    await deleteHeroBanner(id);
    load();
  }

  if (editing !== null) {
    return (
      <HeroForm
        initial={editing === "new" ? null : editing}
        onDone={() => {
          setEditing(null);
          load();
        }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-neutral-600">
          Banners rotativos exibidos no Hero da home. Ordene pela coluna "Ordem".
        </p>
        <button
          onClick={() => setEditing("new")}
          className="rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow"
        >
          + Novo banner
        </button>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-neutral-500">Carregando…</p>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 py-16 text-center">
          <p className="text-sm text-neutral-500">Nenhum banner cadastrado ainda.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3">Ordem</th>
                <th className="px-4 py-3">Imagem</th>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Ativo</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id} className="border-t border-neutral-100">
                  <td className="px-4 py-3">{b.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="h-12 w-20 overflow-hidden rounded bg-neutral-100">
                      <AsyncImg refValue={b.image_url} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900">{b.title || "—"}</div>
                    <div className="text-xs text-neutral-500">{b.subtitle}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        b.active ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {b.active ? "Sim" : "Não"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditing(b)}
                      className="mr-2 text-sm font-medium text-cyan-700 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(b.id)}
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function HeroForm({
  initial,
  onDone,
  onCancel,
}: {
  initial: HeroBanner | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [eyebrow, setEyebrow] = useState(initial?.eyebrow ?? "");
  const [ctaLabel, setCtaLabel] = useState(initial?.cta_label ?? "");
  const [ctaHref, setCtaHref] = useState(initial?.cta_href ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [active, setActive] = useState(initial?.active ?? true);
  const [imageRef, setImageRef] = useState(initial?.image_url ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      await saveHeroBanner({
        id: initial?.id,
        title,
        subtitle,
        eyebrow,
        cta_label: ctaLabel,
        cta_href: ctaHref,
        sort_order: Number(sortOrder) || 0,
        active,
        image_url: imageRef,
      });
      onDone();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-xl border border-neutral-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold">
          {initial ? "Editar banner" : "Novo banner"}
        </h2>
        <button type="button" onClick={onCancel} className="text-sm text-neutral-500 hover:underline">
          Cancelar
        </button>
      </div>

      <ImagePicker value={imageRef} onChange={setImageRef} />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Eyebrow (linha superior)">
          <input value={eyebrow} onChange={(e) => setEyebrow(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Título">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Subtítulo" className="md:col-span-2">
          <textarea
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            className={inputCls}
          />
        </Field>
        <Field label="Texto do botão">
          <input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Link do botão">
          <input
            value={ctaHref}
            onChange={(e) => setCtaHref(e.target.value)}
            placeholder="/catalogo"
            className={inputCls}
          />
        </Field>
        <Field label="Ordem">
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className={inputCls}
          />
        </Field>
        <Field label="Ativo">
          <label className="mt-2 inline-flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm text-neutral-700">Exibir no site</span>
          </label>
        </Field>
      </div>

      {err ? <p className="text-sm text-red-600">{err}</p> : null}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? "Salvando…" : "Salvar banner"}
        </button>
      </div>
    </form>
  );
}

// ============================================================
// CATEGORIES TAB
// ============================================================

function CategoriesTab() {
  const [cats, setCats] = useState<CategoryEntry[]>([]);
  const [map, setMap] = useState<CategoryBannerMap>({});
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [c, m] = await Promise.all([fetchCategoryList(), fetchCategoryBanners()]);
      setCats(c);
      setMap(m);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  if (loading) return <p className="py-12 text-center text-sm text-neutral-500">Carregando…</p>;

  return (
    <div>
      <p className="mb-4 text-sm text-neutral-600">
        Cada card corresponde a uma categoria cadastrada. Trocar a imagem aqui atualiza a seção
        "Encontre sua peça" da home e o cabeçalho da página da categoria.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cats.map((c) => (
          <CategoryBannerCard
            key={c.slug}
            category={c}
            initial={map[c.slug] ?? { imageRef: "", tagline: "" }}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryBannerCard({
  category,
  initial,
}: {
  category: CategoryEntry;
  initial: { imageRef: string; tagline: string };
}) {
  const [imageRef, setImageRef] = useState(initial.imageRef);
  const [tagline, setTagline] = useState(initial.tagline);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSave() {
    setSaving(true);
    setSaved(false);
    setErr(null);
    try {
      await saveCategoryBanner(category.slug, { imageRef, tagline });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="relative aspect-[4/3] w-full bg-neutral-100">
        {imageRef ? (
          <AsyncImg refValue={imageRef} />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
            Sem imagem
          </div>
        )}
      </div>
      <div className="space-y-3 p-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
            Categoria
          </p>
          <p className="font-serif text-lg font-bold text-neutral-900">{category.label}</p>
        </div>
        <ImagePicker value={imageRef} onChange={setImageRef} compact />
        <Field label="Texto de destaque (opcional)">
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="Ex: Cintura alta, alta compressão"
            className={inputCls}
          />
        </Field>
        {err ? <p className="text-xs text-red-600">{err}</p> : null}
        <div className="flex items-center justify-end gap-2">
          {saved ? <span className="text-xs font-medium text-green-600">Salvo ✓</span> : null}
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 px-4 py-2 text-xs font-medium text-white disabled:opacity-60"
          >
            {saving ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Reusable pieces
// ============================================================

function ImagePicker({
  value,
  onChange,
  compact = false,
}: {
  value: string;
  onChange: (v: string) => void;
  compact?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onFile(f: File) {
    setUploading(true);
    setErr(null);
    try {
      const ref = await uploadBannerImage(f);
      onChange(ref);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Falha no upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {!compact ? (
        <div className="mb-2 aspect-[21/9] w-full overflow-hidden rounded-lg bg-neutral-100">
          {value ? (
            <AsyncImg refValue={value} />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
              Sem imagem
            </div>
          )}
        </div>
      ) : null}
      <div className="flex items-center gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-neutral-50">
          {uploading ? "Enviando…" : value ? "Trocar imagem" : "+ Enviar imagem"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
              e.target.value = "";
            }}
          />
        </label>
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-neutral-500 hover:text-red-600"
          >
            Remover
          </button>
        ) : null}
      </div>
      {err ? <p className="mt-1 text-xs text-red-600">{err}</p> : null}
    </div>
  );
}

function AsyncImg({ refValue }: { refValue: string }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    let alive = true;
    resolveImageAsync(refValue).then((u) => {
      if (alive) setUrl(u);
    });
    return () => {
      alive = false;
    };
  }, [refValue]);
  if (!url) return null;
  return <img src={url} alt="" className="h-full w-full object-cover" />;
}

const inputCls =
  "mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium text-neutral-600">{label}</span>
      {children}
    </label>
  );
}