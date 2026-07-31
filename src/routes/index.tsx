import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { ArrowRight, MapPin, Instagram } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import collectionImg from "@/assets/collection.jpg";
import lojaCuritiba from "@/assets/loja-curitiba.jpg.asset.json";
import { site } from "@/lib/site-data";
import { useSiteCategoriesState } from "@/lib/categories";
import { whatsappLink } from "@/lib/whatsapp";
import { CategoryCard } from "@/components/site/CategoryCard";
import { SmartImage } from "@/components/site/SmartImage";
import { ScrollZoomIntro } from "@/components/site/ScrollZoomIntro";
import { FeaturedProducts } from "@/components/site/FeaturedProducts";
import { BrandMarquee } from "@/components/site/BrandMarquee";
import { fetchCategoryBanners } from "@/lib/banners";
import { resolveImageAsync, focalOf } from "@/lib/product-image";
import { fetchSiteImages } from "@/lib/site-images";
import { readSnapshots, writeSnapshots } from "@/lib/image-snapshot";
import { buildDefaults as buildTextDefaults, fetchSiteTexts, type SiteTextsMap } from "@/lib/site-content";
import brandRunMore from "@/assets/brands/run-more.png";
import brandZeroAcucar from "@/assets/brands/zero-acucar.png";
import brandLetsGym from "@/assets/brands/lets-gym.png";
import brandLancaPerfume from "@/assets/brands/lanca-perfume.png";
import brandMovimentoCia from "@/assets/brands/movimento-cia.png";
import brandMulherElastica from "@/assets/brands/mulher-elastica.png";
import brandLive from "@/assets/brands/live.png";

const brandLogos = [
  { name: "Run More", src: brandRunMore },
  { name: "Zero Açúcar", src: brandZeroAcucar },
  { name: "Let's Gym", src: brandLetsGym },
  { name: "Lança Perfume", src: brandLancaPerfume },
  { name: "Movimento & Companhia", src: brandMovimentoCia },
  { name: "Mulher Elástica", src: brandMulherElastica },
  { name: "Live", src: brandLive },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nane Benites Moda Fitness — Vista sua melhor versão" },
      {
        name: "description",
        content:
          "Moda fitness  roupas de treino e casuais das melhores marcas em Curitiba e Campo Largo. Leggings, tops, conjuntos e mais. Vem provar o seu!",
      },
      { property: "og:title", content: "Nane Benites Moda Fitness — Vista sua melhor versão" },
      {
        property: "og:description",
        content:
          "Moda fitness  roupas de treino e casuais das melhores marcas em Curitiba e Campo Largo. Leggings, tops, conjuntos e mais. Vem provar o seu!",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [catOverrides, setCatOverrides] = useState<Record<string, string>>({});
  const [t, setT] = useState<SiteTextsMap>(() => buildTextDefaults());
  const [imgs, setImgs] = useState<{ hero: string; collection: string; lojaCuritiba: string }>({
    hero: "",
    collection: "",
    lojaCuritiba: "",
  });
  const [imgPos, setImgPos] = useState<{ hero: string; collection: string; lojaCuritiba: string }>({
    hero: "50% 50%",
    collection: "50% 50%",
    lojaCuritiba: "50% 50%",
  });
  // Paint the last known images before the first frame (no flash of old defaults).
  useLayoutEffect(() => {
    const catSnap = readSnapshots(["__cat_overrides"]) as any;
    if (catSnap.__cat_overrides?.url) {
      try {
        setCatOverrides(JSON.parse(catSnap.__cat_overrides.url));
      } catch {}
    }
    const snap = readSnapshots(["home_hero", "home_collection", "home_loja_curitiba"]);
    if (!Object.keys(snap).length) return;
    setImgs((p) => ({
      hero: snap.home_hero?.url || p.hero,
      collection: snap.home_collection?.url || p.collection,
      lojaCuritiba: snap.home_loja_curitiba?.url || p.lojaCuritiba,
    }));
    setImgPos((p) => ({
      hero: snap.home_hero?.pos || p.hero,
      collection: snap.home_collection?.pos || p.collection,
      lojaCuritiba: snap.home_loja_curitiba?.pos || p.lojaCuritiba,
    }));
  }, []);
  useEffect(() => {
    let alive = true;
    (async () => {
      const map = await fetchCategoryBanners();
      const entries = await Promise.all(
        Object.entries(map)
          .filter(([, v]) => v.imageRef)
          .map(async ([slug, v]) => [slug, await resolveImageAsync(v.imageRef)] as const),
      );
      if (!alive) return;
      const obj = Object.fromEntries(entries);
      setCatOverrides(obj);
      writeSnapshots({ __cat_overrides: { url: JSON.stringify(obj), pos: "" } });
    })();
    (async () => {
      const m = await fetchSiteImages();
      const [hero, collection, loja] = await Promise.all([
        m.home_hero ? resolveImageAsync(m.home_hero, "hero") : Promise.resolve(""),
        m.home_collection ? resolveImageAsync(m.home_collection) : Promise.resolve(""),
        m.home_loja_curitiba ? resolveImageAsync(m.home_loja_curitiba) : Promise.resolve(""),
      ]);
      if (!alive) return;
      const next = {
        hero: hero || heroImg,
        collection: collection || collectionImg,
        lojaCuritiba: loja || lojaCuritiba.url,
      };
      const pos = {
        hero: focalOf(m.home_hero),
        collection: focalOf(m.home_collection),
        lojaCuritiba: focalOf(m.home_loja_curitiba),
      };
      setImgs(next);
      setImgPos(pos);
      writeSnapshots({
        home_hero: { url: next.hero, pos: pos.hero },
        home_collection: { url: next.collection, pos: pos.collection },
        home_loja_curitiba: { url: next.lojaCuritiba, pos: pos.lojaCuritiba },
      });
    })();
    (async () => {
      try {
        const texts = await fetchSiteTexts();
        if (alive) setT(texts);
      } catch {}
    })();
    return () => { alive = false; };
  }, []);
  const { categories: allCats, loading: catsLoading } = useSiteCategoriesState();
  const cats = allCats.map((c) => (catOverrides[c.slug] ? { ...c, image: catOverrides[c.slug] } : c));
  return (
    <>
      {/* HERO */}
      <section className="relative h-[72vh] min-h-[520px] max-h-[780px] w-full overflow-hidden bg-foreground text-background">
        <SmartImage
          src={imgs.hero}
          alt="Mulher em roupa fitness premium Nane Benites"
          width={1600}
          height={1920}
          priority
          objectPosition={imgPos.hero}
          skeletonClassName="bg-foreground"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/40 to-foreground/10" />
        <div className="container-x relative z-10 flex h-full flex-col justify-end pb-16 md:justify-center md:pb-0">
          <div className="max-w-2xl animate-fade-in">
            <p className="mb-6 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.35em] text-background/70">
              <span className="h-px w-10 bg-gradient-brand" />
              {t.home_hero_eyebrow}
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[0.95] tracking-tight md:text-5xl lg:text-6xl">
              {t.home_hero_title_line1}<br />
              <span className="italic font-light text-gradient-brand">{t.home_hero_title_line2}</span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-background/80 md:text-lg">
              {t.home_hero_description}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                to="/catalogo"
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-brand px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-elegant transition-transform hover:scale-105"
              >
                {t.home_hero_cta_label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={whatsappLink("Olá! Gostaria de conhecer as novidades da Nane Benites Moda Fitness.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-full border border-background/40 px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-background transition-colors hover:bg-background hover:text-foreground"
              >
                Chamar no WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 right-6 hidden text-[10px] font-medium uppercase tracking-[0.3em] text-background/50 md:block">
          {site.name} · Est. 2020
        </div>
      </section>

      <BrandMarquee brands={brandLogos} title="Marcas parceiras" />

      {/* DESTAQUES */}
      <FeaturedProducts />

      {/* CATEGORIAS */}
      <section className="bg-aurora">
       <div className="container-x py-24 md:py-32">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Categorias</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-5xl">
              Encontre <span className="text-gradient-brand italic font-light">sua peça.</span>
            </h2>
          </div>
          <Link to="/catalogo" className="link-underline text-sm font-medium text-foreground/80 hover:text-foreground">
            Ver catálogo completo →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-5">
          {catsLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-sm skeleton-block md:aspect-[4/5]" />
              ))
            : cats.map((c) => <CategoryCard key={c.slug} category={c} />)}
        </div>
       </div>
      </section>

      {/* COLLECTION SPLIT */}
      <section className="bg-gradient-soft">
        <div className="container-x grid gap-12 py-24 md:grid-cols-2 md:gap-16 md:py-32">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
            <SmartImage src={imgs.collection} alt="Coleção Nane Benites" objectPosition={imgPos.collection} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="eyebrow">Nova Coleção</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
              Peças que traduzem a mulher que treina com <span className="text-gradient-brand italic font-light">propósito.</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              Cada peça é escolhida a dedo pela Nane. Tecidos que sustentam o treino, modelagens que valorizam o corpo, cores atemporais que combinam com qualquer estilo. É a expressão de uma marca que entende a mulher moderna.
            </p>
            <div className="mt-10">
              <Link to="/colecoes" className="group inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-background transition-colors hover:bg-gradient-brand">
                Explorar coleções
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SCROLL ZOOM INTRO — foto interna da loja de Campo Largo */}
      <ScrollZoomIntro />

      {/* NOSSA LOJA — Curitiba */}
      <section className="bg-gradient-soft">
        <div className="container-x grid gap-12 py-24 md:grid-cols-2 md:gap-16 md:py-32">
          <div className="flex flex-col justify-center order-2 md:order-1">
            <p className="eyebrow flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" /> Nossas lojas físicas
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
              Venha nos <span className="text-gradient-brand italic font-light">visitar.</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              Duas experiências, a mesma essência. Em Curitiba e Campo Largo, você encontra toda a curadoria da Nane Benites com atendimento consultivo e provador exclusivo.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-brand">Curitiba</p>
                <p className="mt-2 text-xs text-muted-foreground">Seg a Sex · 09h às 19h</p>
                <p className="text-xs text-muted-foreground">Sáb · 09h às 14h</p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-purple">Campo Largo</p>
                <p className="mt-2 text-xs text-muted-foreground">Seg a Sex · 09h às 18h</p>
                <p className="text-xs text-muted-foreground">Sáb · 09h às 14h</p>
              </div>
            </div>
            <div className="mt-10">
              <Link
                to="/contato"
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-brand px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-elegant transition-transform hover:scale-105"
              >
                Ver endereços
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          <div className="relative order-1 md:order-2">
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-elegant">
              <SmartImage
                src={imgs.lojaCuritiba}
                alt="Fachada da loja Nane Benites em Curitiba"
                objectPosition={imgPos.lojaCuritiba}
                className="transition-transform duration-[1200ms] hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 to-transparent p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80">Loja Curitiba</p>
                <p className="mt-1 font-display text-xl font-semibold text-white">Nane Benites Moda Fitness</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INSTAGRAM CTA */}
      <section className="border-t border-border bg-gradient-soft py-24">
        <div className="container-x">
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="group relative block overflow-hidden rounded-3xl bg-gradient-brand p-10 text-white shadow-elegant transition-transform hover:scale-[1.01] md:p-16"
          >
            <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-xl">
                <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-white/80">Instagram</p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-5xl">
                  Siga <span className="italic font-light">@nanebenites</span>
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85 md:text-base">
                  Novidades, bastidores da loja e inspirações de looks fitness — tudo em primeira mão no nosso Instagram.
                </p>
              </div>
              <span className="inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-foreground shadow-sm transition-transform group-hover:scale-105">
                <Instagram className="h-4 w-4" />
                Seguir agora
              </span>
            </div>
          </a>
        </div>
      </section>
    </>
  );
}