import { useRef, useState } from "react";
import { Move } from "lucide-react";
import { focalXY, withFocal } from "@/lib/product-image";

/**
 * Image preview where the admin can drag the photo up/down (and sideways)
 * inside the frame to choose which part stays visible - no cropping needed.
 * The chosen position is stored in the image ref as `#fp=x,y`.
 */
export function FocalImage({
  src,
  refValue,
  onChange,
  className = "",
  imgClassName = "",
  alt = "",
}: {
  src: string;
  refValue: string;
  onChange: (nextRef: string) => void;
  className?: string;
  imgClassName?: string;
  alt?: string;
}) {
  const { x, y } = focalXY(refValue);
  const [dragging, setDragging] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  function apply(clientX: number, clientY: number) {
    const el = boxRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = ((clientX - r.left) / r.width) * 100;
    const ny = ((clientY - r.top) / r.height) * 100;
    onChange(withFocal(refValue, nx, ny));
  }

  return (
    <div
      ref={boxRef}
      onPointerDown={(e) => {
        if (!refValue) return;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        setDragging(true);
        apply(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (dragging) apply(e.clientX, e.clientY);
      }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      className={`group relative select-none overflow-hidden bg-neutral-100 ${
        refValue ? (dragging ? "cursor-grabbing" : "cursor-grab") : ""
      } ${className}`}
      title="Arraste a foto para ajustar o enquadramento"
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{ objectPosition: `${x}% ${y}%` }}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">Sem imagem</div>
      )}
      {refValue ? (
        <span className="pointer-events-none absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white opacity-0 transition group-hover:opacity-100">
          <Move className="h-3 w-3" /> arraste para ajustar
        </span>
      ) : null}
    </div>
  );
}
