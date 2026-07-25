import { supabase } from "@/integrations/supabase/client";

export const SITE_IMAGES_KEY = "site_images";

export type SiteImageSlot = {
  key: string;
  label: string;
  description: string;
  page: string;
};

// Fixed catalog of image slots that admins can override from /admin/imagens
export const SITE_IMAGE_SLOTS: SiteImageSlot[] = [
  {
    key: "sobre_top",
    label: "Sobre — Foto principal (topo)",
    description: "Imagem grande no topo da página Sobre, ao lado do texto 'Nossa história'.",
    page: "/sobre",
  },
  {
    key: "sobre_bottom_1",
    label: "Sobre — Rodapé (esquerda)",
    description: "Primeira imagem no bloco inferior da página Sobre (fachada Curitiba).",
    page: "/sobre",
  },
  {
    key: "sobre_bottom_2",
    label: "Sobre — Rodapé (direita)",
    description: "Segunda imagem no bloco inferior da página Sobre.",
    page: "/sobre",
  },
];

export type SiteImagesMap = Record<string, string>;

export async function fetchSiteImages(): Promise<SiteImagesMap> {
  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("key", SITE_IMAGES_KEY)
    .maybeSingle();
  if (error) throw error;
  return ((data?.content ?? {}) as SiteImagesMap) || {};
}

export async function saveSiteImage(slotKey: string, imageRef: string) {
  const current = await fetchSiteImages();
  const next: SiteImagesMap = { ...current, [slotKey]: imageRef };
  const { data: existing } = await supabase
    .from("site_content")
    .select("id")
    .eq("key", SITE_IMAGES_KEY)
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
      .insert({ key: SITE_IMAGES_KEY, content: contentJson });
    if (error) throw error;
  }
}

export async function uploadSiteImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `site/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { upsert: false });
  if (error) throw error;
  return `storage:${path}`;
}