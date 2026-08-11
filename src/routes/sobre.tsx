import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useState } from "react";
import collectionImg from "@/assets/collection.jpg";
import lojaCampoLargo from "@/assets/loja-campo-largo.jpg.asset.json";
import lojaCuritiba from "@/assets/loja-curitiba.jpg.asset.json";
import { PageHero } from "@/components/site/PageHero";
import { SmartImage } from "@/components/site/SmartImage";
import { fetchSiteImages } from "@/lib/site-images";
import { resolveImageAsync, focalOf } from "@/lib/product-image";
import { buildDefaults, fetchSiteTexts, type SiteTextsMap } from "@/lib/site-content";
import { readSnapshots, writeSnapshots, type Snap } from "@/lib/image-snapshot";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre - Nane Benites Moda Fitness" },
      { name: "description", content: "Conheça a nossa loja de moda fitness feminina em Campo Largo - PR." },
      { property: "og:title", content: "Sobre - Nane Benites" },
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
  const [imgs, setImgs] = useState<Record<string, string>>({});
  const [pos, setPos] = useState<Record<string, string>>({});
  const [t, setT] = useState<SiteTextsMap>(() => buildDefaults());
  useLayoutEffect(() => {
    const snap = readSnapshots(Object.keys(defaults));
    if (!Object.keys(snap).length) return;
    const list = Object.entries(snap) as [string, Snap][];
    setImgs((p) => ({ ...p, ...Object.fromEntries(list.map(([k, v]) => [k, v.url])) }));
    setPos((p) => ({ ...p, ...Object.fromEntries(list.map(([k, v]) => [k, v.pos])) }));
  }, []);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const map = await fetchSiteImages();
        const resolved: Record<string, string> = { ...defaults };
        const positions: Record<string, string> = {};
        await Promise.all(
          Object.entries(map).map(async ([k, ref]) => {
            if (ref) resolved[k] = await resolveImageAsync(ref);
            if (ref) positions[k] = focalOf(ref);
          }),
        );
        if (alive) {
          setImgs(resolved);
          setPos(positions);
          writeSnapshots(
            Object.fromEntries(
              Object.keys(defaults).map((k) => [
                k,
                { url: resolved[k] ?? defaults[k], pos: positions[k] ?? "50% 50%" },
              ]),
            ),
          );
        }
      } catch {}
      try {
        const texts = await fetchSiteTexts();
        if (alive) setT(texts);
      } catch {}
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <PageHero
        eyebrow={t.sobre_hero_eyebrow}
        title={t.sobre_hero_title}
        description={t.sobre_hero_description}
      />

      <section className="container-x grid gap-16 py-24 md:grid-cols-2 md:py-32">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-elegant">
          <SmartImage src={imgs.sobre_top} alt="Interior da loja Nane Benites em Campo Largo" objectPosition={pos.sobre_top ?? "50% 50%"} />
        </div>
        <div className="flex flex-col justify-center">
          <p className="eyebrow">Nossa história</p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            {t.sobre_history_title}
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>{t.sobre_history_p1}</p>
            <p>{t.sobre_history_p2}</p>
            <p>{t.sobre_history_p3}</p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-[color:var(--surface)] py-24">
        <div className="container-x grid gap-12 md:grid-cols-3">
          {[
            { title: t.sobre_pillar1_title, text: t.sobre_pillar1_text },
            { title: t.sobre_pillar2_title, text: t.sobre_pillar2_text },
            { title: t.sobre_pillar3_title, text: t.sobre_pillar3_text },
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
            <SmartImage src={imgs.sobre_bottom_1} alt="Loja Nane Benites" objectPosition={pos.sobre_bottom_1 ?? "50% 50%"} />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 to-transparent p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80">Nossas lojas</p>
              <p className="mt-1 font-display text-lg font-semibold text-white">Curitiba · Campo Largo</p>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-elegant">
            <SmartImage src={imgs.sobre_bottom_2} alt="Coleção Nane Benites" objectPosition={pos.sobre_bottom_2 ?? "50% 50%"} />
          </div>
        </div>
      </section>
    </>
  );
}