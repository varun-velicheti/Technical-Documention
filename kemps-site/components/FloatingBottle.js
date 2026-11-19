"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LiquidImage, { KEMPS_BOTTLE } from "./LiquidImage";

gsap.registerPlugin(ScrollTrigger);

/**
 * The real Kemp's bottle photo with its splash brought to life.
 * variant="hero": floats and turns gently as the page scrolls.
 * variant="tilt": tilts in 3D toward the pointer (or finger) for the showcase.
 */
export default function FloatingBottle({ variant = "hero", className = "", sizes = "40vw" }) {
  const outer = useRef(null);
  const inner = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = outer.current, card = inner.current;
    if (variant === "hero") {
      const tween = gsap.fromTo(el, { rotate: 0, yPercent: 0 }, {
        rotate: 10, yPercent: -12, ease: "none",
        scrollTrigger: { trigger: el.closest("section"), start: "top top", end: "bottom top", scrub: 1 },
      });
      return () => tween.scrollTrigger?.kill();
    }
    // tilt toward pointer
    const zone = el.closest("section") || el;
    let rx = 0, ry = 0, tx = 0, ty = 0, raf = 0;
    const loop = () => {
      rx += (tx - rx) * 0.08; ry += (ty - ry) * 0.08;
      card.style.transform = `perspective(1100px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      raf = Math.abs(tx - rx) + Math.abs(ty - ry) > 0.01 ? requestAnimationFrame(loop) : 0;
    };
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const y = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      ty = Math.max(-1, Math.min(1, x)) * 16;
      tx = Math.max(-1, Math.min(1, y)) * -10;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const leave = () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); };
    zone.addEventListener("pointermove", move);
    zone.addEventListener("pointerleave", leave);
    const scroll = gsap.fromTo(el, { rotate: -6 }, { rotate: 6, ease: "none", scrollTrigger: { trigger: zone, start: "top bottom", end: "bottom top", scrub: 1 } });
    return () => { zone.removeEventListener("pointermove", move); zone.removeEventListener("pointerleave", leave); cancelAnimationFrame(raf); scroll.scrollTrigger?.kill(); };
  }, [variant]);

  return (
    <div ref={outer} className={`fbottle fbottle--${variant} ${className}`}>
      <div ref={inner} className="fbottle__card">
        <LiquidImage className="liquid--float" name="kemps-bottle" mode="splash" fit="contain" protect={KEMPS_BOTTLE.protect} angle={KEMPS_BOTTLE.angle} strength={1.2}
          alt="Kemp's packaged drinking water 1 litre bottle with a pink cap and label, surrounded by a splash of water" sizes={sizes} />
      </div>
    </div>
  );
}
