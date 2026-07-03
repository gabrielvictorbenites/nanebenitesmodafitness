import { createFileRoute } from "@tanstack/react-router";
import collectionImg from "@/assets/collection.jpg";
import lojaCampoLargo from "@/assets/loja-campo-largo.jpg.asset.json";
import lojaCuritiba from "@/assets/loja-curitiba.jpg.asset.json";
import { PageHero } from "@/components/site/PageHero";

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

const values = [
  { title: "Qualidade", text: "Não abrimos mão da excelência em cada peça que entra na curadoria." },
  { title: "Elegância", text: "Estilo é atemporal. Nossas peças combinam moda e performance com sofisticação." },
  { title: "Autenticidade", text: "Uma marca feita por mulher, para mulheres reais que treinam de verdade." },
  { title: "Cuidado", text: "Do primeiro contato à entrega — cada detalhe é pensado para você." },
];

function SobrePage() {
  return (
    <>
      <PageHero
        eyebrow="Sobre"
        title="Uma loja feita para a mulher que se move com propósito."
        description="A Nane Benites é uma loja de moda fitness feminina em Campo Largo — PR. Nasceu do desejo de oferecer uma curadoria cuidadosa, atendimento próximo e peças que realmente honram a mulher que os escolhe."
      />

      <section className="container-x grid gap-16 py-24 md:grid-cols-2 md:py-32">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-elegant">
          <img src={lojaCampoLargo.url} alt="Interior da loja Nane Benites em Campo Largo" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="eyebrow">Nossa história</p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            De uma paixão pessoal a uma loja de referência.
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              Tudo começou com uma insatisfação: era muito difícil encontrar peças fitness que unissem qualidade de tecido, modelagem impecável e estética verdadeiramente premium — sem ter que gastar uma fortuna importando.
            </p>
            <p>
              A Nane transformou essa lacuna em oportunidade. Hoje, na nossa loja em Campo Largo — PR, oferecemos uma curadoria única das melhores marcas nacionais e internacionais, com consultoria personalizada e um padrão de cuidado que se tornou nossa assinatura.
            </p>
            <p>
              A loja cresceu, mas nossa essência permanece a mesma: peças que fazem você se sentir a sua melhor versão — dentro e fora do treino.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-[color:var(--surface)] py-24">
        <div className="container-x grid gap-12 md:grid-cols-3">
          {[
            { title: "Missão", text: "Vestir a mulher moderna com peças que unem performance, conforto e sofisticação — elevando a experiência do treino a um ritual de autocuidado." },
            { title: "Visão", text: "Ser referência em moda fitness feminina no Paraná, reconhecida pela curadoria, atendimento humano e experiência de loja inesquecível." },
            { title: "Valores", text: "Qualidade sem concessões, elegância atemporal, autenticidade em cada relação e cuidado em cada detalhe." },
          ].map((v) => (
            <div key={v.title} className="border-t border-foreground pt-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-brand">{v.title}</p>
              <p className="mt-4 text-base leading-relaxed text-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-24 md:py-32">
        <div className="mb-14 text-center">
          <p className="eyebrow">Nossos valores</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">O que nos guia.</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <div key={v.title} className="border-t border-border pt-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-brand">0{i + 1}</p>
              <h3 className="mt-4 font-display text-xl font-semibold">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x pb-24">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-elegant">
            <img src={lojaCuritiba.url} alt="Fachada da loja em Curitiba" loading="lazy" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 to-transparent p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80">Curitiba</p>
              <p className="mt-1 font-display text-lg font-semibold text-white">Nossa fachada</p>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-elegant">
            <img src={collectionImg} alt="Coleção Nane Benites" loading="lazy" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>
    </>
  );
}