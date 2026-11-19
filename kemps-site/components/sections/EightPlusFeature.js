import Link from "next/link";
import { asset } from "@/lib/base";
import Img from "../Img";
import SwirlBottle from "../SwirlBottle";
import LiquidText from "../LiquidText";
import { Arrow, Download } from "../Icons";

export default function EightPlusFeature() {
  return (
    <section className="section ep" id="eight-plus" aria-labelledby="ep-title">
      <div className="wrap grid-2">
        <div className="ep__img" data-parallax="-6" style={{ height: "min(78vh, 700px)" }}><SwirlBottle alt="An Eight Plus alkaline water bottle with water swirling around it" sizes="(max-width: 900px) 80vw, 40vw" /></div>
        <div>
          <Img name="ep-logo" alt="Eight Plus" sizes="260px" style={{ backgroundColor: "transparent", width: 260, height: "auto", filter: "brightness(0) invert(1)" }} />
          <div style={{ height: 30 }} />
          <LiquidText id="ep-title" lines={["Your go-to drink", <em key="e">to balance your life.</em>]} />
          <p className="lede" data-fade style={{ marginTop: 26 }}>Eight Plus is a premium water-based electrolyte beverage with a pH above 8, enhanced with electrolytes and minerals. It tastes as good as it feels.</p>
          <div className="minerals" data-fade>
            {[["Ca", "Calcium"], ["Mg", "Magnesium"], ["K", "Potassium"], ["Na", "Sodium"]].map(([s, n]) => <div className="mineral" key={s}><b>{s}</b><span>{n}</span></div>)}
          </div>
          <div className="cta__row" data-fade>
            <Link href="/eight-plus/" className="btn btn--light">Discover Eight Plus <Arrow /></Link>
            <a href={asset("/docs/eight-plus-brochure.pdf")} download className="btn btn--glass"><Download width={16} height={16} /> Brochure (PDF)</a>
          </div>
        </div>
      </div>
    </section>
  );
}
