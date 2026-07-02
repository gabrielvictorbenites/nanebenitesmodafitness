import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import collectionImg from "@/assets/collection.jpg";
import { categories, testimonials, reasons, products, site } from "@/lib/site-data";
import { whatsappLink } from "@/lib/whatsapp";
import { CategoryCard } from "@/components/site/CategoryCard";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const featured = products.filter((p) => p.isBestseller || p.isNew).slice(0, 8);

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
        <div className="container-x relative z-10 flex h-full flex-col justify-end pb-16 md:justify-center md:pb-0">
          <div className="max-w-2xl animate-fade-in">
            <p className="mb-6 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.35em] text-background/70">
              <span className="h-px w-10 bg-brand" />
              Coleção 2026
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl lg:text-[5.5rem]">
              Vista sua<br />
              <span className="italic font-light">melhor versão.</span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-background/80 md:text-lg">
              Moda fitness premium para mulheres que treinam com estilo. Curadoria exclusiva das melhores marcas em peças que unem performance, conforto e sofisticação.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                to="/catalogo"
                className="group inline-flex items-center gap-3 rounded-full bg-brand px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-foreground transition-all hover:bg-brand-dark"
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
      <section className="border-y border-border bg-background">
        <div className="container-x flex flex-wrap items-center justify-between gap-6 py-6 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          <span>· Frete para todo Brasil</span>
          <span>· Marcas selecionadas</span>
          <span>· Atendimento personalizado</span>
          <span>· Peças exclusivas</span>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="container-x py-24 md:py-32">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Categorias</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-5xl">
              Encontre sua peça.
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
      </section>

      {/* COLLECTION SPLIT */}
      <section className="bg-[color:var(--surface)]">
        <div className="container-x grid gap-12 py-24 md:grid-cols-2 md:gap-16 md:py-32">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
            <img src={collectionImg} alt="Coleção Nane Benites" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="eyebrow">Nova Coleção</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
              Peças que traduzem a mulher que treina com propósito.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              Cada peça é escolhida a dedo pela Nane. Tecidos que sustentam o treino, modelagens que valorizam o corpo, cores atemporais que combinam com qualquer estilo. É a expressão de uma marca que entende a mulher moderna.
            </p>
            <div className="mt-10">
              <Link to="/colecoes" className="group inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-background transition-colors hover:bg-brand">
                Explorar coleções
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container-x py-24 md:py-32">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Destaques</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-5xl">
              O que está em alta.
            </h2>
          </div>
          <Link to="/lancamentos" className="link-underline text-sm font-medium text-foreground/80 hover:text-foreground">
            Ver lançamentos →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="border-y border-border bg-foreground py-24 text-background md:py-32">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-background/60">
              Por que Nane Benites
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              A experiência de uma marca <span className="italic font-light">premium.</span>
            </h2>
          </div>
          <div className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r, i) => (
              <div key={r.title} className="border-t border-background/15 pt-6">
                <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-brand/90">
                  0{i + 1}
                </p>
                <h3 className="mt-4 font-display text-xl font-semibold text-background">{r.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-background/70">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-x py-24 md:py-32">
        <div className="mb-14">
          <p className="eyebrow">Depoimentos</p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
            Mulheres que treinam com Nane Benites.
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="flex flex-col justify-between rounded-sm border border-border bg-background p-8">
              <blockquote className="font-display text-lg leading-snug tracking-tight text-foreground">
                "{t.text}"
              </blockquote>
              <figcaption className="mt-8">
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* INSTAGRAM GALLERY */}
      <section className="border-t border-border bg-[color:var(--surface)] py-24">
        <div className="container-x mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">@nanebenites</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Siga no Instagram.
            </h2>
          </div>
          <a href={site.instagram} target="_blank" rel="noreferrer" className="link-underline text-sm font-medium text-foreground/80 hover:text-foreground">
            @nanebenites →
          </a>
        </div>
        <div className="container-x grid grid-cols-2 gap-2 md:grid-cols-6">
          {categories.slice(0, 6).map((c) => (
            <a key={c.slug} href={site.instagram} target="_blank" rel="noreferrer" className="group relative aspect-square overflow-hidden rounded-sm bg-background">
              <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-foreground/0 transition-colors group-hover:bg-foreground/30" />
            </a>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand py-20 text-brand-foreground md:py-28">
        <div className="container-x flex flex-col items-center gap-8 text-center">
          <h2 className="max-w-3xl font-display text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            Pronta para vestir sua melhor versão?
          </h2>
          <p className="max-w-xl text-brand-foreground/80">
            Fale com nossa consultoria pelo WhatsApp e descubra a peça perfeita para você.
          </p>
          <a
            href={whatsappLink("Olá! Quero atendimento personalizado da Nane Benites.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-background px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            Chamar no WhatsApp
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </>
  );
}