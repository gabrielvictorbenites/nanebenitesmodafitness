import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

function resolveImg(ref: string): string {
  if (!ref) return "";
  if (ref.startsWith("storage:")) {
    const { data } = supabase.storage.from("product-images").getPublicUrl(ref.slice(8));
    return data.publicUrl;
  }
  return ref;
}

export function MediaUploader({
  values,
  onChange,
  coverIndex,
  onCoverChange,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  coverIndex: number;
  onCoverChange: (i: number) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function upload(files: FileList) {
    setUploading(true);
    setErr(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage
          .from("product-images")
          .upload(path, file, { upsert: false });
        if (error) throw error;
        uploaded.push(`storage:${path}`);
      }
      onChange([...values, ...uploaded]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Falha no upload");
    } finally {
      setUploading(false);
    }
  }

  function remove(i: number) {
    const next = values.filter((_, idx) => idx !== i);
    onChange(next);
    if (coverIndex === i) onCoverChange(0);
    else if (coverIndex > i) onCoverChange(coverIndex - 1);
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= values.length) return;
    const next = [...values];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    if (coverIndex === i) onCoverChange(j);
    else if (coverIndex === j) onCoverChange(i);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-neutral-600">Galeria de mídias</label>
        <label className="cursor-pointer rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-100">
          {uploading ? "Enviando…" : "+ Adicionar fotos"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) upload(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {err ? <p className="mt-2 text-xs text-red-600">{err}</p> : null}

      {values.length === 0 ? (
        <p className="mt-3 rounded-lg border border-dashed border-neutral-300 p-6 text-center text-xs text-neutral-500">
          Nenhuma foto adicionada. A primeira foto (ou marcada como capa) será usada na vitrine.
        </p>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {values.map((v, i) => (
            <div
              key={v + i}
              className={`group relative overflow-hidden rounded-lg border-2 bg-neutral-100 ${
                i === coverIndex ? "border-cyan-500" : "border-transparent"
              }`}
            >
              <img src={resolveImg(v)} alt="" className="aspect-square w-full object-cover" />
              <div className="absolute inset-x-0 top-0 flex justify-between p-1.5">
                {i === coverIndex ? (
                  <span className="rounded bg-cyan-500 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                    Capa
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onCoverChange(i)}
                    className="rounded bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase text-neutral-700 opacity-0 transition group-hover:opacity-100"
                  >
                    Definir capa
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 p-1.5 opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  className="rounded bg-white/90 px-2 py-0.5 text-[10px] font-medium"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => move(i, +1)}
                  className="rounded bg-white/90 px-2 py-0.5 text-[10px] font-medium"
                >
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}