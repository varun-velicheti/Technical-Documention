"use client";
import { useEffect, useRef, useState } from "react";

/** pH 0–14 scale with markers for neutral water and Eight Plus (pH 8+). */
export default function PhScale() {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const pos = (ph) => `${(ph / 14) * 100}%`;
  return (
    <div ref={ref}>
      <div className="phscale" role="img" aria-label="pH scale from 0 (acidic) to 14 (alkaline). Typical drinking water is around pH 7; Eight Plus is above pH 8.">
        <div className="phscale__marker phscale__marker--muted" style={{ left: on ? pos(7) : pos(0) }}><b>Typical water · pH 7</b><i /></div>
        <div className="phscale__marker" style={{ left: on ? pos(8.4) : pos(0), top: -96 }}><b>Eight Plus · pH 8+</b><i style={{ height: 72 }} /></div>
        <div className="phscale__bar" />
        <div className="phscale__ticks" aria-hidden="true">{Array.from({ length: 15 }, (_, i) => <span key={i}>{i}</span>)}</div>
      </div>
      <div className="phlegend">
        <div><b>Acidic</b><span>pH 0.0 – 6.9</span></div>
        <div><b>Neutral</b><span>pH 7.0</span></div>
        <div><b>Alkaline</b><span>pH 7.1 – 14.0</span></div>
      </div>
    </div>
  );
}
