import { TESTIMONIALS } from "@/content/site";
import LiquidText from "../LiquidText";
import PrefillLink from "../PrefillLink";

export default function Testimonials() {
  const has = TESTIMONIALS.length > 0;
  const items = has ? TESTIMONIALS : [
    { segment: "Customer review" }, { segment: "Hospitality partner" }, { segment: "Corporate client" },
  ];
  return (
    <section className="section" id="testimonials" aria-labelledby="testi-title" style={{ background: "linear-gradient(180deg, var(--glacier), var(--ice))" }}>
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow" data-fade>Testimonials</span>
            <div style={{ height: 24 }} />
            <LiquidText id="testi-title" lines={["In their", <em key="e">own words.</em>]} />
          </div>
          <p className="lede" data-fade>We publish only verified reviews from real customers and partners, shared with their consent.</p>
        </div>
        <div className="testi__grid">
          {items.map((t, i) => (
            <figure className={`testi${has ? "" : " testi--pending"}`} key={i} data-fade={i * 0.1} style={{ margin: 0 }}>
              <blockquote>{has ? `“${t.quote}”` : "Verified reviews will appear here as our first customers and partners share their experience."}</blockquote>
              <figcaption>{has ? <><b style={{ color: "var(--ink)" }}>{t.name}</b><br />{t.role}</> : t.segment}</figcaption>
            </figure>
          ))}
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 12, flexWrap: "wrap" }} data-fade>
          <PrefillLink className="btn btn--ghost" topic="Review / feedback" message="I'd like to share my experience: ">Share your experience</PrefillLink>
        </div>
      </div>
    </section>
  );
}
