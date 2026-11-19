import Link from "next/link";
import Img from "../Img";
import LiquidText from "../LiquidText";
import { Arrow } from "../Icons";

export default function Legacy() {
  return (
    <section className="section story" id="story" aria-labelledby="story-title">
      <div className="wrap">
        <div className="grid-2">
          <div>
            <span className="eyebrow" data-fade>Our legacy</span>
            <div style={{ height: 28 }} />
            <LiquidText id="story-title" lines={["North Karnataka's", <em key="e">own water,</em>, "since 1997."]} />
            <p className="lede" data-fade style={{ marginTop: 36 }}>
              Kempannavar Industries began in Hosapete with a single promise: clean, safe packaged drinking water under the name KEMP&apos;S — the first such brand in North Karnataka.
            </p>
            <p className="muted" data-fade style={{ maxWidth: "50ch" }}>
              Nearly three decades on, the same family runs a sophisticated bottling facility, an alkaline water brand and a growing range of sodas — all made by a team of engineers, technicians and quality controllers committed to superior quality.
            </p>
            <Link href="/about/" className="btn btn--ghost" data-fade style={{ marginTop: 18 }}>Our story <Arrow /></Link>
          </div>
          <div className="story__media reveal-img">
            <Img name="river" alt="A crystal-clear river running over pale stones beneath misty mountains" sizes="(max-width: 900px) 100vw, 45vw" />
          </div>
        </div>
        <div className="stats">
          {[["1997", "Year Kemp's was founded"], ["10", "Products in the range"], ["2", "Water brands — Kemp's & Eight Plus"], ["2006", "Kemp's Pet Industries founded"]].map(([b, s], i) => (
            <div className="stat" key={s} data-fade={i * 0.1}><b>{b}</b><span>{s}</span></div>
          ))}
        </div>
      </div>
    </section>
  );
}
