import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import collectionImg from "@/assets/collection.jpg";
import lojaCampoLargo from "@/assets/loja-campo-largo.jpg.asset.json";
import lojaCuritiba from "@/assets/loja-curitiba.jpg.asset.json";
import { PageHero } from "@/components/site/PageHero";
import { fetchSiteImages } from "@/lib/site-images";
import { resolveImageAsync } from "@/lib/product-image";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — Nane Benites Moda Fitness" },
      { name: "description", content: "Conheça a nossa loja de moda fitness feminina em Campo Largo — PR." },
      { property: "og:title", content: "Sobre — Nane Benites" },
      { property: "og:description", content: "A história da nossa loja de moda fitness feminina." },
      { property: "og:url", content: "/sobre" },
    ],
    links: [{ rel: "canonical", href: "/sobre" }],
  }),
  component: SobrePage,
});

function SobrePage() {
  const defaults: Record<string, string> = {
    sobre_top: lojaCampoLargo.url,
    sobre_bottom_1: lojaCuritiba.url,
    sobre_bottom_2: collectionImg,
  };
  const [imgs, setImgs] = useState<Record<string, string>>(defaults);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const map = await fetchSiteImages();
        const resolved: Record<string, string> = { ...defaults };
        await Promise.all(
          Object.entries(map).map(async ([k, ref]) => {
            if (ref) resolved[k] = await resolveImageAsync(ref);
          }),
        );
        if (alive) setImgs(resolved);
      } catch {}
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Sobre a Empresa"
        title="Nane Benites Moda Fitness: onde estilo e conforto se encontram."
        description="Fundada em 2020, em Campo Largo, a Nane Benites nasceu com o propósito de oferecer moda casual e fitness feminina — reunindo as melhores marcas em um só espaço, com um olhar atento à qualidade, ao conforto e ao estilo."
      />

      <section className="container-x grid gap-16 py-24 md:grid-cols-2 md:py-32">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-elegant">
          <img src={imgs.sobre_top} alt="Interior da loja Nane Benites em Campo Largo" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="eyebrow">Nossa história</p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            A união de duas trajetórias que se transformou em marca.
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              A Nane Benites Moda Fitness nasceu em 2020 da união da experiência de <strong className="text-foreground">Eliane Benites</strong>, com mais de 20 anos no setor de vendas e no comando de uma loja de artigos esportivos em Cascavel — PR, e de <strong className="text-foreground">José Henrique Espaki</strong>, administrador com mais de 30 anos de atuação nas áreas financeira e administrativa.
            </p>
            <p>
              Fundada em Campo Largo, a marca surgiu com o propósito de oferecer moda casual e fitness feminina, reunindo as melhores marcas em um só espaço. Com um olhar atento à qualidade, ao conforto e ao estilo, a empresa busca se consolidar como referência no segmento.
            </p>
            <p>
              Hoje, com lojas em Curitiba e Campo Largo, seguimos com o mesmo compromisso do primeiro dia: entregar peças que fazem a mulher se sentir a sua melhor versão — dentro e fora do treino.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-[color:var(--surface)] py-24">
        <div className="container-x grid gap-12 md:grid-cols-3">
          {[
            { title: "A união de experiências", text: "Eliane trouxe sua expertise em vendas e no mercado esportivo, enquanto José contribuiu com seu conhecimento na gestão administrativa e financeira." },
            { title: "Fundação e propósito", text: "Criada em 2020 em Campo Largo, a Nane Benites nasceu com foco na moda casual e fitness feminina, sempre prezando pela qualidade e pela variedade." },
            { title: "Compromisso com as clientes", text: "Trabalhamos com marcas renomadas, selecionadas para proporcionar conforto, autoestima, praticidade e estilo, buscando ser referência no setor de moda fitness." },
          ].map((v) => (
            <div key={v.title} className="border-t border-foreground pt-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-brand">{v.title}</p>
              <p className="mt-4 text-base leading-relaxed text-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-24">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-elegant">
            <img src={imgs.sobre_bottom_1} alt="Loja Nane Benites" loading="lazy" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 to-transparent p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80">Nossas lojas</p>
              <p className="mt-1 font-display text-lg font-semibold text-white">Curitiba · Campo Largo</p>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-elegant">
            <img src={imgs.sobre_bottom_2} alt="Coleção Nane Benites" loading="lazy" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>
    </>
  );
}