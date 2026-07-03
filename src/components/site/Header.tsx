import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Heart } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";
import { useFavorites } from "@/lib/favorites";
import logoAsset from "@/assets/logo.png.asset.json";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/sobre", label: "Sobre" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/colecoes", label: "Coleções" },
  { to: "/lancamentos", label: "Lançamentos" },
  { to: "/acessorios", label: "Acessórios" },
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
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "bg-background/0"
      }`}
    >
      <div className="container-x flex h-20 items-center justify-between gap-4">
        <Link to="/" className="group flex items-center gap-5">
          <img
            src={logoAsset.url}
            alt="Nane Benites Moda Fitness"
            className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-border shadow-elegant md:h-28 md:w-28"
          />
          <div className="flex flex-col leading-none">
            <span className="font-display text-2xl font-bold tracking-[0.14em] text-foreground md:text-3xl">
              NANE BENITES
            </span>
            <span className="mt-2 font-display text-[11px] font-semibold uppercase tracking-[0.5em] text-gradient-brand md:text-sm">
              Moda Fitness
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`link-underline text-sm font-medium transition-colors ${
                  active ? "text-brand" : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/favoritos"
            aria-label="Favoritos"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
          >
            <Heart className={`h-5 w-5 ${count > 0 ? "fill-brand text-brand" : ""}`} />
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
            className="hidden rounded-full bg-gradient-brand px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white shadow-elegant transition-transform hover:scale-105 md:inline-flex"
          >
            WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2.5 text-foreground transition-colors hover:bg-muted lg:hidden"
            aria-label="Abrir menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container-x flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-2 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={whatsappLink("Olá! Gostaria de conhecer as novidades da Nane Benites.")}
              target="_blank"
              rel="noreferrer"
              className="mt-2 rounded-full bg-brand px-5 py-3 text-center text-sm font-semibold uppercase tracking-widest text-brand-foreground"
            >
              Chamar no WhatsApp
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}