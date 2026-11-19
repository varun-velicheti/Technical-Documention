"use client";
import { useEffect, useState } from "react";
import { BRAND } from "@/content/site";
import { whatsappLink } from "@/lib/pricing";
import EnquiryForm from "../EnquiryForm";
import LiquidText from "../LiquidText";
import { WhatsApp } from "../Icons";

const TOPICS = ["General enquiry", "Order support", "Subscription", "Bulk order", "Distribution", "Quality report request", "Review / feedback", "Press & media"];

export default function Contact() {
  const [initial, setInitial] = useState({});
  useEffect(() => {
    const h = (e) => setInitial({ topic: e.detail.topic, message: e.detail.message || "" });
    window.addEventListener("contact:prefill", h);
    return () => window.removeEventListener("contact:prefill", h);
  }, []);

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap contact__grid">
        <div>
          <span className="eyebrow" data-fade>Contact</span>
          <div style={{ height: 24 }} />
          <LiquidText id="contact-title" lines={["Let's", <em key="e">talk.</em>]} />
          <ul className="contact__list">
            <li><small>Phone</small><a className="link-u" href={`tel:${BRAND.phoneHref}`}>{BRAND.phone}</a></li>
            <li><small>Email</small><a className="link-u" href={`mailto:${BRAND.email}`}>{BRAND.email}</a></li>
            <li><small>WhatsApp</small><a className="link-u" href={whatsappLink(`Hello ${BRAND.name}, I have a question.`, BRAND.whatsapp)} target="_blank" rel="noopener noreferrer"><WhatsApp width={16} height={16} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />Chat with us</a></li>
            <li><small>Office</small><span>{BRAND.address.join(", ")}</span></li>
            <li><small>Hours</small><span>{BRAND.hours}</span></li>
          </ul>
        </div>
        <div className="panel panel--light" data-fade>
          <h3 className="h3" style={{ marginBottom: 28 }}>Send us a message</h3>
          <EnquiryForm
            type="contact"
            id="contact-form"
            submitLabel="Send message"
            initial={initial}
            fields={[
              { name: "name", label: "Name", autoComplete: "name" },
              { name: "email", label: "Email", type: "email", autoComplete: "email" },
              { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", optional: true },
              { name: "topic", label: "Topic", type: "select", options: TOPICS },
              { name: "message", label: "Message", type: "textarea", full: true },
              { name: "consent", label: "I agree to be contacted about my enquiry and accept the privacy policy.", type: "checkbox" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
