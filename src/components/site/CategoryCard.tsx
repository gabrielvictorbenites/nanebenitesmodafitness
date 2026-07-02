import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/site-data";

export function CategoryCard({ category, large = false }: { category: Category; large?: boolean }) {
  return (
    <Link
      to="/categoria/$slug"
      params={{ slug: category.slug }}
      className={`group relative block overflow-hidden rounded-sm bg-[color:var(--surface)] ${
        large ? "aspect-[4/5] md:aspect-[3/4]" : "aspect-[3/4]"
      }`}
    >
      <img
        src={category.image}
        alt={category.name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-background md:p-7">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-background/70">
            Categoria
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold md:text-2xl">{category.name}</h3>
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-background/40 text-background transition-all duration-500 group-hover:bg-background group-hover:text-foreground">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}