import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, MapPin, Phone, Mail, Clock } from "lucide-react";
import { site, categories } from "@/lib/site-data";
import { whatsappLink } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-[color:var(--surface)]">
      <div className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-xl font-extrabold tracking-tight">NANE BENITES</p>
            <p className="eyebrow mt-1">Moda Fitness Premium</p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Curadoria exclusiva das melhores marcas de moda fitness. Peças selecionadas para mulheres que treinam com estilo.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-brand hover:text-brand"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={site.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-brand hover:text-brand"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="eyebrow">Navegação</p>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                ["/", "Home"],
                ["/sobre", "Sobre"],
                ["/catalogo", "Catálogo"],
                ["/colecoes", "Coleções"],
                ["/lancamentos", "Lançamentos"],
                ["/promocoes", "Promoções"],
                ["/marcas", "Marcas"],
                ["/contato", "Contato"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="link-underline text-foreground/80 hover:text-foreground">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Categorias</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {categories.slice(0, 8).map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/categoria/$slug"
                    params={{ slug: c.slug }}
                    className="link-underline text-foreground/80 hover:text-foreground"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Contato</p>
            <ul className="mt-5 space-y-3 text-sm text-foreground/80">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>
                  {site.address}
                  <br />
                  {site.city}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-brand" />
                <div className="flex flex-col">
                  <a href={`tel:+55${site.phone.replace(/\D/g, "")}`} className="hover:text-foreground">{site.phone}</a>
                  <a href={`tel:+55${site.phoneSecondary.replace(/\D/g, "")}`} className="hover:text-foreground">{site.phoneSecondary}</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-brand" />
                <a href={`mailto:${site.email}`} className="hover:text-foreground">{site.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 shrink-0 text-brand" />
                <span>{site.hours}</span>
              </li>
            </ul>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex rounded-full bg-brand px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-brand-foreground transition-colors hover:bg-brand-dark"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Nane Benites Moda Fitness. Todos os direitos reservados.</p>
          <p>CNPJ 00.000.000/0001-00</p>
        </div>
      </div>
    </footer>
  );
}