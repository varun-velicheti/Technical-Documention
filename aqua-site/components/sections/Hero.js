import { BRAND } from "@/content/site";
import Img from "../Img";
import LiquidText from "../LiquidText";
import Magnetic from "../Magnetic";
import { Arrow } from "../Icons";

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__bg" data-parallax="6">
        <Img name="lake" alt="A still glacial lake at blue hour with snow-capped mountains reflected in the water" priority sizes="100vw" />
      </div>
      <div className="hero__anchor" data-bottle-anchor="hero" />
      <div className="wrap hero__content">
        <LiquidText as="h1" id="hero-title" className="display hero__title" auto lines={["Purity in", <em key="e">every drop.</em>]} />
        <div className="hero__row">
          <p className="hero__statement" data-fade="0.6">{BRAND.statement}</p>
          <div className="hero__ctas" data-fade="0.8">
            <Magnetic><a href="#story" className="btn btn--glass">Explore our water</a></Magnetic>
            <Magnetic><a href="#collection" className="btn btn--light">Order now <Arrow /></a></Magnetic>
          </div>
        </div>
      </div>
      <div className="hero__scroll" aria-hidden="true">Scroll<i /></div>
    </section>
  );
}
