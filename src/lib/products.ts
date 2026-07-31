import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/lib/site-data";
import { resolveImageAsync, focalOf } from "@/lib/product-image";

type Row = {
  id: string;
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: number | string;
  sale_price: number | string | null;
  on_sale: boolean;
  colors: string[] | null;
  sizes: string[] | null;
  description: string | null;
  image: string | null;
  gallery: string[] | null;
  is_new: boolean;
  is_bestseller: boolean;
  stock: number;
  sku: string | null;
  sort_order: number | null;
  featured?: boolean | null;
  active?: boolean | null;
};

export type DbProduct = Product & { id: string; imageRef: string; galleryRefs: string[]; featured: boolean; active: boolean };

async function toProduct(row: Row, includeGallery = false): Promise<DbProduct> {
  const price = Number(row.price);
  const salePriceRaw = row.sale_price == null ? null : Number(row.sale_price);
  const imageRef = row.image ?? "";
  const galleryRefs = row.gallery ?? [];
  const image = await resolveImageAsync(imageRef, includeGallery ? "full" : "card");
  const gallery = includeGallery
    ? await Promise.all(galleryRefs.map((ref) => resolveImageAsync(ref, "full")))
    : [];
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    brand: row.brand,
    price,
    salePrice: row.on_sale && salePriceRaw ? salePriceRaw : undefined,
    colors: row.colors ?? [],
    sizes: row.sizes ?? [],
    description: row.description ?? "",
    image,
    imageRef,
    galleryRefs,
    gallery,
    imagePosition: focalOf(imageRef),
    galleryPositions: galleryRefs.map(focalOf),
    isNew: row.is_new,
    isSale: row.on_sale,
    isBestseller: row.is_bestseller,
    stock: row.stock,
    sku: row.sku ?? "",
    featured: !!row.featured,
    active: row.active !== false,
  };
}

export async function fetchProducts(): Promise<DbProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return Promise.all((data as Row[]).map(toProduct));
}

export async function fetchProductBySlug(slug: string): Promise<DbProduct | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? await toProduct(data as Row, true) : null;
}