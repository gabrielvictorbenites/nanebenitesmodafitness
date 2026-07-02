# Nane Benites Moda Fitness — Plano de Construção

Projeto grande. Proponho entregar em **3 fases** para você já ver resultado rápido e validar antes de investir nas partes pesadas (admin, métricas).

---

## Stack (ajustada ao ambiente Lovable)

Sua lista pede Next.js, mas o template Lovable usa **TanStack Start + React 19 + TypeScript + Tailwind v4 + Shadcn UI + Framer Motion**, que entrega o mesmo resultado (SSR, SEO, performance) e é o suportado aqui. Backend/auth/storage via **Lovable Cloud** (Supabase gerenciado — sem configuração manual).

---

## Design System (aplicado globalmente antes de qualquer tela)

- Paleta em tokens semânticos (`src/styles.css`, oklch): vermelho `#B11226` como `--primary`, branco, `#F7F7F7` de apoio, texto `#1D1D1D`, cinza `#6B6B6B`.
- Tipografia: **Montserrat** (display) + **Inter** (corpo), via `<link>` no root.
- Variantes de botão premium (hover escurecido, radius suave, shadow discreto).
- Animações Framer Motion: fade, scroll reveal, hover elegante.

---

## Fase 1 — Site público (vitrine premium)

Objetivo: entregar um site institucional lindo, responsivo, com conversão via WhatsApp. **Sem admin ainda, sem banco** — conteúdo (categorias, produtos de exemplo, depoimentos) fica em arquivos TypeScript editáveis.

Rotas:
- `/` Home (hero fullscreen, categorias em grid, "Por que escolher", depoimentos, galeria Instagram, footer)
- `/sobre`
- `/catalogo` (grid + busca + filtros client-side sobre os dados mock)
- `/colecoes`, `/lancamentos`, `/promocoes`, `/marcas`
- `/categoria/$slug` (leggings, tops, shorts, macacões, conjuntos, camisetas, jaquetas, tênis, bolsas, acessórios)
- `/produto/$slug` (galeria, variações, botão WhatsApp com mensagem pré-preenchida)
- `/contato` (formulário, mapa, redes)

SEO: `head()` por rota com title/description/OG únicos, sitemap.xml, robots.txt, URLs amigáveis, JSON-LD Product nas páginas de produto.

Botão WhatsApp flutuante em todo o site. **Preciso do seu número de WhatsApp** para configurar os links (posso deixar um placeholder e você troca depois).

---

## Fase 2 — Backend + Admin

Ativa Lovable Cloud e cria:
- Tabelas: `products`, `categories`, `brands`, `banners`, `testimonials`, `whatsapp_clicks`, `messages`, `admin_users` (via `user_roles` + `has_role`), `settings`.
- Storage para imagens de produtos/banners.
- Auth email/senha só para admin, rota `/admin/*` protegida (não indexada — meta robots noindex + robots.txt disallow).
- Painel estilo Shopify: sidebar + dashboard, CRUD de produtos/categorias/marcas/banners/depoimentos/promoções/lançamentos, editor de textos da Home/Sobre/Footer.
- Site público passa a ler do banco em vez dos mocks.

---

## Fase 3 — Métricas, favoritos, relatórios

- Tracking de cliques WhatsApp e visualizações de produto → dashboard com gráficos (recharts): mais acessados, mensagens, categorias mais visitadas, gráfico mensal/semanal/anual, estoque, lucro estimado, ticket médio.
- Favoritos (localStorage no público; opcional login cliente depois).
- Exportação Excel/CSV/PDF dos relatórios.
- Cupons.

---

## Detalhes técnicos

- Imagens hero e categorias: geradas com o gerador de imagens (mulher fitness, estética premium, tons neutros com toque vermelho) — evita stock genérico.
- Framer Motion para transições, `loading="lazy"` nas imagens, preload do LCP.
- Componentes Shadcn customizados com as variantes do design system — nada de `text-white`/`bg-black` hardcoded.
- Responsivo mobile-first.

---

## O que preciso de você antes de começar

1. **Número de WhatsApp** para os botões (posso usar `+55 00 00000-0000` como placeholder).
2. Confirmação: **começamos pela Fase 1** (site público bonito, dados mockados, pronto pra mostrar) e depois avançamos? Ou você quer que eu ative Lovable Cloud e faça Fases 1+2 juntas desde já?
3. Logo da marca: você tem uma imagem/arquivo? Se não, gero uma marca tipográfica elegante ("NANE BENITES" em Montserrat, com "moda fitness" abaixo).