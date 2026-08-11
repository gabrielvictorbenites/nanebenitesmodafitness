import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/ProductCard";
import { productsByCategory } from "@/lib/site-data";

export const Route = createFileRoute("/acessorios")({
  head: () => ({
    meta: [
      { title: "Acessórios - Nane Benites" },
      { name: "description", content: "Acessórios fitness premium: garrafas, faixas, meias e essenciais para completar seu look." },
      { property: "og:title", content: "Acessórios - Nane Benites" },
      { property: "og:description", content: "Acessórios fitness premium." },
      { property: "og:url", content: "/acessorios" },
    ],
    links: [{ rel: "canonical", href: "/acessorios" }],
  }),
  component: AcessoriosPage,
});

function AcessoriosPage() {
  const items = productsByCategory("acessorios");
  return (
    <>
      <PageHero eyebrow="Acessórios" title="Detalhes que completam." description="Garrafas, faixas, scrunchies e mais. Os essenciais para o seu ritual de treino." />
      <section className="container-x py-16 md:py-24">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}