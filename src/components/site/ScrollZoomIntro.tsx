import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import lojaInterna from "@/assets/loja-interior-hd.png.asset.json";

export function ScrollZoomIntro() {
  return (
    <section className="relative h-[85vh] min-h-[580px] w-full overflow-hidden">
        <img
          src={lojaInterna.url}
          alt="Interior da loja Nane Benites em Campo Largo"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/65 via-foreground/40 to-foreground/80" />

        <div className="container-x relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
          <div className="max-w-3xl">
            <p className="mb-6 flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.35em] text-white/80">
              <span className="h-px w-10 bg-gradient-brand" />
              Bem-vinda ao nosso universo
              <span className="h-px w-10 bg-gradient-brand" />
            </p>
            <h2 className="font-display text-4xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
              Sua loja de{" "}
              <span className="italic font-light text-gradient-brand">moda fitness</span> premium.
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              Curadoria exclusiva de marcas selecionadas - cada peça pensada para vestir sua melhor versão, com atendimento consultivo e provador exclusivo.
            </p>
          </div>

          <div className="absolute inset-x-0 bottom-16 flex flex-col items-center gap-6 px-6">
            <Link
              to="/catalogo" search={{ marca: undefined }}
              className="group inline-flex items-center gap-3 rounded-full bg-card px-9 py-5 text-xs font-semibold uppercase tracking-[0.25em] text-foreground shadow-elegant transition-transform hover:scale-105"
            >
              Entrar no catálogo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
    </section>
  );
}
