import Link from "next/link";
import Img from "../Img";
import LiquidText from "../LiquidText";
import { Arrow } from "../Icons";

const B = [
  { tag: "Packaged drinking water", title: "Kemp's Water", text: "Our original — packaged drinking water with added minerals, from 250 ml to 2 L.", img: "p-water-blue", href: "/products/", bg: "linear-gradient(180deg, #cfe6f8 0%, #7fb6e6 100%)", color: "var(--ink)" },
  { tag: "Alkaline water", title: "Eight Plus", text: "pH 8+ alkaline water enhanced with electrolytes and minerals.", img: "ep-duo", href: "/eight-plus/", bg: "radial-gradient(ellipse at 50% 30%, #1f63b8, #061a33 78%)", color: "#fff" },
  { tag: "Sodas & beverages", title: "Kemp's Beverages", text: "Club soda, jeera soda, lemon, orange, mango, pudina twist and kokum jeera masala.", img: "jeera-mockup", href: "/products/", bg: "linear-gradient(180deg, #fbd9cf 0%, #ee9d88 100%)", color: "var(--ink)" },
];

export default function Brands() {
  return (
    <section className="section" id="brands" aria-labelledby="brands-title" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow" data-fade>Our brands</span>
            <div style={{ height: 24 }} />
            <LiquidText id="brands-title" lines={["One family,", <em key="e">three ways</em>, "to refresh."]} />
          </div>
          <p className="lede" data-fade>From everyday drinking water to alkaline water and spirited Indian sodas — each made in our Hosapete plant with the same care.</p>
        </div>
        <div className="brands">
          {B.map((b, i) => (
            <Link key={b.title} href={b.href} className="brandcard" style={{ background: b.bg, color: b.color }} data-fade={i * 0.1}>
              <div><small>{b.tag}</small><h3>{b.title}</h3></div>
              <div className="brandcard__img"><Img name={b.img} alt={`${b.title} bottles`} sizes="(max-width: 1000px) 80vw, 30vw" style={{ backgroundColor: "transparent" }} /></div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 16 }}>
                <p>{b.text}</p>
                <span className="icon-btn" aria-hidden="true" style={{ flex: "0 0 44px" }}><Arrow className="" style={{ width: 16 }} /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
