import { useEffect, useRef, useState } from "react";

interface Brand {
  name: string;
  src: string;
}

interface BrandMarqueeProps {
  brands: Brand[];
  title?: string;
}

export function BrandMarquee({ brands, title = "Marcas parceiras" }: BrandMarqueeProps) {
  const [isMounted, setIsMounted] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Duplicate the list once to guarantee a seamless loop on every viewport.
  const items = [...brands, ...brands];

  return (
    <section className="overflow-hidden border-y border-border bg-white">
      <div className="container-x pt-8 pb-3 text-center">
        <p className="eyebrow text-foreground/55">{title}</p>
      </div>

      <div
        className="group relative flex items-center py-8 md:py-10"
        onMouseEnter={() => {
          if (trackRef.current) {
            trackRef.current.style.animationPlayState = "paused";
          }
        }}
        onMouseLeave={() => {
          if (trackRef.current) {
            trackRef.current.style.animationPlayState = "running";
          }
        }}
      >
        {/* Soft edge fades for a premium seamless look */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent md:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent md:w-28" />

        <div
          ref={trackRef}
          className="flex shrink-0 items-center gap-10 md:gap-14 animate-marquee"
          style={{
            opacity: isMounted ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        >
          {items.map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              className="flex h-24 w-48 shrink-0 items-center justify-center rounded-xl bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md md:h-28 md:w-60 md:p-5"
              title={brand.name}
            >
              <img
                src={brand.src}
                alt={brand.name}
                loading="lazy"
                className="max-h-full max-w-full object-contain opacity-90 grayscale transition-all duration-500 ease-out hover:opacity-100 hover:grayscale-0 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
