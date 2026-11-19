"use client";
import { useState } from "react";
import EnquiryForm from "../EnquiryForm";
import LiquidText from "../LiquidText";

const TYPES = [
  { id: "Distributor", blurb: "Represent the brand across a city or region, supplying retail, HoReCa and corporate accounts." },
  { id: "Retail partner", blurb: "Stock the collection in your gourmet store, café, pharmacy, boutique or supermarket." },
];

export default function Distribution() {
  const [type, setType] = useState(TYPES[0].id);
  return (
    <section className="section" id="distribution" aria-labelledby="dist-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow" data-fade>Distribution</span>
            <div style={{ height: 24 }} />
            <LiquidText id="dist-title" lines={["Grow with", <em key="e">us.</em>]} />
          </div>
          <p className="lede" data-fade>We are building a select network of partners who share our standards. Apply below and our team will reach out to discuss territory, margins and onboarding.</p>
        </div>
        <div className="panel panel--light" data-fade>
          <div className="tabs" role="tablist" aria-label="Partner type">
            {TYPES.map((t) => (
              <button key={t.id} type="button" role="tab" className="tab" aria-selected={type === t.id} onClick={() => setType(t.id)}>{t.id === "Distributor" ? "Become a distributor" : "Become a retail partner"}</button>
            ))}
          </div>
          <p className="muted" style={{ marginTop: -12, marginBottom: 28 }}>{TYPES.find((t) => t.id === type).blurb}</p>
          <EnquiryForm
            type="distributor"
            submitLabel="Submit application"
            success="Application received — our partnerships team will contact you within three business days."
            extra={{ partnerType: type }}
            fields={[
              { name: "business", label: "Business name", autoComplete: "organization" },
              { name: "name", label: "Contact person", autoComplete: "name" },
              { name: "email", label: "Email", type: "email", autoComplete: "email" },
              { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
              { name: "city", label: "City", autoComplete: "address-level2" },
              { name: "state", label: "State", autoComplete: "address-level1" },
              { name: "gst", label: "GSTIN", optional: true },
              { name: "experience", label: type === "Distributor" ? "Years in distribution" : "Store type", type: "select", optional: true, options: type === "Distributor" ? ["New to distribution", "1–3 years", "3–10 years", "10+ years"] : ["Gourmet / specialty", "Supermarket", "Café / restaurant", "Hotel boutique", "Pharmacy", "Other"] },
              { name: "message", label: "Tell us about your business", type: "textarea", full: true, optional: true },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
