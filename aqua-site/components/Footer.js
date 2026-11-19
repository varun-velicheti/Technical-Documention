"use client";
import { useState } from "react";
import Link from "next/link";
import { BRAND, NAV } from "@/content/site";
import { whatsappLink } from "@/lib/pricing";
import { WhatsApp } from "./Icons";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");
  const join = async (e) => {
    e.preventDefault();
    setState("busy");
    const r = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "newsletter", email }) }).then((x) => x.json()).catch(() => ({ ok: false }));
    setState(r.ok ? "ok" : "error");
    if (r.ok) setEmail("");
  };
  return (
    <>
      <footer className="footer">
        <div className="wrap">
          <div className="footer__top">
            <div>
              <Link href="/" className="brand-mark" style={{ color: "#fff" }}>{BRAND.name}</Link>
              <p style={{ maxWidth: "36ch", marginTop: 18 }}>Purity in every drop. Quiet news, launches and verified quality updates — no more than once a month.</p>
              <form className="footer__news" onSubmit={join}>
                <label htmlFor="news-email" className="sr-only">Email address</label>
                <input id="news-email" className="input" type="email" placeholder="Your email" required value={email} onChange={(e) => { setEmail(e.target.value); setState("idle"); }} style={{ background: "rgba(255,255,255,.06)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.16)", color: "#fff" }} autoComplete="email" />
                <button className="btn btn--light" disabled={state === "busy"}>Subscribe</button>
              </form>
              <p className="small" role="status" style={{ minHeight: 20, color: state === "error" ? "#f2a7b3" : "#8fdcc3" }}>{state === "ok" ? "You're subscribed. Welcome." : state === "error" ? "Please enter a valid email." : ""}</p>
            </div>
            <div>
              <h4>Explore</h4>
              <ul>{NAV.slice(0, 5).map((n) => <li key={n.href}><a className="link-u" href={n.href}>{n.label}</a></li>)}<li><a className="link-u" href="/#faq">FAQs</a></li></ul>
            </div>
            <div>
              <h4>Business</h4>
              <ul>
                <li><a className="link-u" href="/#bulk">Bulk orders</a></li>
                <li><a className="link-u" href="/#distribution">Become a distributor</a></li>
                <li><a className="link-u" href="/#stores">Store locator</a></li>
                <li><a className="link-u" href="/#quality">Quality reports</a></li>
              </ul>
            </div>
            <div>
              <h4>Contact</h4>
              <ul>
                <li><a className="link-u" href={`tel:${BRAND.phoneHref}`}>{BRAND.phone}</a></li>
                <li><a className="link-u" href={`mailto:${BRAND.email}`}>{BRAND.email}</a></li>
                <li><a className="link-u" href={whatsappLink(`Hello ${BRAND.name}`, BRAND.whatsapp)} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
                {BRAND.social.map((s) => <li key={s.label}><a className="link-u" href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}
              </ul>
            </div>
          </div>
          <div className="footer__word" aria-hidden="true">{BRAND.name}</div>
          <div className="footer__bottom">
            <span>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</span>
            <nav aria-label="Legal">
              <Link className="link-u" href="/legal/privacy">Privacy</Link>
              <Link className="link-u" href="/legal/terms">Terms</Link>
              <Link className="link-u" href="/legal/shipping">Shipping &amp; delivery</Link>
              <Link className="link-u" href="/legal/refunds">Returns &amp; refunds</Link>
            </nav>
          </div>
        </div>
      </footer>
      <a className="wa-float" href={whatsappLink(`Hello ${BRAND.name}, I'd like to place an order.`, BRAND.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label="Order on WhatsApp"><WhatsApp /></a>
    </>
  );
}
