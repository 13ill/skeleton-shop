import { useState, useEffect } from "react";

/**
 * Widths (px) that the backend `/upload` endpoint generates as WebP variants.
 * A variant URL looks like `<path-without-ext>-<width>.webp`.
 */
const VARIANT_WIDTHS = [400, 800, 1200];

const IMG_EXT_RE = /\.(jpe?g|png|webp)$/i;
const VARIANT_RE = /-(\d+)\.webp$/i;

/**
 * Given any image URL, work out the "base" used to build responsive variants.
 * - `/Product/a/b.jpg`      -> `/Product/a/b`
 * - `/uploads/x-800.webp`   -> `/uploads/x`
 * Returns null for data URLs / unknown formats so we just render the original.
 */
function getVariantBase(src: string): string | null {
  if (!src || src.startsWith("data:")) return null;
  const variant = src.match(VARIANT_RE);
  if (variant) return src.slice(0, src.length - variant[0].length);
  const ext = src.match(IMG_EXT_RE);
  if (ext) return src.slice(0, src.length - ext[0].length);
  return null;
}

/**
 * Build a `srcSet` string for the standard variant widths, or undefined if the
 * URL does not look like a resizable image.
 */
export function buildSrcSet(src: string): string | undefined {
  const base = getVariantBase(src);
  if (!base) return undefined;
  return VARIANT_WIDTHS.map((w) => `${base}-${w}.webp ${w}w`).join(", ");
}

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  /** `sizes` attribute hint for the browser to pick the right variant. */
  sizes?: string;
  /** Load immediately (above the fold) instead of lazily. */
  eager?: boolean;
  draggable?: boolean;
  onClick?: () => void;
  /** Inline style forwarded to the underlying <img> (e.g. for hover zoom transform). */
  style?: React.CSSProperties;
}

/**
 * <img> wrapper that serves appropriately-sized WebP variants via `srcSet`
 * (reducing bandwidth / CDN egress cost) and lazy-loads by default.
 *
 * If the generated variants are missing (e.g. an old image that was never
 * processed), it gracefully falls back to the original `src`, and finally to a
 * placeholder.
 */
export function ResponsiveImage({
  src,
  alt,
  className,
  sizes = "100vw",
  eager = false,
  draggable,
  onClick,
  style,
}: ResponsiveImageProps) {
  const [useVariants, setUseVariants] = useState(true);

  // Reset the variant attempt whenever the source changes.
  useEffect(() => {
    setUseVariants(true);
  }, [src]);

  const srcSet = useVariants ? buildSrcSet(src) : undefined;

  return (
    <img
      src={src || "/placeholder.svg"}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      className={className}
      style={style}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={draggable}
      onClick={onClick}
      onError={(e) => {
        if (srcSet) {
          // A variant failed to load -> retry with the plain original src.
          setUseVariants(false);
        } else {
          (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
        }
      }}
    />
  );
}
