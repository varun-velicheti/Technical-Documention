import Img from "../Img";
import LiquidText from "../LiquidText";

export default function Award() {
  return (
    <section className="section" id="award" aria-labelledby="award-title" style={{ background: "linear-gradient(180deg, var(--glacier), var(--ice))" }}>
      <div className="wrap grid-2">
        <div>
          <span className="eyebrow" data-fade>Recognition</span>
          <div style={{ height: 24 }} />
          <LiquidText id="award-title" lines={["Excellence,", <em key="e">recognised.</em>]} />
          <p className="lede" data-fade style={{ marginTop: 26 }}>Kemp&apos;s received the Sir M. Visvesvaraya Manufacturing Excellence Award for 2017–18 from the Department of Industries &amp; Commerce, Government of Karnataka.</p>
        </div>
        <figure className="award__frame reveal-img" style={{ margin: 0 }}>
          <Img name="award" alt="Kemp's receiving the Sir M. Visvesvaraya Manufacturing Excellence Award 2017–18" sizes="(max-width: 900px) 100vw, 48vw" />
        </figure>
      </div>
    </section>
  );
}
