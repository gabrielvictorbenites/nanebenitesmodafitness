import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/site-data";
import { formatPrice } from "@/lib/site-data";
import { useFavorites } from "@/lib/favorites";
import { SmartImage } from "./SmartImage";
import { colorOf } from "@/lib/product-image";

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
        <SmartImage
          src={product.image}
          alt={product.name}
          objectPosition={product.imagePosition ?? "50% 50%"}
          className="transition-transform duration-[900ms] ease-out group-hover:scale-105"
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
        <div className="flex items-center justify-between gap-2">
          <p className="eyebrow text-[10px]">{product.brand}</p>
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1">
              {product.colors.slice(0, 5).map((c) => (
                <div
                  key={c}
                  className="h-2 w-2 rounded-full border border-black/10"
                  style={{
                    backgroundColor: getColorHex(c),
                  }}
                  title={c}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-[8px] text-muted-foreground">+{product.colors.length - 5}</span>
              )}
            </div>
          )}
        </div>
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

function getColorHex(color: string): string {
  const map: Record<string, string> = {
    Preto: "#000000",
    Branco: "#FFFFFF",
    Cinza: "#8E8E8E",
    Vermelho: "#FF0000",
    Azul: "#0000FF",
    Verde: "#00FF00",
    Amarelo: "#FFFF00",
    Rosa: "#FFC0CB",
    Roxo: "#800080",
    Laranja: "#FFA500",
    Marrom: "#A52A2A",
    Bordô: "#800000",
    Nude: "#E3C9B2",
    Cru: "#F5F5DC",
    Marinho: "#000080",
    Turquesa: "#40E0D0",
    Fúcsia: "#FF00FF",
    Lilás: "#C8A2C8",
    Pêssego: "#FFDAB9",
    Bege: "#F5F5DC",
  };
  return map[color] || "#CCCCCC";
}