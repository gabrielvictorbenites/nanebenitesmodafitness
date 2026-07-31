import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SmartImage } from "@/components/site/SmartImage";
import { collectionList, fetchCollectionBanners, type CollectionEntry } from "@/lib/collections";
import { resolveImageAsync, focalOf } from "@/lib/product-image";

export const Route = createFileRoute("/colecoes")({
  head: () => ({
    meta: [
      { title: "Coleções por marca — Nane Benites" },
      { name: "description", content: "Conheça as coleções Let's Gym, Run More, Live!, Lança Perfume e outras marcas parceiras da Nane Benites Moda Fitness." },
      { property: "og:title", content: "Coleções por marca — Nane Benites" },
      { property: "og:description", content: "Let's Gym, Run More, Live!, Lança Perfume e mais coleções fitness premium." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/colecoes" },
    ],
    links: [{ rel: "canonical", href: "/colecoes" }],
  }),
  component: ColecoesPage,
});

function ColecoesPage() {
  const list = collectionList();
  const [banners, setBanners] = useState<Record<string, { url: string; focal: string; tagline: string }>>({});

  useEffect(() => {
    let alive = true;
    (async () => {
      const map = await fetchCollectionBanners().catch(() => ({}));
      const entries = await Promise.all(
        Object.entries(map).map(async ([slug, b]) => [
          slug,
          { url: b.imageRef ? await resolveImageAsync(b.imageRef) : "", focal: focalOf(b.imageRef), tagline: b.tagline },
        ] as const),
      );
      if (alive) setBanners(Object.fromEntries(entries));
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Coleções"
        title="Cada marca, um universo."
        description="Reunimos as coleções das marcas que amamos — da alta performance ao lifestyle — com curadoria Nane Benites."
      />
      <section className="container-x py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-2">
          {list.map((c, i) => (
            <CollectionCard key={c.slug} collection={c} index={i} banner={banners[c.slug]} />
          ))}
        </div>
      </section>
    </>
  );
}

function CollectionCard({
  collection,
  index,
  banner,
}: {
  collection: CollectionEntry;
  index: number;
  banner?: { url: string; focal: string; tagline: string };
}) {
  return (
    <Link
      to="/catalogo"
      search={{ marca: collection.slug }}
      className="group relative block aspect-[3/4] overflow-hidden rounded-sm bg-[color:var(--surface)] md:aspect-[4/5]"
    >
      {banner?.url ? (
        <SmartImage
          src={banner.url}
          alt={`Coleção ${collection.name}`}
          objectPosition={banner.focal}
          className="transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[color:var(--surface)] to-background">
          {collection.logo ? (
            <img src={collection.logo} alt={collection.name} className="max-h-24 w-1/2 object-contain opacity-70" />
          ) : null}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/25 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-between p-8 text-background md:p-10">
        <div className="flex items-start justify-between">
          <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-background/70">
            0{index + 1}
          </span>
          {collection.logo ? (
            <img
              src={collection.logo}
              alt={collection.name}
              className="h-9 w-24 object-contain brightness-0 invert opacity-90"
            />
          ) : null}
        </div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-background/70">Coleção</p>
            <h2 className="mt-1 font-display text-3xl font-semibold md:text-4xl">{collection.name}</h2>
            <p className="mt-2 max-w-md text-sm text-background/80">
              {banner?.tagline || collection.description}
            </p>
          </div>
          <ArrowUpRight className="h-6 w-6 shrink-0 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
      </div>
    </Link>
  );
}
