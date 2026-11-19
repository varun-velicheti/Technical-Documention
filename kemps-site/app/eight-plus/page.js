import { waLink } from "@/lib/wa";
import { asset } from "@/lib/base";
import Motion from "@/components/Motion";
import PageHero from "@/components/PageHero";
import LiquidText from "@/components/LiquidText";
import Img from "@/components/Img";
import PhScale from "@/components/PhScale";
import Cta from "@/components/sections/Cta";
import { Download, WhatsApp } from "@/components/Icons";

export const metadata = {
  title: "Eight Plus Alkaline Water",
  description: "Eight Plus is a premium alkaline water-based electrolyte beverage with a pH above 8, enhanced with electrolytes and minerals — calcium, magnesium, potassium and sodium. Available in 1 L and 500 ml.",
  alternates: { canonical: "/eight-plus/" },
};

export default function EightPlus() {
  return (
    <>
      <Motion />
      <PageHero image="droplet" aside="ep-splash" asideAlt="An Eight Plus alkaline water bottle wrapped in a splash of water" eyebrow="Eight Plus · Alkaline water" lines={["Your go-to drink", <em key="e">to balance your life.</em>]} lede="A premium water-based electrolyte beverage with a pH above 8 — enhanced with electrolytes and minerals." >
        <div className="cta__row" data-fade>
          <a href={asset("/docs/eight-plus-brochure.pdf")} download className="btn btn--light"><Download width={16} height={16} /> Download brochure</a>
          <a href={waLink("Hello Kemp's, I'd like to enquire about Eight Plus alkaline water.")} target="_blank" rel="noopener noreferrer" className="btn btn--glass"><WhatsApp width={16} height={16} /> Enquire</a>
        </div>
      </PageHero>

      <section className="section" aria-labelledby="ep-about">
        <div className="wrap grid-2">
          <div className="fit" data-parallax="-5" style={{ height: "min(70vh, 620px)" }}>
            <Img name="ep-duo" alt="Eight Plus alkaline water in 1 L and 500 ml bottles" sizes="(max-width: 900px) 90vw, 44vw" style={{ backgroundColor: "transparent" }} />
          </div>
          <div>
            <span className="eyebrow" data-fade>About Eight Plus</span>
            <div style={{ height: 24 }} />
            <LiquidText id="ep-about" lines={["Tastes as good", <em key="e">as it feels.</em>]} />
            <p className="lede" data-fade style={{ marginTop: 26 }}>Eight Plus started out as a quest to develop great-tasting water while embracing new trends in hydration. With a pH above 8, it&apos;s enriched with alkaline minerals and electrolytes for a crisp, refreshing taste.</p>
            <p className="muted" data-fade>Made for people who want to stay active and keep a healthier lifestyle — one bottle at a time.</p>
            <div className="minerals light" data-fade>
              {[["Ca", "Calcium"], ["Mg", "Magnesium"], ["K", "Potassium"], ["Na", "Sodium"]].map(([s, n]) => <div className="mineral" key={s}><b>{s}</b><span>{n}</span></div>)}
            </div>
            <div className="sizes" style={{ marginTop: 8 }}><span>1 L</span><span>500 ml</span></div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="ph-title" style={{ background: "var(--glacier-2)" }}>
        <div className="wrap grid-2" style={{ alignItems: "center" }}>
          <div>
            <span className="eyebrow" data-fade>Understanding pH</span>
            <div style={{ height: 24 }} />
            <LiquidText id="ph-title" lines={["What makes water", <em key="e">alkaline?</em>]} />
            <p className="lede" data-fade style={{ marginTop: 26 }}>pH measures how acidic or basic a liquid is, on a scale from 0 to 14. Typical drinking water sits around pH 7; alkaline water is commonly pH 8 to 9.</p>
            <p className="muted" data-fade>pH alone doesn&apos;t make water alkaline — alkaline minerals matter too. That&apos;s why Eight Plus pairs a pH above 8 with calcium, magnesium, potassium and sodium.</p>
            <PhScale />
          </div>
          <div className="reveal-img fit" style={{ borderRadius: "var(--radius)", overflow: "hidden", background: "#fff", aspectRatio: "4 / 3.4" }}>
            <Img name="ph-glass" alt="A glass of water in front of a pH scale from acidic to alkaline" sizes="(max-width: 900px) 100vw, 46vw" style={{ backgroundColor: "transparent" }} />
          </div>
        </div>
      </section>

      <Cta title={["Bring Eight Plus", <em key="e">to your shelves.</em>]} text="Retailers, gyms, cafés and distributors — ask us about Eight Plus supply and pricing." />
    </>
  );
}
