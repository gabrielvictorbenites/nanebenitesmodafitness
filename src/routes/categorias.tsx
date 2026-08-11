import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSiteCategories } from "@/lib/categories";
import { CategoryCard } from "@/components/site/CategoryCard";
import { PageHero } from "@/components/site/PageHero";
import { fetchCategoryBanners } from "@/lib/banners";
import { resolveImageAsync } from "@/lib/product-image";

export const Route = createFileRoute("/categorias")({
  head: () => ({
    meta: [
      { title: "Categorias - Nane Benites Moda Fitness" },
      { name: "description", content: "Explore todas as categorias da Nane Benites: leggings, tops, shorts, conjuntos, tênis e mais." },
      { property: "og:title", content: "Categorias - Nane Benites Moda Fitness" },
      { property: "og:description", content: "Navegue por todas as categorias de moda fitness premium." },
    ],
  }),
  component: CategoriasPage,
});

function CategoriasPage() {
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  useEffect(() => {
    let alive = true;
    (async () => {
      const map = await fetchCategoryBanners();
      const entries = await Promise.all(
        Object.entries(map)
          .filter(([, v]) => v.imageRef)
          .map(async ([slug, v]) => [slug, await resolveImageAsync(v.imageRef)] as const),
      );
      if (alive) setOverrides(Object.fromEntries(entries));
    })();
    return () => { alive = false; };
  }, []);
  const categories = useSiteCategories();
  const cats = categories.map((c) => (overrides[c.slug] ? { ...c, image: overrides[c.slug] } : c));
  return (
    <>
      <PageHero
        eyebrow="Categorias"
        title="Encontre sua peça"
        description="Curadoria completa por categoria - das leggings de compressão aos acessórios essenciais do seu treino."
      />
      <section className="bg-aurora">
        <div className="container-x py-16 md:py-24">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-5">
            {cats.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}