import { QUALITY_DOCS } from "@/content/site";
import Img from "../Img";
import LiquidText from "../LiquidText";
import PrefillLink from "../PrefillLink";
import { Download } from "../Icons";

export default function Quality() {
  return (
    <section className="section quality" id="quality" aria-labelledby="quality-title">
      <div className="quality__bg" data-parallax="8"><Img name="droplet" alt="" sizes="100vw" /></div>
      <div className="wrap" style={{ position: "relative" }}>
        <div className="section-head">
          <div>
            <span className="eyebrow" data-fade>Quality &amp; safety</span>
            <div style={{ height: 24 }} />
            <LiquidText id="quality-title" lines={["Evidence,", <em key="e">not adjectives.</em>]} />
          </div>
          <p className="lede" data-fade>We publish what we can prove. Certificates and laboratory reports appear here, downloadable, the moment they are issued and verified — never before.</p>
        </div>

        <div className="docs">
          {QUALITY_DOCS.map((d, i) => (
            <article className="doc" key={d.id} data-fade={i * 0.08}>
              <span className="doc__kind">{d.kind}</span>
              <h3 className="h3" style={{ fontSize: 26 }}>{d.title}</h3>
              <p className="small" style={{ color: "#b7c6d1", margin: 0 }}>{d.note}</p>
              {d.file ? (
                <>
                  <span className="doc__status"><i className="ok" /> Verified</span>
                  <a className="btn btn--light btn--sm" href={d.file} download><Download width={16} height={16} /> Download PDF</a>
                </>
              ) : (
                <>
                  <span className="doc__status"><i /> Pending verification</span>
                  <PrefillLink className="btn btn--glass btn--sm" topic="Quality report request" message={`Please notify me when the "${d.title}" is published.`}>Notify me</PrefillLink>
                </>
              )}
            </article>
          ))}
        </div>

        <div className="standards">
          {[
            ["Batch-level testing", "Each production batch is sampled and tested against the applicable packaged drinking water standard before release."],
            ["Independent laboratories", "Periodic verification by accredited third-party laboratories, with full reports published on this page."],
            ["Traceable to the day", "A batch code on every bottle links it to its filling date, line and test results."],
          ].map(([t, d], i) => (
            <div key={t} data-fade={i * 0.1}>
              <h3 className="h3" style={{ fontSize: 26 }}>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
