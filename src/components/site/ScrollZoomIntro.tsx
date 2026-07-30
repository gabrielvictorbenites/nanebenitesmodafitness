import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import lojaInterna from "@/assets/loja-campo-largo.jpg.asset.json";

export function ScrollZoomIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20, restDelta: 0.001 });

  // Only transform/opacity are animated — animating `filter: blur()` on a
  // full-screen image forces a repaint every frame and causes scroll jank.
  const scale = useTransform(smooth, [0, 1], [1.05, 1.7]);
  const overlay = useTransform(smooth, [0, 0.5, 1], [0.55, 0.4, 0.25]);
  const textY = useTransform(smooth, [0, 1], ["0%", "-30%"]);
  const textOpacity = useTransform(smooth, [0, 0.6, 1], [1, 0.6, 0]);
  const ctaOpacity = useTransform(smooth, [0.5, 0.85], [0, 1]);
  const ctaY = useTransform(smooth, [0.5, 0.85], [40, 0]);

  return (
    <section ref={ref} className="relative h-[180vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.img
          src={lojaInterna.url}
          alt="Interior da loja Nane Benites em Campo Largo"
          loading="lazy"
          decoding="async"
          style={{ scale }}
          className="absolute inset-0 h-full w-full object-cover will-change-transform [transform:translateZ(0)]"
        />
        <motion.div
          style={{ opacity: overlay }}
          className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/40 to-foreground/80"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-brand/30 via-transparent to-brand-purple/30 mix-blend-overlay" />

        <div className="container-x relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
          <motion.div style={{ y: textY, opacity: textOpacity }} className="max-w-3xl">
            <p className="mb-6 flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.35em] text-white/80">
              <span className="h-px w-10 bg-gradient-brand" />
              Bem-vinda ao nosso universo
              <span className="h-px w-10 bg-gradient-brand" />
            </p>
            <h2 className="font-display text-4xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
              Uma experiência que{" "}
              <span className="italic font-light text-gradient-brand">se abre</span> para você.
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              Role para descobrir a curadoria completa da Nane Benites — cada peça escolhida para vestir sua melhor versão.
            </p>
          </motion.div>

          <motion.div
            style={{ opacity: ctaOpacity, y: ctaY }}
            className="absolute inset-x-0 bottom-24 flex flex-col items-center gap-6 px-6"
          >
            <Link
              to="/catalogo"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-9 py-5 text-xs font-semibold uppercase tracking-[0.25em] text-foreground shadow-elegant transition-transform hover:scale-105"
            >
              Entrar no catálogo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}