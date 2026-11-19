import Img from "../Img";
import LiquidText from "../LiquidText";
import { Shield, Drop, Leaf } from "../Icons";

export default function Plant({ dark = false }) {
  return (
    <section className={`section${dark ? " dark" : ""}`} id="plant" aria-labelledby="plant-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow" data-fade>How we work</span>
            <div style={{ height: 24 }} />
            <LiquidText id="plant-title" lines={["Made with care", <em key="e">in Hosapete.</em>]} />
          </div>
          <p className="lede" data-fade>Our sophisticated bottling facility in Hosapete lets us meet growing demand — including urgent, large-volume orders — without compromising on quality.</p>
        </div>
        <div className="values">
          {[
            [Shield, "Quality, by people", "A dedicated team of engineers, technicians, quality controllers, analysts and sales staff, committed to supplying superior products."],
            [Drop, "Trained at CFTRI", "Our founders completed their training and certification at the Central Food Technological Research Institute (CFTRI), Mysore."],
            [Leaf, "Research & community", "Research and development guides our future, and we create opportunities for women from rural areas."],
          ].map(([Icon, t, d], i) => (
            <div key={t} data-fade={i * 0.1}><Icon /><h3 className="h3">{t}</h3><p>{d}</p></div>
          ))}
        </div>
      </div>
    </section>
  );
}
