import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { fetchProducts, type DbProduct } from "@/lib/products";

export function FeaturedProducts() {
  const [items, setItems] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchProducts()
      .then((all) => {
        if (!alive) return;
        const active = all.filter((p) => p.active);
        const featured = active.filter((p) => p.featured);
        // Fallback for legacy data: use bestsellers if nothing is explicitly featured yet
        const list = featured.length > 0 ? featured : active.filter((p) => p.isBestseller);
        setItems(list.slice(0, 8));
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section id="destaques" className="bg-gradient-soft">
      <div className="container-x py-24 md:py-32">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Destaques</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-5xl">
              Produtos <span className="text-gradient-brand italic font-light">em destaque.</span>
            </h2>
          </div>
          <Link to="/catalogo" className="link-underline text-sm font-medium text-foreground/80 hover:text-foreground">
            Ver catálogo completo →
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] rounded-sm skeleton-block" />
                <div className="h-3 w-1/3 skeleton-block" />
                <div className="h-3 w-2/3 skeleton-block" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        <div className="mt-14 flex justify-center">
          <Link
            to="/catalogo"
            className="group inline-flex items-center gap-3 rounded-full bg-gradient-brand px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-elegant transition-transform hover:scale-105"
          >
            Ver catálogo completo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}