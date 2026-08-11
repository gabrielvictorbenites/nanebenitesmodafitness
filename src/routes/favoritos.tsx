import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useFavorites } from "@/lib/favorites";
import { fetchProducts } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/favoritos")({
  component: FavoritesPage,
  head: () => ({
    meta: [
      { title: "Meus Favoritos — Nane Benites" },
      { name: "description", content: "Suas peças favoritas da Nane Benites Moda Fitness." },
    ],
  }),
});

function FavoritesPage() {
  const { items, clear } = useFavorites();
  const { data: products = [] } = useQuery({
    queryKey: ["products", "all"],
    queryFn: fetchProducts,
  });
  const favProducts = products.filter((p) => items.includes(p.slug));

  return (
    <div className="relative">
      <div className="bg-aurora">
        <div className="container-x py-20 md:py-28">
          <p className="eyebrow">Área pessoal</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
            <h1 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
              Meus <span className="text-gradient-brand italic font-light">Favoritos</span>
            </h1>
            {favProducts.length > 0 ? (
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-foreground backdrop-blur hover:bg-background"
              >
                <Trash2 className="h-4 w-4" /> Limpar lista
              </button>
            ) : null}
          </div>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground">
            {favProducts.length > 0
              ? `${favProducts.length} peça${favProducts.length > 1 ? "s" : ""} salva${favProducts.length > 1 ? "s" : ""}. Chame no WhatsApp para verificar disponibilidade.`
              : "Sua lista está vazia por enquanto. Toque no coração de qualquer produto para salvá-lo aqui."}
          </p>
        </div>
      </div>

      <div className="container-x py-16">
        {favProducts.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center gap-6 rounded-3xl border border-border bg-background p-12 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-soft">
              <Heart className="h-7 w-7 text-brand-purple" />
            </div>
            <p className="text-sm text-muted-foreground">
              Explore o catálogo e comece a montar seus looks favoritos.
            </p>
            <Link
              to="/catalogo" search={{ marca: undefined }}
              className="rounded-full bg-gradient-brand px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-elegant transition-transform hover:scale-105"
            >
              Ir para o catálogo
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {favProducts.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
            <div className="mt-16 flex flex-col items-center gap-4 rounded-3xl bg-gradient-brand p-10 text-center text-white">
              <h2 className="max-w-xl font-display text-2xl font-semibold md:text-3xl">
                Envie sua lista completa para nossa consultoria
              </h2>
              <a
                href={whatsappLink(
                  `Olá! Tenho interesse nestas peças da minha lista de favoritos:\n\n${favProducts
                    .map((p) => `• ${p.name} (${p.sku})`)
                    .join("\n")}\n\nGostaria de verificar disponibilidade.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-card px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground hover:bg-card/90"
              >
                Enviar lista pelo WhatsApp
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}