import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { categories } from "@/lib/site-data";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/colecoes")({
  head: () => ({
    meta: [
      { title: "Coleções — Nane Benites" },
      { name: "description", content: "Explore todas as coleções da Nane Benites Moda Fitness organizadas por categoria." },
      { property: "og:title", content: "Coleções — Nane Benites" },
      { property: "og:description", content: "Todas as coleções organizadas por categoria." },
      { property: "og:url", content: "/colecoes" },
    ],
    links: [{ rel: "canonical", href: "/colecoes" }],
  }),
  component: ColecoesPage,
});

function ColecoesPage() {
  return (
    <>
      <PageHero
        eyebrow="Coleções"
        title="Cada coleção é um universo."
        description="Da performance ao lifestyle, explore composições pensadas para acompanhar cada momento da mulher moderna."
      />
      <section className="container-x py-16 md:py-24">
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((c, i) => (
            <Link
              key={c.slug}
              to="/categoria/$slug"
              params={{ slug: c.slug }}
              className="group relative block aspect-[16/10] overflow-hidden rounded-sm bg-[color:var(--surface)]"
            >
              <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-between p-8 text-background md:p-12">
                <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-background/70">0{i + 1}</span>
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="font-display text-3xl font-semibold md:text-4xl">{c.name}</h2>
                    <p className="mt-2 max-w-md text-sm text-background/80">{c.description}</p>
                  </div>
                  <ArrowUpRight className="h-6 w-6 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}