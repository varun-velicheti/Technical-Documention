import Img from "../Img";
import LiquidImage, { DROPLET } from "../LiquidImage";
import LiquidText from "../LiquidText";

export default function ParallaxBand() {
  return (
    <section className="parallax" aria-label="Brand statement">
      <div className="parallax__layer" data-parallax="12">
        <LiquidImage name="droplet" alt="" mode="ripple" fit="cover" center={DROPLET.center} drop={DROPLET.drop} sizes="100vw" />
      </div>
      <div className="parallax__mist" />
      <div className="parallax__layer" data-parallax="-10" style={{ inset: "auto 7% -6% auto", width: "min(22vw, 250px)", height: "auto", zIndex: 1 }}>
        <Img name="p-water-blue" alt="Kemp's water bottles" sizes="22vw" style={{ backgroundColor: "transparent", filter: "drop-shadow(0 40px 50px rgba(0,0,0,.5))" }} />
      </div>
      <div className="parallax__quote">
        <div>
          <span className="eyebrow" style={{ color: "rgba(255,255,255,.75)" }}>With added minerals</span>
          <div style={{ height: 24 }} />
          <LiquidText className="h2" lines={["Clean. Safe.", <em key="e">Honestly refreshing.</em>]} />
        </div>
      </div>
    </section>
  );
}
