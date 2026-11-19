"use client";
import { useEffect, useRef, useState } from "react";
import Img from "../Img";
import LiquidText from "../LiquidText";

const STEPS = [
  { id: "source", n: "01", title: "Source", img: "lake", alt: "A still glacial lake", body: "Every journey begins with the source. Ours will be named and documented here — location, protection and extraction method — once independently verified.", meta: ["Source details: to be published", "Protected collection", "Documented extraction"] },
  { id: "purify", n: "02", title: "Purification", img: "droplet", alt: "A single water droplet falling into a still surface", body: "A minimal, controlled treatment sequence designed to protect clarity and safety without adding anything for show. See each stage in detail below.", meta: ["Multi-stage process", "Continuous monitoring", "Batch-level testing"] },
  { id: "bottle", n: "03", title: "Bottling", img: "facility", alt: "A clean modern bottling line with glass bottles", body: "Filled and sealed in a hygienic, closed environment. Each bottle carries a batch code so it can be traced to the day and line it was filled on.", meta: ["Closed filling", "Tamper-evident seal", "Batch traceability"] },
  { id: "deliver", n: "04", title: "Delivery", img: "case", alt: "A case of bottles ready for delivery", body: "Packed into protective cases and delivered on your schedule — to homes, offices, hotels and restaurants, or to a retail partner near you.", meta: ["Scheduled delivery", "Subscription options", "Business supply"] },
];

export default function Journey() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const root = useRef(null);

  // Auto-advance while visible, until the user interacts
  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.4 });
    io.observe(root.current);
    const id = setInterval(() => { if (visible) setActive((a) => (a + 1) % STEPS.length); }, 5200);
    return () => { clearInterval(id); io.disconnect(); };
  }, [auto]);

  const choose = (i) => { setAuto(false); setActive(i); };
  const onKey = (e) => {
    if (e.key === "ArrowRight") { choose((active + 1) % STEPS.length); e.preventDefault(); }
    if (e.key === "ArrowLeft") { choose((active + STEPS.length - 1) % STEPS.length); e.preventDefault(); }
  };
  const pct = (active / (STEPS.length - 1)) * 100;
  const s = STEPS[active];

  return (
    <section className="section dark" id="journey" aria-labelledby="journey-title" ref={root}>
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow" data-fade>Journey of water</span>
            <div style={{ height: 24 }} />
            <LiquidText id="journey-title" lines={["From source", <em key="e">to sip.</em>]} />
          </div>
          <p className="lede" data-fade>Four stages, one continuous line of care. Select a stage to follow the water.</p>
        </div>

        <div className="journey__rail" role="tablist" aria-label="Journey stages" onKeyDown={onKey}>
          <svg className="flow" viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true">
            <line x1="1" y1="2" x2="76" y2="2" stroke="rgba(255,255,255,.15)" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
            <line x1="1" y1="2" x2={1 + (75 * pct) / 100} y2="2" stroke="var(--ice-2)" strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ transition: "all 1s cubic-bezier(.22,1,.36,1)" }} />
          </svg>
          {STEPS.map((st, i) => (
            <button key={st.id} role="tab" id={`jt-${st.id}`} aria-controls="journey-panel" aria-selected={i === active} tabIndex={i === active ? 0 : -1} className="jstep" onClick={() => choose(i)}>
              <small>{st.n}</small>
              <span>{st.title}</span>
            </button>
          ))}
        </div>

        <div className="journey__panel" id="journey-panel" role="tabpanel" aria-labelledby={`jt-${s.id}`}>
          <div className="journey__img">
            {STEPS.map((st, i) => (
              <Img key={st.id} name={st.img} alt={i === active ? st.alt : ""} sizes="(max-width: 900px) 100vw, 55vw" data-active={i === active ? "true" : "false"} />
            ))}
          </div>
          <div className="journey__text" aria-live="polite">
            <span className="eyebrow">{s.n} — {s.title}</span>
            <p className="h3" style={{ margin: "18px 0", fontWeight: 300 }}>{s.body}</p>
            <ul className="spec-list" style={{ borderTop: "1px solid rgba(255,255,255,.12)" }}>
              {s.meta.map((m) => (<li key={m} style={{ borderColor: "rgba(255,255,255,.12)", padding: "14px 0" }}><span style={{ color: "var(--silver)" }}>{m}</span></li>))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
