"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PRODUCTS } from "@/content/site";
import ProductCard from "../ProductCard";
import LiquidText from "../LiquidText";
import { Arrow } from "../Icons";

gsap.registerPlugin(ScrollTrigger);

/** Pinned horizontal showcase of the full range (native scroll-snap on mobile). */
export default function Range() {
  const pin = useRef(null);
  const track = useRef(null);
  const bar = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const el = track.current;
      const dist = () => Math.max(0, el.scrollWidth - window.innerWidth);
      const tween = gsap.to(el, {
        x: () => -dist(), ease: "none",
        scrollTrigger: {
          trigger: pin.current, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: (st) => { if (bar.current) bar.current.style.transform = `scaleX(${st.progress})`; },
        },
      });
      return () => tween.scrollTrigger?.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="collection" id="range" aria-labelledby="range-title">
      <div className="collection__pin" ref={pin}>
        <div className="collection__track" ref={track}>
          <div className="pcard pcard--intro">
            <span className="eyebrow">The range</span>
            <div style={{ height: 24 }} />
            <LiquidText id="range-title" lines={["Ten ways", <em key="e">to refresh.</em>]} />
            <p className="lede" style={{ marginTop: 24 }}>Water in every size you need, alkaline Eight Plus, and sodas with a distinctly Indian character.</p>
            <Link href="/products/" className="btn btn--ghost" style={{ alignSelf: "start", marginTop: 8 }}>View all products <Arrow /></Link>
          </div>
          {PRODUCTS.map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
        <div className="collection__progress" aria-hidden="true"><i ref={bar} /></div>
      </div>
    </section>
  );
}
