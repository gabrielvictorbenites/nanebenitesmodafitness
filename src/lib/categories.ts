import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { categories as staticCategories, type Category } from "@/lib/site-data";
import catAcessorios from "@/assets/cat-acessorios.jpg";

const bySlug = new Map(staticCategories.map((c) => [c.slug, c]));

/** Categorias reais do site: vêm de custom_fields (admin > Campos). */
export async function fetchSiteCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("custom_fields")
    .select("slug, label, sort_order, active")
    .eq("field_type", "category")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error || !data || data.length === 0) return staticCategories;
  return data.map((r) => {
    const base = bySlug.get(r.slug);
    return {
      slug: r.slug,
      name: r.label,
      image: base?.image ?? catAcessorios,
      description: base?.description ?? `Peças selecionadas de ${r.label.toLowerCase()} com a curadoria Nane Benites.`,
    } satisfies Category;
  });
}

export function useSiteCategories(): Category[] {
  const [cats, setCats] = useState<Category[]>(staticCategories);
  useEffect(() => {
    let alive = true;
    fetchSiteCategories().then((c) => alive && setCats(c)).catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return cats;
}
