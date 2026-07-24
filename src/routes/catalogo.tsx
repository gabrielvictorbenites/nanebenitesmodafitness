import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/ProductCard";
import { categories, brands } from "@/lib/site-data";
import { fetchProducts, type DbProduct } from "@/lib/products";

export const Route = createFileRoute("/catalogo")({
  head: () => ({
    meta: [
      { title: "Catálogo — Nane Benites" },
      { name: "description", content: "Explore o catálogo completo de moda fitness premium: leggings, tops, conjuntos, tênis e mais." },
      { property: "og:title", content: "Catálogo — Nane Benites" },
      { property: "og:description", content: "Catálogo completo de moda fitness premium para mulheres." },
      { property: "og:url", content: "/catalogo" },
    ],
    links: [{ rel: "canonical", href: "/catalogo" }],
  }),
  component: CatalogoPage,
});

function CatalogoPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("todos");
  const [brand, setBrand] = useState<string>("todos");
  const [sort, setSort] = useState<"recentes" | "vendidos" | "menor" | "maior">("recentes");
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchProducts()
      .then((rows) => alive && setProducts(rows))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (cat !== "todos") list = list.filter((p) => p.category === cat);
    if (brand !== "todos") list = list.filter((p) => p.brand === brand);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s));
    }
    if (sort === "menor") list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    if (sort === "maior") list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    if (sort === "vendidos") list.sort((a, b) => Number(!!b.isBestseller) - Number(!!a.isBestseller));
    if (sort === "recentes") list.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    return list;
  }, [q, cat, brand, sort, products]);

  return (
    <>
      <PageHero
        eyebrow="Catálogo"
        title="Toda a coleção em um só lugar."
        description="Filtre por categoria, marca ou faixa de preço e encontre a peça perfeita para o seu treino."
      />

      <section className="container-x py-16">
        <div className="mb-10 grid gap-4 md:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar produtos, marcas..."
              className="h-12 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm placeholder:text-muted-foreground focus:border-brand focus:outline-none"
            />
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="h-12 rounded-full border border-border bg-background px-5 text-sm focus:border-brand focus:outline-none">
            <option value="todos">Todas categorias</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <select value={brand} onChange={(e) => setBrand(e.target.value)} className="h-12 rounded-full border border-border bg-background px-5 text-sm focus:border-brand focus:outline-none">
            <option value="todos">Todas marcas</option>
            {brands.map((b) => (
              <option key={b.slug} value={b.name}>{b.name}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="h-12 rounded-full border border-border bg-background px-5 text-sm focus:border-brand focus:outline-none">
            <option value="recentes">Mais recentes</option>
            <option value="vendidos">Mais vendidos</option>
            <option value="menor">Menor preço</option>
            <option value="maior">Maior preço</option>
          </select>
        </div>

        <p className="mb-8 text-xs uppercase tracking-widest text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "peça" : "peças"} encontradas
        </p>

        {loading ? (
          <p className="py-20 text-center text-muted-foreground">Carregando peças…</p>
        ) : filtered.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">Nenhum produto encontrado com esses filtros.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}