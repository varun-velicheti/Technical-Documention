"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { computeTotals, lineKey, inr, checkPin, whatsappLink } from "@/lib/pricing";
import { BRAND, SUBSCRIPTION, DELIVERY } from "@/content/site";
import { toast } from "./Toast";
import { Close, WhatsApp, Arrow, Check } from "./Icons";
import Img from "./Img";

const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);
const STORAGE = "brand-cart-v1";

export function CartProvider({ children }) {
  const [lines, setLines] = useState([]);
  const [open, setOpen] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE); if (raw) setLines(JSON.parse(raw)); } catch {}
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    try { localStorage.setItem(STORAGE, JSON.stringify(lines)); } catch {}
  }, [lines]);

  const add = useCallback((item) => {
    const key = lineKey(item);
    setLines((ls) => {
      const found = ls.find((l) => lineKey(l) === key);
      if (found) return ls.map((l) => (lineKey(l) === key ? { ...l, qty: Math.min(99, l.qty + (item.qty || 1)) } : l));
      return [...ls, { ...item, qty: item.qty || 1 }];
    });
    toast("Added to your bag");
  }, []);
  const setQty = useCallback((key, qty) => setLines((ls) => (qty <= 0 ? ls.filter((l) => lineKey(l) !== key) : ls.map((l) => (lineKey(l) === key ? { ...l, qty: Math.min(99, qty) } : l)))), []);
  const clear = useCallback(() => setLines([]), []);
  const totals = useMemo(() => computeTotals(lines), [lines]);
  const count = lines.reduce((n, l) => n + l.qty, 0);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(open ? "scroll:lock" : "scroll:unlock"));
    const esc = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const value = { lines, add, setQty, clear, totals, count, open, setOpen };
  return (
    <CartCtx.Provider value={value}>
      {children}
      <CartDrawer />
    </CartCtx.Provider>
  );
}

function freqLabel(id) { return SUBSCRIPTION.frequencies.find((f) => f.id === id)?.label || ""; }

export function orderSummaryText(totals) {
  const items = totals.lines.map((l) => `• ${l.qty} × ${l.product.name} ${l.product.volume} — ${l.packInfo.label}${l.plan === "subscribe" ? ` (subscription, ${freqLabel(l.frequency).toLowerCase()})` : ""}`).join("\n");
  return `Hello ${BRAND.name}, I'd like to order:\n${items}\nEstimated total: ${inr(totals.total)}`;
}

function CartDrawer() {
  const { lines, setQty, totals, open, setOpen, clear } = useCart();
  const [step, setStep] = useState("bag");
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", pin: "", notes: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const panel = useRef(null);
  const pinState = form.pin.length === 6 ? checkPin(form.pin) : null;

  useEffect(() => { if (open) { setTimeout(() => panel.current?.focus(), 50); } else { setTimeout(() => { if (step === "done") setStep("bag"); }, 800); } }, [open]); // eslint-disable-line

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErrors({});
    try {
      const res = await fetch("/api/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customer: form, lines, website: e.target.website?.value }) });
      const json = await res.json();
      if (!json.ok) { setErrors(json.errors || { _form: json.error || "Something went wrong." }); return; }
      setDone({ ref: json.ref, total: json.total, text: orderSummaryText(totals) });
      clear(); setStep("done");
    } catch { setErrors({ _form: "Network error — please try again or order via WhatsApp." }); }
    finally { setBusy(false); }
  };
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <div className={`scrim${open ? " is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside className={`drawer${open ? " is-open" : ""}`} aria-label="Shopping bag" aria-hidden={!open} ref={panel} tabIndex={-1} role="dialog" aria-modal="true">
        <div className="drawer__head">
          <span className="h3" style={{ fontSize: 26 }}>{step === "details" ? "Delivery details" : step === "done" ? "Thank you" : "Your bag"}</span>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close bag"><Close /></button>
        </div>

        {step === "bag" && (
          <>
            <div className="drawer__body" data-lenis-prevent>
              {totals.lines.length === 0 ? (
                <div className="empty">
                  <p className="h3" style={{ fontSize: 28 }}>Your bag is empty.</p>
                  <p>Explore the collection to begin.</p>
                  <a href="/#collection" className="btn btn--ghost btn--sm" onClick={() => setOpen(false)}>View collection</a>
                </div>
              ) : totals.lines.map((l) => {
                const key = lineKey(l);
                return (
                  <div className="line" key={key}>
                    <Img name={l.product.image} alt="" sizes="72px" />
                    <div>
                      <b>{l.product.name} · {l.product.volume}</b>
                      <small>{l.packInfo.label}{l.plan === "subscribe" ? ` · Subscription, ${freqLabel(l.frequency).toLowerCase()}` : ""}</small>
                      <div className="qty" aria-label="Quantity">
                        <button onClick={() => setQty(key, l.qty - 1)} aria-label={`Decrease quantity of ${l.product.name}`}>−</button>
                        <span aria-live="polite">{l.qty}</span>
                        <button onClick={() => setQty(key, l.qty + 1)} aria-label={`Increase quantity of ${l.product.name}`}>+</button>
                      </div>
                    </div>
                    <span>{inr(l.total)}</span>
                  </div>
                );
              })}
            </div>
            {totals.lines.length > 0 && (
              <div className="drawer__foot">
                <div className="row"><span className="muted">Subtotal</span><span>{inr(totals.subtotal)}</span></div>
                <div className="row"><span className="muted">Delivery</span><span>{totals.shipping ? inr(totals.shipping) : "Complimentary"}</span></div>
                {totals.shipping > 0 && <p className="small muted" style={{ margin: 0 }}>Complimentary delivery on orders over {inr(DELIVERY.freeShippingOver)}.</p>}
                <div className="row row--total"><span>Total</span><span>{inr(totals.total)}</span></div>
                <button className="btn btn--block" onClick={() => setStep("details")}>Checkout <Arrow /></button>
                <a className="btn btn--ghost btn--block" href={whatsappLink(orderSummaryText(totals), BRAND.whatsapp)} target="_blank" rel="noopener noreferrer"><WhatsApp width={18} height={18} /> Order on WhatsApp</a>
              </div>
            )}
          </>
        )}

        {step === "details" && (
          <form className="drawer__body" onSubmit={submit} noValidate data-lenis-prevent>
            <div className="form" style={{ gridTemplateColumns: "1fr", marginTop: 18 }}>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
              {[["name", "Full name", "text", "name"], ["phone", "Phone", "tel", "tel"], ["email", "Email", "email", "email"]].map(([k, label, type, ac]) => (
                <div className="field" key={k}>
                  <label htmlFor={`co-${k}`}>{label}</label>
                  <input id={`co-${k}`} className="input" type={type} autoComplete={ac} value={form[k]} onChange={set(k)} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `co-${k}-e` : undefined} required />
                  {errors[k] && <span className="err" id={`co-${k}-e`}>{errors[k]}</span>}
                </div>
              ))}
              <div className="field">
                <label htmlFor="co-address">Delivery address</label>
                <textarea id="co-address" className="textarea" autoComplete="street-address" value={form.address} onChange={set("address")} aria-invalid={!!errors.address} required style={{ height: 96 }} />
                {errors.address && <span className="err">{errors.address}</span>}
              </div>
              <div className="field">
                <label htmlFor="co-pin">PIN code</label>
                <input id="co-pin" className="input" inputMode="numeric" maxLength={6} autoComplete="postal-code" value={form.pin} onChange={(e) => setForm((f) => ({ ...f, pin: e.target.value.replace(/\D/g, "") }))} aria-invalid={!!errors.pin} required />
                {(errors.pin || pinState) && <span className="pin-msg" data-ok={pinState?.ok ? "true" : "false"} role="status">{errors.pin || pinState.message}</span>}
              </div>
              <div className="field">
                <label htmlFor="co-notes">Delivery notes (optional)</label>
                <input id="co-notes" className="input" value={form.notes} onChange={set("notes")} />
              </div>
              <div className="panel panel--light" style={{ padding: 20, borderRadius: 18 }}>
                <div className="row row--total"><span>Total</span><span>{inr(totals.total)}</span></div>
                <p className="small muted" style={{ margin: "8px 0 0" }}>We'll confirm your order by phone and share a secure payment link. Subscriptions can be paused or cancelled anytime.</p>
              </div>
              {errors._form && <p className="form-status" data-state="error" role="alert">{errors._form}</p>}
              <button className="btn btn--block" disabled={busy}>{busy ? "Placing order…" : "Place order"} <Arrow /></button>
              <button type="button" className="btn btn--ghost btn--block" onClick={() => setStep("bag")}>Back to bag</button>
            </div>
          </form>
        )}

        {step === "done" && done && (
          <div className="drawer__body" style={{ display: "grid", alignContent: "center", textAlign: "center", gap: 18 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--ice)", display: "grid", placeItems: "center", margin: "0 auto", color: "var(--ocean)" }}><Check width={28} height={28} /></div>
            <p className="h3">Your order is in.</p>
            <p className="muted">Reference <b style={{ color: "var(--ink)" }}>{done.ref}</b><br />We'll call to confirm delivery and payment shortly.</p>
            <a className="btn btn--ghost" href={whatsappLink(`${done.text}\nOrder reference: ${done.ref}`, BRAND.whatsapp)} target="_blank" rel="noopener noreferrer"><WhatsApp width={18} height={18} /> Share on WhatsApp</a>
            <button className="btn" onClick={() => setOpen(false)}>Continue</button>
          </div>
        )}
      </aside>
    </>
  );
}
