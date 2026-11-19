"use client";
import { useState } from "react";
import { PACKS, SUBSCRIPTION, BRAND } from "@/content/site";
import { getProduct, packPrice, inr, whatsappLink } from "@/lib/pricing";
import { useCart } from "./Cart";
import { Arrow, WhatsApp } from "./Icons";

export default function ProductConfigurator({ slug }) {
  const p = getProduct(slug);
  const { add, setOpen } = useCart();
  const [pack, setPack] = useState("six");
  const [plan, setPlan] = useState("once");
  const [frequency, setFrequency] = useState("fortnightly");
  const [qty, setQty] = useState(1);
  const pk = PACKS.find((x) => x.id === pack);
  const unit = packPrice(p, pk, plan);
  const full = packPrice(p, pk, "once");
  const freqLabel = SUBSCRIPTION.frequencies.find((f) => f.id === frequency).label;
  const waText = `Hello ${BRAND.name}, I'd like to order ${qty} × ${p.name} ${p.volume} (${pk.label})${plan === "subscribe" ? `, as a subscription ${freqLabel.toLowerCase()}` : ""}. Estimated total ${inr(unit * qty)}.`;

  return (
    <div>
      <div className="opt-group" style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
        <span className="price-big" aria-live="polite">{inr(unit * qty)}</span>
        {plan === "subscribe" && <s className="muted">{inr(full * qty)}</s>}
        <span className="price-note">Inclusive of taxes · indicative pricing</span>
      </div>

      <div className="opt-group">
        <span className="label" id="pack-label">Pack</span>
        <div className="chips" role="radiogroup" aria-labelledby="pack-label">
          {PACKS.map((x) => (
            <button key={x.id} className="chip" role="radio" aria-checked={pack === x.id} onClick={() => setPack(x.id)}>
              {x.label}{x.discount ? ` · save ${Math.round(x.discount * 100)}%` : ""}
            </button>
          ))}
        </div>
      </div>

      <div className="opt-group">
        <span className="label" id="plan-label">Purchase</span>
        <div className="radio-cards" role="radiogroup" aria-labelledby="plan-label">
          <button className="radio-card" role="radio" aria-checked={plan === "once"} onClick={() => setPlan("once")}>One-time order<small>Delivered once</small></button>
          <button className="radio-card" role="radio" aria-checked={plan === "subscribe"} onClick={() => setPlan("subscribe")}>Subscribe &amp; save {Math.round(SUBSCRIPTION.discount * 100)}%<small>Pause or cancel anytime</small></button>
        </div>
        {plan === "subscribe" && (
          <div className="chips" role="radiogroup" aria-label="Delivery frequency" style={{ marginTop: 12 }}>
            {SUBSCRIPTION.frequencies.map((f) => (
              <button key={f.id} className="chip" role="radio" aria-checked={frequency === f.id} onClick={() => setFrequency(f.id)}>{f.label}</button>
            ))}
          </div>
        )}
      </div>

      <div className="opt-group">
        <span className="label">Quantity</span>
        <div className="qty" style={{ marginTop: 0 }}>
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
          <span aria-live="polite" style={{ minWidth: 20, textAlign: "center" }}>{qty}</span>
          <button onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Increase quantity">+</button>
        </div>
      </div>

      <div className="add-row">
        <button className="btn" onClick={() => { add({ slug, pack, plan, frequency, qty }); setOpen(true); }}>{plan === "subscribe" ? "Start subscription" : "Add to bag"} <Arrow /></button>
        <a className="btn btn--ghost" href={whatsappLink(waText, BRAND.whatsapp)} target="_blank" rel="noopener noreferrer"><WhatsApp width={18} height={18} /> Order on WhatsApp</a>
      </div>
    </div>
  );
}
