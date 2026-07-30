import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, Upload, Loader2, Check, Plus } from "lucide-react";
import {
  fetchHeroBanners,
  saveHeroBanner,
  deleteHeroBanner,
  fetchCategoryBanners,
  saveCategoryBanner,
  uploadBannerImage,
  fetchCategoryList,
  type HeroBanner,
  type CategoryEntry,
} from "@/lib/banners";
import { resolveImageAsync } from "@/lib/product-image";
import { FocalImage } from "@/components/admin/FocalImage";
import {
  collectionList,
  fetchCollectionBanners,
  saveCollectionBanner,
  type CollectionEntry,
} from "@/lib/collections";

export const Route = createFileRoute("/admin/banners")({
  ssr: false,
  component: BannersPage,
});

function BannersPage() {
  const [tab, setTab] = useState<"hero" | "categorias" | "colecoes">("hero");
  return (
    <div className="mx-auto max-w-6xl p-6 md:p-10">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-neutral-900">Banners</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Edite cada banner diretamente. As alterações refletem no site após salvar.
        </p>
      </header>

      <div className="mb-6 flex gap-2 border-b border-neutral-200">
        {(
          [
            { id: "hero", label: "Banners da Home" },
            { id: "categorias", label: "Banners de Categorias" },
            { id: "colecoes", label: "Banners de Coleções" },
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

      {tab === "hero" ? <HeroTab /> : tab === "categorias" ? <CategoriesTab /> : <CollectionsTab />}
    </div>
  );
}

// ============================================================
// HERO TAB — inline card por banner
// ============================================================

function HeroTab() {
  const [items, setItems] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

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

  async function onCreate() {
    setCreating(true);
    try {
      const nextOrder = items.reduce((m, b) => Math.max(m, b.sort_order), 0) + 1;
      await saveHeroBanner({
        title: "",
        subtitle: "",
        eyebrow: "",
        cta_label: "",
        cta_href: "",
        image_url: "",
        sort_order: nextOrder,
        active: true,
      });
      await load();
    } finally {
      setCreating(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Excluir este banner?")) return;
    await deleteHeroBanner(id);
    load();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-neutral-600">
          Os banners ativos giram automaticamente a cada 5 segundos na página inicial.
        </p>
        <button
          onClick={onCreate}
          disabled={creating}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow disabled:opacity-60"
        >
          <Plus className="h-4 w-4" /> Novo banner
        </button>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-neutral-500">Carregando…</p>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 py-16 text-center">
          <p className="text-sm text-neutral-500">Nenhum banner cadastrado ainda.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((b, i) => (
            <HeroCard key={b.id} index={i + 1} banner={b} onDeleted={() => onDelete(b.id)} onSaved={load} />
          ))}
        </div>
      )}
    </div>
  );
}

function HeroCard({
  index,
  banner,
  onDeleted,
  onSaved,
}: {
  index: number;
  banner: HeroBanner;
  onDeleted: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(banner.title);
  const [sortOrder, setSortOrder] = useState(banner.sort_order);
  const [active, setActive] = useState(banner.active);
  const [imageRef, setImageRef] = useState(banner.image_url);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSave() {
    setSaving(true);
    setErr(null);
    setSaved(false);
    try {
      await saveHeroBanner({
        id: banner.id,
        title,
        subtitle: banner.subtitle,
        eyebrow: banner.eyebrow,
        cta_label: banner.cta_label,
        cta_href: banner.cta_href,
        sort_order: Number(sortOrder) || 0,
        active,
        image_url: imageRef,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Banner #{index}
          </span>
          <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-500">
            slide rotativo
          </span>
        </div>
        <div className="flex items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-neutral-700">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 accent-cyan-600"
            />
            Ativo
          </label>
          <button
            onClick={onDeleted}
            className="rounded-md p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
            aria-label="Excluir banner"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-6 p-5 md:grid-cols-[280px_1fr]">
        <div>
          <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-100">
            {imageRef ? (
              <AsyncImg refValue={imageRef} />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                Sem imagem
              </div>
            )}
          </div>
          <UploadButton value={imageRef} onChange={setImageRef} />
          <p className="mt-2 text-center text-[11px] text-neutral-400">
            Proporção 4:3 – recomendado 1600x1200px
          </p>
        </div>

        <div className="grid gap-4">
          <Field label="Texto de destaque (opcional)">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Ordem" className="max-w-[140px]">
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <p className="text-xs text-neutral-500">
            Este banner rotaciona no topo da home. A imagem que você salvar aqui aparece automaticamente no site.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-neutral-100 px-5 py-3">
        {err ? (
          <p className="text-xs text-red-600">{err}</p>
        ) : saved ? (
          <p className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
            <Check className="h-3.5 w-3.5" /> Salvo
          </p>
        ) : (
          <span />
        )}
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {saving ? "Salvando…" : "Salvar"}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// CATEGORIES TAB
// ============================================================

function CategoriesTab() {
  const [cats, setCats] = useState<CategoryEntry[]>([]);
  const [map, setMap] = useState<Record<string, { imageRef: string; tagline: string }>>({});
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
        Cada card corresponde a uma categoria do site. A imagem que você salvar aqui aparece
        automaticamente na seção "Encontre sua peça" da home e no topo de <code>/categoria/[slug]</code>.
      </p>
      <div className="space-y-4">
        {cats.map((c, i) => (
          <CategoryBannerRow
            key={c.slug}
            index={i + 1}
            category={c}
            initial={map[c.slug] ?? { imageRef: "", tagline: "" }}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryBannerRow({
  index,
  category,
  initial,
}: {
  index: number;
  category: CategoryEntry;
  initial: { imageRef: string; tagline: string; heroImageRef?: string; heroTagline?: string };
}) {
  const [imageRef, setImageRef] = useState(initial.imageRef);
  const [tagline, setTagline] = useState(initial.tagline);
  const [heroImageRef, setHeroImageRef] = useState(initial.heroImageRef ?? "");
  const [heroTagline, setHeroTagline] = useState(initial.heroTagline ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSave() {
    setSaving(true);
    setSaved(false);
    setErr(null);
    try {
      await saveCategoryBanner(category.slug, { imageRef, tagline, heroImageRef, heroTagline });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Categoria #{index}
          </span>
          <span className="font-serif text-base font-bold text-neutral-900">{category.label}</span>
          <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-500">
            /categoria/{category.slug}
          </span>
        </div>
      </div>

      <div className="grid gap-6 p-5 md:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 p-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            1. Card da Home / Categorias
          </p>
          <div className="max-w-[280px]">
            <FocalPreview refValue={imageRef} onChange={setImageRef} />
            <UploadButton value={imageRef} onChange={setImageRef} />
          </div>
          <p className="mt-2 text-[11px] text-neutral-400">
            Foto vertical (3:4) – recomendado 1200x1600px. Arraste para ajustar o enquadramento.
          </p>
          <div className="mt-4">
            <Field label="Texto de destaque do card (opcional)">
              <input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Ex: Cintura alta, alta compressão"
                className={inputCls}
              />
            </Field>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 p-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            2. Banner grande da página da categoria
          </p>
          <FocalPreview
            refValue={heroImageRef}
            onChange={setHeroImageRef}
            className="aspect-[16/9] w-full rounded-lg"
          />
          <UploadButton value={heroImageRef} onChange={setHeroImageRef} />
          <p className="mt-2 text-[11px] text-neutral-400">
            Imagem larga (16:9) – recomendado 2000x1125px. Se ficar vazio, usa a imagem do card.
          </p>
          <div className="mt-4">
            <Field label="Texto do banner grande (opcional)">
              <input
                value={heroTagline}
                onChange={(e) => setHeroTagline(e.target.value)}
                placeholder="Ex: Suporte real com estética minimalista"
                className={inputCls}
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-neutral-100 px-5 py-3">
        {err ? (
          <p className="text-xs text-red-600">{err}</p>
        ) : saved ? (
          <p className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
            <Check className="h-3.5 w-3.5" /> Salvo
          </p>
        ) : (
          <span />
        )}
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {saving ? "Salvando…" : "Salvar"}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Reusable pieces
// ============================================================

function CollectionsTab() {
  const list = collectionList();
  const [map, setMap] = useState<Record<string, { imageRef: string; tagline: string }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchCollectionBanners()
      .then((m) => alive && setMap(m))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  if (loading) return <p className="py-12 text-center text-sm text-neutral-500">Carregando…</p>;

  return (
    <div>
      <p className="mb-4 text-sm text-neutral-600">
        Cada card é uma coleção de marca exibida na página <code>/colecoes</code>. Envie uma foto vertical e
        arraste para ajustar o enquadramento — a moça aparece de corpo inteiro.
      </p>
      <div className="space-y-4">
        {list.map((c, i) => (
          <CollectionBannerRow
            key={c.slug}
            index={i + 1}
            collection={c}
            initial={map[c.slug] ?? { imageRef: "", tagline: "" }}
          />
        ))}
      </div>
    </div>
  );
}

function CollectionBannerRow({
  index,
  collection,
  initial,
}: {
  index: number;
  collection: CollectionEntry;
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
      await saveCollectionBanner(collection.slug, { imageRef, tagline });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-neutral-100 px-5 py-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
          Coleção #{index}
        </span>
        <span className="font-serif text-base font-bold text-neutral-900">{collection.name}</span>
        <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-500">
          /colecoes
        </span>
      </div>

      <div className="grid gap-6 p-5 md:grid-cols-[280px_1fr]">
        <div>
          <FocalPreview refValue={imageRef} onChange={setImageRef} />
          <UploadButton value={imageRef} onChange={setImageRef} />
          <p className="mt-2 text-center text-[11px] text-neutral-400">
            Foto vertical (3:4) – recomendado 1200x1600px.
          </p>
        </div>

        <div className="grid gap-4">
          <Field label="Texto da coleção (opcional)">
            <input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder={collection.description}
              className={inputCls}
            />
          </Field>
          <p className="text-xs text-neutral-500">
            O card leva direto ao catálogo filtrado pela marca {collection.name}.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-neutral-100 px-5 py-3">
        {err ? (
          <p className="text-xs text-red-600">{err}</p>
        ) : saved ? (
          <p className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
            <Check className="h-3.5 w-3.5" /> Salvo
          </p>
        ) : (
          <span />
        )}
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {saving ? "Salvando…" : "Salvar"}
        </button>
      </div>
    </div>
  );
}

function FocalPreview({
  refValue,
  onChange,
  className = "aspect-[3/4] w-full rounded-lg",
}: {
  refValue: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    let alive = true;
    if (!refValue) {
      setUrl("");
      return;
    }
    resolveImageAsync(refValue).then((u) => {
      if (alive) setUrl(u);
    });
    return () => {
      alive = false;
    };
  }, [refValue]);

  return (
    <FocalImage
      src={url}
      refValue={refValue}
      onChange={onChange}
      className={className}
    />
  );
}

function UploadButton({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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
    <>
      <div className="mt-3 flex items-center gap-2">
        <label className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50">
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {uploading ? "Enviando…" : value ? "Trocar imagem" : "Enviar imagem"}
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
            className="rounded-lg border border-neutral-200 p-2 text-neutral-400 hover:border-red-200 hover:text-red-600"
            aria-label="Remover imagem"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
      {err ? <p className="mt-1 text-xs text-red-600">{err}</p> : null}
    </>
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
      <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">{label}</span>
      {children}
    </label>
  );
}