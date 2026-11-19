import Img from "../Img";
import LiquidText from "../LiquidText";

export default function Story() {
  return (
    <section className="section story" id="story" aria-labelledby="story-title">
      <div className="wrap">
        <div className="grid-2">
          <div>
            <span className="eyebrow" data-fade>Our story</span>
            <div style={{ height: 28 }} />
            <LiquidText id="story-title" lines={["Born from one idea:", <em key="e">leave water</em>, <em key="f">alone.</em>]} />
            <p className="lede" data-fade style={{ marginTop: 36 }}>
              We started with a question most brands skip — what does water need from us? The honest answer was very little. Protection, patience and proof.
            </p>
            <p className="muted" data-fade style={{ maxWidth: "48ch" }}>
              So that is what we built: a quiet discipline of careful handling, considered packaging and published testing. Our source and laboratory data will be shared openly as each is independently verified — because trust should be earned in the open.
            </p>
          </div>
          <div className="story__media reveal-img">
            <Img name="river" alt="A crystal-clear glacial river running over pale stones beneath misty mountains" sizes="(max-width: 900px) 100vw, 45vw" />
          </div>
        </div>
        <div className="story__pillars">
          {[
            ["01", "Origin", "Our source will be named, located and documented here once independently verified. We describe nothing we cannot evidence."],
            ["02", "Philosophy", "Restraint over decoration. We keep the process minimal and the packaging honest, so the water speaks for itself."],
            ["03", "Commitment", "Every batch tested. Every report published. Every bottle traceable to the day it was filled."],
          ].map(([n, t, d], i) => (
            <div className="pillar" key={n} data-fade={i * 0.12}>
              <span className="pillar__num">{n}</span>
              <h3 className="h3" style={{ marginTop: 8 }}>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
