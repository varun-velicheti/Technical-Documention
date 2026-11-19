import Img from "../Img";
import LiquidText from "../LiquidText";
import { Recycle, Leaf, Truck, Check } from "../Icons";

export default function Sustainability() {
  return (
    <section className="section sustain" id="sustainability" aria-labelledby="sustain-title">
      <div className="wrap">
        <div className="grid-2" style={{ alignItems: "start" }}>
          <div className="sustain__img reveal-img">
            <Img name="sustain" alt="The bottle standing on a mossy rock beside a clear forest stream" sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
          <div>
            <span className="eyebrow" data-fade>Sustainability</span>
            <div style={{ height: 24 }} />
            <LiquidText id="sustain-title" lines={["Take only", <em key="e">what we return.</em>]} />
            <p className="lede" data-fade style={{ marginTop: 24 }}>Responsibility, reported honestly. We share initiatives as they launch, and impact figures only once they have been independently verified.</p>
            <ul className="commit">
              {[
                [Recycle, "Glass & aluminium packaging", "Materials that can be recycled repeatedly, chosen over single-use plastic for our collection."],
                [Leaf, "Return & refill programme", "In development for subscribers, hotels and restaurants. Launch details will be announced here."],
                [Truck, "Considered logistics", "Consolidated, scheduled deliveries to reduce empty miles across our delivery network."],
                [Check, "Verified reporting", "Environmental metrics will be published only after third-party verification."],
              ].map(([Icon, t, d], i) => (
                <li key={t} data-fade={i * 0.08}><Icon /><div><b>{t}</b><span>{d}</span></div></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
