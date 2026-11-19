"use client";
import { useCallback, useEffect, useState } from "react";
import Img from "./Img";
import { IMAGES } from "@/lib/images";
import { Close, Arrow } from "./Icons";

export default function Gallery({ items }) {
  const [idx, setIdx] = useState(-1);
  const open = idx >= 0;
  const close = useCallback(() => setIdx(-1), []);
  const step = useCallback((d) => setIdx((i) => (i + d + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (!open) return;
    window.dispatchEvent(new CustomEvent("scroll:lock"));
    const k = (e) => { if (e.key === "Escape") close(); if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); };
    window.addEventListener("keydown", k);
    return () => { window.removeEventListener("keydown", k); window.dispatchEvent(new CustomEvent("scroll:unlock")); };
  }, [open, close, step]);

  const cur = items[idx];
  const big = cur ? `/img/${cur.img}-${IMAGES[cur.img].widths.at(-1)}.webp` : "";
  return (
    <>
      <div className="gallery">
        {items.map((it, i) => (
          <button key={it.img + i} className={`gitem${it.contain ? " gitem--contain" : ""}`} style={{ "--tint": it.tint }} onClick={() => setIdx(i)} aria-label={`Open image: ${it.cap}`} data-fade={(i % 3) * 0.08}>
            <Img name={it.img} alt={it.alt} sizes="(max-width: 700px) 100vw, 33vw" style={it.contain ? { backgroundColor: "transparent" } : undefined} />
            <figcaption>{it.cap}</figcaption>
          </button>
        ))}
      </div>
      <div className={`lightbox${open ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Image viewer" aria-hidden={!open} onClick={(e) => e.target === e.currentTarget && close()}>
        {cur && (
          <figure style={{ margin: 0, textAlign: "center" }}>
            <img src={big} alt={cur.alt} />
            <figcaption className="lightbox__cap">{cur.cap} · {idx + 1} / {items.length}</figcaption>
          </figure>
        )}
        <button className="icon-btn lightbox__close" onClick={close} aria-label="Close viewer"><Close /></button>
        <button className="icon-btn lightbox__nav lightbox__nav--prev" onClick={() => step(-1)} aria-label="Previous image"><Arrow style={{ transform: "rotate(180deg)", width: 16 }} /></button>
        <button className="icon-btn lightbox__nav lightbox__nav--next" onClick={() => step(1)} aria-label="Next image"><Arrow style={{ width: 16 }} /></button>
      </div>
    </>
  );
}
