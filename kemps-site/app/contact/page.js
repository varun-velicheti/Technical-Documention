import { BRAND } from "@/content/site";
import { waLink } from "@/lib/wa";
import Motion from "@/components/Motion";
import PageHero from "@/components/PageHero";
import LiquidText from "@/components/LiquidText";
import ContactForm from "@/components/ContactForm";
import { WhatsApp, Pin } from "@/components/Icons";

export const metadata = {
  title: "Contact Us",
  description: "Contact Kemp's in Hosapete for product enquiries, bulk and event orders, distributorship and retail partnerships. Call 96865 51876 / 96865 51877 or WhatsApp us.",
  alternates: { canonical: "/contact/" },
};

export default function Contact() {
  return (
    <>
      <Motion />
      <PageHero light eyebrow="Contact us" lines={["Get in", <em key="e">touch.</em>]} lede="Product enquiries, bulk and event orders, distributorship or retail partnerships — we'd love to hear from you." />
      <section className="section contact" style={{ paddingTop: 0 }} aria-label="Contact details and enquiry form">
        <div className="wrap contact__grid">
          <div>
            <ul className="contact__list" style={{ marginTop: 0 }}>
              <li><small>Phone</small>{BRAND.phones.map((p, i) => <span key={p.href}>{i > 0 && " / "}<a className="link-u" href={`tel:${p.href}`}>{p.label}</a></span>)}</li>
              <li><small>Landline</small><a className="link-u" href={`tel:${BRAND.landline.href}`}>{BRAND.landline.label}</a></li>
              <li><small>Email</small><a className="link-u" href={`mailto:${BRAND.email}`}>{BRAND.email}</a></li>
              <li><small>WhatsApp</small><a className="link-u" href={waLink("Hello Kemp's, I have an enquiry.")} target="_blank" rel="noopener noreferrer"><WhatsApp width={16} height={16} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />Chat with us</a></li>
              {BRAND.addresses.map((a) => <li key={a.name}><small>{a.name}</small><span style={{ fontSize: 17 }}>{a.lines.join(", ")}</span></li>)}
              <li><a className="btn btn--ghost btn--sm" href={BRAND.mapUrl} target="_blank" rel="noopener noreferrer"><Pin width={16} height={16} /> Open in Google Maps</a></li>
            </ul>
          </div>
          <div className="panel panel--light" data-fade>
            <h2 className="h3" style={{ marginBottom: 10 }}>Send an enquiry</h2>
            <p className="muted small" style={{ marginTop: 0, marginBottom: 26 }}>Your message opens in WhatsApp or your email app, ready to send.</p>
            <ContactForm />
          </div>
        </div>
      </section>
      <section className="section dark" aria-labelledby="partner-title">
        <div className="wrap">
          <div className="section-head" style={{ marginBottom: 48 }}>
            <div>
              <span className="eyebrow">Partner with us</span>
              <div style={{ height: 24 }} />
              <LiquidText id="partner-title" lines={["Distributors", <em key="e">&amp; retailers.</em>]} />
            </div>
            <p className="lede">We supply shops, supermarkets, hotels, restaurants, offices and events, and we&apos;re always open to new distribution partners across Karnataka.</p>
          </div>
          <div className="values">
            {[["Distributorship", "Represent Kemp's and Eight Plus in your town or district.", "Hello Kemp's, I'm interested in becoming a distributor."], ["Retail partners", "Stock Kemp's water and sodas in your store.", "Hello Kemp's, I'd like to stock your products in my store."], ["Bulk & events", "Weddings, functions, offices and institutions.", "Hello Kemp's, I'd like a quote for a bulk / event order."]].map(([t, d, msg]) => (
              <div key={t}><h3 className="h3">{t}</h3><p>{d}</p><a className="btn btn--glass btn--sm" style={{ marginTop: 18 }} href={waLink(msg)} target="_blank" rel="noopener noreferrer"><WhatsApp width={15} height={15} /> Enquire</a></div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
