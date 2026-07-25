import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Upload, Loader2, Check } from "lucide-react";
import {
  SITE_IMAGE_SLOTS,
  fetchSiteImages,
  saveSiteImage,
  uploadSiteImage,
  type SiteImageSlot,
} from "@/lib/site-images";
import { resolveImageAsync } from "@/lib/product-image";

export const Route = createFileRoute("/admin/imagens")({
  ssr: false,
  component: SiteImagesPage,
});

function SiteImagesPage() {
  const [map, setMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setMap(await fetchSiteImages());
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-10">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-neutral-900">Imagens do site</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Substitua as imagens fixas que aparecem nas páginas institucionais. As alterações refletem no site após salvar.
        </p>
      </header>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
        </div>
      ) : (
        <div className="space-y-4">
          {SITE_IMAGE_SLOTS.map((slot) => (
            <SlotRow
              key={slot.key}
              slot={slot}
              currentRef={map[slot.key] ?? ""}
              onSaved={load}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SlotRow({
  slot,
  currentRef,
  onSaved,
}: {
  slot: SiteImageSlot;
  currentRef: string;
  onSaved: () => void;
}) {
  const [preview, setPreview] = useState<string>("");
  const [ref, setRef] = useState<string>(currentRef);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setRef(currentRef);
    if (!currentRef) {
      setPreview("");
      return;
    }
    resolveImageAsync(currentRef).then((url) => {
      if (alive) setPreview(url);
    });
    return () => {
      alive = false;
    };
  }, [currentRef]);

  async function onFile(file: File) {
    setErr(null);
    setUploading(true);
    try {
      const newRef = await uploadSiteImage(file);
      setRef(newRef);
      setPreview(await resolveImageAsync(newRef));
    } catch (e: any) {
      setErr(e?.message ?? "Falha no upload");
    } finally {
      setUploading(false);
    }
  }

  async function onSave() {
    if (!ref) return;
    setSaving(true);
    setSaved(false);
    try {
      await saveSiteImage(slot.key, ref);
      setSaved(true);
      onSaved();
      setTimeout(() => setSaved(false), 1800);
    } catch (e: any) {
      setErr(e?.message ?? "Falha ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-5 rounded-2xl border border-neutral-200 bg-white p-5 md:grid-cols-[220px,1fr] md:items-start">
      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100">
        {preview ? (
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
            Sem imagem
          </div>
        )}
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
          {slot.page}
        </p>
        <h3 className="mt-1 font-serif text-lg font-bold text-neutral-900">{slot.label}</h3>
        <p className="mt-1 text-sm text-neutral-600">{slot.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-xs font-medium text-neutral-800 shadow-sm hover:bg-neutral-50">
            <Upload className="h-3.5 w-3.5" />
            {uploading ? "Enviando…" : "Trocar imagem"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) onFile(e.target.files[0]);
                e.target.value = "";
              }}
            />
          </label>
          <button
            type="button"
            onClick={onSave}
            disabled={!ref || saving}
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-sm disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <Check className="h-3.5 w-3.5" /> : null}
            {saving ? "Salvando" : saved ? "Salvo!" : "Salvar"}
          </button>
        </div>
        {err ? <p className="mt-2 text-xs text-rose-600">{err}</p> : null}
      </div>
    </div>
  );
}