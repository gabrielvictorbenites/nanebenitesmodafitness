import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/ProductCard";
import { products } from "@/lib/site-data";

export const Route = createFileRoute("/promocoes")({
  head: () => ({
    meta: [
      { title: "Promoções — Nane Benites" },
      { name: "description", content: "Ofertas exclusivas em moda fitness premium. Peças selecionadas com condições especiais." },
      { property: "og:title", content: "Promoções — Nane Benites" },
      { property: "og:description", content: "Ofertas exclusivas em moda fitness premium." },
      { property: "og:url", content: "/promocoes" },
    ],
    links: [{ rel: "canonical", href: "/promocoes" }],
  }),
  component: PromocoesPage,
});

function PromocoesPage() {
  const items = products.filter((p) => p.isSale);
  return (
    <>
      <PageHero eyebrow="Promoções" title="Peças selecionadas em oferta." description="Curadoria com condições especiais por tempo limitado." />
      <section className="container-x py-16 md:py-24">
        {items.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">Nenhuma promoção ativa no momento.</p>
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