import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Instagram, Facebook, MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { site } from "@/lib/site-data";
import { whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Nane Benites" },
      { name: "description", content: "Entre em contato com a Nane Benites. Endereço, telefone, WhatsApp, redes sociais e formulário." },
      { property: "og:title", content: "Contato — Nane Benites" },
      { property: "og:description", content: "Fale com a Nane Benites Moda Fitness." },
      { property: "og:url", content: "/contato" },
    ],
    links: [{ rel: "canonical", href: "/contato" }],
  }),
  component: ContatoPage,
});

function ContatoPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", mensagem: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const msg = `Olá! Sou ${form.nome} (${form.email}).\n\n${form.mensagem}`;
    window.open(whatsappLink(msg), "_blank");
    setSent(true);
  }

  return (
    <>
      <PageHero eyebrow="Contato" title="Fale com a Nane." description="Estamos aqui para atender você. Escolha o canal que preferir." />

      <section className="container-x py-16 md:py-24">
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <p className="eyebrow">Nossos canais</p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight md:text-3xl">Como podemos ajudar?</h2>

            <ul className="mt-10 space-y-6 text-sm">
              {site.addresses.map((a) => (
                <li key={a.label} className="flex items-start gap-4">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-brand" />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Loja {a.label}</p>
                    <p className="mt-1 text-foreground">{a.street}</p>
                    <p className="text-foreground">{a.neighborhood} · {a.city}</p>
                  </div>
                </li>
              ))}
              <li className="flex items-start gap-4">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-brand" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Telefones</p>
                  <a href={`tel:+55${site.phone.replace(/\D/g, "")}`} className="mt-1 block text-foreground">{site.phone}</a>
                  <a href={`tel:+55${site.phoneSecondary.replace(/\D/g, "")}`} className="block text-foreground">{site.phoneSecondary}</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <MessageCircle className="mt-1 h-5 w-5 shrink-0 text-brand" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">WhatsApp</p>
                  <a href={whatsappLink()} target="_blank" rel="noreferrer" className="mt-1 block text-foreground link-underline">
                    Chamar agora
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-brand" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Email</p>
                  <a href={`mailto:${site.email}`} className="mt-1 block text-foreground">{site.email}</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Clock className="mt-1 h-5 w-5 shrink-0 text-brand" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Horário de atendimento</p>
                  <ul className="mt-2 space-y-1 text-foreground">
                    {site.hoursList.map((h) => (
                      <li key={h.day} className="flex items-center justify-between gap-6 text-sm">
                        <span className="text-foreground/80">{h.day}</span>
                        <span className="font-medium">{h.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>

            <div className="mt-10 flex items-center gap-3">
              <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-brand hover:text-brand">
                <Instagram className="h-4 w-4" />
              </a>
              <a href={site.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-brand hover:text-brand">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="eyebrow">Formulário</p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight md:text-3xl">Envie uma mensagem.</h2>
            <p className="mt-3 text-sm text-muted-foreground">Sua mensagem será enviada diretamente pelo WhatsApp.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Nome</label>
                <input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="mt-2 h-12 w-full rounded-sm border border-border bg-background px-4 text-sm focus:border-brand focus:outline-none" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 h-12 w-full rounded-sm border border-border bg-background px-4 text-sm focus:border-brand focus:outline-none" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Mensagem</label>
                <textarea required rows={5} value={form.mensagem} onChange={(e) => setForm({ ...form, mensagem: e.target.value })} className="mt-2 w-full rounded-sm border border-border bg-background p-4 text-sm focus:border-brand focus:outline-none" />
              </div>
              <button type="submit" className="w-full rounded-full bg-brand px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-foreground transition-colors hover:bg-brand-dark">
                Enviar pelo WhatsApp
              </button>
              {sent ? <p className="text-xs text-muted-foreground">Abrindo WhatsApp...</p> : null}
            </form>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="grid gap-px bg-border md:grid-cols-2">
          {site.addresses.map((a) => (
            <div key={a.label} className="relative aspect-[16/10] w-full bg-muted">
              <iframe src={a.mapEmbed} loading="lazy" title={`Mapa ${a.label}`} className="h-full w-full border-0" />
              <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-background/95 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground shadow-elegant">
                Loja {a.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}