import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { findCategory } from "@/lib/site-data";
import { useSiteCategories } from "@/lib/categories";
import { fetchProducts, type DbProduct } from "@/lib/products";
import { fetchCategoryBanners } from "@/lib/banners";
import { resolveImageAsync, focalOf } from "@/lib/product-image";

export const Route = createFileRoute("/categoria/$slug")({
  loader: ({ params }) => {
    const cat = findCategory(params.slug);
    if (cat) return { category: cat };
    const name = params.slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      category: {
        slug: params.slug,
        name,
        image: "",
        description: `Peças selecionadas de ${name.toLowerCase()} com a curadoria Nane Benites.`,
      },
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Categoria não encontrada" }, { name: "robots", content: "noindex" }] };
    const c = loaderData.category;
    return {
      meta: [
        { title: `${c.name} — Nane Benites` },
        { name: "description", content: `${c.name} premium: ${c.description}` },
        { property: "og:title", content: `${c.name} — Nane Benites` },
        { property: "og:description", content: c.description },
        { property: "og:url", content: `/categoria/${c.slug}` },
        { property: "og:type", content: "product.group" },
      ],
      links: [{ rel: "canonical", href: `/categoria/${c.slug}` }],
    };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="container-x py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-display text-4xl font-semibold">Categoria não encontrada</h1>
      <Link to="/catalogo" className="mt-6 inline-block link-underline text-sm">Ver catálogo</Link>
    </div>
  ),
  errorComponent: () => <div className="container-x py-32 text-center">Erro ao carregar.</div>,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const allCats = useSiteCategories();
  const dbCat = allCats.find((c) => c.slug === category.slug);
  const name = dbCat?.name ?? category.name;
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [bannerImg, setBannerImg] = useState<string>(category.image);
  const [focal, setFocal] = useState<string>("50% 50%");
  const heroImg = bannerImg || dbCat?.image || "";
  const [tagline, setTagline] = useState<string>("");
  useEffect(() => {
    let alive = true;
    fetchProducts()
      .then((rows) => alive && setProducts(rows.filter((p) => p.category === category.slug)))
      .finally(() => alive && setLoading(false));
    (async () => {
      const map = await fetchCategoryBanners();
      const entry = map[category.slug];
      if (!alive || !entry) return;
      if (entry.imageRef) {
        const url = await resolveImageAsync(entry.imageRef);
        if (alive) {
          setBannerImg(url);
          setFocal(focalOf(entry.imageRef));
        }
      }
      if (entry.tagline) setTagline(entry.tagline);
    })();
    return () => { alive = false; };
  }, [category.slug]);

  return (
    <>
      <section className="relative h-[78vh] min-h-[560px] w-full overflow-hidden bg-foreground text-background">
        {heroImg ? (
          <img
            src={heroImg}
            alt={name}
            style={{ objectPosition: focal }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-foreground/20" />
        <div className="container-x relative z-10 flex h-full flex-col justify-end pb-12">
          <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-background/70">Categoria</p>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-tight tracking-tight md:text-7xl">{name}</h1>
          <p className="mt-4 max-w-2xl text-base text-background/80">{tagline || category.description}</p>
        </div>
      </section>

      <section className="container-x py-16 md:py-24">
        {loading ? (
          <p className="py-20 text-center text-muted-foreground">Carregando…</p>
        ) : products.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">Em breve novas peças nesta categoria.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-border bg-[color:var(--surface)] py-16">
        <div className="container-x">
          <p className="eyebrow mb-6">Outras categorias</p>
          <div className="flex flex-wrap gap-2">
            {allCats.filter((c) => c.slug !== category.slug).map((c) => (
              <Link key={c.slug} to="/categoria/$slug" params={{ slug: c.slug }} className="rounded-full border border-border bg-background px-5 py-2 text-xs uppercase tracking-widest text-foreground transition-colors hover:border-brand hover:text-brand">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}