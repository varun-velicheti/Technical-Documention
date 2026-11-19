import { IMAGES } from "@/lib/images";
import { BASE } from "@/lib/base";

/** Responsive <picture> with AVIF + WebP sources and intrinsic size to avoid layout shift. */
export default function Img({ name, alt, sizes = "100vw", priority = false, className, imgClassName, style, ...rest }) {
  const meta = IMAGES[name];
  if (!meta) return null;
  const set = (ext) => meta.widths.map((w) => `${BASE}/img/${name}-${w}.${ext} ${w}w`).join(", ");
  return (
    <picture className={className} {...rest}>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <img
        src={`${BASE}/img/${name}-${meta.widths[meta.widths.length - 1]}.webp`}
        srcSet={set("webp")}
        sizes={sizes}
        width={meta.w}
        height={meta.h}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding={priority ? "sync" : "async"}
        className={imgClassName}
        style={{ ...style, backgroundColor: meta.color }}
      />
    </picture>
  );
}
