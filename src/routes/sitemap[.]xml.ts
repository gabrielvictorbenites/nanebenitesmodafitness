import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { categories, products } from "@/lib/site-data";

const BASE_URL = "https://nanebenitesmodafitness.com";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = ["/", "/sobre", "/catalogo", "/colecoes", "/lancamentos", "/promocoes", "/marcas", "/acessorios", "/contato"];
        const entries = [
          ...staticPaths.map((p) => ({ path: p, changefreq: "weekly", priority: p === "/" ? "1.0" : "0.8" })),
          ...categories.map((c) => ({ path: `/categoria/${c.slug}`, changefreq: "weekly", priority: "0.7" })),
          ...products.map((p) => ({ path: `/produto/${p.slug}`, changefreq: "weekly", priority: "0.6" })),
        ];
        const urls = entries.map((e) =>
          `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});