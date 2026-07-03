import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/site-data";
import { formatPrice } from "@/lib/site-data";
import { useFavorites } from "@/lib/favorites";

export function ProductCard({ product }: { product: Product }) {
  const { has, toggle } = useFavorites();
  const fav = has(product.slug);
  return (
    <Link
      to="/produto/$slug"
      params={{ slug: product.slug }}
      className="group block"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[color:var(--surface)]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 flex flex-col gap-1.5">
          {product.isNew ? (
            <span className="rounded-full bg-background/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-foreground">
              Novo
            </span>
          ) : null}
          {product.isSale ? (
            <span className="rounded-full bg-brand px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-brand-foreground">
              Oferta
            </span>
          ) : null}
          {product.isBestseller ? (
            <span className="rounded-full bg-foreground/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-background">
              Mais Vendido
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(product.slug);
          }}
          aria-label={fav ? "Remover dos favoritos" : "Favoritar"}
          aria-pressed={fav}
          className={`absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/95 shadow-sm transition-all duration-300 hover:text-brand ${
            fav ? "text-brand" : "text-foreground"
          }`}
        >
          <Heart className={`h-4 w-4 transition-transform ${fav ? "fill-current scale-110" : ""}`} />
        </button>
      </div>
      <div className="mt-4 flex flex-col gap-1">
        <p className="eyebrow text-[10px]">{product.brand}</p>
        <h3 className="text-sm font-medium text-foreground">{product.name}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          {product.salePrice ? (
            <>
              <span className="text-sm font-semibold text-brand">{formatPrice(product.salePrice)}</span>
              <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-sm font-semibold text-foreground">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}