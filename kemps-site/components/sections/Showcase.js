import Img from "../Img";
import LiquidText from "../LiquidText";

export default function Showcase() {
  return (
    <section className="section showcase" id="showcase" aria-labelledby="showcase-title">
      <div className="wrap showcase__grid">
        <div>
          <span className="eyebrow" data-fade>In the round</span>
          <div style={{ height: 24 }} />
          <LiquidText id="showcase-title" lines={["The bottle", <em key="e">you trust.</em>]} />
          <p className="lede" data-fade style={{ marginTop: 28 }}>
            Drag the bottle to turn it. Sealed at our Hosapete plant, Kemp&apos;s water reaches homes, offices, shops and events across the region.
          </p>
        </div>
        <div className="showcase__spin" data-bottle-anchor="showcase" data-bottle-spin tabIndex={0} role="img" aria-label="Interactive 360° view of a Kemp's water bottle. Drag, or use the left and right arrow keys, to rotate.">
          <div className="showcase__fallback fit"><Img name="p-water-blue" alt="" sizes="300px" style={{ backgroundColor: "transparent" }} /></div>
          <span className="showcase__hint" aria-hidden="true">← Drag to rotate →</span>
        </div>
        <ul className="spec-list" data-fade>
          <li><span>Brand</span><span>Kemp&apos;s Water</span></li>
          <li><span>Type</span><span>Packaged drinking water</span></li>
          <li><span>Enhanced</span><span>With added minerals</span></li>
          <li><span>Sizes</span><span>2 L · 1 L · 500 ml · 250 ml</span></li>
          <li><span>Made in</span><span>Hosapete, Karnataka</span></li>
        </ul>
      </div>
    </section>
  );
}
