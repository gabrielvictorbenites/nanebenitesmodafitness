import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/ProductCard";
import { products } from "@/lib/site-data";

export const Route = createFileRoute("/lancamentos")({
  head: () => ({
    meta: [
      { title: "Lançamentos — Nane Benites" },
      { name: "description", content: "As últimas novidades em moda fitness premium chegaram. Confira os lançamentos da Nane Benites." },
      { property: "og:title", content: "Lançamentos — Nane Benites" },
      { property: "og:description", content: "Novidades em moda fitness premium." },
      { property: "og:url", content: "/lancamentos" },
    ],
    links: [{ rel: "canonical", href: "/lancamentos" }],
  }),
  component: LancamentosPage,
});

function LancamentosPage() {
  const items = products.filter((p) => p.isNew);
  return (
    <>
      <PageHero
        eyebrow="Lançamentos"
        title="Recém-chegados."
        description="As peças mais novas da curadoria, prontas para elevar seu treino e seu look."
      />
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