import { useEffect, useRef, useState } from "react";

interface SmartImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  objectPosition?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  /** Extra classes for the skeleton placeholder */
  skeletonClassName?: string;
}

/**
 * Imagem com placeholder skeleton suave, fade-in e lazy loading.
 * Deve ser usada dentro de um container `relative` com proporção fixa
 * (ex.: `relative aspect-[3/4] overflow-hidden`) para evitar layout shift.
 */
export function SmartImage({
  src,
  alt,
  className = "",
  objectPosition = "50% 50%",
  priority = false,
  width,
  height,
  skeletonClassName = "",
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  // Imagens vindas do cache do browser podem já estar completas antes do onLoad.
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) setLoaded(true);
  }, [src]);

  return (
    <>
      <div
        aria-hidden
        className={`absolute inset-0 skeleton-shimmer transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100"
        } ${skeletonClassName}`}
      />
      {src ? (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          {...(priority ? { fetchPriority: "high" as const } : {})}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          style={{ objectPosition }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
            loaded ? "opacity-100" : "opacity-0"
          } ${className}`}
        />
      ) : null}
    </>
  );
}
