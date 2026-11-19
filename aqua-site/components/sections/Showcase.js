import Img from "../Img";
import LiquidText from "../LiquidText";

export default function Showcase() {
  return (
    <section className="section showcase" id="showcase" aria-labelledby="showcase-title">
      <div className="wrap showcase__grid">
        <div>
          <span className="eyebrow" data-fade>In the round</span>
          <div style={{ height: 24 }} />
          <LiquidText id="showcase-title" lines={["Shaped by", <em key="e">stillness.</em>]} />
          <p className="lede" data-fade style={{ marginTop: 28 }}>
            A heavy glass base, a straight column and a brushed metal cap. Drag the bottle to turn it — every angle is designed to catch light the way water does.
          </p>
        </div>
        <div className="showcase__spin" data-bottle-anchor="showcase" data-bottle-spin tabIndex={0} role="img" aria-label="Interactive 360° view of the bottle. Drag, or use the left and right arrow keys, to rotate.">
          <div className="showcase__fallback"><Img name="studio" alt="" sizes="340px" /></div>
          <span className="showcase__hint" aria-hidden="true">← Drag to rotate →</span>
        </div>
        <ul className="spec-list" data-fade>
          <li><span>Signature</span><span>Classic · 500 ml</span></li>
          <li><span>Vessel</span><span>Glass, heavy base</span></li>
          <li><span>Closure</span><span>Aluminium screw cap</span></li>
          <li><span>Serve</span><span>Chilled, 8–10°C</span></li>
          <li><span>Source</span><span className="muted">To be published</span></li>
        </ul>
      </div>
    </section>
  );
}
