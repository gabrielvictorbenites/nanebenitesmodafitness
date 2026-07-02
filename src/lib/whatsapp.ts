import { site } from "./site-data";
import type { Product } from "./site-data";

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function productWhatsappMessage(p: Product, opts?: { color?: string; size?: string }) {
  return [
    "Olá! Tenho interesse no seguinte produto:",
    "",
    `Nome: ${p.name}`,
    `Categoria: ${p.category}`,
    `Cor: ${opts?.color ?? p.colors[0]}`,
    `Tamanho: ${opts?.size ?? p.sizes[0]}`,
    `Código: ${p.sku}`,
    "",
    "Gostaria de saber disponibilidade.",
  ].join("\n");
}