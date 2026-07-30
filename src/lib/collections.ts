import { supabase } from "@/integrations/supabase/client";
import { brands } from "@/lib/site-data";
import brandRunMore from "@/assets/brands/run-more.png";
import brandZeroAcucar from "@/assets/brands/zero-acucar.png";
import brandLetsGym from "@/assets/brands/lets-gym.png";
import brandLancaPerfume from "@/assets/brands/lanca-perfume.png";
import brandMovimentoCia from "@/assets/brands/movimento-cia.png";
import brandMulherElastica from "@/assets/brands/mulher-elastica.png";
import brandLive from "@/assets/brands/live.png";

const COLLECTION_BANNERS_KEY = "collection_banners";

export type CollectionEntry = {
  slug: string;
  name: string;
  logo: string;
  description: string;
};

export const COLLECTIONS: CollectionEntry[] = [
  { slug: "lets-gym", name: "Let's Gym", logo: brandLetsGym, description: "Modelagens de alta compressão e estampas marcantes para treinos intensos." },
  { slug: "run-more", name: "Run More", logo: brandRunMore, description: "Tecidos leves e respiráveis pensados para corrida e alta performance." },
  { slug: "live", name: "Live!", logo: brandLive, description: "Clássicos versáteis que vão do treino ao dia a dia com conforto absoluto." },
  { slug: "lanca-perfume", name: "Lança Perfume", logo: brandLancaPerfume, description: "Fitness com assinatura fashion: cores, recortes e atitude." },
  { slug: "movimento-e-companhia", name: "Movimento & Companhia", logo: brandMovimentoCia, description: "Peças autorais para quem faz do movimento um estilo de vida." },
  { slug: "mulher-elastica", name: "Mulher Elástica", logo: brandMulherElastica, description: "Elasticidade e caimento impecável para todos os tipos de corpo." },
  { slug: "zero-acucar", name: "Zero Açúcar", logo: brandZeroAcucar, description: "Coleção despojada, jovem e cheia de personalidade." },
];

export type CollectionBanner = { imageRef: string; tagline: string };
export type CollectionBannerMap = Record<string, CollectionBanner>;

export function collectionList(): CollectionEntry[] {
  const known = new Map(COLLECTIONS.map((c) => [c.slug, c]));
  return brands.map(
    (b) =>
      known.get(b.slug) ?? {
        slug: b.slug,
        name: b.name,
        logo: "",
        description: `Peças selecionadas da coleção ${b.name}.`,
      },
  );
}

export async function fetchCollectionBanners(): Promise<CollectionBannerMap> {
  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("key", COLLECTION_BANNERS_KEY)
    .maybeSingle();
  if (error) throw error;
  const raw = (data?.content ?? {}) as Record<string, Partial<CollectionBanner> | string>;
  const out: CollectionBannerMap = {};
  for (const [slug, v] of Object.entries(raw)) {
    if (typeof v === "string") out[slug] = { imageRef: v, tagline: "" };
    else out[slug] = { imageRef: v?.imageRef ?? "", tagline: v?.tagline ?? "" };
  }
  return out;
}

export async function saveCollectionBanner(slug: string, banner: CollectionBanner) {
  const current = await fetchCollectionBanners();
  const next = { ...current, [slug]: banner };
  const { data: existing } = await supabase
    .from("site_content")
    .select("id")
    .eq("key", COLLECTION_BANNERS_KEY)
    .maybeSingle();
  const contentJson = JSON.parse(JSON.stringify(next));
  if (existing?.id) {
    const { error } = await supabase.from("site_content").update({ content: contentJson }).eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("site_content").insert({ key: COLLECTION_BANNERS_KEY, content: contentJson });
    if (error) throw error;
  }
}
