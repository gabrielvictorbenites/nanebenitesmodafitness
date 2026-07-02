import { useEffect, useState, useCallback } from "react";

const KEY = "nb_favorites_v1";
const EVT = "nb:favorites-change";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(list: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(EVT));
}

export function useFavorites() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setItems(read());
    const sync = () => setItems(read());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const has = useCallback((slug: string) => items.includes(slug), [items]);

  const toggle = useCallback((slug: string) => {
    const curr = read();
    const next = curr.includes(slug) ? curr.filter((s) => s !== slug) : [...curr, slug];
    write(next);
  }, []);

  const remove = useCallback((slug: string) => {
    write(read().filter((s) => s !== slug));
  }, []);

  const clear = useCallback(() => write([]), []);

  return { items, has, toggle, remove, clear, count: items.length };
}