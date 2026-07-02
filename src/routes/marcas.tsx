import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/ProductCard";
import { brands, products } from "@/lib/site-data";

export const Route = createFileRoute("/marcas")({
  head: () => ({
    meta: [
      { title: "Marcas — Nane Benites" },
      { name: "description", content: "As melhores marcas de moda fitness premium reunidas em um só lugar." },
      { property: "og:title", content: "Marcas — Nane Benites" },
      { property: "og:description", content: "Curadoria das melhores marcas fitness." },
      { property: "og:url", content: "/marcas" },
    ],
    links: [{ rel: "canonical", href: "/marcas" }],
  }),
  component: MarcasPage,
});

function MarcasPage() {
  return (
    <>
      <PageHero eyebrow="Marcas" title="Curadoria de marcas premium." description="Trabalhamos com marcas selecionadas que compartilham nossos padrões de qualidade, design e sofisticação." />

      <section className="container-x py-16 md:py-24">
        <div className="grid gap-x-8 gap-y-16">
          {brands.map((b) => {
            const items = products.filter((p) => p.brand === b.name);
            return (
              <div key={b.slug}>
                <div className="mb-8 flex items-end justify-between border-b border-border pb-4">
                  <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">{b.name}</h2>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{items.length} {items.length === 1 ? "peça" : "peças"}</span>
                </div>
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Em breve novas peças desta marca.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
                    {items.map((p) => (
                      <ProductCard key={p.slug} product={p} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}