import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/ProductCard";
import { fetchProducts, type DbProduct } from "@/lib/products";

export const Route = createFileRoute("/lancamentos")({
  head: () => ({
    meta: [
      { title: "Lançamentos - Nane Benites" },
      { name: "description", content: "As últimas novidades em moda fitness premium chegaram. Confira os lançamentos da Nane Benites." },
      { property: "og:title", content: "Lançamentos - Nane Benites" },
      { property: "og:description", content: "Novidades em moda fitness premium." },
      { property: "og:url", content: "/lancamentos" },
    ],
    links: [{ rel: "canonical", href: "/lancamentos" }],
  }),
  component: LancamentosPage,
});

function LancamentosPage() {
  const [items, setItems] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    fetchProducts()
      .then((rows) => alive && setItems(rows.filter((p) => p.isNew)))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);
  return (
    <>
      <PageHero
        eyebrow="Lançamentos"
        title="Recém-chegados."
        description="As peças mais novas da curadoria, prontas para elevar seu treino e seu look."
      />
      <section className="container-x py-16 md:py-24">
        {loading ? (
          <p className="py-20 text-center text-muted-foreground">Carregando…</p>
        ) : items.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">Sem lançamentos no momento.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}