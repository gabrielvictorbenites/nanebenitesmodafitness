import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Instagram } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import collectionImg from "@/assets/collection.jpg";
import lojaCuritiba from "@/assets/loja-curitiba.jpg.asset.json";
import { categories, site } from "@/lib/site-data";
import { whatsappLink } from "@/lib/whatsapp";
import { CategoryCard } from "@/components/site/CategoryCard";
import { ScrollZoomIntro } from "@/components/site/ScrollZoomIntro";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[92vh] min-h-[640px] w-full overflow-hidden bg-foreground text-background">
        <img
          src={heroImg}
          alt="Mulher em roupa fitness premium Nane Benites"
          width={1600}
          height={1920}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/40 to-foreground/10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-brand/25 via-transparent to-brand-purple/30 mix-blend-overlay" />
        <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-brand/30 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-[28rem] w-[28rem] rounded-full bg-brand-purple/30 blur-3xl animate-blob" style={{ animationDelay: "6s" }} />
        <div className="container-x relative z-10 flex h-full flex-col justify-end pb-16 md:justify-center md:pb-0">
          <div className="max-w-2xl animate-fade-in">
            <p className="mb-6 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.35em] text-background/70">
              <span className="h-px w-10 bg-gradient-brand" />
              Coleção 2026
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl lg:text-[5.5rem]">
              Vista sua<br />
              <span className="italic font-light text-gradient-brand">melhor versão.</span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-background/80 md:text-lg">
              Moda fitness premium para mulheres que treinam com estilo. Curadoria exclusiva das melhores marcas em peças que unem performance, conforto e sofisticação.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                to="/catalogo"
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-brand px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-elegant transition-transform hover:scale-105"
              >
                Ver Catálogo
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

      {/* STRIP */}
      <section className="overflow-hidden border-y border-border bg-gradient-brand text-white">
        <div className="flex animate-marquee gap-16 whitespace-nowrap py-4 text-[11px] font-semibold uppercase tracking-[0.3em]">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex shrink-0 items-center gap-16">
              <span>◆ Frete para todo Brasil</span>
              <span>◆ Marcas selecionadas</span>
              <span>◆ Atendimento personalizado</span>
              <span>◆ Peças exclusivas</span>
              <span>◆ Loja física em Curitiba e Campo Largo</span>
              <span>◆ Consultoria via WhatsApp</span>
            </div>
          ))}
        </div>
      </section>

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
          {categories.slice(0, 5).map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 md:mt-5 md:grid-cols-3 md:gap-5 lg:grid-cols-5">
          {categories.slice(5, 10).map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
       </div>
      </section>

      {/* COLLECTION SPLIT */}
      <section className="bg-gradient-soft">
        <div className="container-x grid gap-12 py-24 md:grid-cols-2 md:gap-16 md:py-32">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
            <img src={collectionImg} alt="Coleção Nane Benites" loading="lazy" className="h-full w-full object-cover" />
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
                <p className="mt-2 text-xs text-muted-foreground">Seg a Sex · 09h às 19h</p>
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
            <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-brand opacity-30 blur-2xl" />
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-elegant">
              <img
                src={lojaCuritiba.url}
                alt="Fachada da loja Nane Benites em Curitiba"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-105"
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
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 -bottom-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
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