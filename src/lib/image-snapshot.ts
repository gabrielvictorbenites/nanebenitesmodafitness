// Snapshot of the last resolved image URLs so returning visitors see the current
// images immediately instead of a flash of the bundled default.
const KEY = "nb_img_snapshot_v1";

export type Snap = { url: string; pos: string };

function readAll(): Record<string, Snap> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Record<string, Snap>;
  } catch {
    return {};
  }
}

export function readSnapshot(key: string): Snap | null {
  return readAll()[key] ?? null;
}

export function readSnapshots(keys: string[]): Record<string, Snap> {
  const all = readAll();
  const out: Record<string, Snap> = {};
  for (const k of keys) if (all[k]) out[k] = all[k];
  return out;
}

export function writeSnapshots(entries: Record<string, Snap>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...readAll(), ...entries }));
  } catch {}
}
