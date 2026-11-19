"use client";
/** Link to the contact form that pre-selects a topic and message. */
export default function PrefillLink({ topic, message = "", className, children }) {
  return (
    <a href="#contact" className={className} onClick={() => window.dispatchEvent(new CustomEvent("contact:prefill", { detail: { topic, message } }))}>
      {children}
    </a>
  );
}
