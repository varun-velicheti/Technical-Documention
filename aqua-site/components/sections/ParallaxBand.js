import Img from "../Img";
import LiquidText from "../LiquidText";

export default function ParallaxBand() {
  return (
    <section className="parallax" aria-label="Brand statement">
      <div className="parallax__layer" data-parallax="12">
        <Img name="river" alt="" sizes="100vw" />
      </div>
      <div className="parallax__mist" />
      <div className="parallax__layer" data-parallax="-8" style={{ inset: "auto 6% -10% auto", width: "min(30vw, 360px)", height: "auto", zIndex: 1 }}>
        <div style={{ borderRadius: 999, overflow: "hidden", aspectRatio: "3 / 4.4", boxShadow: "0 50px 100px -40px rgba(0,0,0,.6)" }}>
          <Img name="ice" alt="The bottle resting in crushed ice, beaded with condensation" sizes="30vw" />
        </div>
      </div>
      <div className="parallax__quote">
        <div>
          <span className="eyebrow" style={{ color: "rgba(255,255,255,.75)" }}>Our belief</span>
          <div style={{ height: 24 }} />
          <LiquidText className="h2" lines={["Clarity is not added.", <em key="e">It is protected.</em>]} />
        </div>
      </div>
    </section>
  );
}
