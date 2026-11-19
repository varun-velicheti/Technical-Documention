import { MILESTONES } from "@/content/site";
import Motion from "@/components/Motion";
import PageHero from "@/components/PageHero";
import LiquidText from "@/components/LiquidText";
import Img from "@/components/Img";
import Plant from "@/components/sections/Plant";
import Award from "@/components/sections/Award";
import Cta from "@/components/sections/Cta";

export const metadata = {
  title: "About Us",
  description: "Kempannavar Industries was established in Hosapete in 1997, launching KEMP'S packaged drinking water — the first such brand in North Karnataka — and later Kemp's Pet Industries and a range of beverages.",
  alternates: { canonical: "/about/" },
};

export default function About() {
  return (
    <>
      <Motion />
      <PageHero image="river" eyebrow="About us" lines={["A Hosapete story", <em key="e">since 1997.</em>]} lede="Two companies, one family, and nearly three decades of bottling water and beverages for North Karnataka." />

      <section className="section" aria-labelledby="ki-title">
        <div className="wrap grid-2" style={{ alignItems: "start" }}>
          <div>
            <span className="eyebrow" data-fade>Kempannavar Industries</span>
            <div style={{ height: 24 }} />
            <LiquidText id="ki-title" lines={["Where it", <em key="e">all began.</em>]} />
          </div>
          <div>
            <p className="lede" data-fade style={{ marginTop: 0 }}>Kempannavar Industries was established in 1997 under the ownership of K S Manjunath. The company began by manufacturing packaged drinking water under the brand name KEMP&apos;S — the first such brand in North Karnataka.</p>
            <p className="muted" data-fade>In 2003 the company diversified into the beverage industry with its own KEMP&apos;S brand. The plant is located in Hosapete, Ballari district, Karnataka, where sophisticated water bottling facilities let us meet the growing demands of customers across the market — including urgent requests for larger quantities.</p>
            <p className="muted" data-fade>Our team of engineers, technicians, quality controllers, sales personnel and analysts is committed to supplying superior quality products, supported by a wide network of marketing agents.</p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="kp-title" style={{ background: "var(--glacier-2)" }}>
        <div className="wrap grid-2" style={{ alignItems: "center" }}>
          <div className="reveal-img fit" style={{ borderRadius: "var(--radius)", overflow: "hidden", background: "linear-gradient(180deg,#fbe9e4,#f2c9bf)", padding: "48px 0", aspectRatio: "4 / 4.4" }}>
            <Img name="jeera-mockup" alt="Kemp's Jeera Soda bottle" sizes="(max-width: 900px) 60vw, 26vw" style={{ backgroundColor: "transparent", filter: "drop-shadow(0 30px 30px rgba(6,24,42,.25))" }} />
          </div>
          <div>
            <span className="eyebrow" data-fade>Kemp&apos;s Pet Industries</span>
            <div style={{ height: 24 }} />
            <LiquidText id="kp-title" lines={["Growing", <em key="e">the family.</em>]} />
            <p className="lede" data-fade style={{ marginTop: 26 }}>Founded by K M Sunitha in 2006, who is currently its CEO, Kemp&apos;s Pet Industries brought club soda and jeera soda into the range.</p>
            <p className="muted" data-fade>Today the range includes flavours such as lemon ginger, nannari, pudina and kokum jeera. Research and development drives the company forward, and Kemp&apos;s is proud to empower women from rural areas.</p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="people-title">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow" data-fade>Leadership</span>
              <div style={{ height: 24 }} />
              <LiquidText id="people-title" lines={["The people", <em key="e">behind Kemp&apos;s.</em>]} />
            </div>
            <p className="lede" data-fade>Both founders completed their training and were certified by the Central Food Technological Research Institute (CFTRI), Mysore.</p>
          </div>
          <div className="people">
            <div className="person" data-fade><span className="monogram" aria-hidden="true">KSM</span><div><h3 className="h3">K S Manjunath</h3><p>Founder, Kempannavar Industries. Established the company in 1997 and launched KEMP&apos;S packaged drinking water.</p></div></div>
            <div className="person" data-fade="0.1"><span className="monogram" aria-hidden="true">KMS</span><div><h3 className="h3">K M Sunitha</h3><p>Founder &amp; CEO, Kemp&apos;s Pet Industries. Founded the company in 2006 and leads its beverage range and R&amp;D.</p></div></div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="tl-title" style={{ paddingTop: 0 }}>
        <div className="wrap grid-2" style={{ alignItems: "start" }}>
          <div style={{ position: "sticky", top: 120 }}>
            <span className="eyebrow" data-fade>Milestones</span>
            <div style={{ height: 24 }} />
            <LiquidText id="tl-title" lines={["Nearly three", <em key="e">decades.</em>]} />
          </div>
          <ol className="timeline">
            {MILESTONES.map((m, i) => (
              <li className="tl" key={m.year} data-fade={i * 0.05}><span className="tl__year">{m.year}</span><div><h3 className="h3">{m.title}</h3><p>{m.text}</p></div></li>
            ))}
          </ol>
        </div>
      </section>

      <Plant dark />
      <Award />
      <Cta />
    </>
  );
}
