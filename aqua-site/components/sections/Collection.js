"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PRODUCTS, PACKS } from "@/content/site";
import { packPrice, inr } from "@/lib/pricing";
import { useCart } from "../Cart";
import Img from "../Img";
import LiquidText from "../LiquidText";
import { Arrow } from "../Icons";

gsap.registerPlugin(ScrollTrigger);

function ProductCard({ p }) {
  const { add, setOpen } = useCart();
  const [pack, setPack] = useState("six");
  const packObj = PACKS.find((x) => x.id === pack);
  return (
    <article className="pcard" aria-labelledby={`p-${p.slug}`}>
      <Link href={`/products/${p.slug}`} className="pcard__img" aria-label={`View ${p.name} ${p.volume}`}>
        <Img name={p.image} alt={`${p.name} ${p.volume} glass bottle`} sizes="(max-width: 900px) 82vw, 30vw" />
      </Link>
      <div className="pcard__body">
        <div className="pcard__top">
          <h3 className="h3" id={`p-${p.slug}`}>{p.name} <span className="muted" style={{ fontSize: ".6em" }}>{p.volume}</span></h3>
          <span className="pcard__price">{inr(packPrice(p, packObj))}</span>
        </div>
        <p className="muted small" style={{ margin: 0 }}>{p.moment}</p>
        <div className="chips" role="radiogroup" aria-label={`Pack size for ${p.name}`}>
          {PACKS.map((x) => (
            <button key={x.id} className="chip" role="radio" aria-checked={pack === x.id} onClick={() => setPack(x.id)}>{x.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: "auto", flexWrap: "wrap" }}>
          <button className="btn btn--sm" style={{ flex: 1 }} onClick={() => { add({ slug: p.slug, pack, plan: "once", qty: 1 }); setOpen(true); }}>Add to bag</button>
          <Link className="btn btn--ghost btn--sm" href={`/products/${p.slug}`}>Subscribe</Link>
        </div>
      </div>
    </article>
  );
}

export default function Collection() {
  const pin = useRef(null);
  const track = useRef(null);
  const bar = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      if (reduce) return;
      const el = track.current;
      const dist = () => Math.max(0, el.scrollWidth - window.innerWidth);
      const tween = gsap.to(el, {
        x: () => -dist(),
        ease: "none",
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
    <section className="collection" id="collection" aria-labelledby="collection-title">
      <div className="collection__pin" ref={pin}>
        <div className="collection__track" ref={track}>
          <div className="pcard pcard--intro">
            <span className="eyebrow">The collection</span>
            <div style={{ height: 24 }} />
            <LiquidText id="collection-title" lines={["Three measures.", <em key="e">One standard.</em>]} />
            <p className="lede" style={{ marginTop: 24 }}>Individual bottles, gift-ready packs and cases for the table, the desk and the event. Order once or subscribe.</p>
          </div>
          {PRODUCTS.map((p) => <ProductCard key={p.slug} p={p} />)}
          <article className="pcard pcard--wide">
            <div className="pcard__img" style={{ aspectRatio: "4 / 3" }}>
              <Img name="case" alt="An open white case holding twelve glass bottles" sizes="(max-width: 900px) 82vw, 42vw" />
            </div>
            <div className="pcard__body">
              <h3 className="h3">Cases &amp; bulk supply</h3>
              <p className="muted small" style={{ margin: 0 }}>Cases of 12 and 24 for homes and offices, and custom volumes for hotels, restaurants, weddings and events.</p>
              <div style={{ display: "flex", gap: 8, marginTop: "auto", flexWrap: "wrap" }}>
                <a className="btn btn--sm" href="#bulk">Request a quotation <Arrow /></a>
              </div>
            </div>
          </article>
          <article className="pcard pcard--wide">
            <div className="pcard__img" style={{ aspectRatio: "16 / 10" }}>
              <Img name="lineup" alt="The three bottle sizes standing side by side" sizes="(max-width: 900px) 82vw, 42vw" />
            </div>
            <div className="pcard__body">
              <h3 className="h3">Water, on schedule</h3>
              <p className="muted small" style={{ margin: 0 }}>Choose a size, pack and frequency. Pause, change or cancel before any dispatch.</p>
              <div style={{ display: "flex", gap: 8, marginTop: "auto", flexWrap: "wrap" }}>
                <Link className="btn btn--ghost btn--sm" href="/products/classic-500">Start a subscription <Arrow /></Link>
              </div>
            </div>
          </article>
        </div>
        <div className="collection__progress" aria-hidden="true"><i ref={bar} /></div>
      </div>
    </section>
  );
}
