"use client";
import { useState } from "react";
import { checkPin } from "@/lib/pricing";
import { Pin } from "./Icons";

export default function DeliveryCheck({ compact = false }) {
  const [pin, setPin] = useState("");
  const [res, setRes] = useState(null);
  const [notify, setNotify] = useState({ email: "", state: "idle" });
  const check = (e) => { e.preventDefault(); setRes(checkPin(pin)); };

  const sendNotify = async (e) => {
    e.preventDefault();
    setNotify((n) => ({ ...n, state: "busy" }));
    const r = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "notify", email: notify.email, pin }) }).then((x) => x.json()).catch(() => ({ ok: false }));
    setNotify((n) => ({ ...n, state: r.ok ? "ok" : "error" }));
  };

  return (
    <div>
      <form className="pin-check" onSubmit={check} role="search" aria-label="Check delivery availability">
        <label htmlFor={`pin-${compact ? "c" : "f"}`} className="sr-only">PIN code</label>
        <input id={`pin-${compact ? "c" : "f"}`} className="input" inputMode="numeric" maxLength={6} placeholder="Enter PIN code" value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setRes(null); }} autoComplete="postal-code" />
        <button className="btn btn--sm btn--ghost" style={{ height: 46 }}><Pin width={16} height={16} /> Check</button>
      </form>
      {res && <p className="pin-msg" data-ok={String(res.ok)} role="status">{res.message}</p>}
      {res && res.valid && !res.ok && (
        notify.state === "ok" ? <p className="pin-msg" data-ok="true">Thank you — we'll email you when delivery opens in your area.</p> : (
          <form className="pin-check" onSubmit={sendNotify} style={{ marginTop: 8 }}>
            <label htmlFor="notify-email" className="sr-only">Email for delivery updates</label>
            <input id="notify-email" type="email" className="input" placeholder="Email me when you arrive" value={notify.email} onChange={(e) => setNotify({ email: e.target.value, state: "idle" })} required autoComplete="email" />
            <button className="btn btn--sm" style={{ height: 46 }} disabled={notify.state === "busy"}>Notify me</button>
          </form>
        )
      )}
      {notify.state === "error" && <p className="pin-msg" data-ok="false">Please enter a valid email address.</p>}
    </div>
  );
}
