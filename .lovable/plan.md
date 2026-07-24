# Painel Admin Completo — Opção A

Reconstrução do `/admin` como um mini-Shopify da Nane Benites, migrando o site público para ler tudo do banco. Trabalho grande — dividido em 4 fases sequenciais, cada uma entregando algo funcional.

## Arquitetura

- Rotas TanStack: `src/routes/admin/*` (layout `_layout` com sidebar + auth gate) — mantém a rota `admin.tsx` atual como redirect legado para não quebrar login existente.
- Auth: reaproveita Supabase Auth já configurado + `user_roles` + `has_role('admin')`.
- Storage: bucket `product-media` (novo, substitui semanticamente `product-images`, mantém o antigo para não quebrar imports).
- IA de descrições: `createServerFn` chamando Lovable AI Gateway (google/gemini-2.5-flash) — sem custo extra.

## Fase 1 — Fundação de dados + Layout do Admin

**Migrações (uma única):**
- `site_content` — chave/valor JSON por seção (`home_hero`, `sobre`, `contato`, `footer`, `stores`, `social`). Editável pelo admin, lido pelo site.
- `banners` — banners rotativos do hero da home (imagem, título, subtítulo, CTA, link, ordem, ativo, período).
- `leads` — contatos capturados (nome, telefone, email, mensagem, origem, status, `created_at`).
- `custom_fields` — campos dinâmicos por tipo (`brand`, `category`, `collection`) com label, slug, ordem, ativo.
- `whatsapp_templates` — mensagens padrão (chave, texto com placeholders `{produto}`, `{preço}`).
- `product_media` — múltiplas mídias por produto (produto_id, url, tipo, ordem, capa). Migração popula com `image`/`gallery` atuais.
- Coluna `featured boolean` em `products` (o "destaque" real, separado de `is_bestseller`).
- Seed de `site_content` com os textos hoje hardcoded em `site-data.ts`.

**Layout Admin (`src/routes/admin/_layout.tsx`):**
- Sidebar fixa esquerda com ícones: Dashboard, Produtos, Novo Produto, Banners, Leads, Conteúdo, Campos, Templates WhatsApp, Usuários.
- Header com logo + user menu (sair).
- Identidade: serifada Playfair preta + acentos gradiente turquesa/roxo.
- Gate: `beforeLoad` verifica sessão + role admin via `has_role`.

**Entregas visíveis:** login funcional, sidebar navegável, todas as páginas com placeholders.

## Fase 2 — Produtos avançados + Mídia + IA

- `/admin/produtos` — listagem com busca, filtros (marca, categoria, ativo, destaque, promoção), ordenação, paginação. Toggle rápido "Destaque" / "Ativo" na linha.
- `/admin/produtos/novo` e `/admin/produtos/$id/editar` — formulário completo:
  - `MediaUploader`: múltiplas imagens, drag-drop pra reordenar, marcar capa, remover.
  - Campos dinâmicos: marca e categoria vindos de `custom_fields` (dropdown editável).
  - Preço, promoção, tamanhos, cores (chips).
  - Botão **"Gerar descrição com IA"** — server fn que envia nome+marca+categoria pro Lovable AI e retorna texto pronto.
  - SEO: slug editável (auto-gerado do nome), meta title/description opcionais.
- Ajuste do site público: rota `/produto/$slug` passa a ler de `product_media` (galeria real).

## Fase 3 — Conteúdo, Banners, Campos, WhatsApp

- `/admin/banners` — CRUD dos banners do hero da home (upload, período de exibição, ordem). Site público passa a renderizar carrossel do hero a partir daqui.
- `/admin/conteudo` — editor das seções institucionais:
  - Home: título hero, subtítulo, textos das seções.
  - Sobre: história, imagens.
  - Contato: endereços, horários, telefones.
  - Footer: textos.
  - Refatoração do site: `Header`, `Footer`, `/sobre`, `/contato`, `index.tsx` passam a ler de `site_content` (com fallback pros valores atuais).
- `/admin/campos` — CRUD de marcas, categorias, coleções. Filtros do catálogo público passam a vir daqui.
- `/admin/templates` — CRUD de mensagens WhatsApp com placeholders. Botões "Chamar no WhatsApp" do site usam o template `default_product` (com `{produto}` e `{preço}` substituídos).

## Fase 4 — Leads, Usuários, Dashboard

- Formulário `/contato` do site passa a inserir em `leads` (via server fn pública, com rate-limit por IP).
- `/admin/leads` — lista com filtros (status, período), detalhe, marcar como respondido, **exportar CSV**.
- `/admin/usuarios` — listar admins, adicionar novo admin por email (server fn com `supabaseAdmin` — cria user + role), remover role. Não permite se auto-remover.
- `/admin/dashboard` (home do painel) — cards de métrica:
  - Total de produtos, produtos ativos, em promoção, em destaque.
  - Leads dos últimos 7/30 dias.
  - Últimos 5 leads e últimos 5 produtos editados.
  - Gráfico simples de leads por dia (recharts).

## O que NÃO entra

- Carrinho / checkout (WhatsApp continua sendo o canal).
- Multi-idioma.
- Sistema de pedidos/estoque avançado (estoque continua sendo o número atual).
- Trocar `/produto/$slug` por `/produto/$id` — mantenho `$slug` para não quebrar links já compartilhados.
- Alterações no site público além do descrito (fundo, logo, header e destaques recém-ajustados ficam como estão).

## Ordem de execução

Executo fase por fase, cada uma com sua(s) migração(ões) aprovada(s) antes do código. Ao final de cada fase, você já pode usar o que foi entregue enquanto sigo a próxima. Confirma?
