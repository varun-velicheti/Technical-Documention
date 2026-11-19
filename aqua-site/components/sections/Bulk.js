import EnquiryForm from "../EnquiryForm";
import LiquidText from "../LiquidText";
import Img from "../Img";
import { PRODUCTS } from "@/content/site";

export default function Bulk() {
  return (
    <section className="section bulk dark" id="bulk" aria-labelledby="bulk-title" style={{ background: "var(--ocean)" }}>
      <div className="wrap bulk__grid">
        <div className="bulk__aside">
          <span className="eyebrow" data-fade>Bulk orders</span>
          <div style={{ height: 24 }} />
          <LiquidText id="bulk-title" lines={["Poured at", <em key="e">every scale.</em>]} />
          <p className="lede" data-fade style={{ marginTop: 24 }}>Scheduled supply for workplaces and hospitality, and considered service for celebrations. Tell us what you need — we'll respond with a tailored quotation.</p>
          <div className="audience" data-fade>
            {["Offices", "Hotels", "Restaurants", "Weddings", "Events", "Airlines & lounges"].map((a) => <span key={a}>{a}</span>)}
          </div>
          <div className="reveal-img" style={{ borderRadius: "var(--radius)", overflow: "hidden" }}>
            <Img name="splash" alt="The bottle surrounded by a crystal-clear splash of water" sizes="(max-width: 900px) 100vw, 40vw" style={{ aspectRatio: "4 / 3", objectFit: "cover", objectPosition: "70% 50%", width: "100%" }} />
          </div>
        </div>
        <div className="panel" data-fade>
          <h3 className="h3" style={{ marginBottom: 28 }}>Request a quotation</h3>
          <EnquiryForm
            type="bulk"
            submitLabel="Request quotation"
            success="Thank you — our partnerships team will send your quotation within one business day."
            fields={[
              { name: "segment", label: "Enquiry for", type: "select", options: ["Office", "Hotel", "Restaurant", "Wedding", "Event", "Other"] },
              { name: "organisation", label: "Organisation / occasion", autoComplete: "organization" },
              { name: "name", label: "Your name", autoComplete: "name" },
              { name: "email", label: "Email", type: "email", autoComplete: "email" },
              { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
              { name: "city", label: "City", autoComplete: "address-level2" },
              { name: "pin", label: "PIN code", inputMode: "numeric", maxLength: 6, optional: true, autoComplete: "postal-code" },
              { name: "format", label: "Preferred format", type: "select", options: [...PRODUCTS.map((p) => `${p.name} ${p.volume}`), "Mixed / not sure"], optional: true },
              { name: "volume", label: "Estimated quantity", type: "select", options: ["Under 100 bottles", "100–500 bottles", "500–2,000 bottles", "2,000+ bottles", "Recurring monthly supply"] },
              { name: "date", label: "Event / start date", type: "date", optional: true },
              { name: "message", label: "Anything else we should know?", type: "textarea", full: true, optional: true },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
