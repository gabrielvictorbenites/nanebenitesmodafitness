import { createFileRoute } from "@tanstack/react-router";
import aboutImg from "@/assets/about.jpg";
import collectionImg from "@/assets/collection.jpg";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — Nane Benites Moda Fitness" },
      { name: "description", content: "Conheça a história, missão e valores da Nane Benites Moda Fitness." },
      { property: "og:title", content: "Sobre — Nane Benites" },
      { property: "og:description", content: "A história de uma marca premium de moda fitness feminina." },
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
        title="Uma marca feita para a mulher que se move com propósito."
        description="A Nane Benites nasceu do desejo de trazer para o Brasil a experiência de uma marca premium de moda fitness feminina — com curadoria, atendimento e produtos que realmente honram a mulher que os escolhe."
      />

      <section className="container-x grid gap-16 py-24 md:grid-cols-2 md:py-32">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
          <img src={aboutImg} alt="Loja Nane Benites" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="eyebrow">Nossa história</p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            De uma paixão pessoal a uma marca premium.
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              Tudo começou com uma insatisfação: era muito difícil encontrar peças fitness que unissem qualidade de tecido, modelagem impecável e estética verdadeiramente premium — sem ter que gastar uma fortuna importando.
            </p>
            <p>
              A Nane transformou essa lacuna em oportunidade. Hoje, atendemos clientes por todo o Brasil, oferecendo uma curadoria única das melhores marcas nacionais e internacionais, com consultoria personalizada e um padrão de cuidado que se tornou nossa assinatura.
            </p>
            <p>
              A marca cresceu, mas nossa essência permanece a mesma: peças que fazem você se sentir a sua melhor versão — dentro e fora do treino.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-[color:var(--surface)] py-24">
        <div className="container-x grid gap-12 md:grid-cols-3">
          {[
            { title: "Missão", text: "Vestir a mulher moderna com peças que unem performance, conforto e sofisticação — elevando a experiência do treino a um ritual de autocuidado." },
            { title: "Visão", text: "Ser referência nacional em moda fitness premium feminina, reconhecida pela curadoria, atendimento humano e experiência de marca inesquecível." },
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
        <div className="relative aspect-[16/7] overflow-hidden rounded-sm">
          <img src={collectionImg} alt="Coleção Nane Benites" loading="lazy" className="h-full w-full object-cover" />
        </div>
      </section>
    </>
  );
}