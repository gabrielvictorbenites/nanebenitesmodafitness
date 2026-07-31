import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Heart } from "lucide-react";
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
  const { count } = useFavorites();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-border/60 bg-background/60 backdrop-blur-md shadow-[0_8px_30px_-20px_oklch(0.18_0_0/0.18)]"
          : "bg-background/40 backdrop-blur-sm"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4 md:h-20">
        <Link to="/" className="group flex items-center">
          <img
            src={logoAsset.url}
            alt="Nane Benites Moda Fitness"
            className="h-16 w-auto shrink-0 object-contain md:h-20"
          />
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`link-underline text-[13px] font-medium tracking-wide transition-colors ${
                  active ? "text-brand" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            to="/favoritos"
            aria-label="Favoritos"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/80 transition-all hover:bg-muted hover:text-foreground"
          >
            <Heart className={`h-[18px] w-[18px] ${count > 0 ? "fill-brand text-brand" : ""}`} />
            {count > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-brand px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            ) : null}
          </Link>
          <a
            href={whatsappLink("Olá! Gostaria de conhecer as novidades da Nane Benites.")}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full bg-gradient-brand px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-elegant transition-transform hover:scale-105 md:inline-flex"
          >
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
        <div className="border-t border-border/60 bg-background/80 backdrop-blur-lg lg:hidden">
          <nav className="container-x flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
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