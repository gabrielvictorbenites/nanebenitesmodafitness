import { supabase } from "@/integrations/supabase/client";

export type HeroBanner = {
  id: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  image_url: string;
  cta_label: string;
  cta_href: string;
  sort_order: number;
  active: boolean;
};

export type CategoryBanner = { imageRef: string; tagline: string };
export type CategoryBannerMap = Record<string, CategoryBanner>;

const CATEGORY_BANNERS_KEY = "category_banners";

// ---------- Hero banners (banners table) ----------

export async function fetchHeroBanners(): Promise<HeroBanner[]> {
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as HeroBanner[];
}

export async function saveHeroBanner(b: Partial<HeroBanner> & { id?: string }) {
  const payload = {
    title: b.title ?? "",
    subtitle: b.subtitle ?? "",
    eyebrow: b.eyebrow ?? "",
    image_url: b.image_url ?? "",
    cta_label: b.cta_label ?? "",
    cta_href: b.cta_href ?? "",
    sort_order: b.sort_order ?? 0,
    active: b.active ?? true,
  };
  if (b.id) {
    const { error } = await supabase.from("banners").update(payload).eq("id", b.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("banners").insert(payload);
    if (error) throw error;
  }
}

export async function deleteHeroBanner(id: string) {
  const { error } = await supabase.from("banners").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Category banners (site_content table) ----------

export async function fetchCategoryBanners(): Promise<CategoryBannerMap> {
  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("key", CATEGORY_BANNERS_KEY)
    .maybeSingle();
  if (error) throw error;
  const raw = (data?.content ?? {}) as Record<string, Partial<CategoryBanner> | string>;
  const out: CategoryBannerMap = {};
  for (const [slug, v] of Object.entries(raw)) {
    if (typeof v === "string") out[slug] = { imageRef: v, tagline: "" };
    else out[slug] = { imageRef: v?.imageRef ?? "", tagline: v?.tagline ?? "" };
  }
  return out;
}

export async function saveCategoryBanner(slug: string, banner: CategoryBanner) {
  const current = await fetchCategoryBanners();
  const next: CategoryBannerMap = { ...current, [slug]: banner };
  const { data: existing } = await supabase
    .from("site_content")
    .select("id")
    .eq("key", CATEGORY_BANNERS_KEY)
    .maybeSingle();
  const contentJson = JSON.parse(JSON.stringify(next));
  if (existing?.id) {
    const { error } = await supabase
      .from("site_content")
      .update({ content: contentJson })
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("site_content")
      .insert({ key: CATEGORY_BANNERS_KEY, content: contentJson });
    if (error) throw error;
  }
}

// ---------- Image upload (reuse product-images bucket) ----------

export async function uploadBannerImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `banners/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { upsert: false });
  if (error) throw error;
  return `storage:${path}`;
}

// ---------- Category list (merges custom_fields + fallback) ----------

export type CategoryEntry = { slug: string; label: string };

export const FALLBACK_CATEGORIES: CategoryEntry[] = [
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
  { slug: "macacoes", label: "Macacões" },
  { slug: "jaquetas", label: "Jaquetas" },
  { slug: "tenis", label: "Tênis" },
  { slug: "chinelos", label: "Chinelos" },
  { slug: "bolsas", label: "Bolsas" },
  { slug: "bolsas-de-treino", label: "Bolsas de treino" },
  { slug: "mochilas", label: "Mochilas" },
  { slug: "garrafas", label: "Garrafas" },
  { slug: "meias", label: "Meias" },
  { slug: "faixas-de-cabelo", label: "Faixas de cabelo" },
  { slug: "bones", label: "Bonés" },
  { slug: "acessorios", label: "Acessórios" },
];

export async function fetchCategoryList(): Promise<CategoryEntry[]> {
  const { data } = await supabase
    .from("custom_fields")
    .select("slug, label, active, sort_order")
    .eq("field_type", "category")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  const fromDb: CategoryEntry[] = (data ?? []).map((r) => ({ slug: r.slug, label: r.label }));
  // Só as categorias realmente publicadas no site (admin > Campos).
  if (fromDb.length > 0) return fromDb;
  return FALLBACK_CATEGORIES;
}