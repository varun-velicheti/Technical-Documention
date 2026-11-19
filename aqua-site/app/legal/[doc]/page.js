import { notFound } from "next/navigation";
import { BRAND, DELIVERY } from "@/content/site";

const DOCS = {
  privacy: {
    title: "Privacy policy",
    sections: [
      ["What we collect", "When you place an order, subscribe, or send an enquiry, we collect the details you provide — such as your name, phone number, email, delivery address and PIN code — together with your order history. Our website may also record basic, anonymised usage information to keep it secure and working well."],
      ["How we use it", "We use your information to process and deliver orders, manage subscriptions, respond to enquiries and quotations, and — only if you opt in — send occasional updates. We do not sell your personal data."],
      ["Sharing", "We share information only with service providers who help us operate (for example delivery, payment and communication partners), and only as needed to provide the service you requested, or where required by law."],
      ["Your choices", `You may request access to, correction of, or deletion of your personal data at any time by writing to ${BRAND.email}. You can unsubscribe from updates using the link in any email.`],
      ["Retention & security", "We keep personal data only as long as necessary for the purposes above and apply reasonable technical and organisational safeguards to protect it."],
    ],
  },
  terms: {
    title: "Terms of use",
    sections: [
      ["Using this website", "By using this website you agree to these terms. Content is provided for general information about our products and services and may be updated without notice."],
      ["Orders", "All orders are subject to availability and confirmation. Prices shown are indicative and confirmed at the time of order confirmation. We may decline or cancel an order where necessary, with a full refund of any payment made."],
      ["Subscriptions", "Subscriptions renew at the frequency you choose until paused or cancelled. You can change, pause or cancel before the next dispatch date by contacting us."],
      ["Intellectual property", `All content on this site, including imagery and design, belongs to ${BRAND.name} or its licensors and may not be reused without permission.`],
      ["Contact", `Questions about these terms can be sent to ${BRAND.email}.`],
    ],
  },
  shipping: {
    title: "Shipping & delivery",
    sections: [
      ["Where we deliver", `We currently deliver to selected cities. Enter your PIN code at checkout or in our delivery checker to confirm availability. Current service areas: ${Object.values(DELIVERY.serviceablePrefixes).map((c) => c.city).join(", ")}.`],
      ["Delivery charges", `Delivery is complimentary on orders over ₹${DELIVERY.freeShippingOver}. A delivery fee of ₹${DELIVERY.shippingFee} applies to smaller orders.`],
      ["Timelines", "Estimated delivery windows are shown when you check your PIN code. We will contact you to confirm a delivery slot after your order is placed."],
      ["Business & events", "Bulk, recurring and event deliveries are scheduled individually. Please use the Bulk Orders form to request a quotation."],
    ],
  },
  refunds: {
    title: "Returns & refunds",
    sections: [
      ["Damaged or incorrect items", "If any item arrives damaged, leaking or incorrect, please contact us within 48 hours of delivery with your order reference and a photo. We will replace the item or refund it in full."],
      ["Food-safety returns", "For hygiene and safety reasons, opened or unsealed bottles cannot be returned unless defective."],
      ["Refund timelines", "Approved refunds are issued to the original payment method, typically within 5–7 business days."],
      ["Subscriptions", "You may cancel a subscription at any time before the next dispatch. Dispatched orders follow the policy above."],
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((doc) => ({ doc }));
}
export async function generateMetadata({ params }) {
  const { doc } = await params;
  return DOCS[doc] ? { title: DOCS[doc].title, alternates: { canonical: `/legal/${doc}` } } : {};
}

export default async function Legal({ params }) {
  const { doc } = await params;
  const d = DOCS[doc];
  if (!d) notFound();
  return (
    <div className="legal">
      <div className="wrap">
        <article>
          <span className="eyebrow">Legal</span>
          <h1 className="h2" style={{ marginTop: 18 }}>{d.title}</h1>
          <p className="notice">This policy is a working draft and must be reviewed by your legal counsel before launch.</p>
          {d.sections.map(([h, p]) => (<section key={h}><h2>{h}</h2><p>{p}</p></section>))}
        </article>
      </div>
    </div>
  );
}
