import Link from "next/link";
import { BRAND } from "@/content/site";
import { waLink } from "@/lib/wa";
import Img from "../Img";
import LiquidText from "../LiquidText";
import Magnetic from "../Magnetic";
import { Arrow, WhatsApp } from "../Icons";

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__bg" data-parallax="6">
        <Img name="lake" alt="A still, crystal-clear lake at blue hour with mountains reflected in the water" priority sizes="100vw" />
      </div>
      <div className="hero__anchor" data-bottle-anchor="hero" />
      <div className="wrap hero__content">
        <div style={{ alignSelf: "end" }}>
          <span className="eyebrow" data-fade style={{ color: "rgba(255,255,255,.8)" }}>Kemp&apos;s · Since 1997 · Hosapete</span>
          <div style={{ height: 22 }} />
          <LiquidText as="h1" id="hero-title" className="display hero__title" auto lines={["Purity in", <em key="e">every drop.</em>]} />
        </div>
        <div className="hero__row">
          <p className="hero__statement" data-fade="0.2">{BRAND.statement}</p>
          <div className="hero__ctas" data-fade="0.35">
            <Magnetic><Link href="/products/" className="btn btn--light">Explore our range <Arrow /></Link></Magnetic>
            <Magnetic><a href={waLink("Hello Kemp's, I'd like to enquire about your products.")} target="_blank" rel="noopener noreferrer" className="btn btn--glass"><WhatsApp width={16} height={16} /> Enquire now</a></Magnetic>
          </div>
        </div>
      </div>
      <div className="hero__scroll" aria-hidden="true">Scroll<i /></div>
    </section>
  );
}
