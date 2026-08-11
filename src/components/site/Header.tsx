import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Heart, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";
import { useFavorites } from "@/lib/favorites";
import logoAsset from "@/assets/logo-nane-v2.png.asset.json";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/sobre", label: "Sobre" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/categorias", label: "Categorias" },
  { to: "/colecoes", label: "Coleções" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const hiddenRef = useRef(false);
  const scrolledRef = useRef(false);
  const { count } = useFavorites();

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const nextScrolled = y > 12;
        let nextHidden = hiddenRef.current;
        if (y <= 12) nextHidden = false;
        else if (y > lastY + 10 && !open) nextHidden = true;
        else if (y < lastY - 10) nextHidden = false;
        if (nextScrolled !== scrolledRef.current) {
          scrolledRef.current = nextScrolled;
          setScrolled(nextScrolled);
        }
        if (nextHidden !== hiddenRef.current) {
          hiddenRef.current = nextHidden;
          setHidden(nextHidden);
        }
        lastY = y;
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transform-gpu bg-nav transition-[transform,box-shadow,border-color] duration-300 ease-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${scrolled ? "border-b border-border/50 shadow-sm" : "border-b border-transparent"}`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-6 md:h-[76px]">
        <Link to="/" className="flex shrink-0 items-center">
          <img
            src={logoAsset.url}
            alt="Nane Benites Moda Fitness"
            className="h-16 w-auto shrink-0 object-contain md:h-20"
          />
        </Link>

        <nav className="hidden items-center gap-5 xl:gap-6 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                  active ? "text-foreground" : "text-foreground/65 hover:text-foreground"
                }`}
              >
                {item.label}
                {active ? (
                  <span className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-gradient-brand" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            to="/favoritos"
            aria-label="Favoritos"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/75 transition-colors hover:text-foreground"
          >
            <Heart className={`h-[19px] w-[19px] ${count > 0 ? "fill-brand text-brand" : ""}`} strokeWidth={1.6} />
            {count > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-brand px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            ) : null}
          </Link>
          <span className="mx-2 hidden h-5 w-px bg-border md:block" />
          <a
            href={whatsappLink("Olá! Gostaria de conhecer as novidades da Nane Benites.")}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full bg-gradient-brand px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-elegant transition-transform hover:scale-[1.03] md:inline-flex"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2} />
            WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2 text-foreground/80 transition-colors hover:bg-muted hover:text-foreground lg:hidden"
            aria-label="Abrir menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border/60 bg-nav lg:hidden">
          <nav className="container-x flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-lg px-3 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={whatsappLink("Olá! Gostaria de conhecer as novidades da Nane Benites.")}
              target="_blank"
              rel="noreferrer"
              className="mt-2 rounded-full bg-gradient-brand px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white"
            >
              Chamar no WhatsApp
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}