import Link from "next/link";
import Img from "../Img";
import LiquidText from "../LiquidText";
import { waLink } from "@/lib/wa";
import { Arrow, WhatsApp } from "../Icons";

export default function Cta({ title = ["Stock Kemp's.", <em key="e">Serve Kemp's.</em>], text = "Distributors, retailers, offices, hotels and event organisers — tell us what you need and our team will get back to you." }) {
  return (
    <section className="section section--tight" aria-label="Enquire">
      <div className="wrap">
        <div className="cta">
          <div className="cta__bg" data-parallax="6"><Img name="lake" alt="" sizes="100vw" /></div>
          <span className="eyebrow" style={{ color: "rgba(255,255,255,.75)" }}>Distribution & bulk orders</span>
          <div style={{ height: 22 }} />
          <LiquidText className="h2" lines={title} />
          <p className="lede" style={{ color: "rgba(255,255,255,.85)", marginTop: 22 }}>{text}</p>
          <div className="cta__row">
            <a className="btn btn--light" href={waLink("Hello Kemp's, I'm interested in distribution / bulk orders.")} target="_blank" rel="noopener noreferrer"><WhatsApp width={16} height={16} /> WhatsApp us</a>
            <Link className="btn btn--glass" href="/contact/">Send an enquiry <Arrow /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
