import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Share2, MessageCircle } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { SmartImage } from "@/components/site/SmartImage";
import { findCategory, formatPrice, type Product } from "@/lib/site-data";
import { whatsappLink, productWhatsappMessage } from "@/lib/whatsapp";
import { useFavorites } from "@/lib/favorites";
import { fetchProductBySlug, fetchProducts, type DbProduct } from "@/lib/products";

export const Route = createFileRoute("/produto/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Nane Benites` },
      { property: "og:title", content: `${params.slug} — Nane Benites` },
    ],
    links: [{ rel: "canonical", href: `/produto/${params.slug}` }],
  }),
  component: ProductPage,
  errorComponent: () => <div className="container-x py-32 text-center">Erro ao carregar produto.</div>,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const [product, setProduct] = useState<DbProduct | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [color, setColor] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const { has, toggle } = useFavorites();

  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      const p = await fetchProductBySlug(slug);
      if (!alive) return;
      setProduct(p);
      if (p) {
        const all = await fetchProducts();
        if (!alive) return;
        setRelated(all.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 4));
        setColor(p.colors[0] ?? "");
        setSize(p.sizes[0] ?? "");
        setActive(0);
      }
      if (alive) setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  if (loading) {
    return <div className="container-x py-32 text-center text-muted-foreground">Carregando…</div>;
  }
  if (!product) {
    return (
      <div className="container-x py-32 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Produto não encontrado</h1>
        <Link to="/catalogo" className="mt-6 inline-block link-underline text-sm">Ver catálogo</Link>
      </div>
    );
  }

  const p = product;
  const category = findCategory(p.category);
  const gallery = p.gallery && p.gallery.length > 0 ? p.gallery : [p.image];
  const fav = has(p.slug);

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && (navigator as Navigator).share) {
      try {
        await (navigator as Navigator).share({ title: p.name, text: p.description, url });
      } catch {
        /* cancelled */
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
  }

  return (
    <>
      <div className="container-x pt-8">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/catalogo" className="hover:text-foreground">Catálogo</Link>
          {category ? (
            <>
              <span>/</span>
              <Link to="/categoria/$slug" params={{ slug: category.slug }} className="hover:text-foreground">{category.name}</Link>
            </>
          ) : null}
        </nav>
      </div>

      <section className="container-x grid gap-12 py-12 md:grid-cols-2 md:gap-16 md:py-16">
        <div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[color:var(--surface)]">
            <SmartImage
              src={gallery[active]}
              alt={product.name}
              priority
              objectPosition={product.galleryPositions?.[active] ?? product.imagePosition ?? "50% 50%"}
            />
          </div>
          {gallery.length > 1 ? (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {gallery.map((g: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`aspect-square overflow-hidden rounded-sm border transition-colors ${
                    i === active ? "border-brand" : "border-border hover:border-foreground"
                  }`}
                >
                  <span className="relative block h-full w-full">
                    <SmartImage
                      src={g}
                      alt=""
                      objectPosition={product.galleryPositions?.[i] ?? "50% 50%"}
                    />
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col">
          <p className="eyebrow">{product.brand}</p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">{product.name}</h1>

          <div className="mt-6 flex items-baseline gap-4">
            {product.salePrice ? (
              <>
                <span className="font-display text-3xl font-semibold text-brand">{formatPrice(product.salePrice)}</span>
                <span className="text-base text-muted-foreground line-through">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="font-display text-3xl font-semibold text-foreground">{formatPrice(product.price)}</span>
            )}
          </div>
          <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">Ou em até 6x sem juros no cartão</p>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Cor: <span className="text-foreground">{color}</span></p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.colors.map((c: string) => (
                <button key={c} onClick={() => setColor(c)} className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
                  c === color ? "border-brand bg-brand text-brand-foreground" : "border-border hover:border-foreground"
                }`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Tamanho: <span className="text-foreground">{size}</span></p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s: string) => (
                <button key={s} onClick={() => setSize(s)} className={`h-11 min-w-11 rounded-sm border px-4 text-xs font-medium uppercase tracking-widest transition-colors ${
                  s === size ? "border-brand bg-brand text-brand-foreground" : "border-border hover:border-foreground"
                }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <a
              href={whatsappLink(productWhatsappMessage(product, { color, size }))}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 rounded-full bg-brand px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-foreground transition-colors hover:bg-brand-dark"
            >
              <MessageCircle className="h-4 w-4" />
              Tenho interesse — WhatsApp
            </a>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => toggle(product.slug)} className={`flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                fav ? "border-brand bg-brand/10 text-brand" : "border-border text-foreground hover:border-foreground"
              }`}>
                <Heart className={`h-4 w-4 ${fav ? "fill-brand" : ""}`} />
                {fav ? "Favoritado" : "Favoritar"}
              </button>
              <button onClick={handleShare} className="flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition-colors hover:border-foreground">
                <Share2 className="h-4 w-4" />
                Compartilhar
              </button>
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-8">
            <p className="eyebrow">Descrição</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            <dl className="mt-6 grid grid-cols-2 gap-y-3 text-xs">
              <dt className="uppercase tracking-widest text-muted-foreground">Código</dt>
              <dd className="text-foreground">{product.sku}</dd>
              <dt className="uppercase tracking-widest text-muted-foreground">Marca</dt>
              <dd className="text-foreground">{product.brand}</dd>
              <dt className="uppercase tracking-widest text-muted-foreground">Estoque</dt>
              <dd className="text-foreground">{product.stock > 0 ? `${product.stock} disponíveis` : "Sob consulta"}</dd>
            </dl>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-border bg-[color:var(--surface)] py-16 md:py-24">
          <div className="container-x">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="eyebrow">Você também pode gostar</p>
                <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight md:text-3xl">Peças relacionadas</h2>
              </div>
              {category ? (
                <Link to="/categoria/$slug" params={{ slug: category.slug }} className="link-underline text-sm text-foreground/80 hover:text-foreground">
                  Ver mais {category.name} →
                </Link>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {related.map((rp: Product) => (
                <ProductCard key={rp.slug} product={rp} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}