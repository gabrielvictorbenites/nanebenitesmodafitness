import { useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FocalImage } from "@/components/admin/FocalImage";
import { resolveImageAsync, colorOf, withColor } from "@/lib/product-image";

function useResolved(ref: string) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    let alive = true;
    resolveImageAsync(ref).then((u) => {
      if (alive) setUrl(u);
    });
    return () => {
      alive = false;
    };
  }, [ref]);
  return url;
}

export function MediaUploader({
  values,
  onChange,
  coverIndex,
  onCoverChange,
  colors = [],
}: {
  values: string[];
  onChange: (v: string[]) => void;
  coverIndex: number;
  onCoverChange: (i: number) => void;
  colors?: string[];
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Mídias</p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) upload(e.dataTransfer.files);
        }}
        className={`mt-2 rounded-xl border-2 border-dashed p-8 text-center transition ${
          dragOver ? "border-cyan-500 bg-cyan-50/40" : "border-neutral-300 bg-[#faf6ef]"
        }`}
      >
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
          <Upload className="h-4 w-4 text-neutral-700" />
        </div>
        <p className="mt-3 text-sm text-neutral-700">
          Arraste imagens aqui ou
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-md bg-[#b0491f] px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-white shadow-sm hover:opacity-90 disabled:opacity-60"
          >
            {uploading ? "Enviando…" : "Selecionar imagens"}
          </button>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-neutral-500">
          Primeira imagem vira a capa. Use as setas para reordenar.<br />
          Marque a cor de cada foto para o cliente trocar de cor no site.<br />
          Arraste a foto dentro do quadrado para ajustar o enquadramento - nada é cortado.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) upload(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {err ? <p className="mt-2 text-xs text-red-600">{err}</p> : null}

      {values.length === 0 ? (
        <p className="mt-3 rounded-lg border border-dashed border-neutral-300 p-6 text-center text-xs text-neutral-500">
          Nenhuma foto adicionada. A primeira foto (ou marcada como capa) será usada na vitrine.
        </p>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {values.map((v, i) => (
            <MediaThumb
              key={v.split("#")[0] + i}
              value={v}
              isCover={i === coverIndex}
              onFocal={(next) => {
                const arr = [...values];
                arr[i] = next;
                onChange(arr);
              }}
            >
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
              <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 p-1.5 opacity-0 transition group-hover:opacity-100">
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
              </MediaThumb>
              {colors.length > 0 ? (
                <select
                  value={colorOf(v)}
                  onChange={(e) => {
                    const arr = [...values];
                    arr[i] = withColor(v, e.target.value);
                    onChange(arr);
                  }}
                  className="mt-1 h-8 w-full rounded-md border border-neutral-300 bg-white px-2 text-[11px]"
                >
                  <option value="">Sem cor</option>
                  {colors.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MediaThumb({
  value,
  isCover,
  onFocal,
  children,
}: {
  value: string;
  isCover: boolean;
  onFocal: (next: string) => void;
  children: React.ReactNode;
}) {
  const url = useResolved(value);
  return (
    <div
      className={`group relative overflow-hidden rounded-lg border-2 ${
        isCover ? "border-cyan-500" : "border-transparent"
      }`}
    >
      <FocalImage
        src={url}
        refValue={value}
        onChange={onFocal}
        className="aspect-square w-full rounded-md"
      />
      {children}
    </div>
  );
}