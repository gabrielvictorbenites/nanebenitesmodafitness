import { Instagram, Facebook, MapPin, Phone, Mail, Clock } from "lucide-react";
import { site } from "@/lib/site-data";
import { whatsappLink } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-[color:var(--surface)]">
      <div className="container-x py-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-display text-xl font-extrabold tracking-tight">NANE BENITES</p>
            <p className="eyebrow mt-1">Moda Fitness Premium</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Curadoria exclusiva das melhores marcas de moda fitness. Peças selecionadas para mulheres que treinam com estilo.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-brand hover:text-brand"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={site.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-brand hover:text-brand"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="eyebrow">Endereços</p>
            <ul className="mt-4 space-y-4 text-sm text-foreground/80">
              {site.addresses.map((a) => (
                <li key={a.label} className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span>
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-brand">
                      {a.label}
                    </span>
                    {a.street}
                    {a.neighborhood ? ` · ${a.neighborhood}` : ""}
                    <span className="block text-muted-foreground">{a.city}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Contato</p>
            <ul className="mt-4 space-y-2 text-sm text-foreground/80">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-brand" />
                <a href={`tel:+55${site.phone.replace(/\D/g, "")}`} className="hover:text-foreground">{site.phone}</a>
                <span className="text-muted-foreground">·</span>
                <a href={`tel:+55${site.phoneSecondary.replace(/\D/g, "")}`} className="hover:text-foreground">{site.phoneSecondary}</a>
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
            <div className="mt-4 flex flex-col gap-2">
              {site.addresses.map((a) => (
                <div key={a.label} className="overflow-hidden rounded-md border border-border">
                  <iframe
                    title={`Mapa ${a.label}`}
                    src={a.mapEmbed}
                    loading="lazy"
                    className="h-20 w-full"
                    style={{ border: 0 }}
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex rounded-full bg-brand px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-brand-foreground transition-colors hover:bg-brand-dark"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Nane Benites Moda Fitness. Todos os direitos reservados.</p>
          <p>CNPJ {site.cnpj}</p>
          <p>
            Site desenvolvido por <span className="text-foreground">{site.creator}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}