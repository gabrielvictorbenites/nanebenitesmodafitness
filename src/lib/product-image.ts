import catLeggings from "@/assets/cat-leggings.jpg";
import catTops from "@/assets/cat-tops.jpg";
import catShorts from "@/assets/cat-shorts.jpg";
import catConjuntos from "@/assets/cat-conjuntos.jpg";
import catMacacoes from "@/assets/cat-macacoes.jpg";
import catCamisetas from "@/assets/cat-camisetas.jpg";
import catJaquetas from "@/assets/cat-jaquetas.jpg";
import catTenis from "@/assets/cat-tenis.jpg";
import catBolsas from "@/assets/cat-bolsas.jpg";
import catAcessorios from "@/assets/cat-acessorios.jpg";
import { supabase } from "@/integrations/supabase/client";

const LOCAL_ASSETS: Record<string, string> = {
  catLeggings,
  catTops,
  catShorts,
  catConjuntos,
  catMacacoes,
  catCamisetas,
  catJaquetas,
  catTenis,
  catBolsas,
  catAcessorios,
};

const PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 4'><rect width='3' height='4' fill='%23f2f2f2'/></svg>";

/**
 * Synchronous resolver used by admin/loading placeholders.
 * Storage refs return a placeholder here — use `resolveImageAsync` for signed URLs.
 */
export function resolveImage(ref: string | null | undefined): string {
  if (!ref) return PLACEHOLDER;
  if (ref.startsWith("local:")) {
    return LOCAL_ASSETS[ref.slice(6)] ?? PLACEHOLDER;
  }
  if (ref.startsWith("storage:")) return PLACEHOLDER;
  return ref;
}

/**
 * Async resolver. Storage refs are resolved to time-limited signed URLs
 * because the bucket is private (public buckets are blocked in this workspace).
 */
export async function resolveImageAsync(ref: string | null | undefined): Promise<string> {
  if (!ref) return PLACEHOLDER;
  if (ref.startsWith("local:")) {
    return LOCAL_ASSETS[ref.slice(6)] ?? PLACEHOLDER;
  }
  if (ref.startsWith("storage:")) {
    const path = ref.slice(8);
    const { data, error } = await supabase.storage
      .from("product-images")
      .createSignedUrl(path, 60 * 60 * 24 * 7); // 7 days
    if (error || !data) return PLACEHOLDER;
    return data.signedUrl;
  }
  return ref;
}