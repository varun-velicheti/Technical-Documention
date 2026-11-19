"use client";
import { useMemo, useState } from "react";
import { RETAILERS } from "@/content/site";
import LiquidText from "../LiquidText";
import { Pin } from "../Icons";

const toRad = (d) => (d * Math.PI) / 180;
function km(a, b) {
  const R = 6371, dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
// Simple equirectangular projection over India's bounding box
const BOUNDS = { minLat: 7, maxLat: 34, minLng: 68, maxLng: 92 };
const proj = (lat, lng) => [((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100, (1 - (lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100];

export default function StoreLocator() {
  const [q, setQ] = useState("");
  const [me, setMe] = useState(null);
  const [geoMsg, setGeoMsg] = useState("");
  const [sel, setSel] = useState(null);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    let rows = RETAILERS.map((r, i) => ({ ...r, i, dist: me ? km(me, r) : null }));
    if (term) rows = rows.filter((r) => [r.name, r.area, r.city, r.pin, r.type].join(" ").toLowerCase().includes(term) || (/^\d{3,6}$/.test(term) && r.pin.startsWith(term.slice(0, 3))));
    if (me) rows.sort((a, b) => a.dist - b.dist);
    return rows;
  }, [q, me]);

  const locate = () => {
    if (!navigator.geolocation) { setGeoMsg("Location isn't available in this browser — search by city or PIN instead."); return; }
    setGeoMsg("Locating…");
    navigator.geolocation.getCurrentPosition(
      (p) => { setMe({ lat: p.coords.latitude, lng: p.coords.longitude }); setGeoMsg("Showing retailers nearest to you."); setQ(""); },
      () => setGeoMsg("We couldn't access your location — search by city, area or PIN code instead."),
      { enableHighAccuracy: false, timeout: 8000 }
    );
  };
  const hasSamples = RETAILERS.some((r) => r.sample);

  return (
    <section className="section" id="stores" aria-labelledby="stores-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow" data-fade>Store locator</span>
            <div style={{ height: 24 }} />
            <LiquidText id="stores-title" lines={["Find us", <em key="e">nearby.</em>]} />
          </div>
          <p className="lede" data-fade>Search by city, neighbourhood or PIN code — or share your location to see the closest retail partners.</p>
        </div>
        <div className="locator">
          <div>
            <div className="locator__bar">
              <label htmlFor="store-q" className="sr-only">Search retailers</label>
              <input id="store-q" className="input" placeholder="City, area or PIN code" value={q} onChange={(e) => setQ(e.target.value)} />
              <button className="btn btn--ghost" onClick={locate} type="button"><Pin width={16} height={16} /> Near me</button>
            </div>
            <p className="small muted" role="status" style={{ minHeight: 20, margin: "0 0 10px" }}>{geoMsg || `${list.length} location${list.length === 1 ? "" : "s"}`}</p>
            {hasSamples && <p className="small" style={{ margin: "0 0 12px", color: "var(--ocean)" }}>Partner network launching soon — listings marked “Sample” illustrate the format.</p>}
            <ul className="stores" data-lenis-prevent>
              {list.length === 0 && <li className="store" style={{ cursor: "default" }}><span className="muted">No partners match yet. Try another city, or <a className="link-u" href="#contact">ask us</a>.</span></li>}
              {list.map((r) => (
                <li key={r.i} className="store" aria-current={sel === r.i} onClick={() => setSel(r.i)}>
                  <div>
                    <b>{r.name}</b>
                    <small>{r.area}, {r.city} {r.pin} · {r.type}{r.dist != null ? ` · ${r.dist < 10 ? r.dist.toFixed(1) : Math.round(r.dist)} km` : ""}</small>
                    <a className="link-u small" href={`https://www.google.com/maps/search/?api=1&query=${r.lat},${r.lng}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>Directions</a>
                  </div>
                  {r.sample && <span className="tag">Sample</span>}
                </li>
              ))}
            </ul>
          </div>
          <div className="map" aria-label="Map of retail partner locations" role="img">
            <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {Array.from({ length: 9 }, (_, i) => <line key={`h${i}`} x1="0" x2="100" y1={i * 12.5} y2={i * 12.5} stroke="rgba(12,44,71,.06)" strokeWidth=".2" />)}
              {Array.from({ length: 9 }, (_, i) => <line key={`v${i}`} y1="0" y2="100" x1={i * 12.5} x2={i * 12.5} stroke="rgba(12,44,71,.06)" strokeWidth=".2" />)}
              {me && (() => { const [x, y] = proj(me.lat, me.lng); return <g><circle cx={x} cy={y} r="3" fill="var(--ice-3)" opacity=".2"><animate attributeName="r" values="1.5;5;1.5" dur="2.4s" repeatCount="indefinite" /></circle><circle cx={x} cy={y} r="1.3" fill="var(--ocean)" /></g>; })()}
              {RETAILERS.map((r, i) => {
                const [x, y] = proj(r.lat, r.lng);
                const on = sel === i || list.some((l) => l.i === i);
                return (
                  <g key={i} style={{ cursor: "pointer", transition: "opacity .4s" }} opacity={on ? 1 : 0.25} onClick={() => setSel(i)}>
                    <circle cx={x} cy={y} r={sel === i ? 2.6 : 1.6} fill={sel === i ? "var(--ocean)" : "var(--ice-3)"} style={{ transition: "r .4s" }} />
                    {sel === i && <text x={x + 3.5} y={y + 1} fontSize="3" fill="var(--ocean)">{r.area}</text>}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
