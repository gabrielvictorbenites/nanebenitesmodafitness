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
 * Image refs may carry a focal point suffix: `<ref>#fp=50,30`
 * (percent X, percent Y) used as CSS object-position.
 */
export function splitFocal(ref: string | null | undefined): { base: string; focal: string } {
  if (!ref) return { base: "", focal: "50% 50%" };
  const i = ref.indexOf("#fp=");
  if (i === -1) return { base: ref, focal: "50% 50%" };
  const base = ref.slice(0, i);
  const [x, y] = ref.slice(i + 4).split(",").map((n) => Number(n));
  const cx = Number.isFinite(x) ? Math.min(100, Math.max(0, x)) : 50;
  const cy = Number.isFinite(y) ? Math.min(100, Math.max(0, y)) : 50;
  return { base, focal: `${cx}% ${cy}%` };
}

export function focalOf(ref: string | null | undefined): string {
  return splitFocal(ref).focal;
}

export function focalXY(ref: string | null | undefined): { x: number; y: number } {
  const [x, y] = splitFocal(ref).focal.split(" ").map((v) => parseFloat(v));
  return { x, y };
}

export function withFocal(ref: string, x: number, y: number): string {
  const { base } = splitFocal(ref);
  const cx = Math.round(Math.min(100, Math.max(0, x)));
  const cy = Math.round(Math.min(100, Math.max(0, y)));
  return `${base}#fp=${cx},${cy}`;
}

/**
 * Synchronous resolver used by admin/loading placeholders.
 * Storage refs return a placeholder here — use `resolveImageAsync` for signed URLs.
 */
export function resolveImage(rawRef: string | null | undefined): string {
  const ref = splitFocal(rawRef).base;
  if (!ref) return PLACEHOLDER;
  if (ref.startsWith("local:")) {
    return LOCAL_ASSETS[ref.slice(6)] ?? PLACEHOLDER;
  }
  if (ref.startsWith("storage:")) return PLACEHOLDER;
  return ref;
}

// Signed URLs are expensive to mint (one network round-trip per image).
// Cache them in memory + sessionStorage so re-renders and route changes are instant.
const SIGNED_TTL_SEC = 60 * 60 * 24 * 7;
const CACHE_KEY = "nb_signed_urls_v1";
type CacheEntry = { url: string; exp: number };

type ImageVariant = "card" | "hero" | "full";

const TRANSFORMS = {
  card: { width: 720, height: 960, resize: "cover" as const, quality: 78 },
  hero: { width: 1600, height: 1000, resize: "cover" as const, quality: 82 },
  full: { width: 1400, resize: "contain" as const, quality: 84 },
};

const memCache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<string>>();

function loadPersisted() {
  if (typeof window === "undefined" || memCache.size) return;
  try {
    const raw = window.sessionStorage.getItem(CACHE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<string, CacheEntry>;
    for (const [k, v] of Object.entries(parsed)) memCache.set(k, v);
  } catch {}
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(memCache)));
  } catch {}
}

/**
 * Async resolver. Storage refs are resolved to time-limited signed URLs
 * because the bucket is private (public buckets are blocked in this workspace).
 */
export async function resolveImageAsync(
  rawRef: string | null | undefined,
  variant: ImageVariant = "card",
): Promise<string> {
  const ref = splitFocal(rawRef).base;
  if (!ref) return PLACEHOLDER;
  if (ref.startsWith("local:")) {
    return LOCAL_ASSETS[ref.slice(6)] ?? PLACEHOLDER;
  }
  if (ref.startsWith("storage:")) {
    const path = ref.slice(8);
    const cachePath = `${variant}:${path}`;
    loadPersisted();
    const now = Date.now();
    const hit = memCache.get(cachePath);
    if (hit && hit.exp > now) return hit.url;

    const pending = inflight.get(cachePath);
    if (pending) return pending;

    const task = (async () => {
      const { data, error } = await supabase.storage
        .from("product-images")
        .createSignedUrl(path, SIGNED_TTL_SEC, { transform: TRANSFORMS[variant] });
      if (error || !data) return PLACEHOLDER;
      memCache.set(cachePath, { url: data.signedUrl, exp: now + (SIGNED_TTL_SEC - 3600) * 1000 });
      persist();
      return data.signedUrl;
    })().finally(() => inflight.delete(cachePath));

    inflight.set(cachePath, task);
    return task;
  }
  return ref;
}