"use client";
import { useState } from "react";
import { FAQS } from "@/content/site";
import LiquidText from "../LiquidText";
import DeliveryCheck from "../DeliveryCheck";

export default function Faq() {
  const [open, setOpen] = useState("0-0");
  return (
    <section className="section" id="faq" aria-labelledby="faq-title" style={{ background: "var(--glacier-2)" }}>
      <div className="wrap faq">
        <div className="faq__aside">
          <span className="eyebrow" data-fade>FAQs</span>
          <div style={{ height: 24 }} />
          <LiquidText id="faq-title" lines={["Questions,", <em key="e">answered clearly.</em>]} />
          <p className="lede" data-fade style={{ marginTop: 24 }}>Check whether we deliver to you:</p>
          <DeliveryCheck />
        </div>
        <div>
          {FAQS.map((g, gi) => (
            <div className="faq__group" key={g.group}>
              <h3>{g.group}</h3>
              {g.items.map((it, ii) => {
                const id = `${gi}-${ii}`;
                const isOpen = open === id;
                return (
                  <div className="qa" key={id} data-open={isOpen}>
                    <button aria-expanded={isOpen} aria-controls={`qa-${id}`} id={`qb-${id}`} onClick={() => setOpen(isOpen ? null : id)}>
                      {it.q}<span className="qa__icon" aria-hidden="true" />
                    </button>
                    <div className="qa__a" id={`qa-${id}`} role="region" aria-labelledby={`qb-${id}`}>
                      <div><p>{it.a}</p></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
