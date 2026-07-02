import { useRef } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/site-data";
import { ProductCard } from "./ProductCard";

export function ProductCarousel({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative -mx-5 md:-mx-10 xl:-mx-16">
      <motion.div
        ref={trackRef}
        drag="x"
        dragConstraints={{
          left: -((products.length - 1) * 260),
          right: 0,
        }}
        dragElastic={0.15}
        className="no-scrollbar flex cursor-grab items-stretch gap-5 overflow-x-auto scroll-smooth px-5 pb-4 active:cursor-grabbing md:gap-6 md:px-10 xl:px-16"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {products.map((p) => (
          <div
            key={p.slug}
            className="w-[70vw] shrink-0 sm:w-[42vw] md:w-[30vw] lg:w-[22vw]"
            style={{ scrollSnapAlign: "start" }}
            onDragStart={(e) => e.preventDefault()}
          >
            <ProductCard product={p} />
          </div>
        ))}
        <div className="w-2 shrink-0" />
      </motion.div>
      <p className="mt-4 px-5 text-[11px] uppercase tracking-[0.25em] text-muted-foreground md:px-10 xl:px-16">
        ← Arraste para o lado
      </p>
    </div>
  );
}