"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import LiquidText from "../LiquidText";

const STAGES = [
  { t: "Intake & screening", d: "Water enters a closed system and passes fine screens that hold back visible particles before treatment begins." },
  { t: "Sediment filtration", d: "Graded filter media capture suspended solids, progressively finer at each step, to bring the water to optical clarity." },
  { t: "Activated carbon", d: "Carbon beds adsorb organic compounds and off-notes that affect taste and odour." },
  { t: "Membrane purification", d: "Micro-fine membranes separate dissolved impurities at a molecular scale, under continuous pressure and conductivity monitoring." },
  { t: "UV & sealed bottling", d: "Ultraviolet treatment guards against microbial life before the water is filled and sealed in a hygienic, closed environment." },
];

// Deterministic pseudo-random particles (stable between server & client)
function rand(i) { const x = Math.sin(i * 9301 + 49297) * 233280; return x - Math.floor(x); }

export default function Purification() {
  const [stage, setStage] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setStage(Number(e.target.dataset.i)); }),
      { rootMargin: "-45% 0px -45% 0px" }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const particles = useMemo(() => Array.from({ length: 90 }, (_, i) => ({
    x: 120 + rand(i) * 160, y: 130 + rand(i + 100) * 200, r: 1 + rand(i + 200) * (i % 7 === 0 ? 4.5 : 2.2), tier: Math.floor(rand(i + 300) * 5),
  })), []);

  const level = 330 - stage * 6;
  const tint = ["#9bb7c8", "#a9c8da", "#bcd7e6", "#d2e6f0", "#e8f4fa"][stage];

  return (
    <section className="section purify" id="process" aria-labelledby="process-title" style={{ paddingBottom: 0 }}>
      <div className="wrap">
        <span className="eyebrow" data-fade>Purification process</span>
        <div style={{ height: 24 }} />
        <LiquidText id="process-title" lines={["Five quiet steps", <em key="e">to clarity.</em>]} />
        <p className="purify__note" data-fade style={{ marginTop: 24 }}>Stages shown describe our process framework. Final plant specifications will be published alongside verified laboratory reports.</p>
        <div className="purify__wrap">
          <div className="purify__visual" aria-hidden="true">
            <svg className="vessel" viewBox="0 0 400 400">
              <defs>
                <clipPath id="vesselClip"><rect x="110" y="70" width="180" height="280" rx="90" /></clipPath>
                <linearGradient id="wGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor={tint} stopOpacity=".55" style={{ transition: "stop-color 1s" }} />
                  <stop offset="1" stopColor="#0c2c47" stopOpacity={0.5 - stage * 0.08} />
                </linearGradient>
                <radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#fff" stopOpacity=".9" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
              </defs>
              <circle cx="200" cy="210" r="170" fill="none" stroke="var(--line)" />
              <circle cx="200" cy="210" r="170" fill="none" stroke="var(--ice-3)" strokeWidth="1.5" strokeDasharray={2 * Math.PI * 170} strokeDashoffset={2 * Math.PI * 170 * (1 - (stage + 1) / STAGES.length)} transform="rotate(-90 200 210)" style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)" }} />
              {STAGES.map((_, i) => {
                const a = (-90 + (360 / STAGES.length) * i) * (Math.PI / 180);
                return <circle key={i} cx={200 + 170 * Math.cos(a)} cy={210 + 170 * Math.sin(a)} r={i <= stage ? 5 : 3.5} fill={i <= stage ? "var(--ice-3)" : "var(--glacier)"} stroke="var(--ice-3)" style={{ transition: "all .6s" }} />;
              })}
              <g clipPath="url(#vesselClip)">
                <rect x="110" y="70" width="180" height="280" fill="#f8fbfd" />
                <path d={`M110 ${400 - level} Q 155 ${392 - level} 200 ${400 - level} T 290 ${400 - level} V 360 H 110 Z`} fill="url(#wGrad)">
                  <animate attributeName="d" dur="5s" repeatCount="indefinite"
                    values={`M110 ${400 - level} Q 155 ${392 - level} 200 ${400 - level} T 290 ${400 - level} V 360 H 110 Z;M110 ${400 - level} Q 155 ${408 - level} 200 ${400 - level} T 290 ${400 - level} V 360 H 110 Z;M110 ${400 - level} Q 155 ${392 - level} 200 ${400 - level} T 290 ${400 - level} V 360 H 110 Z`} />
                </path>
                {particles.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#3b4d5c" opacity={p.tier >= stage + 1 || stage === 0 ? 0.35 - p.tier * 0.04 : 0}
                    style={{ transition: `opacity .9s ${(i % 10) * 0.04}s` }}>
                    <animate attributeName="cy" dur={`${6 + (i % 5)}s`} repeatCount="indefinite" values={`${p.y};${p.y - 10};${p.y}`} />
                  </circle>
                ))}
                <ellipse cx="160" cy="150" rx="18" ry="70" fill="url(#glow)" opacity=".5" />
              </g>
              <rect x="110" y="70" width="180" height="280" rx="90" fill="none" stroke="var(--ice-3)" strokeOpacity=".5" />
              <text x="200" y="392" textAnchor="middle" fontSize="11" letterSpacing="3" fill="var(--ink-mute)">{`STAGE ${stage + 1} / ${STAGES.length}`}</text>
            </svg>
          </div>
          <ol className="purify__steps" style={{ listStyle: "none", margin: 0, paddingLeft: 0 }}>
            {STAGES.map((s, i) => (
              <li key={s.t} className={`pstep${i === stage ? " is-active" : ""}`} data-i={i} ref={(el) => (refs.current[i] = el)}>
                <span className="pstep__n">0{i + 1}</span>
                <h3 className="h3">{s.t}</h3>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
