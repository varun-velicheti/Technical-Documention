import LiquidText from "../LiquidText";
import { Glass, Shield, Trace, Drop, Truck, Leaf } from "../Icons";

const ITEMS = [
  [Glass, "Glass, without compromise", "Every bottle in our collection is glass with an aluminium cap — chosen for neutrality of taste and a cleaner end of life."],
  [Shield, "Published proof", "Certificates and laboratory reports are made public and downloadable as they are issued. No unverifiable claims."],
  [Trace, "Batch traceability", "A batch code on every bottle connects it to the day, line and test results behind it."],
  [Drop, "Nothing added for show", "A minimal process, designed to protect the water rather than reinvent it."],
  [Truck, "Delivery that fits your rhythm", "One-off orders, subscriptions or scheduled business supply — with PIN-code availability at checkout."],
  [Leaf, "Designed to be returned", "A bottle return and refill programme is in development for subscribers and business partners."],
];

export default function Why() {
  return (
    <section className="section" id="why" aria-labelledby="why-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow" data-fade>Why choose us</span>
            <div style={{ height: 24 }} />
            <LiquidText id="why-title" lines={["The details", <em key="e">no one sees.</em>]} />
          </div>
          <p className="lede" data-fade>Premium is not a label. It is a sequence of small, deliberate decisions — most of them invisible, all of them on purpose.</p>
        </div>
        <div className="why__grid">
          {ITEMS.map(([Icon, t, d], i) => (
            <div className="why__item" key={t} data-fade={(i % 3) * 0.1}>
              <Icon />
              <h3 className="h3">{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
