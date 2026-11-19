"use client";
import { useState } from "react";
import { BRAND } from "@/content/site";
import { waLink } from "@/lib/wa";
import { WhatsApp, Arrow } from "./Icons";

const TOPICS = ["General enquiry", "Product & pricing", "Bulk / event order", "Become a distributor", "Retail partnership", "Eight Plus", "Feedback"];
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const isPhone = (v) => /^[+]?[0-9\s-]{10,16}$/.test(v.trim());

/**
 * Static-site friendly enquiry form: validates in the browser, then hands the
 * message to WhatsApp or the visitor's email app — no server required.
 */
export default function ContactForm() {
  const [v, setV] = useState({ name: "", phone: "", email: "", city: "", topic: "", message: "" });
  const [err, setErr] = useState({});
  const [sent, setSent] = useState("");
  const set = (k) => (e) => { setV((s) => ({ ...s, [k]: e.target.value })); setErr((x) => ({ ...x, [k]: undefined })); };

  const check = () => {
    const e = {};
    if (v.name.trim().length < 2) e.name = "Please enter your name.";
    if (!isPhone(v.phone)) e.phone = "Enter a valid phone number.";
    if (v.email && !isEmail(v.email)) e.email = "Enter a valid email address.";
    if (!v.topic) e.topic = "Please choose a topic.";
    if (v.message.trim().length < 5) e.message = "Please add a short message.";
    setErr(e);
    if (Object.keys(e).length) document.getElementById(`cf-${Object.keys(e)[0]}`)?.focus();
    return Object.keys(e).length === 0;
  };
  const body = () => `${v.topic}\n\nName: ${v.name}\nPhone: ${v.phone}${v.email ? `\nEmail: ${v.email}` : ""}${v.city ? `\nCity: ${v.city}` : ""}\n\n${v.message}`;

  const viaWhatsApp = (e) => {
    e.preventDefault();
    if (!check()) return;
    window.open(waLink(`Hello Kemp's — ${body()}`), "_blank", "noopener");
    setSent("WhatsApp has opened with your message — just press send.");
  };
  const viaEmail = () => {
    if (!check()) return;
    window.location.href = `mailto:${BRAND.email}?subject=${encodeURIComponent(`Website enquiry: ${v.topic}`)}&body=${encodeURIComponent(body())}`;
    setSent("Your email app has opened with your message — just press send.");
  };

  const F = ({ k, label, type = "text", ac, full, optional }) => (
    <div className={`field${full ? " field--full" : ""}`}>
      <label htmlFor={`cf-${k}`}>{label}{optional && <span style={{ textTransform: "none", letterSpacing: 0 }}> (optional)</span>}</label>
      <input id={`cf-${k}`} className="input" type={type} autoComplete={ac} value={v[k]} onChange={set(k)} aria-invalid={err[k] ? "true" : undefined} aria-describedby={err[k] ? `cf-${k}-e` : undefined} />
      {err[k] && <span className="err" id={`cf-${k}-e`}>{err[k]}</span>}
    </div>
  );

  return (
    <form className="form" onSubmit={viaWhatsApp} noValidate>
      {F({ k: "name", label: "Full name", ac: "name" })}
      {F({ k: "phone", label: "Phone", type: "tel", ac: "tel" })}
      {F({ k: "email", label: "Email", type: "email", ac: "email", optional: true })}
      {F({ k: "city", label: "City / town", ac: "address-level2", optional: true })}
      <div className="field field--full">
        <label htmlFor="cf-topic">Topic</label>
        <select id="cf-topic" className="select" value={v.topic} onChange={set("topic")} aria-invalid={err.topic ? "true" : undefined}>
          <option value="">Select…</option>
          {TOPICS.map((t) => <option key={t}>{t}</option>)}
        </select>
        {err.topic && <span className="err">{err.topic}</span>}
      </div>
      <div className="field field--full">
        <label htmlFor="cf-message">Message</label>
        <textarea id="cf-message" className="textarea" value={v.message} onChange={set("message")} aria-invalid={err.message ? "true" : undefined} placeholder="Products, quantities, delivery location…" />
        {err.message && <span className="err">{err.message}</span>}
      </div>
      <div className="form__foot">
        <p className="form-status" data-state={sent ? "ok" : "idle"} role="status" aria-live="polite" style={{ margin: 0, maxWidth: "40ch" }}>{sent}</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" className="btn btn--ghost" onClick={viaEmail}>Send by email</button>
          <button className="btn"><WhatsApp width={16} height={16} /> Send on WhatsApp <Arrow /></button>
        </div>
      </div>
    </form>
  );
}
