/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH FOR BRAND FACTS
 *  Everything marked `PLACEHOLDER` must be replaced with verified information
 *  before launch. Nothing in this file is a claim about a real water source,
 *  certification, mineral composition or health benefit.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const BRAND = {
  name: "NIVALIS", // PLACEHOLDER working wordmark — replace with the final brand name
  tagline: "Purity in Every Drop.",
  statement:
    "Still water, bottled with restraint. Nothing added for show, nothing left to chance — only clarity, carefully kept from source to sip.",
  siteUrl: "https://www.example.com", // PLACEHOLDER production domain
  phone: "+91 00000 00000", // PLACEHOLDER
  phoneHref: "+910000000000", // PLACEHOLDER
  whatsapp: "", // PLACEHOLDER digits only, e.g. "919800000000". Empty → WhatsApp asks the user to pick a chat.
  email: "hello@example.com", // PLACEHOLDER
  salesEmail: "partners@example.com", // PLACEHOLDER
  address: ["Registered office address", "City, State — PIN"], // PLACEHOLDER
  hours: "Mon – Sat, 9:00 – 19:00 IST", // PLACEHOLDER
  social: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
    { label: "YouTube", href: "https://youtube.com/" },
    { label: "X", href: "https://x.com/" },
  ],
};

/** Delivery availability — first three digits of Indian PIN codes we serve. PLACEHOLDER list. */
export const DELIVERY = {
  serviceablePrefixes: {
    "560": { city: "Bengaluru", eta: "Next-day delivery" },
    "400": { city: "Mumbai", eta: "Next-day delivery" },
    "110": { city: "New Delhi", eta: "1–2 day delivery" },
    "500": { city: "Hyderabad", eta: "1–2 day delivery" },
    "600": { city: "Chennai", eta: "2–3 day delivery" },
  },
  freeShippingOver: 1500, // INR — PLACEHOLDER
  shippingFee: 99, // INR — PLACEHOLDER
};

/** Pack formats. Multipliers apply to the single-bottle price. PLACEHOLDER pricing. */
export const PACKS = [
  { id: "single", label: "Single", units: 1, discount: 0 },
  { id: "six", label: "Pack of 6", units: 6, discount: 0.05 },
  { id: "twelve", label: "Case of 12", units: 12, discount: 0.08 },
  { id: "twentyfour", label: "Case of 24", units: 24, discount: 0.12 },
];

export const SUBSCRIPTION = {
  discount: 0.1, // PLACEHOLDER
  frequencies: [
    { id: "weekly", label: "Every week" },
    { id: "fortnightly", label: "Every 2 weeks" },
    { id: "monthly", label: "Every month" },
  ],
};

export const PRODUCTS = [
  {
    slug: "petite-330",
    name: "Petite",
    volume: "330 ml",
    price: 60, // INR — PLACEHOLDER
    image: "bottle-330",
    moment: "Meetings, minibars and tables for one.",
    description:
      "The compact format. Sized for a single glass at the table or a moment between meetings — the same clarity, in a measure that never goes to waste.",
    details: ["Glass bottle with aluminium cap", "Best served at 8–10°C", "Single-serve format"],
  },
  {
    slug: "classic-500",
    name: "Classic",
    volume: "500 ml",
    price: 80, // PLACEHOLDER
    image: "bottle-500",
    moment: "Desks, studios and the daily carry.",
    description:
      "Our signature bottle. Tall, quiet and balanced in the hand — designed for the everyday rituals that deserve a little more care.",
    details: ["Glass bottle with aluminium cap", "Best served at 8–10°C", "Everyday format"],
  },
  {
    slug: "grand-1000",
    name: "Grand",
    volume: "1 L",
    price: 130, // PLACEHOLDER
    image: "bottle-1000",
    moment: "Shared tables, long dinners, slow evenings.",
    description:
      "Made for the centre of the table. A generous litre poured with ceremony for hosts, restaurants and long conversations.",
    details: ["Glass bottle with aluminium cap", "Best served at 8–10°C", "Table-sharing format"],
  },
];

export const NAV = [
  { href: "/#story", label: "Story" },
  { href: "/#collection", label: "Collection" },
  { href: "/#journey", label: "Journey" },
  { href: "/#quality", label: "Quality" },
  { href: "/#sustainability", label: "Sustainability" },
  { href: "/#bulk", label: "Business" },
  { href: "/#contact", label: "Contact" },
];

/**
 * Quality documents. Set `file` to a path inside /public/documents once a
 * verified certificate or laboratory report is available. Until then the
 * document is shown as "pending verification" and can be requested.
 */
export const QUALITY_DOCS = [
  { id: "licence", title: "Regulatory licence", kind: "Licence", file: null, note: "Licence number and issuing authority to be published." },
  { id: "product-cert", title: "Product standard certification", kind: "Certificate", file: null, note: "Certificate and scope to be published once verified." },
  { id: "lab-report", title: "Independent laboratory report", kind: "Lab report", file: null, note: "Latest third-party test report, with lab accreditation details." },
  { id: "batch", title: "Batch testing summary", kind: "Report", file: null, note: "Routine batch testing results, published per production period." },
];

/** Verified customer & partner testimonials only. Leave empty until reviews are collected with consent. */
export const TESTIMONIALS = [];

/** Retail partners. Entries flagged `sample: true` are layout samples, not real stores. */
export const RETAILERS = [
  { name: "Sample Retail Partner", area: "Indiranagar", city: "Bengaluru", pin: "560038", lat: 12.9784, lng: 77.6408, type: "Gourmet store", sample: true },
  { name: "Sample Retail Partner", area: "Koramangala", city: "Bengaluru", pin: "560034", lat: 12.9352, lng: 77.6245, type: "Supermarket", sample: true },
  { name: "Sample Retail Partner", area: "Bandra West", city: "Mumbai", pin: "400050", lat: 19.0596, lng: 72.8295, type: "Gourmet store", sample: true },
  { name: "Sample Retail Partner", area: "Lower Parel", city: "Mumbai", pin: "400013", lat: 18.9953, lng: 72.8302, type: "Hotel boutique", sample: true },
  { name: "Sample Retail Partner", area: "Khan Market", city: "New Delhi", pin: "110003", lat: 28.6003, lng: 77.2270, type: "Gourmet store", sample: true },
  { name: "Sample Retail Partner", area: "Jubilee Hills", city: "Hyderabad", pin: "500033", lat: 17.4325, lng: 78.4071, type: "Supermarket", sample: true },
  { name: "Sample Retail Partner", area: "Nungambakkam", city: "Chennai", pin: "600034", lat: 13.0597, lng: 80.2420, type: "Café", sample: true },
];

export const FAQS = [
  {
    group: "Water quality",
    items: [
      { q: "Where does your water come from?", a: "We will publish the verified source, location and extraction details here once they are confirmed and documented. We do not describe a source until it can be evidenced." },
      { q: "Is the water tested?", a: "Every production batch will be tested against the applicable packaged drinking water standard. Laboratory reports will be available to download in the Quality & Safety section as soon as they are issued." },
      { q: "Do you add minerals?", a: "The final mineral profile will be published together with the independent laboratory report. We will not state composition figures before they are verified." },
    ],
  },
  {
    group: "Packaging",
    items: [
      { q: "What is the bottle made of?", a: "Our collection is presented in glass bottles with aluminium caps. Detailed packaging specifications and recyclability guidance will be printed on each pack." },
      { q: "Can I return empty bottles?", a: "We are designing a bottle return programme for subscription and business customers. Details will be shared on this page when it opens." },
    ],
  },
  {
    group: "Storage",
    items: [
      { q: "How should I store the bottles?", a: "Store in a cool, dry place away from direct sunlight and strong odours. Once opened, refrigerate and finish within a few days." },
      { q: "What is the best serving temperature?", a: "We recommend serving chilled, at around 8–10°C, to keep the taste crisp and clean." },
    ],
  },
  {
    group: "Delivery",
    items: [
      { q: "Do you deliver to my area?", a: "Enter your PIN code in the delivery checker or at checkout. We are expanding city by city; if we do not deliver to you yet, you can still find a retail partner or request a business delivery." },
      { q: "How do subscriptions work?", a: "Choose a size, pack and frequency. Your order repeats automatically and you can pause, change or cancel at any time before the next dispatch." },
      { q: "Can I order for an event?", a: "Yes. Use the Bulk Orders form with your date, venue and estimated guest count and our team will send a quotation." },
    ],
  },
];
